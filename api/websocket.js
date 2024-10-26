// api/websocket.js
import { Server } from 'ws';

const videoDuration = 596; // Replace with actual duration of the video in seconds
const syncInterval = 5000; // Send sync updates every 5 seconds

// Track the "real-time" playback time
let startTime = Date.now(); // Initialize start time as server start time

const wss = new Server({ noServer: true });

// Calculate current playback time based on the server's start time
function getPlaybackTime() {
    let currentTime = ((Date.now() - startTime) / 1000) % videoDuration;
    return currentTime;
}

// Broadcast sync time every few seconds to all clients
setInterval(() => {
    const playbackTime = getPlaybackTime();
    wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify({ playbackTime }));
        }
    });
}, syncInterval);

wss.on('connection', (ws) => {
    // Send initial playback time when a client connects
    ws.send(JSON.stringify({ playbackTime: getPlaybackTime() }));
});

// Export the WebSocket handler
export default (req, res) => {
    if (req.method === 'GET') {
        res.socket.server.wss = wss;
        res.socket.server.wss.handleUpgrade(req.socket, req, Buffer.alloc(0), (ws) => {
            wss.emit('connection', ws, req);
        });
        res.end();
    }
};