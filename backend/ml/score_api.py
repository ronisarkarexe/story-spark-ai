"""
score_api.py
------------
Flask blueprint exposing POST /score.
Called by ai_model.service.ts after Gemini generates stories.

Place at: backend/ml/score_api.py
"""

import logging
from flask import Blueprint, request, jsonify
from scorer import batch_score


score_bp = Blueprint("score", __name__)
logger = logging.getLogger(__name__)

MAX_STORIES = 50
REQUIRED_STORY_FIELDS = {"title", "content", "uuid"}


def _validate_story(story: dict) -> str | None:
    """Returns an error message if invalid, else None."""
    missing = REQUIRED_STORY_FIELDS - story.keys()
    if missing:
        return f"Missing fields: {sorted(missing)}"
    if not isinstance(story["content"], str) or not story["content"].strip():
        return "Field 'content' must be a non-empty string"
    if not isinstance(story["uuid"], str) or not story["uuid"].strip():
        return "Field 'uuid' must be a non-empty string"
    return None


@score_bp.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "scorer": "loaded"})


@score_bp.route("/score", methods=["POST"])
def score_route():
    """
    Request body:
        {
          "stories": [
            { "title": "...", "content": "...", "uuid": "..." },
            ...
          ],
          "prompt": "the original user prompt"
        }

    Response:
        {
          "scores": [
            {
              "uuid": "...",
              "coherence": 0.82,
              "creativity": 0.74,
              "relevance": 0.91,
              "overall": 0.82
            },
            ...
          ],
          "meta": {
            "total": 3,
            "succeeded": 2,
            "failed": 1
          }
        }
    """
    data = request.get_json(force=True)

    if not data or "stories" not in data or "prompt" not in data:
        return jsonify({"error": "Missing required fields: 'stories' and 'prompt'"}), 400

    prompt = data["prompt"]
    stories = data["stories"]

    if not isinstance(prompt, str) or not prompt.strip():
        return jsonify({"error": "Field 'prompt' must be a non-empty string"}), 400

    if not isinstance(stories, list) or len(stories) == 0:
        return jsonify({"error": "Field 'stories' must be a non-empty list"}), 400

    if len(stories) > MAX_STORIES:
        return jsonify({"error": f"Too many stories. Maximum allowed is {MAX_STORIES}"}), 413

    # ── pre-validate each story before hitting the model ─────────────────
    pre_errors = {}
    valid_stories = []

    for story in stories:
        uuid = story.get("uuid", "unknown")
        error_msg = _validate_story(story)
        if error_msg:
            logger.warning("Validation failed for uuid=%s: %s", uuid, error_msg)
            pre_errors[uuid] = error_msg
        else:
            valid_stories.append(story)

    # ── run batch scoring in one forward pass ─────────────────────────────
    scored = []
    if valid_stories:
        try:
            scored = batch_score(valid_stories, prompt)
        except FileNotFoundError as e:
            logger.error("Scorer model missing: %s", e)
            return jsonify({
                "error": "Scorer model unavailable",
                "error_code": "MODEL_UNAVAILABLE"
            }), 503
        except Exception as e:
            logger.exception("Unexpected error during batch scoring")
            return jsonify({"error": str(e)}), 500

    # ── merge validation errors back into results ─────────────────────────
    results = scored + [
        {"uuid": uuid, "error": msg} for uuid, msg in pre_errors.items()
    ]

    return jsonify({
        "scores": results,
        "meta": {
            "total": len(stories),
            "succeeded": sum(1 for r in results if "error" not in r),
            "failed": sum(1 for r in results if "error" in r),
        }
    })