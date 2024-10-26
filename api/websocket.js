// api/websocket.js
import { Server } from 'ws';

const wss = new Server({ noServer: true });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.playbackTime !== undefined) {
            // Broadcast to all clients
            wss.clients.forEach((client) => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify({ playbackTime: data.playbackTime }));
                }
            });
        }
    });

    ws.send(JSON.stringify({ message: 'Welcome to the synchronized video!' }));
});

// Export the WebSocket handler
export default (req, res) => {
    if (req.method === 'GET') {
        // Upgrade to WebSocket
        res.socket.server.wss = wss;
        res.socket.server.wss.handleUpgrade(req.socket, req, Buffer.alloc(0), (ws) => {
            wss.emit('connection', ws, req);
        });
        res.end();
    }
};