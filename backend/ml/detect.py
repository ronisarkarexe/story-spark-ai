"""
detect.py
---------
Detect writer's block from a user session and return a suggestion.

Usage:
    python detect.py              ← interactive mode, enter your own session
    from detect import detect     ← import in Flask server

Place at: story-spark-ai/ml/detect.py
"""

import os
import json
import numpy as np
import joblib
import random

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

from tensorflow.keras.models import load_model
from model import SEQ_LEN, N_FEATURES

MODEL_PATH = "saved/model.keras"
SCALER_PATH = "saved/scaler.pkl"
THRESHOLD_PATH = "saved/threshold.json"

_ML_ASSETS_CACHE = None

# Feature order — must match train.py exactly:
# 0: prompt_length       words typed before submitting
# 1: time_to_submit      seconds before submitting
# 2: regeneration_count  times user hit regenerate
# 3: session_duration    seconds spent on current block
# 4: backspace_ratio     backspaces / total keystrokes * 100
# 5: pause_duration      longest pause in seconds
# 6: confidence_score    1–10 derived score
# 7: blocked_word_count  count of frustration-signal words

FEATURE_KEYS = [
    "prompt_length",
    "time_to_submit",
    "regeneration_count",
    "session_duration",
    "backspace_ratio",
    "pause_duration",
    "confidence_score",
    "blocked_word_count",
]

def _validate_session(session: list, idx: int | None = None) -> str | None:
    """
    Validate a single session before processing.
    Returns an error message string if invalid, else None.

    idx is included in the message for batch_detect() context.
    """
    label = f"Session[{idx}]" if idx is not None else "Session"

    if not isinstance(session, list) or len(session) == 0:
        return f"{label}: must be a non-empty list"

    if len(session) < SEQ_LEN:
        return f"{label}: needs at least {SEQ_LEN} entries, got {len(session)}"

    window = session[-SEQ_LEN:]

    if isinstance(window[0], dict):
        missing_keys = [
            i for i, s in enumerate(window)
            if not all(k in s for k in FEATURE_KEYS)
        ]
        if missing_keys:
            return f"{label}: entries at positions {missing_keys} are missing required keys"

        non_numeric = [
            i for i, s in enumerate(window)
            if not all(isinstance(s.get(k, None), (int, float)) for k in FEATURE_KEYS)
        ]
        if non_numeric:
            return f"{label}: entries at positions {non_numeric} have non-numeric values"

    elif isinstance(window[0], (list, np.ndarray)):
        wrong_len = [
            i for i, s in enumerate(window)
            if len(s) != N_FEATURES
        ]
        if wrong_len:
            return f"{label}: entries at positions {wrong_len} must have {N_FEATURES} values"
    else:
        return f"{label}: entries must be dicts or lists, got {type(window[0]).__name__}"

    return None

def load_ml_assets_into_cache():
    """
    Load ML assets once and reuse them for all inference calls.

    This prevents repeated disk reads and repeated TensorFlow/Keras model
    loading inside detect(), reducing I/O saturation and memory growth.
    """
    global _ML_ASSETS_CACHE

    if _ML_ASSETS_CACHE is not None:
        return _ML_ASSETS_CACHE

    for path in (MODEL_PATH, SCALER_PATH, THRESHOLD_PATH):
        if not os.path.exists(path):
            raise FileNotFoundError(f"{path} not found — run train.py first.")

    model = load_model(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)

    with open(THRESHOLD_PATH, "r") as f:
        threshold = json.load(f)["threshold"]

    _ML_ASSETS_CACHE = {
        "model": model,
        "scaler": scaler,
        "threshold": threshold,
    }

    return _ML_ASSETS_CACHE


# ── Suggestions by anomaly type ───────────────────────────────────────────────

SUGGESTIONS = {
    "prompt_length": [
        "Stuck on what to write? Don't start with a plot — start with a feeling your character has right now.",
        "Try writing just one sentence: where is your character standing and what do they smell?",
        "Short on ideas? Steal a situation from real life and drop your character into it.",
    ],
    "regeneration_count": [
        "Nothing feels right? Try a completely different tone — make the scene funny instead of serious.",
        "Too many options can paralyze. Pick the last generation and just edit one sentence in it.",
        "When regenerating a lot, it usually means the direction is wrong, not the words.",
    ],
    "backspace_ratio": [
        "You're deleting a lot — that's your inner critic talking. Try writing without backspace for 2 minutes.",
        "High backspace use often means perfectionism. Write ugly first, edit later.",
        "Slow down. Read your last paragraph out loud before typing more.",
    ],
    "pause_duration": [
        "Long pauses happen. Try the 5-minute rule: set a timer and write anything, even if it's bad.",
        "Come back after a short walk. Your brain solves writing problems in the background.",
        "If you've been staring at the screen, change your environment — even just a different chair helps.",
    ],
    "confidence_score": [
        "Low confidence is normal. Write the worst possible version of this scene — seriously.",
        "Skip this scene entirely and write a future scene. You can fill the gap later.",
        "Describe the room your character is in — sometimes setting unlocks the story.",
    ],
    "blocked_word_count": [
        "Sounds like frustration is building. Step away for 5 minutes — writing will still be there.",
        "Writer's block is normal. Try writing the scene from a different character's point of view.",
        "When nothing works, lower the stakes. What's the smallest thing that could happen in this scene?",
    ],
    "general": [
        "Writer's block is normal. Try writing the scene from a different character's point of view.",
        "Describe the room your character is in — sometimes setting unlocks the story.",
        "Skip this scene entirely and write a future scene. You can come back and fill in the gap later.",
    ],
}


def _dominant_feature(session_raw: np.ndarray) -> str:
    """Return the most anomalous feature name for a raw session array."""
    avg = session_raw.mean(axis=0)
    scores = {
        "prompt_length":      1 / (avg[0] + 1),
        "regeneration_count": avg[2] / 40,
        "backspace_ratio":    avg[4] / 100,
        "pause_duration":     avg[5] / 90,
        "confidence_score":   1 / (avg[6] + 1),
        "blocked_word_count": avg[7] / 15,
    }
    return max(scores, key=scores.get)


# ── Suggestion history — avoid repeating the same tip ────────────────────────

_suggestion_history: list[str] = []
MAX_HISTORY = 6


def _get_unique_suggestion(feature: str) -> str:
    """
    Pick a suggestion for the given feature that hasn't been shown recently.
    Falls back to any suggestion if all have been shown.
    """
    pool = SUGGESTIONS.get(feature, SUGGESTIONS["general"])
    unseen = [s for s in pool if s not in _suggestion_history]

    chosen = random.choice(unseen) if unseen else random.choice(pool)

    _suggestion_history.append(chosen)
    if len(_suggestion_history) > MAX_HISTORY:
        _suggestion_history.pop(0)

    return chosen


# ── Core detect function ──────────────────────────────────────────────────────

def detect(session: list) -> dict:
    """
    Parameters
    ----------
    session : list[dict] or list[list]
        At least SEQ_LEN entries. Each entry is either:
          - a dict with keys matching FEATURE_KEYS
          - a list of 8 floats in FEATURE_KEYS order

    Returns
    -------
    dict : is_stuck, confidence, anomaly_score, threshold, suggestion

    Raises
    ------
    ValueError        : if session is invalid
    FileNotFoundError : if model artifacts are missing
    """
    error_msg = _validate_session(session)
    if error_msg:
        raise ValueError(error_msg)

    assets    = load_ml_assets_into_cache()
    model     = assets["model"]
    scaler    = assets["scaler"]
    threshold = assets["threshold"]

    window = session[-SEQ_LEN:]

    if isinstance(window[0], dict):
        session_raw = np.array(
            [[s[k] for k in FEATURE_KEYS] for s in window],
            dtype=np.float32,
        )
    else:
        session_raw = np.array(window, dtype=np.float32)

    if session_raw.shape != (SEQ_LEN, N_FEATURES):
        raise ValueError(
            f"Expected session shape ({SEQ_LEN}, {N_FEATURES}), "
            f"got {session_raw.shape}. Check FEATURE_KEYS order."
        )

    seq_scaled    = scaler.transform(session_raw).reshape(1, SEQ_LEN, N_FEATURES)
    reconstructed = model.predict(seq_scaled, verbose=0)
    anomaly_score = float(np.mean((seq_scaled - reconstructed) ** 2))

    is_stuck = anomaly_score > threshold
    ratio    = anomaly_score / threshold

    if not is_stuck:
        confidence = "N/A"
    elif ratio > 2.0:
        confidence = "High"
    elif ratio > 1.2:
        confidence = "Medium"
    else:
        confidence = "Low"

    return {
        "is_stuck":     is_stuck,
        "confidence":   confidence,
        "anomaly_score": round(anomaly_score, 6),
        "threshold":    round(threshold, 6),
        "suggestion":   _get_unique_suggestion(_dominant_feature(session_raw)) if is_stuck else "",
    }


# ── Interactive input ─────────────────────────────────────────────────────────

def _get_int(prompt: str) -> int:
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("  ⚠  Please enter a whole number.")


PROMPTS = {
    "prompt_length":      "    prompt_length       (words typed)            : ",
    "time_to_submit":     "    time_to_submit      (seconds before submit)  : ",
    "regeneration_count": "    regeneration_count  (times regenerated)      : ",
    "session_duration":   "    session_duration    (seconds in session)     : ",
    "backspace_ratio":    "    backspace_ratio     (0–100, % of backspaces) : ",
    "pause_duration":     "    pause_duration      (longest pause, seconds) : ",
    "confidence_score":   "    confidence_score    (1–10)                   : ",
    "blocked_word_count": "    blocked_word_count  (frustration words seen) : ",
}


def _interactive():
    print("\n" + "=" * 52)
    print("  Writer's Block Detector — Interactive Mode")
    print("=" * 52)
    print(f"\nEnter data for {SEQ_LEN} timesteps (one per writing window).")
    print("─" * 52)

    session = []
    for i in range(1, SEQ_LEN + 1):
        print(f"\n  Timestep {i}/{SEQ_LEN}")
        step = {key: _get_int(prompt) for key, prompt in PROMPTS.items()}
        session.append(step)

    print("\n" + "─" * 52)
    print("  Result")
    print("─" * 52)

    result = detect(session)

    status = "🔴 STUCK" if result["is_stuck"] else "🟢 FLOWING"
    print(f"\n  Status        : {status}")
    print(f"  Confidence    : {result['confidence']}")
    print(f"  Anomaly Score : {result['anomaly_score']}")
    print(f"  Threshold     : {result['threshold']}")

    if result["is_stuck"]:
        print(f"\n  💡 Suggestion :")
        print(f"     {result['suggestion']}")
    else:
        print("\n  ✅ User is in a normal creative flow — no intervention needed.")

    print()

    again = input("  Run again? (y/n): ").strip().lower()
    if again == "y":
        _interactive()


# ── Batch detect ──────────────────────────────────────────────────────────────

def batch_detect(sessions: list[list]) -> list[dict]:
    """
    Run writer's block detection on multiple sessions in one call.
    Loads ML assets once and reuses them across all sessions.

    Parameters
    ----------
    sessions : list of sessions
        Each session is a list[dict] or list[list] with at least SEQ_LEN entries.

    Returns
    -------
    list[dict] : one result per session, each with keys:
        index, is_stuck, confidence, anomaly_score, threshold, suggestion, error
    """
    if not sessions:
        raise ValueError("sessions list must not be empty")

    assets    = load_ml_assets_into_cache()  # load once for all sessions
    model     = assets["model"]
    scaler    = assets["scaler"]
    threshold = assets["threshold"]

    results = []

    for idx, session in enumerate(sessions):
        # ── validate before touching the model ───────────────────────────
        error_msg = _validate_session(session, idx=idx)
        if error_msg:
            results.append({"index": idx, "error": error_msg})
            continue

        try:
            window = session[-SEQ_LEN:]

            if isinstance(window[0], dict):
                session_raw = np.array(
                    [[s[k] for k in FEATURE_KEYS] for s in window],
                    dtype=np.float32,
                )
            else:
                session_raw = np.array(window, dtype=np.float32)

            if session_raw.shape != (SEQ_LEN, N_FEATURES):
                raise ValueError(
                    f"Expected shape ({SEQ_LEN}, {N_FEATURES}), "
                    f"got {session_raw.shape}"
                )

            seq_scaled    = scaler.transform(session_raw).reshape(1, SEQ_LEN, N_FEATURES)
            reconstructed = model.predict(seq_scaled, verbose=0)
            anomaly_score = float(np.mean((seq_scaled - reconstructed) ** 2))

            is_stuck = anomaly_score > threshold
            ratio    = anomaly_score / threshold

            if not is_stuck:
                confidence = "N/A"
            elif ratio > 2.0:
                confidence = "High"
            elif ratio > 1.2:
                confidence = "Medium"
            else:
                confidence = "Low"

            results.append({
                "index":         idx,
                "is_stuck":      is_stuck,
                "confidence":    confidence,
                "anomaly_score": round(anomaly_score, 6),
                "threshold":     round(threshold, 6),
                "suggestion":    _get_unique_suggestion(
                                     _dominant_feature(session_raw)
                                 ) if is_stuck else "",
            })

        except Exception as e:
            results.append({"index": idx, "error": str(e)})

    return results


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    _interactive()