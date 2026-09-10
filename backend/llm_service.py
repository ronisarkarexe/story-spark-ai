"""
llm_service.py
--------------
LLM integration and dynamic context injection service.
Scans user prompt for lorebook keywords and injects strict lore directive blocks
into system prompts for OpenAI, Anthropic, or Gemini story generation.
"""

import os
from typing import Dict, List, Optional, Tuple, Any
from lorebook import find_matching_lore, get_lore_entries


LORE_DIRECTIVE_HEADER = "[WORLD LORE & RULES - STRICT ADHERENCE REQUIRED]"


def inject_lore_into_system_prompt(
    prompt: str,
    base_system_prompt: str = "",
    user_id: Optional[str] = None,
    universe_id: Optional[str] = None,
    entries: Optional[List[Dict[str, Any]]] = None,
    db_path: Optional[str] = None
) -> Tuple[str, List[Dict[str, Any]]]:
    """
    Scans `prompt` for lore keywords and injects matched lore rules into `base_system_prompt`.

    Returns:
        Tuple of (augmented_system_prompt, list_of_matched_entries)
    """
    matched_entries = find_matching_lore(
        text=prompt,
        user_id=user_id,
        universe_id=universe_id,
        custom_entries=entries,
        db_path=db_path
    )

    if not matched_entries:
        return base_system_prompt, []

    # Build structured lore instruction block
    lore_lines = [LORE_DIRECTIVE_HEADER]
    lore_lines.append(
        "The story prompt references specific world elements below. You MUST strictly adhere to all of the following rules, locations, and lore constraints without contradiction:"
    )

    for entry in matched_entries:
        key = entry.get("key", "").strip()
        category = entry.get("category", "general").strip()
        content = entry.get("content", "").strip()
        lore_lines.append(f"• [{key} ({category.upper()})]: {content}")

    lore_block = "\n".join(lore_lines)

    if base_system_prompt and base_system_prompt.strip():
        augmented = f"{base_system_prompt.strip()}\n\n{lore_block}"
    else:
        augmented = lore_block

    return augmented, matched_entries


class LLMService:
    """Service to handle LLM story generation with automatic lore injection."""

    def __init__(self, default_provider: str = "openai"):
        self.default_provider = default_provider

    def generate_story_with_lore(
        self,
        prompt: str,
        base_system_prompt: str = "You are an expert creative story generator. Craft vivid, compelling narratives.",
        user_id: Optional[str] = None,
        universe_id: Optional[str] = None,
        entries: Optional[List[Dict[str, Any]]] = None,
        provider: Optional[str] = None,
        db_path: Optional[str] = None,
        max_tokens: int = 1000,
        temperature: float = 0.7
    ) -> Dict[str, Any]:
        """
        Executes story generation after dynamically injecting matching lore into the system prompt.
        """
        selected_provider = provider or self.default_provider

        # 1. Inject matching lore into system prompt
        augmented_system_prompt, matched = inject_lore_into_system_prompt(
            prompt=prompt,
            base_system_prompt=base_system_prompt,
            user_id=user_id,
            universe_id=universe_id,
            entries=entries,
            db_path=db_path
        )

        # 2. Attempt call to LLM APIs or fallback to rich mock generator
        openai_key = os.getenv("OPENAI_API_KEY")
        anthropic_key = os.getenv("ANTHROPIC_API_KEY")

        content = None
        used_provider = "mock"

        if selected_provider == "openai" and openai_key:
            try:
                from openai import OpenAI
                client = OpenAI(api_key=openai_key)
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": augmented_system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=max_tokens,
                    temperature=temperature
                )
                content = response.choices[0].message.content
                used_provider = "openai"
            except Exception as e:
                content = None

        elif selected_provider == "anthropic" and anthropic_key:
            try:
                import anthropic
                client = anthropic.Anthropic(api_key=anthropic_key)
                response = client.messages.create(
                    model="claude-3-haiku-20240307",
                    system=augmented_system_prompt,
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=max_tokens,
                    temperature=temperature
                )
                content = response.content[0].text
                used_provider = "anthropic"
            except Exception as e:
                content = None

        # Fallback simulated response for offline/local testing
        if content is None:
            used_provider = "mock_simulator"
            lore_mention_text = ""
            if matched:
                lore_summary = ", ".join([f"'{e['key']}' ({e['category']})" for e in matched])
                lore_mention_text = f"\n\n[Lore Adherence Applied for: {lore_summary}]"
            
            content = (
                f"Story Generation Output:\n"
                f"The story unfolds seamlessly based on your prompt: '{prompt}'.\n"
                f"{lore_mention_text}\n"
                f"Every detail strictly reflects the established setting rules and lore specifications."
            )

        return {
            "prompt": prompt,
            "system_prompt": augmented_system_prompt,
            "matched_lore_count": len(matched),
            "matched_entries": matched,
            "provider": used_provider,
            "generated_story": content
        }


# Global helper instance
llm_service = LLMService()
