from flask import Blueprint, jsonify, request
import time

gallery_bp = Blueprint("gallery", __name__, url_prefix="/api/gallery")

# In-memory mock storage (replace with real DB model queries as needed)
STORIES_DB = [
    {
        "id": "story-1",
        "title": "The Whispering Galaxy",
        "content": "Deep in space, a signal echoed through the quantum void...",
        "author": "AstralWriter",
        "is_public": True,
        "rating": 4.8,
        "rating_count": 12,
        "remix_count": 5,
        "parent_story_id": None,
        "created_at": time.time() - 3600,
    },
    {
        "id": "story-2",
        "title": "Echoes of Neo-Tokyo",
        "content": "Neon rain dripped down the side of the towering cyber-spire...",
        "author": "CyberBard",
        "is_public": True,
        "rating": 4.5,
        "rating_count": 8,
        "remix_count": 2,
        "parent_story_id": None,
        "created_at": time.time() - 7200,
    }
]

@gallery_bp.route("", methods=["GET"])
def get_public_gallery():
    """Fetch public stories with sorting (top_rated, newest, most_remixed)."""
    sort_by = request.args.get("sort_by", "newest")
    public_stories = [s for s in STORIES_DB if s.get("is_public", True)]

    if sort_by == "top_rated":
        public_stories.sort(key=lambda s: s["rating"], reverse=True)
    elif sort_by == "most_remixed":
        public_stories.sort(key=lambda s: s["remix_count"], reverse=True)
    else:  # newest
        public_stories.sort(key=lambda s: s["created_at"], reverse=True)

    return jsonify({"stories": public_stories})

@gallery_bp.route("/publish", methods=["POST"])
def publish_story():
    """Toggle a story's public visibility."""
    data = request.get_json() or {}
    story_id = data.get("story_id")
    is_public = data.get("is_public", True)

    for story in STORIES_DB:
        if story["id"] == story_id:
            story["is_public"] = is_public
            return jsonify({"message": "Publication status updated", "story": story})

    return jsonify({"error": "Story not found"}), 404

@gallery_bp.route("/rate", methods=["POST"])
def rate_story():
    """Rate a story (1-5 stars) and update average rating."""
    data = request.get_json() or {}
    story_id = data.get("story_id")
    new_rating = data.get("rating", 5)

    if not (1 <= new_rating <= 5):
        return jsonify({"error": "Rating must be between 1 and 5"}), 400

    for story in STORIES_DB:
        if story["id"] == story_id:
            total_score = (story["rating"] * story["rating_count"]) + new_rating
            story["rating_count"] += 1
            story["rating"] = round(total_score / story["rating_count"], 1)
            return jsonify({"message": "Rating recorded", "story": story})

    return jsonify({"error": "Story not found"}), 404

@gallery_bp.route("/remix", methods=["POST"])
def remix_story_lineage():
    """Tracks lineage when a story is remixed."""
    data = request.get_json() or {}
    parent_id = data.get("parent_story_id")
    remixed_title = data.get("title")
    remixed_content = data.get("content")

    # Increment parent story's remix count
    parent_author = "Original Author"
    for story in STORIES_DB:
        if story["id"] == parent_id:
            story["remix_count"] += 1
            parent_author = story["author"]
            break

    # Create new remixed story entry with parent lineage reference
    new_remix = {
        "id": f"story-remix-{int(time.time())}",
        "title": remixed_title,
        "content": remixed_content,
        "author": "Current User",
        "is_public": True,
        "rating": 0.0,
        "rating_count": 0,
        "remix_count": 0,
        "parent_story_id": parent_id,
        "parent_author": parent_author,
        "created_at": time.time(),
    }
    STORIES_DB.append(new_remix)
    return jsonify({"message": "Remix created with lineage tracked", "story": new_remix})
