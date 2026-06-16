"""
tests/test_detect_api.py
------------------------
Unit tests for the /detect and /detect/batch endpoints.

Run with:
    pytest backend/ml/tests/test_detect_api.py -v
"""

import pytest
from unittest.mock import patch
from app import create_app
from model import SEQ_LEN, N_FEATURES


# ── Fixtures ──────────────────────────────────────────────────────────────────

@pytest.fixture
def client():
    app = create_app(testing=True)
    with app.test_client() as client:
        yield client


def _make_session(length=SEQ_LEN) -> list:
    """Return a valid session of dicts with all FEATURE_KEYS."""
    return [
        {
            "prompt_length": 10,
            "time_to_submit": 60,
            "regeneration_count": 2,
            "session_duration": 300,
            "backspace_ratio": 20,
            "pause_duration": 15,
            "confidence_score": 7,
            "blocked_word_count": 1,
        }
        for _ in range(length)
    ]


STUCK_RESULT = {
    "is_stuck": True,
    "confidence": "High",
    "anomaly_score": 0.042,
    "threshold": 0.018,
    "suggestion": "Try writing without backspace for 2 minutes.",
}

FLOWING_RESULT = {
    "is_stuck": False,
    "confidence": "N/A",
    "anomaly_score": 0.011,
    "threshold": 0.018,
    "suggestion": "",
}


# ── /detect – bad requests ────────────────────────────────────────────────────

def test_detect_missing_session_returns_400(client):
    res = client.post("/detect", json={})
    assert res.status_code == 400
    assert "session" in res.get_json()["error"]


def test_detect_empty_session_returns_400(client):
    res = client.post("/detect", json={"session": []})
    assert res.status_code == 400


def test_detect_session_too_short_returns_400(client):
    res = client.post("/detect", json={"session": _make_session(length=3)})
    assert res.status_code == 400
    assert str(SEQ_LEN) in res.get_json()["error"]


def test_detect_missing_feature_key_returns_400(client):
    session = _make_session()
    del session[0]["prompt_length"]   # break one entry
    res = client.post("/detect", json={"session": session})
    assert res.status_code == 400
    assert "missing required keys" in res.get_json()["error"]


# ── /detect – happy path ──────────────────────────────────────────────────────

@patch("score_api.detect")
def test_detect_stuck_session(mock_detect, client):
    mock_detect.return_value = STUCK_RESULT
    res = client.post("/detect", json={"session": _make_session()})

    assert res.status_code == 200
    data = res.get_json()
    assert data["is_stuck"] is True
    assert data["confidence"] == "High"
    assert data["suggestion"] != ""


@patch("score_api.detect")
def test_detect_flowing_session(mock_detect, client):
    mock_detect.return_value = FLOWING_RESULT
    res = client.post("/detect", json={"session": _make_session()})

    assert res.status_code == 200
    data = res.get_json()
    assert data["is_stuck"] is False
    assert data["suggestion"] == ""


@patch("score_api.detect", side_effect=FileNotFoundError("model.keras not found"))
def test_detect_model_unavailable_returns_503(mock_detect, client):
    res = client.post("/detect", json={"session": _make_session()})
    assert res.status_code == 503
    assert res.get_json()["error_code"] == "MODEL_UNAVAILABLE"


# ── /detect/batch – bad requests ──────────────────────────────────────────────

def test_batch_detect_missing_sessions_returns_400(client):
    res = client.post("/detect/batch", json={})
    assert res.status_code == 400
    assert "sessions" in res.get_json()["error"]


def test_batch_detect_empty_sessions_returns_400(client):
    res = client.post("/detect/batch", json={"sessions": []})
    assert res.status_code == 400


def test_batch_detect_oversized_returns_413(client):
    sessions = [_make_session() for _ in range(51)]
    res = client.post("/detect/batch", json={"sessions": sessions})
    assert res.status_code == 413


# ── /detect/batch – happy path ────────────────────────────────────────────────

@patch("score_api.batch_detect")
def test_batch_detect_returns_results_and_meta(mock_batch, client):
    mock_batch.return_value = [
        {"index": 0, **STUCK_RESULT},
        {"index": 1, **FLOWING_RESULT},
    ]
    sessions = [_make_session(), _make_session()]
    res = client.post("/detect/batch", json={"sessions": sessions})

    assert res.status_code == 200
    data = res.get_json()
    assert len(data["results"]) == 2
    assert data["meta"]["total"] == 2
    assert data["meta"]["stuck"] == 1
    assert data["meta"]["flowing"] == 1


@patch("score_api.batch_detect")
def test_batch_detect_meta_counts_errors_as_neither(mock_batch, client):
    mock_batch.return_value = [
        {"index": 0, **STUCK_RESULT},
        {"index": 1, "error": "Expected shape (10, 8), got (3, 8)"},
    ]
    sessions = [_make_session(), _make_session()]
    res = client.post("/detect/batch", json={"sessions": sessions})

    meta = res.get_json()["meta"]
    assert meta["total"] == 2
    assert meta["stuck"] == 1
    assert meta["flowing"] == 0   # errored session counts as neither


@patch("score_api.batch_detect", side_effect=FileNotFoundError("model.keras not found"))
def test_batch_detect_model_unavailable_returns_503(mock_batch, client):
    sessions = [_make_session()]
    res = client.post("/detect/batch", json={"sessions": sessions})
    assert res.status_code == 503
    assert res.get_json()["error_code"] == "MODEL_UNAVAILABLE"