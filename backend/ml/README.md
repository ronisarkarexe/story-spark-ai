# ML Module

This directory contains the Machine Learning components used in StorySparkAI.

## Prerequisites

- Python 3.10+
- pip

## Installation

Install dependencies:

```bash
pip install -r requirements.txt
```

## Quick Start

Follow these copy-paste steps to get the ML demo and training running locally.

Note: Run the commands below from inside the `backend/ml` directory (for example: `cd backend/ml`) so the `saved/` paths resolve correctly.

### Windows PowerShell
```powershell
# create & activate virtual environment (PowerShell)
python -m venv .venv
.venv\Scripts\Activate.ps1

# upgrade pip and install dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt

# run the Streamlit demo (opens at http://localhost:8501)
streamlit run app.py

# (optional) train models
python train.py
python train_scorer.py
```

### Unix / macOS / WSL
```bash
# create & activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# upgrade pip and install dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt

# run the Streamlit demo (opens at http://localhost:8501)
streamlit run app.py

# (optional) train models
python train.py
python train_scorer.py
```

### Notes

- Python version: requires Python 3.10+. Check with `python --version`.
- Artifacts: the Streamlit demo expects model artifacts in the `saved/` directory (relative to this `backend/ml` folder). Expected files: `model.keras`, `scaler.pkl`, `threshold.json`. Create the `saved/` directory if missing.
- If the Streamlit demo raises a `FileNotFoundError`, ensure the saved artifacts are present (see `DEVELOPMENT.md` and `app.py` for details).
- TensorFlow caveat: the `requirements.txt` installs the CPU build by default. For GPU support, follow the official TensorFlow GPU installation guide and ensure compatible CUDA/cuDNN versions for your platform.


## Verification


After installing dependencies, quickly verify the main Python packages are importable:

```bash
# prints "OK" on success
python -c "import streamlit, tensorflow, joblib; print('OK')"
```

If that command raises an ImportError, double-check the virtual environment is activated and re-run `pip install -r requirements.txt`.

## Troubleshooting

- FileNotFoundError on startup: create the `saved/` folder and confirm artifact filenames match (`model.keras`, `scaler.pkl`, `threshold.json`).
- `pip install` failures on Linux: install system build tools first (Debian/Ubuntu: `sudo apt-get install build-essential python3-dev`).
- TensorFlow import errors on GPU machines: verify CUDA/cuDNN versions match the TensorFlow release — see the TensorFlow installation guide: https://www.tensorflow.org/install
- Streamlit not opening in browser: Streamlit serves on `http://localhost:8501` by default; open that URL manually if your browser doesn't open automatically.



## Files Overview

### detect.py
AI-generated content detection module.

### model.py
Defines the LSTM-based neural network architecture used for training and inference.

### score_api.py
Provides API endpoints and utilities for story scoring.

### scorer.py
Implements story quality scoring logic.

### train.py
Training script for the content detection model.

### train_scorer.py
Training script for the scoring model.

### tests/
Contains unit tests for ML components.

## Running Training

Train detection model:

```bash
python train.py
```

Train scoring model:

```bash
python train_scorer.py
```

## Testing

Run tests:

```bash
pytest
```
