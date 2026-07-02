import sys
from unittest.mock import MagicMock, patch
import numpy as np
import pytest

# Inject mock tensorflow modules into sys.modules before importing detect
mock_tf = MagicMock()
sys.modules['tensorflow'] = mock_tf
sys.modules['tensorflow.keras'] = mock_tf.keras
sys.modules['tensorflow.keras.models'] = mock_tf.keras.models
sys.modules['tensorflow.keras.layers'] = mock_tf.keras.layers
sys.modules['tensorflow.keras.optimizers'] = mock_tf.keras.optimizers
sys.modules['tensorflow.keras.callbacks'] = mock_tf.keras.callbacks

# Now import the components to test
from ml.detect import (
    SEQ_LEN,
    N_FEATURES,
    FEATURE_KEYS,
    _validate_session,
    _validate_dict_window,
    _validate_list_window,
    _session_to_numpy,
    _calculate_confidence,
    _run_prediction,
    detect,
    batch_detect
)

# ── Mock data helpers ─────────────────────────────────────────────────────────

def _make_dict_session(length=SEQ_LEN, valid=True, numeric=True):
    session = []
    for i in range(length):
        entry = {
            "prompt_length": 10.0,
            "time_to_submit": 60.0,
            "regeneration_count": 2.0,
            "session_duration": 300.0,
            "backspace_ratio": 20.0,
            "pause_duration": 15.0,
            "confidence_score": 7.0,
            "blocked_word_count": 1.0,
        }
        if not valid and i == 0:
            del entry["prompt_length"]
        if not numeric and i == 0:
            entry["prompt_length"] = "invalid_string"
        session.append(entry)
    return session

def _make_list_session(length=SEQ_LEN, valid=True):
    session = []
    for i in range(length):
        entry = [10.0, 60.0, 2.0, 300.0, 20.0, 15.0, 7.0, 1.0]
        if not valid and i == 0:
            entry = entry[:-1]  # wrong size
        session.append(entry)
    return session


# ── Tests for validation helpers ──────────────────────────────────────────────

def test_validate_dict_window():
    valid_window = _make_dict_session(SEQ_LEN)
    invalid_window_missing = _make_dict_session(SEQ_LEN, valid=False)
    invalid_window_numeric = _make_dict_session(SEQ_LEN, numeric=False)

    assert _validate_dict_window(valid_window, "Test") is None
    assert "missing required keys" in _validate_dict_window(invalid_window_missing, "Test")
    assert "non-numeric values" in _validate_dict_window(invalid_window_numeric, "Test")

def test_validate_list_window():
    valid_window = _make_list_session(SEQ_LEN)
    invalid_window = _make_list_session(SEQ_LEN, valid=False)

    assert _validate_list_window(valid_window, "Test") is None
    assert f"must have {N_FEATURES} values" in _validate_list_window(invalid_window, "Test")

def test_validate_session():
    # Test valid sessions
    assert _validate_session(_make_dict_session()) is None
    assert _validate_session(_make_list_session()) is None

    # Test empty / invalid type
    assert "must be a non-empty list" in _validate_session([])
    assert "must be a non-empty list" in _validate_session(None)

    # Test too short
    assert "needs at least" in _validate_session(_make_dict_session(length=SEQ_LEN - 1))

    # Test invalid entry type
    invalid_type_session = [123] * SEQ_LEN
    assert "entries must be dicts or lists" in _validate_session(invalid_type_session)


# ── Tests for preprocessing / conversion ──────────────────────────────────────

def test_session_to_numpy_dicts():
    window = _make_dict_session()
    arr = _session_to_numpy(window)
    assert isinstance(arr, np.ndarray)
    assert arr.shape == (SEQ_LEN, N_FEATURES)
    assert arr[0, 0] == 10.0

def test_session_to_numpy_lists():
    window = _make_list_session()
    arr = _session_to_numpy(window)
    assert isinstance(arr, np.ndarray)
    assert arr.shape == (SEQ_LEN, N_FEATURES)
    assert arr[0, 0] == 10.0

def test_session_to_numpy_invalid_shape():
    window = [[1.0, 2.0]] * SEQ_LEN
    with pytest.raises(ValueError, match="Expected session shape"):
        _session_to_numpy(window)


# ── Tests for confidence calculation ──────────────────────────────────────────

def test_calculate_confidence():
    assert _calculate_confidence(0.01, 0.02, is_stuck=False) == "N/A"
    assert _calculate_confidence(0.05, 0.02, is_stuck=True) == "High"     # ratio > 2.0
    assert _calculate_confidence(0.03, 0.02, is_stuck=True) == "Medium"   # ratio > 1.2
    assert _calculate_confidence(0.022, 0.02, is_stuck=True) == "Low"     # ratio <= 1.2


# ── Tests for prediction helper ────────────────────────────────────────────────

@patch("ml.detect.np.mean")
def test_run_prediction(mock_mean):
    mock_model = MagicMock()
    mock_model.predict.return_value = np.zeros((1, SEQ_LEN, N_FEATURES))
    
    mock_scaler = MagicMock()
    mock_scaler.transform.return_value = np.zeros((SEQ_LEN, N_FEATURES))

    mock_mean.return_value = 0.015

    session_raw = np.zeros((SEQ_LEN, N_FEATURES))
    seq_scaled, reconstructed, score = _run_prediction(mock_model, mock_scaler, session_raw)

    assert seq_scaled.shape == (1, SEQ_LEN, N_FEATURES)
    assert reconstructed.shape == (1, SEQ_LEN, N_FEATURES)
    assert score == 0.015
    mock_model.predict.assert_called_once()
    mock_scaler.transform.assert_called_once_with(session_raw)


# ── Tests for core detect and batch_detect ────────────────────────────────────

@patch("ml.detect.load_ml_assets_into_cache")
@patch("ml.detect._run_prediction")
def test_detect_flowing(mock_pred, mock_load):
    # Set up mocks
    mock_load.return_value = {
        "model": MagicMock(),
        "scaler": MagicMock(),
        "threshold": 0.020
    }
    mock_pred.return_value = (
        np.zeros((1, SEQ_LEN, N_FEATURES)),
        np.zeros((1, SEQ_LEN, N_FEATURES)),
        0.015  # below threshold
    )

    result = detect(_make_dict_session())
    assert result["is_stuck"] is False
    assert result["confidence"] == "N/A"
    assert result["anomaly_score"] == 0.015
    assert result["suggestion"] == ""

@patch("ml.detect.load_ml_assets_into_cache")
@patch("ml.detect._run_prediction")
def test_detect_stuck(mock_pred, mock_load):
    # Set up mocks
    mock_load.return_value = {
        "model": MagicMock(),
        "scaler": MagicMock(),
        "threshold": 0.020
    }
    # Return high reconstruction error in the first feature dimension (index 0: prompt_length)
    seq_scaled = np.zeros((1, SEQ_LEN, N_FEATURES))
    reconstructed = np.zeros((1, SEQ_LEN, N_FEATURES))
    reconstructed[0, 0, 0] = 5.0 # create reconstruction error

    mock_pred.return_value = (seq_scaled, reconstructed, 0.050) # above threshold

    result = detect(_make_dict_session())
    assert result["is_stuck"] is True
    assert result["confidence"] == "High"
    assert result["anomaly_score"] == 0.050
    assert result["suggestion"] != ""

@patch("ml.detect.load_ml_assets_into_cache")
@patch("ml.detect._run_prediction")
def test_batch_detect(mock_pred, mock_load):
    mock_load.return_value = {
        "model": MagicMock(),
        "scaler": MagicMock(),
        "threshold": 0.020
    }
    mock_pred.return_value = (
        np.zeros((1, SEQ_LEN, N_FEATURES)),
        np.zeros((1, SEQ_LEN, N_FEATURES)),
        0.015
    )

    sessions = [
        _make_dict_session(),                  # valid
        _make_dict_session(length=3),          # invalid too short
        _make_list_session()                   # valid list
    ]

    results = batch_detect(sessions)
    assert len(results) == 3
    assert results[0]["index"] == 0
    assert "error" not in results[0]
    assert results[0]["is_stuck"] is False

    assert results[1]["index"] == 1
    assert "error" in results[1]

    assert results[2]["index"] == 2
    assert "error" not in results[2]
