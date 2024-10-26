// public/sync.js
const video = document.getElementById('video');
const socket = new WebSocket(`ws://${window.location.host}/api/websocket`);

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.playbackTime !== undefined) {
        video.currentTime = data.playbackTime; // Sync to server playback time
        if (video.paused) video.play();        // Ensure video is playing
    }
};

// Prevent user controls
video.controls = false;
video.addEventListener('play', () => video.pause());