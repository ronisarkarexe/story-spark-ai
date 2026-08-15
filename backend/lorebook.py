"""
lorebook.py
-----------
Backend database model, keyword matcher, and REST API blueprint for the Lorebook feature.
Stores lorebook entries (rules, locations, magic systems, characters, etc.) and offers
dynamic keyword matching for context injection into LLM system prompts.
"""

import os
import re
import sqlite3
import time
from typing import Dict, List, Optional, Any
from flask import Blueprint, jsonify, request

DEFAULT_DB_PATH = os.getenv("LOREBOOK_DB_PATH", os.path.join(os.path.dirname(__file__), "lorebook.db"))

lorebook_bp = Blueprint("lorebook", __name__, url_prefix="/api/lorebook")


def get_db_connection(db_path: Optional[str] = None) -> sqlite3.Connection:
    """Creates and returns a sqlite3 database connection with Row factory enabled."""
    path = db_path or DEFAULT_DB_PATH
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(db_path: Optional[str] = None) -> None:
    """Initializes the lorebook_entries database schema if it doesn't already exist."""
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS lorebook_entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            universe_id TEXT,
            key TEXT NOT NULL,
            category TEXT NOT NULL DEFAULT 'general',
            content TEXT NOT NULL,
            is_active INTEGER NOT NULL DEFAULT 1,
            created_at REAL NOT NULL,
            updated_at REAL NOT NULL
        )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_lorebook_user ON lorebook_entries(user_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_lorebook_universe ON lorebook_entries(universe_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_lorebook_key ON lorebook_entries(key)")
    conn.commit()
    conn.close()


def _row_to_dict(row: sqlite3.Row) -> Dict[str, Any]:
    """Converts SQLite Row to dictionary with boolean for is_active."""
    d = dict(row)
    d["is_active"] = bool(d["is_active"])
    return d


def add_lore_entry(
    key: str,
    content: str,
    category: str = "general",
    user_id: Optional[str] = None,
    universe_id: Optional[str] = None,
    is_active: bool = True,
    db_path: Optional[str] = None
) -> Dict[str, Any]:
    """Inserts a new lorebook entry into the database."""
    init_db(db_path)
    now = time.time()
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO lorebook_entries (user_id, universe_id, key, category, content, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (user_id, universe_id, key.strip(), category.strip().lower(), content.strip(), 1 if is_active else 0, now, now)
    )
    entry_id = cursor.lastrowid
    conn.commit()
    
    cursor.execute("SELECT * FROM lorebook_entries WHERE id = ?", (entry_id,))
    row = cursor.fetchone()
    conn.close()
    return _row_to_dict(row)


def get_lore_entries(
    user_id: Optional[str] = None,
    universe_id: Optional[str] = None,
    category: Optional[str] = None,
    active_only: bool = False,
    db_path: Optional[str] = None
) -> List[Dict[str, Any]]:
    """Retrieves lore entries matching optional filters."""
    init_db(db_path)
    conn = get_db_connection(db_path)
    cursor = conn.cursor()

    query = "SELECT * FROM lorebook_entries WHERE 1=1"
    params: List[Any] = []

    if user_id is not None:
        query += " AND (user_id = ? OR user_id IS NULL)"
        params.append(user_id)
    if universe_id is not None:
        query += " AND (universe_id = ? OR universe_id IS NULL)"
        params.append(universe_id)
    if category is not None and category.strip():
        query += " AND category = ?"
        params.append(category.strip().lower())
    if active_only:
        query += " AND is_active = 1"

    query += " ORDER BY created_at DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return [_row_to_dict(row) for row in rows]


def get_lore_entry_by_id(entry_id: int, db_path: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Retrieves a single lore entry by ID."""
    init_db(db_path)
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM lorebook_entries WHERE id = ?", (entry_id,))
    row = cursor.fetchone()
    conn.close()
    return _row_to_dict(row) if row else None


def update_lore_entry(
    entry_id: int,
    key: Optional[str] = None,
    content: Optional[str] = None,
    category: Optional[str] = None,
    is_active: Optional[bool] = None,
    user_id: Optional[str] = None,
    universe_id: Optional[str] = None,
    db_path: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """Updates an existing lore entry fields."""
    init_db(db_path)
    entry = get_lore_entry_by_id(entry_id, db_path)
    if not entry:
        return None

    now = time.time()
    updates = []
    params: List[Any] = []

    if key is not None:
        updates.append("key = ?")
        params.append(key.strip())
    if content is not None:
        updates.append("content = ?")
        params.append(content.strip())
    if category is not None:
        updates.append("category = ?")
        params.append(category.strip().lower())
    if is_active is not None:
        updates.append("is_active = ?")
        params.append(1 if is_active else 0)
    if user_id is not None:
        updates.append("user_id = ?")
        params.append(user_id)
    if universe_id is not None:
        updates.append("universe_id = ?")
        params.append(universe_id)

    if not updates:
        return entry

    updates.append("updated_at = ?")
    params.append(now)
    params.append(entry_id)

    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    cursor.execute(f"UPDATE lorebook_entries SET {', '.join(updates)} WHERE id = ?", params)
    conn.commit()
    conn.close()

    return get_lore_entry_by_id(entry_id, db_path)


def delete_lore_entry(entry_id: int, db_path: Optional[str] = None) -> bool:
    """Deletes a lore entry by ID."""
    init_db(db_path)
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM lorebook_entries WHERE id = ?", (entry_id,))
    affected = cursor.rowcount
    conn.commit()
    conn.close()
    return affected > 0


def find_matching_lore(
    text: str,
    user_id: Optional[str] = None,
    universe_id: Optional[str] = None,
    db_path: Optional[str] = None,
    custom_entries: Optional[List[Dict[str, Any]]] = None
) -> List[Dict[str, Any]]:
    """
    Scans `text` for active lorebook entry keywords.
    Uses case-insensitive word-boundary matching so that keywords like 'Hogwarts'
    match 'hogwarts' or 'Hogwarts,' but not partial words unless key contains non-word chars.
    Returns list of matched entry dicts.
    """
    if not text or not text.strip():
        return []

    entries = custom_entries
    if entries is None:
        entries = get_lore_entries(user_id=user_id, universe_id=universe_id, active_only=True, db_path=db_path)

    matched = []
    text_lower = text.lower()

    for entry in entries:
        if not entry.get("is_active", True):
            continue
        
        key = entry.get("key", "").strip()
        if not key:
            continue

        # Prepare regex pattern with word boundaries for alphanumeric keys
        key_pattern = re.escape(key.lower())
        pattern = rf"\b{key_pattern}\b"
        
        if re.search(pattern, text_lower):
            matched.append(entry)

    return matched


# ── Flask REST API Endpoints ───────────────────────────────────────────────────

@lorebook_bp.route("", methods=["GET"])
def api_get_entries():
    """Fetch lore entries."""
    user_id = request.args.get("user_id")
    universe_id = request.args.get("universe_id")
    category = request.args.get("category")
    active_only = request.args.get("active_only", "false").lower() in ("true", "1")

    entries = get_lore_entries(
        user_id=user_id,
        universe_id=universe_id,
        category=category,
        active_only=active_only
    )
    return jsonify({"entries": entries, "total": len(entries)})


@lorebook_bp.route("", methods=["POST"])
def api_create_entry():
    """Create a new lore entry."""
    data = request.get_json(force=True) or {}
    key = data.get("key")
    content = data.get("content")
    category = data.get("category", "general")
    user_id = data.get("user_id")
    universe_id = data.get("universe_id")
    is_active = data.get("is_active", True)

    if not key or not isinstance(key, str) or not key.strip():
        return jsonify({"error": "Field 'key' is required and must be a non-empty string"}), 400
    if not content or not isinstance(content, str) or not content.strip():
        return jsonify({"error": "Field 'content' is required and must be a non-empty string"}), 400

    entry = add_lore_entry(
        key=key,
        content=content,
        category=category,
        user_id=user_id,
        universe_id=universe_id,
        is_active=is_active
    )
    return jsonify({"message": "Lore entry created successfully", "entry": entry}), 201


@lorebook_bp.route("/<int:entry_id>", methods=["GET"])
def api_get_entry(entry_id: int):
    """Fetch single entry by ID."""
    entry = get_lore_entry_by_id(entry_id)
    if not entry:
        return jsonify({"error": f"Lore entry with ID {entry_id} not found"}), 404
    return jsonify({"entry": entry})


@lorebook_bp.route("/<int:entry_id>", methods=["PUT"])
def api_update_entry(entry_id: int):
    """Update an existing entry."""
    data = request.get_json(force=True) or {}
    entry = update_lore_entry(
        entry_id=entry_id,
        key=data.get("key"),
        content=data.get("content"),
        category=data.get("category"),
        is_active=data.get("is_active"),
        user_id=data.get("user_id"),
        universe_id=data.get("universe_id")
    )
    if not entry:
        return jsonify({"error": f"Lore entry with ID {entry_id} not found"}), 404
    return jsonify({"message": "Lore entry updated successfully", "entry": entry})


@lorebook_bp.route("/<int:entry_id>", methods=["DELETE"])
def api_delete_entry(entry_id: int):
    """Delete an entry."""
    success = delete_lore_entry(entry_id)
    if not success:
        return jsonify({"error": f"Lore entry with ID {entry_id} not found"}), 404
    return jsonify({"message": f"Lore entry {entry_id} deleted successfully"})


@lorebook_bp.route("/match", methods=["POST"])
def api_match_prompt():
    """Scans prompt for lore matching entries."""
    data = request.get_json(force=True) or {}
    prompt = data.get("prompt", "")
    user_id = data.get("user_id")
    universe_id = data.get("universe_id")
    custom_entries = data.get("custom_entries")

    matched = find_matching_lore(
        text=prompt,
        user_id=user_id,
        universe_id=universe_id,
        custom_entries=custom_entries
    )
    return jsonify({
        "prompt": prompt,
        "matched_count": len(matched),
        "matched_entries": matched
    })
