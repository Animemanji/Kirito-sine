// public/sync.js
const video = document.getElementById('video');
const socket = new WebSocket(`ws://${window.location.host}/api/websocket`);

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.playbackTime !== undefined) {
        // Sync the video playback time to match the server's time
        video.currentTime = data.playbackTime;
        if (video.paused) video.play(); // Make sure the video is playing
    }
};

// Hide video controls and disable user control
video.controls = false;
video.addEventListener('play', () => video.pause()); // Block user-initiated play