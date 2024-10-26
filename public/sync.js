// public/sync.js
const video = document.getElementById('video');
const socket = new WebSocket(`ws://${window.location.host}/api/websocket`);

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.playbackTime !== undefined) {
        video.currentTime = data.playbackTime; // Sync video time
    }
};

video.addEventListener('timeupdate', () => {
    const currentTime = video.currentTime;
    // Send current time to the server
    socket.send(JSON.stringify({ playbackTime: currentTime }));
});