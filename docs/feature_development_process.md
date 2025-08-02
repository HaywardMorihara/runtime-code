# Feature Development Process

This document outlines the standard process for developing new features in this repository.

## Process Steps

### 1. Requirements Gathering (`requirements.md`)
- Create numbered feature directory under `specs/` (e.g., `01-feature-name/`)
- Define requirements through discovery questions
- Document user stories, functional requirements, technical decisions
- **Review checkpoint**: User reviews and approves requirements before proceeding
- **Git commit**: Commit approved requirements with descriptive message

### 2. Design Documentation (`design.md`)
- Create detailed technical design based on approved requirements
- Define architecture, data flow, component interactions
- Specify implementation approach and technology choices
- **Review checkpoint**: User reviews and approves design before proceeding
- **Git commit**: Commit approved design with descriptive message

### 3. Task Planning (`tasks.md`)
- Break down design into specific, actionable tasks
- Define task dependencies and implementation order
- Estimate effort and identify potential blockers
- **Review checkpoint**: User reviews and approves task plan before proceeding
- **Git commit**: Commit approved task plan with descriptive message

### 4. Implementation
- Execute tasks in planned order
- Create code, tests, and documentation
- Validate each task completion against acceptance criteria

## Key Principles
- **Gated Process**: Each step requires explicit user approval before proceeding
- **Documentation First**: Always document before implementing
- **Simplicity for POCs**: Favor simplicity over features for proof-of-concepts
- **Iterative**: Be prepared to revise earlier steps based on new insights

## Directory Structure
```
specs/
  NN-feature-name/
    requirements.md
    design.md
    tasks.md
```

Where `NN` is a zero-padded number to maintain chronological order.
