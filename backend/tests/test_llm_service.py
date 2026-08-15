"""
tests/test_llm_service.py
--------------------------
Unit tests for backend/llm_service.py context injection logic.
"""

import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from lorebook import init_db, add_lore_entry
from llm_service import inject_lore_into_system_prompt, LLMService, LORE_DIRECTIVE_HEADER


class TestLLMService(unittest.TestCase):

    def setUp(self):
        self.db_fd, self.db_path = tempfile.mkstemp(suffix=".db")
        init_db(self.db_path)
        
        add_lore_entry(
            key="Hogwarts",
            content="A magical school in Scotland hidden from muggles.",
            category="location",
            db_path=self.db_path
        )
        add_lore_entry(
            key="Ancient Runes",
            content="Protection spells cast using stone symbols.",
            category="magic_system",
            db_path=self.db_path
        )

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(self.db_path)

    def test_inject_lore_into_system_prompt_single_match(self):
        prompt = "Write a scene about a student arriving at Hogwarts."
        base_prompt = "You are a fantasy writer."

        augmented, matched = inject_lore_into_system_prompt(
            prompt=prompt,
            base_system_prompt=base_prompt,
            db_path=self.db_path
        )

        self.assertEqual(len(matched), 1)
        self.assertEqual(matched[0]["key"], "Hogwarts")
        self.assertIn("You are a fantasy writer.", augmented)
        self.assertIn(LORE_DIRECTIVE_HEADER, augmented)
        self.assertIn("[Hogwarts (LOCATION)]: A magical school in Scotland hidden from muggles.", augmented)

    def test_inject_lore_into_system_prompt_multiple_matches(self):
        prompt = "The student entered Hogwarts to study Ancient Runes."
        augmented, matched = inject_lore_into_system_prompt(
            prompt=prompt,
            db_path=self.db_path
        )

        self.assertEqual(len(matched), 2)
        self.assertIn("Hogwarts", augmented)
        self.assertIn("Ancient Runes", augmented)

    def test_inject_lore_no_matches(self):
        prompt = "A simple story in a normal city."
        augmented, matched = inject_lore_into_system_prompt(
            prompt=prompt,
            base_system_prompt="Base prompt.",
            db_path=self.db_path
        )

        self.assertEqual(len(matched), 0)
        self.assertEqual(augmented, "Base prompt.")

    def test_llm_service_generate_story(self):
        service = LLMService()
        result = service.generate_story_with_lore(
            prompt="Tell a story about Hogwarts.",
            db_path=self.db_path
        )

        self.assertEqual(result["matched_lore_count"], 1)
        self.assertIn(LORE_DIRECTIVE_HEADER, result["system_prompt"])
        self.assertIn("generated_story", result)


if __name__ == "__main__":
    unittest.main()
