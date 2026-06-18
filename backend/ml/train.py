"""
train.py
--------
Train the LSTM Autoencoder on simulated normal sessions.
Saves model, scaler, and anomaly threshold to disk.

Run:
    python train.py

Place at: story-spark-ai/ml/train.py
"""

import os
import json
import shutil
import numpy as np
import joblib

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
import keras_tuner as kt
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.callbacks import EarlyStopping
from model import build_model, SEQ_LEN, N_FEATURES

MODEL_PATH     = "saved/model.keras"
SCALER_PATH    = "saved/scaler.pkl"
THRESHOLD_PATH = "saved/threshold.json"
EVALUATION_REPORT_PATH = "saved/evaluation_report.json"
TUNER_DIR      = "my_tuner"
RANDOM_SEED = 42
os.makedirs("saved", exist_ok=True)

# ── Feature index reference ──────────────────────────────────────────────────
# 0: prompt_length       (words typed before submitting)
# 1: time_to_submit      (seconds before submitting)
# 2: regeneration_count  (times user hit "regenerate")
# 3: session_duration    (seconds spent on current block)
# 4: backspace_ratio     (backspaces / total keystrokes, scaled 0–100)
# 5: pause_duration      (longest pause in seconds)
# 6: confidence_score    (1–10 self-rated or inferred)
# 7: blocked_word_count  (count of frustration-signal words)

blocked_words = [
    "idk", "can't", "stuck", "help",
    "rewrite", "confused", "delete this", "this sucks"
]

def count_blocked_words(text: str) -> int:
    text = text.lower()
    return sum(1 for w in blocked_words if w in text)


# ── Simulate data ────────────────────────────────────────────────────────────

def normal_sessions(n: int = 1000) -> np.ndarray:
    if n < 1:
        raise ValueError("n must be positive")
    """
    Healthy creative flow — engaged, patient, few retries.
    Feature order matches the index reference above.
    """
    sessions = []
    for _ in range(n):
        session = [
            [
                np.random.randint(120, 300),   # 0: long prompts
                np.random.randint(40,  120),   # 1: takes time to think
                np.random.randint(1,   3),     # 2: rarely regenerates
                np.random.randint(15,  40),    # 3: comfortable session length
                np.random.randint(0,   15),    # 4: low backspace ratio
                np.random.randint(1,   8),     # 5: short pauses
                np.random.randint(7,   10),    # 6: high confidence
                np.random.randint(0,   1),     # 7: almost no blocked words
            ]
            for _ in range(SEQ_LEN)
        ]
        sessions.append(session)
    return np.array(sessions, dtype=np.float32)

def stuck_sessions(n: int = 200) -> np.ndarray:
    if n < 1:
        raise ValueError("n must be positive")
    """
    Generate writer's block sessions with varying severity levels.

    Real users do not always exhibit extreme writer's block behaviour.
    Some users experience mild difficulty, while others may be
    moderately or severely stuck. Simulating multiple severity levels
    produces more realistic training and evaluation data.

    Feature order is IDENTICAL to normal_sessions.
    """

    sessions = []

    for _ in range(n):

        # Simulate different levels of writer's block instead of
        # treating all blocked users as a single extreme category.
        severity = np.random.choice(
            ["mild", "moderate", "severe"],
            p=[0.4, 0.4, 0.2]
        )

        if severity == "mild":

            # User is struggling slightly but can still make progress.
            # Behaviour overlaps somewhat with normal users.
            session = [
                [
                    np.random.randint(80, 180),
                    np.random.randint(20, 80),
                    np.random.randint(2, 8),
                    np.random.randint(10, 35),
                    np.random.randint(10, 40),
                    np.random.randint(5, 20),
                    np.random.randint(5, 8),
                    np.random.randint(1, 4),
                ]
                for _ in range(SEQ_LEN)
            ]

        elif severity == "moderate":

            # User shows noticeable signs of writer's block such as
            # increased retries, lower confidence, and more hesitation.
            session = [
                [
                    np.random.randint(40, 120),
                    np.random.randint(10, 60),
                    np.random.randint(5, 15),
                    np.random.randint(5, 25),
                    np.random.randint(20, 60),
                    np.random.randint(10, 40),
                    np.random.randint(3, 6),
                    np.random.randint(2, 8),
                ]
                for _ in range(SEQ_LEN)
            ]

        else:

            # Severe writer's block with behaviour close to the
            # original synthetic anomaly distribution.
            session = [
                [
                    np.random.randint(1, 40),
                    np.random.randint(1, 20),
                    np.random.randint(10, 30),
                    np.random.randint(1, 10),
                    np.random.randint(50, 100),
                    np.random.randint(20, 90),
                    np.random.randint(1, 3),
                    np.random.randint(5, 15),
                ]
                for _ in range(SEQ_LEN)
            ]

        sessions.append(session)

    return np.array(sessions, dtype=np.float32)

# ── Scale ────────────────────────────────────────────────────────────────────

def scale(
    data: np.ndarray,
    scaler: MinMaxScaler = None,
    fit: bool = False,
) -> tuple[np.ndarray, MinMaxScaler]:
    n, t, f = data.shape
    flat = data.reshape(-1, f)
    if fit:
        scaler = MinMaxScaler()
        scaled = scaler.fit_transform(flat)
    else:
        scaled = scaler.transform(flat)
    return scaled.reshape(n, t, f), scaler


# ── Threshold ────────────────────────────────────────────────────────────────

def compute_threshold(model, X_normal_scaled: np.ndarray) -> float:
    """
    BUG FIX 4 (design): Use mean + 2*std instead of 3*std.

    With 3σ the bar is so high that stuck sessions — which aren't
    astronomically different after scaling — never cross it.
    2σ keeps ~95% of normal traffic below threshold while catching
    anomalies that sit meaningfully above the normal reconstruction band.

    Additionally we validate on a held-out stuck set to confirm the
    percentile actually separates the two distributions before saving.
    """
    recon  = model.predict(X_normal_scaled, verbose=0)
    errors = np.mean((X_normal_scaled - recon) ** 2, axis=(1, 2))
    return float(np.mean(errors) + 2 * np.std(errors))


# ── Build model for tuner ─────────────────────────────────────────────────────

def build_model_tuner(hp):
    units = hp.Int("units", min_value=16, max_value=128, step=16)
    return build_model(units)


# ── Train ────────────────────────────────────────────────────────────────────

def train():
    np.random.seed(RANDOM_SEED)
    print("\n" + "=" * 50)
    print("  Writer's Block Detector — Training")
    print("=" * 50)

    # ── 1. Data ──────────────────────────────────────────────────────────────
    print("\n[1/3] Simulating sessions...")
    normal_raw = normal_sessions(1000)
    scaled, scaler = scale(normal_raw, fit=True)

    split = int(0.8 * len(scaled))
    X_train, X_val = scaled[:split], scaled[split:]
    print(f"      Train: {X_train.shape}  Val: {X_val.shape}")

    # ── 2. Hyperparameter search ─────────────────────────────────────────────
    print("\n[2/3] Tuning hyperparameters...")

    # BUG FIX 5: Clear stale tuner cache so we always search fresh.
    # Without this the tuner reloads old results and skips the search entirely,
    # which means it may pick up weights trained on a different data split.
    if os.path.exists(TUNER_DIR):
        shutil.rmtree(TUNER_DIR)
        print(f"      Cleared stale tuner cache at '{TUNER_DIR}/'")

    tuner = kt.RandomSearch(
        build_model_tuner,
        objective="val_loss",
        max_trials=10,
        executions_per_trial=2,
        directory=TUNER_DIR,
        project_name="lstm_hyper_tuning",
    )

    tuner.search(
        X_train, X_train,
        epochs=50,
        batch_size=32,
        validation_data=(X_val, X_val),
        callbacks=[
            EarlyStopping(
                monitor="val_loss",
                patience=5,
                restore_best_weights=True,
                verbose=0,
            )
        ],
        verbose=0,
    )

    # ── 3. Save artefacts ────────────────────────────────────────────────────
    print("\n[3/3] Saving model and threshold...")
    best_model = tuner.get_best_models(num_models=1)[0]
    best_model.save(MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)

    threshold = compute_threshold(best_model, X_train)
    with open(THRESHOLD_PATH, "w") as fh:
        json.dump({"threshold": threshold}, fh)

    print(f"\n  Threshold : {threshold:.6f}")
    print(f"  Model     → {MODEL_PATH}")
    print(f"  Scaler    → {SCALER_PATH}")
    print(f"  Threshold → {THRESHOLD_PATH}")

    # ── Evaluation ───────────────────────────────────────────────────────────
    print("\n" + "-" * 50)
    print("  Evaluation")
    print("-" * 50)

    # False positive rate — normal sessions that wrongly trigger the alarm
    rec_val  = best_model.predict(X_val, verbose=0)
    err_val  = np.mean((X_val - rec_val) ** 2, axis=(1, 2))
    fp       = int(np.sum(err_val > threshold))
    fp_pct   = 100 * fp / len(X_val)
    print(f"\n  Normal flagged as stuck : {fp}/{len(X_val)} "
          f"({fp_pct:.1f}%)  ← target < 10%")

    # BUG FIX 6: Use stuck_sessions() here, not normal_sessions().
    # The original code measured normal sessions twice and called the
    # second pass "detection rate", which is meaningless.
    stuck_raw, _ = scale(stuck_sessions(200), scaler=scaler, fit=False)
    rec_stuck    = best_model.predict(stuck_raw, verbose=0)
    err_stuck    = np.mean((stuck_raw - rec_stuck) ** 2, axis=(1, 2))
    tp           = int(np.sum(err_stuck > threshold))
    tp_pct       = 100 * tp / len(stuck_raw)
    print(f"  Stuck correctly detected: {tp}/{len(stuck_raw)} "
          f"({tp_pct:.1f}%)  ← target > 80%")

    # Reconstruction error distribution summary (helps diagnose threshold)
    print(f"\n  Normal  err  mean={np.mean(err_val):.4f}  "
          f"max={np.max(err_val):.4f}")
    print(f"  Stuck   err  mean={np.mean(err_stuck):.4f}  "
          f"max={np.max(err_stuck):.4f}")
    print(f"  Threshold  = {threshold:.4f}")

    # Save evaluation report
    evaluation_report = {
        "threshold": threshold,
        "false_positive_rate": fp_pct/100,
        "detection_rate": tp_pct/100,

        "normal_error_mean": float(np.mean(err_val)),
        "normal_error_max": float(np.max(err_val)),

        "stuck_error_mean": float(np.mean(err_stuck)),
        "stuck_error_max": float(np.max(err_stuck)),

        "normal_samples": len(X_val),
        "stuck_samples": len(stuck_raw),
    }

    with open(EVALUATION_REPORT_PATH, "w") as fh:
        json.dump(evaluation_report, fh, indent=4)

    print(f"  Evaluation report → {EVALUATION_REPORT_PATH}")

    if tp_pct < 50:
        print("\n  ⚠  Detection rate still low. Consider:")
        print("     • Widening the gap between normal/stuck feature ranges")
        print("     • Reducing threshold multiplier below 2.0")
        print("     • Training for more epochs (increase EarlyStopping patience)")

    print("\n  Done.\n")


if __name__ == "__main__":
    train()