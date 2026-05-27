"""
scorer.py
---------
BiLSTM model that scores a story on three dimensions.

Inputs : (story_text, prompt_text) as strings
Outputs: { coherence, creativity, relevance } each 0.0–1.0

Place at: backend/ml/scorer.py
"""

import numpy as np
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import (
    Embedding, Bidirectional, LSTM, Dense, Dropout,
    GlobalAveragePooling1D, Input, Concatenate
)
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras import Model
import joblib
import json
import os

MAX_VOCAB  = 10_000
MAX_LEN    = 300   # tokens per story
EMBED_DIM  = 64
LSTM_UNITS = 64
SAVE_DIR   = os.path.join(os.path.dirname(__file__), "saved_scorer")

# Module-level cache — model and tokenizer loaded once on first call
_model     = None
_tokenizer = None

def build_model() -> Model:
    """
    Two-branch BiLSTM:
      branch A — story text
      branch B — prompt text (shorter, reuses same embedding weights would need
                 shared layer; for simplicity we use separate branches same arch)
    Outputs three sigmoid neurons → [coherence, creativity, relevance]
    """
    story_in  = Input(shape=(MAX_LEN,), name="story")
    prompt_in = Input(shape=(MAX_LEN,), name="prompt")

    emb = Embedding(MAX_VOCAB, EMBED_DIM, mask_zero=True, name="embedding")

    story_emb  = emb(story_in)
    prompt_emb = emb(prompt_in)

    story_enc  = Bidirectional(LSTM(LSTM_UNITS, return_sequences=True))(story_emb)
    story_enc  = GlobalAveragePooling1D()(story_enc)
    story_enc  = Dropout(0.3)(story_enc)

    prompt_enc = Bidirectional(LSTM(LSTM_UNITS // 2, return_sequences=True))(prompt_emb)
    prompt_enc = GlobalAveragePooling1D()(prompt_enc)
    prompt_enc = Dropout(0.3)(prompt_enc)

    merged = Concatenate()([story_enc, prompt_enc])
    hidden = Dense(64, activation="relu")(merged)
    hidden = Dropout(0.2)(hidden)

    # Three outputs, each a probability 0-1
    coherence   = Dense(1, activation="sigmoid", name="coherence")(hidden)
    creativity  = Dense(1, activation="sigmoid", name="creativity")(hidden)
    relevance   = Dense(1, activation="sigmoid", name="relevance")(hidden)

    model = Model(
        inputs=[story_in, prompt_in],
        outputs=[coherence, creativity, relevance],
    )
    model.compile(
        optimizer="adam",
        loss={"coherence": "mse", "creativity": "mse", "relevance": "mse"},
    )
    return model

def _load_artifacts() -> None:
    """
    Load model and tokenizer from disk into module-level cache.
    Called once on the first score() invocation — subsequent calls
    reuse the already-loaded objects, avoiding repeated disk I/O.
    """
    global _model, _tokenizer

    model_path     = os.path.join(SAVE_DIR, "scorer.keras")
    tokenizer_path = os.path.join(SAVE_DIR, "tokenizer.pkl")

    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"{model_path} not found — run train_scorer.py first."
        )

    if _model is None:
        _model = load_model(model_path)

    if _tokenizer is None:
        _tokenizer = joblib.load(tokenizer_path)

def score(story_text: str, prompt_text: str) -> dict:
    """
    Load saved model + tokenizer and score one story.
    Returns { coherence, creativity, relevance } as floats.
    """
    model_path     = os.path.join(SAVE_DIR, "scorer.keras")
    tokenizer_path = os.path.join(SAVE_DIR, "tokenizer.pkl")

    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"{model_path} not found — run train_scorer.py first."
        )

    model     = load_model(model_path)
    tokenizer = joblib.load(tokenizer_path)

    def encode(text: str):
        seq = tokenizer.texts_to_sequences([text])
        return pad_sequences(seq, maxlen=MAX_LEN, padding="post", truncating="post")

    story_seq  = encode(story_text)
    prompt_seq = encode(prompt_text)

    coh, cre, rel = model.predict(
        {"story": story_seq, "prompt": prompt_seq}, verbose=0
    )

    return {
        "coherence":  round(float(coh[0][0]), 3),
        "creativity": round(float(cre[0][0]), 3),
        "relevance":  round(float(rel[0][0]), 3),
        "overall":    round(float((coh[0][0] + cre[0][0] + rel[0][0]) / 3), 3),
    }
    