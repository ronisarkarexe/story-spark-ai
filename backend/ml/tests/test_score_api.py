"""
tests/test_score_api.py
-----------------------
Unit tests for the /score, /health, /detect and /detect/batch endpoints.

Run with:
    pytest backend/ml/tests/test_score_api.py -v
"""

import pytest
from unittest.mock import patch
from app import create_app


@pytest.fixture
def client():
    app = create_app(testing=True)
    with app.test_client() as client:
        yield client


# ── /health ───────────────────────────────────────────────────────────────────

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
    stories = [{"uuid": "abc", "title": "t"}]
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

@patch("score_api.batch_score")                      # ← fixed: was score_story
def test_valid_story_returns_scores(mock_batch, client):
    mock_batch.return_value = [{
        "uuid": "abc",
        "coherence": 0.8, "creativity": 0.7,
        "relevance": 0.9, "overall": 0.8,
    }]
    stories = [{"uuid": "abc", "title": "Title", "content": "Once upon a time..."}]
    res = client.post("/score", json={"stories": stories, "prompt": "a fairy tale"})

    assert res.status_code == 200
    data = res.get_json()
    assert data["scores"][0]["uuid"] == "abc"
    assert data["scores"][0]["coherence"] == 0.8


@patch("score_api.batch_score")                      # ← fixed: was score_story
def test_meta_counts_are_correct(mock_batch, client):
    mock_batch.return_value = [
        {"uuid": "1", "coherence": 0.8, "creativity": 0.7, "relevance": 0.9, "overall": 0.8},
        {"uuid": "3", "coherence": 0.7, "creativity": 0.6, "relevance": 0.8, "overall": 0.7},
    ]
    stories = [
        {"uuid": "1", "title": "t", "content": "valid story"},
        {"uuid": "2", "title": "t"},             # missing content → pre-error
        {"uuid": "3", "title": "t", "content": "another valid story"},
    ]
    res = client.post("/score", json={"stories": stories, "prompt": "test"})
    meta = res.get_json()["meta"]

    assert meta["total"] == 3
    assert meta["succeeded"] == 2
    assert meta["failed"] == 1


@patch("score_api.batch_score", side_effect=FileNotFoundError("model.keras not found"))
def test_model_unavailable_returns_503(mock_batch, client):
    stories = [
        {"uuid": "1", "title": "t", "content": "story one"},
        {"uuid": "2", "title": "t", "content": "story two"},
    ]
    res = client.post("/score", json={"stories": stories, "prompt": "test"})

    assert res.status_code == 503
    assert res.get_json()["error_code"] == "MODEL_UNAVAILABLE"