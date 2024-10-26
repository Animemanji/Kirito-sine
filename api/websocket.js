// api/websocket.js
import { Server } from 'ws';

const videoDuration = 596; // Duration of the video in seconds
let startTime = Date.now(); // Start time for playback reference

// Calculate the current playback time based on the start time
function getCurrentPlaybackTime() {
  return ((Date.now() - startTime) / 1000) % videoDuration;
}

const wss = new Server({ noServer: true });

// Broadcast the current playback time to all clients every 2 seconds
setInterval(() => {
  const playbackTime = getCurrentPlaybackTime();
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify({ playbackTime }));
    }
  });
}, 2000); // Adjust frequency if needed

wss.on('connection', (ws) => {
  // Send initial playback time to new connections
  ws.send(JSON.stringify({ playbackTime: getCurrentPlaybackTime() }));
});

export default (req, res) => {
  if (req.method === 'GET') {
    res.socket.server.wss = wss;
    res.socket.server.wss.handleUpgrade(req.socket, req, Buffer.alloc(0), (ws) => {
      wss.emit('connection', ws, req);
    });
    res.end();
  }
};