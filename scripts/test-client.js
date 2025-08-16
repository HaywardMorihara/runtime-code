// Simple WebSocket client to test message sending/receiving
const WebSocket = require('ws');

console.log('🧪 Testing WebSocket client connection...');
console.log(' Make sure the server is running: npm start\n');

// Connect to our existing server
const client = new WebSocket('ws://localhost:8080');

client.on('open', () => {
    console.log('✅ Connected to server');
    
    // Test 1: Send a simple math expression
    console.log('📤 Sending: 5 + 3');
    client.send(JSON.stringify({
        type: 'execute',
        code: '5 + 3'
    }));
});

client.on('message', (data) => {
    try {
        const message = JSON.parse(data.toString());
        console.log('📨 Received:', message);
        
        if (message.type === 'connection') {
            console.log('✅ Welcome message received');
        } else if (message.type === 'result') {
            if (message.success) {
                console.log(`✅ Code executed successfully! Result: ${message.result}`);
                
                // Test 2: Send invalid code to test error handling
                console.log('\n📤 Testing error handling with invalid code...');
                client.send(JSON.stringify({
                    type: 'execute',
                    code: 'this will cause an error('
                }));
            } else {
                console.log(`✅ Error handling works! Error: ${message.error}`);
                console.log('\n🎉 All tests passed! Closing connection...');
                client.close();
            }
        }
    } catch (error) {
        console.error('❌ Failed to parse message:', error);
        client.close();
    }
});

client.on('close', () => {
    console.log('👋 Disconnected from server');
    process.exit(0);
});

client.on('error', (error) => {
    console.error('❌ Connection failed:', error.message);
    console.log('\n💡 Make sure the server is running with: npm start');
    process.exit(1);
});

// Timeout after 5 seconds
setTimeout(() => {
    console.error('❌ Test timeout - no response from server');
    console.log('💡 Make sure the server is running with: npm start');
    process.exit(1);
}, 5000);
