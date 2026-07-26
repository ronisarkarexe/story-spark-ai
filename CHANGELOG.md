# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Character library feature for managing story characters
- Story genre transformation component
- Story version history tracking
- Audio narration feature for stories
- Story translation functionality
- Cookie consent redesign
- Improved onboarding guide documentation
- Payment signature length validation
- Search query parameter validation
- Story translation bug fixes
- Parallel middleware fetches for performance improvement
- User data loss prevention fixes
- Reservation flow fixes
- Writer feedback review form
- Story branching graph visualization
- Story world map feature
- Story remix functionality
- Story visualizer component
- Story trailer generation
- Continue story modal
- Story collection features

### Changed
- Updated empty stories state component
- Improved trending topics layout with responsive grid
- Enhanced dark mode support across components
- Updated frontend package dependencies
- Improved error handling and validation

### Fixed
- Fixed delete user dangling references
- Fixed story translation bug
- Fixed search query parameter validation
- Fixed payment signature length check
- Replaced `require()` with ES module import for `expo-server-sdk`
- Cached ML model and tokenizer at module level to avoid repeated disk I/O
- Fixed reservation flow issues
- Fixed data loss issues
- Fixed story coherence scoring

---

## [0.1.0] - 2026-05-14

### Added
- Initial open-source release of StorySparkAI
- Core story generation platform
- User registration and login
- Story prompt input and variation generation
- Basic frontend UI with React
