// src/controllers/webSocketController.js
const WebSocket = require('ws');

// Lưu trữ WebSocket Server vào biến
let wss;

const initWebSocket = (server) => {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('Client WebSocket connected');
        ws.send(JSON.stringify({ message: 'WebSocket connection established' }));

        ws.on('message', (message) => {
            console.log('Received from client:', message);
        });

        ws.send(JSON.stringify({ message: 'Welcome to WebSocket server!' }));
    });
};

const broadcast = (data) => {
    if (wss) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
};

module.exports = { initWebSocket, broadcast };
