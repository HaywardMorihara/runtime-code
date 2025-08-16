# Tasks: Code Execution POC

## Implementation Plan

Break down the design into specific, actionable tasks for building the WebSocket-based code execution POC.

## Task Breakdown

### Task 1: Project Setup & Test Infrastructure
**Goal**: Set up basic project structure, dependencies, and testing framework
- [x] Create `src/` directory
- [x] Initialize `package.json` with basic project info
- [x] Install `ws` dependency for WebSocket support
- [x] Install testing dependencies (`jest` or similar lightweight framework)
- [x] Create basic `.gitignore` for Node.js
- [x] Set up test script in `package.json`
- [x] Create `tests/` directory structure

**Acceptance Criteria**: 
- Project can run `npm install` successfully
- Dependencies are properly defined
- `npm test` runs successfully (even with empty test suite)

---

### Task 2: WebSocket Server Implementation
**Goal**: Build Node.js server that accepts WebSocket connections and executes code
- [x] Create `src/server.js`
- [x] Set up WebSocket server listening on port 8080
- [x] Handle client connections and disconnections
- [x] Implement message parsing for `{type: 'execute', code: string}`
- [x] Implement basic `eval()` execution of received code
- [x] Send success/error responses back to client

**Acceptance Criteria**:
- Server starts without errors
- Can accept WebSocket connections
- Can receive and parse JSON messages
- Executes simple JavaScript code with `eval()`

---

### Task 3: Console Output Capture (TDD)
**Goal**: Capture console output during code execution and send to client
- [ ] **Write tests first**: Create unit tests for console capture functionality
  - Test: `console.log("hello")` is captured
  - Test: Multiple console calls captured in order
  - Test: Original console methods are restored
  - Test: No output case is handled
- [ ] Implement console capture functionality to pass tests
- [ ] Override `console.log`, `console.error`, `console.warn` during execution
- [ ] Collect all console output in an array
- [ ] Restore original console methods after execution
- [ ] Include captured output in WebSocket response

**Acceptance Criteria**:
- All unit tests pass
- `console.log("hello")` output is captured
- Multiple console calls are captured in order
- Original console functionality is preserved
- Captured output is sent to client

---

### Task 4: Game State Management (TDD)
**Goal**: Provide simple game state object that executed code can modify
- [ ] **Write tests first**: Create unit tests for game state functionality
  - Test: Initial game state structure
  - Test: Game state modification by executed code
  - Test: Game state persistence between executions
  - Test: Game state serialization for WebSocket
- [ ] Implement game state management to pass tests
- [ ] Create initial game state object: `{player: {x: 0, y: 0}, world: "Starting area"}`
- [ ] Make game state available in execution context
- [ ] Include current game state in WebSocket responses

**Acceptance Criteria**:
- All unit tests pass
- Game state is accessible in executed code
- Code can modify game state (e.g., `gameState.player.x = 5`)
- Modified game state is sent back to client
- Game state persists between code executions

---

### Task 5: Web Client Implementation
**Goal**: Build single HTML file with UI for code input and output display
- [ ] Create `src/client.html` with basic structure
- [ ] Add textarea for code input
- [ ] Add div for console output display
- [ ] Add div for game state display
- [ ] Add submit button
- [ ] Style with basic CSS for readability

**Acceptance Criteria**:
- Clean, functional UI layout
- Text areas and buttons work properly
- Displays are clearly labeled

---

### Task 6: WebSocket Client Integration
**Goal**: Connect client to server and handle real-time communication
- [ ] Add WebSocket client connection to server
- [ ] Handle connection success/failure
- [ ] Send code execution requests on button click
- [ ] Receive and parse server responses
- [ ] Display console output in output area
- [ ] Display game state as formatted text
- [ ] Handle connection errors gracefully

**Acceptance Criteria**:
- Client connects to WebSocket server
- Can send code and receive responses
- Output displays in real-time
- Error messages are shown to user

---

### Task 7: End-to-End Manual Testing
**Goal**: Verify complete functionality with manual test scenarios
- [ ] **Manual Testing Scenarios**:
  - Test: `console.log("hello world")` displays "hello world" in browser
  - Test: `gameState.player.x = 10` updates displayed game state in browser
  - Test: Syntax errors are handled gracefully in browser
  - Test: Multiple console outputs are displayed correctly in browser
  - Test: Game state persists between executions in browser
- [ ] Document any issues found during testing
- [ ] Verify all acceptance criteria are met

**Acceptance Criteria**:
- All manual test scenarios work as expected
- Error handling works as expected
- Ready for demo and future iterations

## Dependencies & Order
- Task 1 must complete before all others
- Tasks 2-4 can be done in parallel (server-side)
- Tasks 5-6 can be done in parallel (client-side)
- Task 7 requires all previous tasks complete

## Estimated Effort
- **Total**: ~3-4 hours for complete POC
- **Core functionality** (Tasks 1-3, 5-6): ~2-3 hours
- **Game state + testing** (Tasks 4, 7): ~1 hour
