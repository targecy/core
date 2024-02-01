# Project Naming Conventions

## Branch Naming Conventions

Branch names should be descriptive, concise, and follow a consistent pattern to make them easily identifiable. Here’s our standard format:

- **Feature Branches**: `feature/<short-feature-description>` or `feat/<short-feature-description>`
  - Example: `feature/add-login`
- **Bugfix Branches**: `fix/<short-bug-description>`
  - Example: `fix/login-error`
- **Hotfix Branches**: `hotfix/<short-hotfix-description>`
  - Example: `hotfix/login-crash`
- **Release Branches**: `release/<version>`
  - Example: `release/1.0.0`
- **Development Branch**: `main` (primary development branch)
- **Release Branch**: `release` (stable release branch)

## Commit Message Guidelines

Commit messages should be clear, descriptive, and follow a standard format to make the history readable and easy to follow.

- Start with a capitalized imperative verb.
- Use present tense ("Add feature" not "Added feature").
- Include a concise description in the first line (50-70 characters).
- Optionally, provide a detailed description in the body.
- Reference issue or ticket numbers when applicable.

### Example

```
Add login page validation
- Implement email and password validation
- Update unit tests for login
- Refers to ticket #123
```

## Version Tagging

For version tagging, follow semantic versioning (`MAJOR.MINOR.PATCH`) to track the progress and scope of the project.

- **MAJOR**: Incompatible API changes
- **MINOR**: Add functionality in a backwards-compatible manner
- **PATCH**: Backwards-compatible bug fixes

Example: `v1.0.0`, `v1.0.1`, `v1.1.0`
