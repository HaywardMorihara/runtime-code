# Feature Development Process

This document outlines the standard process for developing new features in this repository.

## Process Steps

### 1. Requirements Gathering (`requirements.md`)
- Create numbered feature directory under `specs/` (e.g., `01-feature-name/`)
- Define requirements through discovery questions
- Document user stories, functional requirements, technical decisions
- **Review checkpoint**: User reviews and approves requirements before proceeding
- **Documentation update**: Update README.md and `common/` documents if relevant
- **Git commit**: Commit approved requirements with descriptive message

### 2. Design Documentation (`design.md`)
- Create detailed technical design based on approved requirements
- Define architecture, data flow, component interactions
- Specify implementation approach and technology choices
- **Review checkpoint**: User reviews and approves design before proceeding
- **Documentation update**: Update README.md and `common/` documents if relevant
- **Git commit**: Commit approved design with descriptive message

### 3. Task Planning (`tasks.md`)
- Break down design into specific, actionable tasks
- Define task dependencies and implementation order
- Estimate effort and identify potential blockers
- **Review checkpoint**: User reviews and approves task plan before proceeding
- **Documentation update**: Update README.md and `common/` documents if relevant
- **Git commit**: Commit approved task plan with descriptive message

### 4. Implementation
- **Task-by-Task Execution**: Implement tasks one at a time with approval gates
- **Test-Driven Development**: Write lightweight unit tests first for testable components
- **Incremental Progress**: Complete individual checkmarks with review cycles
- **Documentation & Commit**: Update docs and commit after each complete task

#### Implementation Workflow (Per Task)
1. **Task Start**: Request approval to begin specific task
2. **Checkmark Completion Cycle** (repeat for each checkmark):
   - Complete the checkmark requirement
   - Update `tasks.md` to mark checkmark as completed (✅)
   - Request code review before proceeding to next checkmark
3. **Task Completion**:
   - Update relevant documentation (README.md, `common/`, etc.)
   - Git commit all changes for the completed task
   - Proceed to next task (with approval)

## Key Principles
- **Gated Process**: Each step requires explicit user approval before proceeding
- **Documentation First**: Always document before implementing
- **Incremental Implementation**: Complete tasks one-by-one with checkmark-level review cycles
- **Test-Driven Development**: Write unit tests first where feasible (not dogmatic - focus on easy wins)
- **Self-Documenting Tests**: Tests should enforce acceptance criteria and prevent regressions
- **Speed over Perfection for POCs**: For proof-of-concepts, prioritize development speed over comprehensive testing
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
