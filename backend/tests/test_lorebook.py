"""
tests/test_lorebook.py
-----------------------
Unit tests for backend/lorebook.py database functions, keyword matcher, and Flask API.
"""

import os
import sys
import tempfile
import unittest
from flask import Flask

# Add parent dir to sys.path so lorebook and llm_service can be imported directly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from lorebook import (
    init_db,
    add_lore_entry,
    get_lore_entries,
    get_lore_entry_by_id,
    update_lore_entry,
    delete_lore_entry,
    find_matching_lore,
    lorebook_bp,
)


class TestLorebookDB(unittest.TestCase):

    def setUp(self):
        self.db_fd, self.db_path = tempfile.mkstemp(suffix=".db")
        init_db(self.db_path)

        self.app = Flask(__name__)
        self.app.register_blueprint(lorebook_bp)
        self.client = self.app.test_client()

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(self.db_path)

    def test_add_and_get_lore_entry(self):
        entry = add_lore_entry(
            key="Hogwarts",
            content="A magical school in Scotland hidden from muggles.",
            category="location",
            user_id="user1",
            db_path=self.db_path
        )
        self.assertEqual(entry["key"], "Hogwarts")
        self.assertEqual(entry["category"], "location")
        self.assertTrue(entry["is_active"])

        entries = get_lore_entries(user_id="user1", db_path=self.db_path)
        self.assertEqual(len(entries), 1)
        self.assertEqual(entries[0]["key"], "Hogwarts")

    def test_update_lore_entry(self):
        entry = add_lore_entry(key="Elder Wand", content="Ancient wand.", category="item", db_path=self.db_path)
        updated = update_lore_entry(
            entry_id=entry["id"],
            content="Most powerful wand made of elder wood.",
            is_active=False,
            db_path=self.db_path
        )
        self.assertEqual(updated["content"], "Most powerful wand made of elder wood.")
        self.assertFalse(updated["is_active"])

    def test_delete_lore_entry(self):
        entry = add_lore_entry(key="DeleteMe", content="To be deleted", db_path=self.db_path)
        success = delete_lore_entry(entry["id"], db_path=self.db_path)
        self.assertTrue(success)
        self.assertIsNone(get_lore_entry_by_id(entry["id"], db_path=self.db_path))

    def test_find_matching_lore(self):
        add_lore_entry(key="Hogwarts", content="A magical school.", category="location", db_path=self.db_path)
        add_lore_entry(key="Forbidden Forest", content="Dangerous woods.", category="location", db_path=self.db_path)
        add_lore_entry(key="Inactive Realm", content="Secret.", is_active=False, db_path=self.db_path)

        prompt = "Harry arrived at Hogwarts on a cold autumn morning."
        matches = find_matching_lore(prompt, db_path=self.db_path)

        self.assertEqual(len(matches), 1)
        self.assertEqual(matches[0]["key"], "Hogwarts")

    def test_find_matching_lore_case_insensitive_and_punctuation(self):
        add_lore_entry(key="Shadow Magic", content="Forbidden art.", category="magic_system", db_path=self.db_path)
        
        prompt = "Using shadow magic, the sorcerer vanished!"
        matches = find_matching_lore(prompt, db_path=self.db_path)
        self.assertEqual(len(matches), 1)
        self.assertEqual(matches[0]["key"], "Shadow Magic")

    def test_api_create_and_fetch_lore(self):
        res = self.client.post("/api/lorebook", json={
            "key": "Gryffindor",
            "content": "House of bravery and chivalry.",
            "category": "faction"
        })
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertEqual(data["entry"]["key"], "Gryffindor")

        res_get = self.client.get("/api/lorebook")
        self.assertEqual(res_get.status_code, 200)
        self.assertGreaterEqual(len(res_get.get_json()["entries"]), 1)


if __name__ == "__main__":
    unittest.main()
