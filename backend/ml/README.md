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
