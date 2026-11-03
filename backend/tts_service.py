import os

AVAILABLE_VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]

def generate_speech_bytes(text: str, voice: str = "alloy") -> bytes:
    """
    Generates TTS audio bytes using OpenAI TTS API.
    """
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    if voice not in AVAILABLE_VOICES:
        voice = "alloy"

    response = client.audio.speech.create(
        model="tts-1",
        voice=voice,
        input=text,
        response_format="mp3"
    )
    return response.content
