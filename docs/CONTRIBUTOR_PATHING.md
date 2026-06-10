# Component Architecture & Path Resolution Guidelines

This document tracks directory setup rules for introducing frontend sub-modules and resolving workspace environment path alignment anomalies.

## 1. Directory Structure Standards
When initializing a new UI or dashboard sub-module, always ensure it is nested cleanly within the active tracking path:
`frontend/src/components/<your-component-name>/`

Every sub-module must include:
- An isolated structural layout configuration (`index.html` or component file)
- A dedicated layout stylesheet matrix (`style.css` or scoped style module)

## 2. Troubleshooting PathNotFoundException Errors
If the local compilation or terminal synchronization routines fail with a `PathNotFoundException`, check the following:
- Verify that absolute pathways aren't hardcoded into execution scripts.
- Ensure PowerShell context paths align with the nested workspace directory before initializing scripts.
- Run tracking checks locally to ensure all sub-directories exist before staging commits.