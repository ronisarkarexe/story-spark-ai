"""
tests/test_detect.py
--------------------
Unit tests for detect.py. Uses pytest and unittest.mock to mock TensorFlow,
joblib, and filesystem interactions. This allows us to test the validation,
payload parsing, confidence mapping, suggestion logic, and error isolation
behavior without having physical model assets trained or saved on disk.

Run with:
    pytest backend/ml/tests/test_detect.py -v
"""

import sys
from pathlib import Path
import pytest
from unittest.mock import MagicMock, patch
import numpy as np

# Adjust sys.path so we can import from backend/ml/
ML_DIR = Path(__file__).resolve().parents[1]
if str(ML_DIR) not in sys.path:
    sys.path.insert(0, str(ML_DIR))

import sys
from unittest.mock import MagicMock

# Mock tensorflow modules before importing detect to bypass Python 3.13 compatibility errors
sys.modules['tensorflow'] = MagicMock()
sys.modules['tensorflow.keras'] = MagicMock()
sys.modules['tensorflow.keras.models'] = MagicMock()
sys.modules['tensorflow.keras.layers'] = MagicMock()
sys.modules['tensorflow.keras.optimizers'] = MagicMock()
sys.modules['tensorflow.keras.callbacks'] = MagicMock()

import detect
from model import SEQ_LEN, N_FEATURES


# ── MOCK FIXTURES ─────────────────────────────────────────────────────────────

@pytest.fixture
def mock_scaler():
    scaler = MagicMock()
    # transform should return the same array shape as input
    scaler.transform.side_effect = lambda x: x
    return scaler


@pytest.fixture
def mock_model():
    model = MagicMock()
    # predict should return the same shape as input (1, SEQ_LEN, N_FEATURES)
    # but we can adjust this in tests if needed
    model.predict.side_effect = lambda x, verbose=0: x
    return model


@pytest.fixture
def mock_assets(mock_model, mock_scaler):
    return {
        "model": mock_model,
        "scaler": mock_scaler,
        "threshold": 0.05,
    }


# ── VALIDATION TESTS ─────────────────────────────────────────────────────────

def test_validate_session_non_list():
    # Session must be a list
    err = detect._validate_session("not a list")
    assert err is not None
    assert "must be a non-empty list" in err


def test_validate_session_empty():
    # Session must not be empty
    err = detect._validate_session([])
    assert err is not None
    assert "must be a non-empty list" in err


def test_validate_session_too_short():
    # Session must have at least SEQ_LEN (10) entries
    short_session = [{"prompt_length": 1} for _ in range(SEQ_LEN - 1)]
    err = detect._validate_session(short_session)
    assert err is not None
    assert f"needs at least {SEQ_LEN} entries" in err


def test_validate_session_dict_missing_keys():
    # Dictionaries must contain all FEATURE_KEYS
    session = []
    for i in range(SEQ_LEN):
        entry = {k: 1.0 for k in detect.FEATURE_KEYS}
        if i == 5:
            # remove a key from entry at index 5 of the window
            entry.pop("prompt_length")
        session.append(entry)
    
    err = detect._validate_session(session)
    assert err is not None
    assert "missing required keys" in err
    # Since we extract session[-SEQ_LEN:], index 5 of the window corresponds to index 5
    assert "5" in err


def test_validate_session_dict_non_numeric():
    # Dictionary values must be int or float
    session = []
    for i in range(SEQ_LEN):
        entry = {k: 1.0 for k in detect.FEATURE_KEYS}
        if i == 3:
            entry["prompt_length"] = "not numeric"
        session.append(entry)
    
    err = detect._validate_session(session)
    assert err is not None
    assert "have non-numeric values" in err
    assert "3" in err


def test_validate_session_list_wrong_length():
    # List entries must have N_FEATURES (8) elements
    session = []
    for i in range(SEQ_LEN):
        entry = [1.0] * N_FEATURES
        if i == 8:
            entry = [1.0] * (N_FEATURES - 1)
        session.append(entry)
    
    err = detect._validate_session(session)
    assert err is not None
    assert f"must have {N_FEATURES} values" in err
    assert "8" in err


def test_validate_session_invalid_types():
    # Entries must be dicts, lists, or np.ndarrays
    session = ["invalid entry type"] * SEQ_LEN
    err = detect._validate_session(session)
    assert err is not None
    assert "entries must be dicts or lists" in err


def test_validate_session_valid_dict():
    session = [{k: 1.0 for k in detect.FEATURE_KEYS} for _ in range(SEQ_LEN)]
    err = detect._validate_session(session)
    assert err is None


def test_validate_session_valid_list():
    session = [[1.0] * N_FEATURES for _ in range(SEQ_LEN)]
    err = detect._validate_session(session)
    assert err is None


# ── CORE DETECTION TESTS ──────────────────────────────────────────────────────

@patch("detect.load_ml_assets_into_cache")
def test_detect_not_stuck(mock_load, mock_assets):
    mock_load.return_value = mock_assets
    
    # Create a session where the reconstructed array is identical to input
    # this will result in reconstruction error = 0.0 (<= threshold of 0.05)
    session = [[1.0] * N_FEATURES for _ in range(SEQ_LEN)]
    
    result = detect.detect(session)
    assert result["is_stuck"] is False
    assert result["confidence"] == "N/A"
    assert result["anomaly_score"] == 0.0
    assert result["threshold"] == mock_assets["threshold"]
    assert result["suggestion"] == ""


@patch("detect.load_ml_assets_into_cache")
def test_detect_stuck_high_confidence(mock_load, mock_assets):
    # Setup mock assets with threshold = 0.05
    mock_load.return_value = mock_assets
    
    # We want reconstruction error to be > 2.0x threshold, i.e., > 0.10.
    # Scaled input is 1.0 everywhere. We set mock predict output to be 2.0 everywhere.
    # Difference squared is 1.0, mean is 1.0. 1.0 > 0.10, so high confidence.
    mock_assets["model"].predict.side_effect = lambda x, verbose=0: x + 1.0
    
    session = [[1.0] * N_FEATURES for _ in range(SEQ_LEN)]
    result = detect.detect(session)
    
    assert result["is_stuck"] is True
    assert result["confidence"] == "High"
    assert result["anomaly_score"] == 1.0
    assert result["suggestion"] != ""


@patch("detect.load_ml_assets_into_cache")
def test_detect_stuck_medium_confidence(mock_load, mock_assets):
    mock_load.return_value = mock_assets
    
    # Threshold is 0.05. Medium confidence is ratio between 1.2 and 2.0.
    # Anomaly score needs to be, say, 0.08 (which is 1.6x threshold).
    # We can design the prediction output to produce exactly 0.08 mean squared error.
    # Diff squared: let's make the difference of one element in the SEQ_LEN*N_FEATURES matrix be large enough.
    # total elements = 10 * 8 = 80.
    # Sum of squared diffs needs to be 0.08 * 80 = 6.4.
    # We can set reconstructed output to have diff = sqrt(6.4) = 2.5298 for one element, or diff = 0.2828 for all elements.
    # Let's just return x + 0.2828427. Diff sq = 0.08. Mean = 0.08.
    mock_assets["model"].predict.side_effect = lambda x, verbose=0: x + 0.2828427
    
    session = [[1.0] * N_FEATURES for _ in range(SEQ_LEN)]
    result = detect.detect(session)
    
    assert result["is_stuck"] is True
    assert result["confidence"] == "Medium"
    assert abs(result["anomaly_score"] - 0.08) < 1e-4


@patch("detect.load_ml_assets_into_cache")
def test_detect_stuck_low_confidence(mock_load, mock_assets):
    mock_load.return_value = mock_assets
    
    # Threshold is 0.05. Low confidence is ratio between 1.0 and 1.2.
    # Anomaly score needs to be, say, 0.055 (which is 1.1x threshold).
    # Diff sq = 0.055. Diff = sqrt(0.055) = 0.23452.
    mock_assets["model"].predict.side_effect = lambda x, verbose=0: x + 0.23452
    
    session = [[1.0] * N_FEATURES for _ in range(SEQ_LEN)]
    result = detect.detect(session)
    
    assert result["is_stuck"] is True
    assert result["confidence"] == "Low"
    assert abs(result["anomaly_score"] - 0.055) < 1e-4


@patch("detect.load_ml_assets_into_cache")
def test_detect_invalid_session_raises(mock_load, mock_assets):
    mock_load.return_value = mock_assets
    with pytest.raises(ValueError) as exc_info:
        detect.detect([])
    assert "must be a non-empty list" in str(exc_info.value)


# ── BATCH DETECTION TESTS ─────────────────────────────────────────────────────

@patch("detect.load_ml_assets_into_cache")
def test_batch_detect_empty_raises(mock_load, mock_assets):
    mock_load.return_value = mock_assets
    with pytest.raises(ValueError) as exc_info:
        detect.batch_detect([])
    assert "sessions list must not be empty" in str(exc_info.value)


@patch("detect.load_ml_assets_into_cache")
def test_batch_detect_mixed_validity(mock_load, mock_assets):
    mock_load.return_value = mock_assets
    mock_assets["model"].predict.side_effect = lambda x, verbose=0: x
    
    valid_session = [[1.0] * N_FEATURES for _ in range(SEQ_LEN)]
    invalid_session = [[1.0] * N_FEATURES for _ in range(SEQ_LEN - 1)]  # too short
    
    results = detect.batch_detect([valid_session, invalid_session, valid_session])
    
    assert len(results) == 3
    
    # First should be success
    assert results[0]["index"] == 0
    assert "error" not in results[0]
    assert results[0]["is_stuck"] is False
    
    # Second should have validation error
    assert results[1]["index"] == 1
    assert "error" in results[1]
    assert "needs at least" in results[1]["error"]
    
    # Third should be success
    assert results[2]["index"] == 2
    assert "error" not in results[2]


@patch("detect.load_ml_assets_into_cache")
def test_batch_detect_prediction_failure_isolation(mock_load, mock_assets):
    mock_load.return_value = mock_assets
    
    # Mock model predict raises an exception for the second session only
    call_count = 0
    def side_effect(x, verbose=0):
        nonlocal call_count
        call_count += 1
        if call_count == 2:
            raise RuntimeError("prediction failed")
        return x
    
    mock_assets["model"].predict.side_effect = side_effect
    
    valid_session = [[1.0] * N_FEATURES for _ in range(SEQ_LEN)]
    
    results = detect.batch_detect([valid_session, valid_session, valid_session])
    
    assert len(results) == 3
    
    # Session 0: Success
    assert results[0]["index"] == 0
    assert "error" not in results[0]
    
    # Session 1: Swallows runtime exception and reports it in "error"
    assert results[1]["index"] == 1
    assert "error" in results[1]
    assert "prediction failed" in results[1]["error"]
    
    # Session 2: Success (proving error isolation works)
    assert results[2]["index"] == 2
    assert "error" not in results[2]


# ── SUGGESTION HISTORY TESTS ──────────────────────────────────────────────────

def test_suggestion_history_uniqueness():
    # Reset history
    detect._suggestion_history = []
    
    # We want to test that _get_unique_suggestion picks from pool
    # and keeps a sliding window history of length MAX_HISTORY
    # We can use "prompt_length" feature which has 3 items in SUGGESTIONS
    pool = detect.SUGGESTIONS["prompt_length"]
    assert len(pool) == 3
    
    # Get suggestions one after the other
    first = detect._get_unique_suggestion("prompt_length")
    second = detect._get_unique_suggestion("prompt_length")
    third = detect._get_unique_suggestion("prompt_length")
    
    # With pool size of 3, the first 3 picks should all be unique if random picks unseen
    picks = {first, second, third}
    assert len(picks) == 3
    assert picks == set(pool)
    
    # The suggestion history length should be exactly 3
    assert len(detect._suggestion_history) == 3
    
    # If we pull more, the history length should be capped at MAX_HISTORY (6)
    for _ in range(10):
        detect._get_unique_suggestion("prompt_length")
    
    assert len(detect._suggestion_history) <= detect.MAX_HISTORY
