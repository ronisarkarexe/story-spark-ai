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
from tensorflow.keras.callbacks import (
    EarlyStopping,
    ModelCheckpoint,
    Callback,
)

import os

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


def get_callbacks(
    checkpoint_path: str = "saved/model.keras",
    patience: int = 5,
    min_delta: float = 1e-4,
) -> list[Callback]:
    """
    Return standard training callbacks for the autoencoder.

    Includes:
    - EarlyStopping  : stops training when val_loss stops improving,
                       restores the best weights automatically
    - ModelCheckpoint: saves the best model to disk during training

    Parameters
    ----------
    checkpoint_path : path to save the best model (default saved/model.keras)
    patience        : epochs to wait before early stopping (default 5)
    min_delta       : minimum improvement to count as progress (default 1e-4)

    Returns
    -------
    list of Keras callbacks ready to pass to model.fit()

    Example
    -------
    model.fit(
        X_train, X_train,
        validation_split=0.1,
        epochs=100,
        callbacks=get_callbacks(),
    )
    """
    if patience < 1:
        raise ValueError(f"patience must be >= 1, got {patience}")
    
    if min_delta < 0:
        raise ValueError(f"min_delta must be >= 0, got {min_delta}")
    
    if not isinstance(checkpoint_path, str) or not checkpoint_path.strip():
        raise ValueError("checkpoint_path must be a non-empty string")

    early_stopping = EarlyStopping(
        monitor="val_loss",
        patience=patience,
        min_delta=min_delta,
        restore_best_weights=True,
        verbose=1,
    )

    # Ensure checkpoint directory exists before saving
    checkpoint_dir = os.path.dirname(checkpoint_path)
    
    if checkpoint_dir:
        os.makedirs(checkpoint_dir, exist_ok=True)
    
    checkpoint = ModelCheckpoint(
    filepath=checkpoint_path,
    monitor="val_loss",
    save_best_only=True,
    verbose=1,
    )

    return [early_stopping, checkpoint]


def model_summary() -> None:
    """Print a summary of the default model architecture."""
    build_model().summary()


if __name__ == "__main__":
    model_summary()