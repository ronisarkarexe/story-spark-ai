# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- BiLSTM scorer model for evaluating story coherence, creativity, and relevance
- LSTM Autoencoder for writer's block detection
- Flask API blueprint exposing POST /score endpoint
- Daily digest push notification via Expo SDK
- Google OAuth login support
- OTP-based email verification
- Story generation via Gemini AI
- User authentication with JWT
- MongoDB integration for story and user storage

### Fixed
- Replaced `require()` with ES module import for `expo-server-sdk`
- Cached ML model and tokenizer at module level to avoid repeated disk I/O

---

## [0.1.0] - 2026-05-14

### Added
- Initial open-source release of StorySparkAI
- Core story generation platform
- User registration and login
- Story prompt input and variation generation
- Basic frontend UI with React
