"""
tests/test_score_api.py
-----------------------
Unit tests for the /score and /health endpoints.

Run with:
    pytest backend/ml/tests/test_score_api.py -v
"""

import pytest
from unittest.mock import patch
from app import create_app  # adjust import to match your Flask app factory


@pytest.fixture
def client():
    app = create_app(testing=True)
    with app.test_client() as client:
        yield client


# ── /health ──────────────────────────────────────────────────────────────────

def test_health_returns_ok(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.get_json() == {"status": "ok", "scorer": "loaded"}


# ── /score – bad requests ─────────────────────────────────────────────────────

def test_missing_prompt_returns_400(client):
    res = client.post("/score", json={"stories": []})
    assert res.status_code == 400
    assert "prompt" in res.get_json()["error"]


def test_missing_stories_returns_400(client):
    res = client.post("/score", json={"prompt": "a story about space"})
    assert res.status_code == 400
    assert "stories" in res.get_json()["error"]


def test_empty_prompt_returns_400(client):
    res = client.post("/score", json={"stories": [], "prompt": "   "})
    assert res.status_code == 400


def test_empty_stories_list_returns_400(client):
    res = client.post("/score", json={"stories": [], "prompt": "valid prompt"})
    assert res.status_code == 400


def test_oversized_batch_returns_413(client):
    stories = [
        {"uuid": str(i), "title": "t", "content": "c"} for i in range(51)
    ]
    res = client.post("/score", json={"stories": stories, "prompt": "test"})
    assert res.status_code == 413


# ── /score – validation errors land in results, not as HTTP errors ────────────

def test_missing_content_field_produces_per_story_error(client):
    stories = [{"uuid": "abc", "title": "t"}]  # content missing
    res = client.post("/score", json={"stories": stories, "prompt": "test"})
    assert res.status_code == 200
    result = res.get_json()["scores"][0]
    assert result["uuid"] == "abc"
    assert "error" in result
    assert "content" in result["error"]


def test_empty_content_produces_per_story_error(client):
    stories = [{"uuid": "abc", "title": "t", "content": "   "}]
    res = client.post("/score", json={"stories": stories, "prompt": "test"})
    result = res.get_json()["scores"][0]
    assert "error" in result


# ── /score – happy path ───────────────────────────────────────────────────────

@patch("score_api.score_story")
def test_valid_story_returns_scores(mock_score, client):
    mock_score.return_value = {
        "coherence": 0.8, "creativity": 0.7,
        "relevance": 0.9, "overall": 0.8
    }
    stories = [{"uuid": "abc", "title": "Title", "content": "Once upon a time..."}]
    res = client.post("/score", json={"stories": stories, "prompt": "a fairy tale"})

    assert res.status_code == 200
    data = res.get_json()
    assert data["scores"][0]["uuid"] == "abc"
    assert data["scores"][0]["coherence"] == 0.8


@patch("score_api.score_story")
def test_meta_counts_are_correct(mock_score, client):
    mock_score.return_value = {
        "coherence": 0.8, "creativity": 0.7,
        "relevance": 0.9, "overall": 0.8
    }
    stories = [
        {"uuid": "1", "title": "t", "content": "valid story"},
        {"uuid": "2", "title": "t"},          # missing content → fails
        {"uuid": "3", "title": "t", "content": "another valid story"},
    ]
    res = client.post("/score", json={"stories": stories, "prompt": "test"})
    meta = res.get_json()["meta"]

    assert meta["total"] == 3
    assert meta["succeeded"] == 2
    assert meta["failed"] == 1


# ── /score – error isolation ──────────────────────────────────────────────────

@patch("score_api.score_story", side_effect=FileNotFoundError("model.pkl not found"))
def test_model_unavailable_does_not_abort_batch(mock_score, client):
    stories = [
        {"uuid": "1", "title": "t", "content": "story one"},
        {"uuid": "2", "title": "t", "content": "story two"},
    ]
    res = client.post("/score", json={"stories": stories, "prompt": "test"})

    assert res.status_code == 200
    scores = res.get_json()["scores"]
    assert len(scores) == 2                          # both returned, not aborted
    assert all(r["error_code"] == "MODEL_UNAVAILABLE" for r in scores)