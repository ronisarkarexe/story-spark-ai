from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, RepeatVector, TimeDistributed, Input, Dropout

SEQ_LEN = 10
N_FEATURES = 8

def build_model(units=32):
    model = Sequential([
        Input(shape=(SEQ_LEN, N_FEATURES)),
        LSTM(
            units,
            activation="tanh",
            return_sequences=False,
            name="encoder"
        ),
        RepeatVector(SEQ_LEN),
        LSTM(
            units,
            activation="tanh",
            return_sequences=True,
            name="decoder"
        ),
        TimeDistributed(Dense(N_FEATURES, activation="linear"), name="output")
    ])

    model.compile(optimizer="adam", loss="mse")
    return model
