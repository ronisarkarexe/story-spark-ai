"""
detect.py
---------
Detect writer's block from a user session and return a suggestion.

Usage:
    python detect.py              ← interactive mode, enter your own session
    from detect import detect     ← import in Flask server

Place at: story-spark-ai/backend/ml/detect.py
"""

import os
import json
from pathlib import Path
import numpy as np
import joblib
import random
from typing import Any

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

from tensorflow.keras.models import load_model
from model import SEQ_LEN, N_FEATURES
ML_DIR = Path(__file__).resolve().parent
MODEL_PATH = ML_DIR / "saved" / "model.keras"
SCALER_PATH = ML_DIR / "saved" / "scaler.pkl"
THRESHOLD_PATH = ML_DIR / "saved" / "threshold.json"

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

def _validate_dict_window(window: list, label: str) -> str | None:
    """
    Validate a window of dictionary entries.

    Returns an error message string if invalid, else None.
    """
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

    return None


def _validate_sequence_window(window: list, label: str) -> str | None:
    """
    Validate a window of list or numpy array entries.

    Returns an error message string if invalid, else None.
    """
    wrong_len = [
        i for i, s in enumerate(window)
        if len(s) != N_FEATURES
    ]
    if wrong_len:
        return f"{label}: entries at positions {wrong_len} must have {N_FEATURES} values"

    return None


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
    first_item = window[0]

    if isinstance(first_item, dict):
        return _validate_dict_window(window, label)

    if isinstance(first_item, (list, np.ndarray)):
        return _validate_sequence_window(window, label)

    return f"{label}: entries must be dicts or lists, got {type(first_item).__name__}"


def load_ml_assets_into_cache() -> dict[str, Any]:
    """
    Load ML assets once and reuse them for all inference calls.

    This prevents repeated disk reads and repeated TensorFlow/Keras model
    loading inside detect(), reducing I/O saturation and memory growth.
    """
    global _ML_ASSETS_CACHE

    if _ML_ASSETS_CACHE is not None:
        return _ML_ASSETS_CACHE

    for path in (MODEL_PATH, SCALER_PATH, THRESHOLD_PATH):
        if not path.exists():
            raise FileNotFoundError(f"{path} not found — run train.py first.")

    model = load_model(str(MODEL_PATH))
    scaler = joblib.load(str(SCALER_PATH))

    with open(THRESHOLD_PATH, "r", encoding="utf-8") as f:
        threshold_data = json.load(f)
    
    threshold = threshold_data.get("threshold")
    
    if threshold is None:
        raise ValueError(
            "threshold.json is missing required 'threshold' field"
    )

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


def _dominant_feature(seq_scaled: np.ndarray, reconstructed: np.ndarray) -> str:
    """
    Return the most anomalous feature name by evaluating the 
    Mean Squared Error (MSE) per feature dimension from the Autoencoder output.
    """
    # Calculate the MSE across the batch and sequence length dimensions (axis 0 and 1)
    # seq_scaled and reconstructed shapes are (1, SEQ_LEN, N_FEATURES)
    mse_per_feature = np.mean((seq_scaled - reconstructed) ** 2, axis=(0, 1))
    
    # Find the feature index with the maximum reconstruction error
    dominant_idx = int(np.argmax(mse_per_feature))
    
    return FEATURE_KEYS[dominant_idx]


# ── Suggestion history — avoid repeating the same tip ────────────────────────

MAX_HISTORY = 6


def _get_unique_suggestion(
    feature: str,
    history: list[str] | None = None,
) -> str:

    history = history or []

    pool = SUGGESTIONS.get(feature, SUGGESTIONS["general"])

    unseen = [s for s in pool if s not in history]

    chosen = random.choice(unseen) if unseen else random.choice(pool)

    history.append(chosen)

    if len(history) > MAX_HISTORY:
        history.pop(0)

    return chosen


# ── Refactored Helpers ────────────────────────────────────────────────────────

def _normalize_session_payload(session: list, is_batch: bool = False) -> np.ndarray:
    """
    Extract the SEQ_LEN window from the session and normalize it to a numpy array.

    Parameters
    ----------
    session : list
        A list of dictionaries or lists containing sequence data.
    is_batch : bool, optional
        Whether the call is from batch_detect, for custom exception message matching.

    Returns
    -------
    np.ndarray
        A 2D float32 numpy array of shape (SEQ_LEN, N_FEATURES).

    Raises
    ------
    ValueError
        If the shape of the reconstructed array does not match (SEQ_LEN, N_FEATURES).
    """
    window = session[-SEQ_LEN:]

    if isinstance(window[0], dict):
        session_raw = np.array(
            [[s[k] for k in FEATURE_KEYS] for s in window],
            dtype=np.float32,
        )
    else:
        session_raw = np.array(window, dtype=np.float32)

    if session_raw.shape != (SEQ_LEN, N_FEATURES):
        if is_batch:
            raise ValueError(
                f"Expected shape ({SEQ_LEN}, {N_FEATURES}), "
                f"got {session_raw.shape}"
            )
        else:
            raise ValueError(
                f"Expected session shape ({SEQ_LEN}, {N_FEATURES}), "
                f"got {session_raw.shape}. Check FEATURE_KEYS order."
            )

    return session_raw


def _run_inference(session_raw: np.ndarray, model: Any, scaler: Any) -> float:
    """
    Scale features, run model prediction, and calculate the anomaly score.

    Parameters
    ----------
    session_raw : np.ndarray
        Preprocessed 2D numpy array of shape (SEQ_LEN, N_FEATURES).
    model : Any
        Loaded TensorFlow Keras model.
    scaler : Any
        Loaded joblib Scaler.

    Returns
    -------
    float
        The anomaly score (reconstruction error).
    """
    seq_scaled = scaler.transform(session_raw).reshape(1, SEQ_LEN, N_FEATURES)
    reconstructed = model.predict(seq_scaled, verbose=0)
    anomaly_score = float(np.mean((seq_scaled - reconstructed) ** 2))
    return anomaly_score


def _calculate_confidence(anomaly_score: float, threshold: float, is_stuck: bool) -> str:
    """
    Calculate confidence based on anomaly score and threshold.

    Parameters
    ----------
    anomaly_score : float
        Calculated reconstruction error.
    threshold : float
        Calculated threshold for writer's block.
    is_stuck : bool
        Flag indicating if the writer is stuck.

    Returns
    -------
    str
        Confidence string: 'High', 'Medium', 'Low', or 'N/A'.
    """
    if not is_stuck:
        return "N/A"

    ratio = anomaly_score / threshold
    if ratio > 2.0:
        return "High"
    if ratio > 1.2:
        return "Medium"
    return "Low"


def _detect_single_session(session: list, assets: dict[str, Any], is_batch: bool = False) -> dict[str, Any]:
    """
    Perform writer's block detection on a single session.

    Parameters
    ----------
    session : list
        Single session (list of dicts or list of lists).
    assets : dict
        Loaded ML assets (model, scaler, threshold).
    is_batch : bool, optional
        Flag passed to _normalize_session_payload for exception message compatibility.

    Returns
    -------
    dict
        Detection results including stuck status, confidence, anomaly score,
        threshold, and suggestion.
    """
    model = assets["model"]
    scaler = assets["scaler"]
    threshold = assets["threshold"]

    session_raw = _normalize_session_payload(session, is_batch=is_batch)
    anomaly_score = _run_inference(session_raw, model, scaler)

    is_stuck = anomaly_score > threshold
    confidence = _calculate_confidence(anomaly_score, threshold, is_stuck)

    suggestion = ""
    if is_stuck:
        dominant = _dominant_feature(session_raw)
        suggestion = _get_unique_suggestion(dominant)

    return {
        "is_stuck": is_stuck,
        "confidence": confidence,
        "anomaly_score": round(anomaly_score, 6),
        "threshold": round(threshold, 6),
        "suggestion": suggestion,
    }


# ── Core detect function ──────────────────────────────────────────────────────

def detect(session: list) -> dict[str, Any]:
    """
    Detect writer's block from a single user session and return a suggestion.

    Parameters
    ----------
    session : list
        At least SEQ_LEN entries. Each entry is either:
          - a dict with keys matching FEATURE_KEYS
          - a list of 8 floats in FEATURE_KEYS order

    Returns
    -------
    dict
        is_stuck, confidence, anomaly_score, threshold, suggestion

    Raises
    ------
    ValueError
        If session is invalid
    FileNotFoundError
        If model artifacts are missing
    """
    error_msg = _validate_session(session)
    if error_msg:
        raise ValueError(error_msg)

    assets = load_ml_assets_into_cache()
    return _detect_single_session(session, assets, is_batch=False)


# ── Interactive input ─────────────────────────────────────────────────────────

def _get_int(prompt: str) -> int:
    while True:
        try:
                return int(input(prompt))
            except ValueError:
                print("⚠ Please enter a whole number.")


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
    while True:
        print("\n" + "=" * 52)
        print("  Writer's Block Detector — Interactive Mode")
        print("=" * 52)
        print(f"\nEnter data for {SEQ_LEN} timesteps (one per writing window).")
        print("─" * 52)

        session = []

        for i in range(1, SEQ_LEN + 1):
            print(f"\n  Timestep {i}/{SEQ_LEN}")
            step = {
                key: _get_int(prompt)
                for key, prompt in PROMPTS.items()
            }
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
            print("\n  💡 Suggestion :")
            print(f"     {result['suggestion']}")
        else:
            print(
                "\n  ✅ User is in a normal creative flow — no intervention needed."
            )

        print()

        again = input("  Run again? (y/n): ").strip().lower()

        if again != "y":
            break


# ── Batch detect ──────────────────────────────────────────────────────────────

def batch_detect(sessions: list[list]) -> list[dict[str, Any]]:
    """
    Run writer's block detection on multiple sessions in one call.
    Loads ML assets once and reuses them across all sessions.

    Parameters
    ----------
    sessions : list of sessions
        Each session is a list[dict] or list[list] with at least SEQ_LEN entries.

    Returns
    -------
    list[dict]
        One result per session, each with keys:
        index, is_stuck, confidence, anomaly_score, threshold, suggestion, error
    """
    if not sessions:
        raise ValueError("sessions list must not be empty")

    assets = load_ml_assets_into_cache()  # load once for all sessions
    results = []

    for idx, session in enumerate(sessions):
        error_msg = _validate_session(session, idx=idx)
        if error_msg:
            results.append({"index": idx, "error": error_msg})
            continue

        try:
            res = _detect_single_session(session, assets, is_batch=True)
            results.append({
                "index": idx,
                **res
            })

        except Exception as e:
            results.append({"index": idx, "error": str(e)})

    return results


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    _interactive()