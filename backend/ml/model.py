"""
model.py
--------
LSTM Autoencoder for writer's block detection.
Encodes a session sequence and reconstructs it —
high reconstruction error signals anomalous (blocked) behaviour.

Place at: backend/ml/model.py
"""

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import (
    LSTM, Dense, RepeatVector,
    TimeDistributed, Input, Dropout
)
from tensorflow.keras.optimizers import Adam

SEQ_LEN    = 10
N_FEATURES = 8


def build_model(
    units: int = 32,
    dropout: float = 0.2,
    learning_rate: float = 0.001,
) -> Sequential:
    """
    Build and compile an LSTM Autoencoder for anomaly detection.

    Architecture
    ------------
    Encoder : LSTM(units) → compressed representation
    Repeat  : RepeatVector repeats encoding SEQ_LEN times
    Decoder : LSTM(units, return_sequences=True) → full sequence
    Output  : TimeDistributed Dense → reconstructed features

    Reconstruction error (MSE) is used as the anomaly score at
    inference time — high error → writer is blocked.

    Parameters
    ----------
    units         : LSTM hidden units (default 32)
    dropout       : dropout rate applied after encoder and decoder (default 0.2)
    learning_rate : Adam learning rate (default 0.001)

    Returns
    -------
    Compiled Keras Sequential model
    """
    if not (0.0 <= dropout < 1.0):
        raise ValueError(f"dropout must be in [0, 1), got {dropout}")
    if units < 1:
        raise ValueError(f"units must be >= 1, got {units}")
    if learning_rate <= 0:
        raise ValueError(f"learning_rate must be > 0, got {learning_rate}")

    model = Sequential([
        Input(shape=(SEQ_LEN, N_FEATURES)),

        # ── Encoder ──────────────────────────────────────────────────────
        LSTM(
            units,
            activation="tanh",
            return_sequences=False,
            name="encoder",
        ),
        Dropout(dropout, name="encoder_dropout"),

        # ── Bridge ───────────────────────────────────────────────────────
        RepeatVector(SEQ_LEN),

        # ── Decoder ──────────────────────────────────────────────────────
        LSTM(
            units,
            activation="tanh",
            return_sequences=True,
            name="decoder",
        ),
        Dropout(dropout, name="decoder_dropout"),

        # ── Reconstruction ───────────────────────────────────────────────
        TimeDistributed(
            Dense(N_FEATURES, activation="linear"),
            name="output",
        ),
    ], name="lstm_autoencoder")

    model.compile(
        optimizer=Adam(learning_rate=learning_rate),
        loss="mse",
    )

    return model


def model_summary() -> None:
    """Print a summary of the default model architecture."""
    build_model().summary()


if __name__ == "__main__":
    model_summary()