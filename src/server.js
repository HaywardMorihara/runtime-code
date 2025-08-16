const WebSocket = require('ws');

// Function to handle code execution
function handleCodeExecution(ws, code) {
    try {
        console.log('Executing code:', code);
        
        // Execute the code using eval
        const result = eval(code);
        
        // Send success response
        ws.send(JSON.stringify({
            type: 'result',
            success: true,
            result: result,
            console: [] // Will be populated in Task 3
        }));
        
    } catch (error) {
        console.error('Code execution error:', error);
        
        // Send error response
        ws.send(JSON.stringify({
            type: 'result',
            success: false,
            error: error.message,
            console: []
        }));
    }
}

// Create WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server starting on port 8080...');

// Handle client connections
wss.on('connection', (ws) => {
    console.log('Client connected');
    
    // Send welcome message
    ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to code execution server'
    }));
    
    // Handle incoming messages
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data.toString());
            console.log('Received message:', message);
            
            // Handle execute requests
            if (message.type === 'execute') {
                handleCodeExecution(ws, message.code);
            } else {
                // Unknown message type
                ws.send(JSON.stringify({
                    type: 'error',
                    message: `Unknown message type: ${message.type}`
                }));
            }
        } catch (error) {
            // Invalid JSON
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Invalid JSON message format'
            }));
        }
    });
    
    // Handle client disconnections
    ws.on('close', () => {
        console.log('Client disconnected');
    });
    
    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

console.log('WebSocket server ready on ws://localhost:8080');
