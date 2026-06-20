import sys
from unittest.mock import MagicMock

# Inject mock tensorflow modules into sys.modules before any test collects
mock_tf = MagicMock()
sys.modules['tensorflow'] = mock_tf
sys.modules['tensorflow.keras'] = mock_tf.keras
sys.modules['tensorflow.keras.models'] = mock_tf.keras.models
sys.modules['tensorflow.keras.layers'] = mock_tf.keras.layers
sys.modules['tensorflow.keras.optimizers'] = mock_tf.keras.optimizers
sys.modules['tensorflow.keras.callbacks'] = mock_tf.keras.callbacks
sys.modules['tensorflow.keras.preprocessing'] = mock_tf.keras.preprocessing
sys.modules['tensorflow.keras.preprocessing.text'] = mock_tf.keras.preprocessing.text
sys.modules['tensorflow.keras.preprocessing.sequence'] = mock_tf.keras.preprocessing.sequence
