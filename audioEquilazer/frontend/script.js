
const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");

canvas.width = 500;
canvas.height = 500;

let audioContext, analyser, dataArray;

startBtn.addEventListener("click", async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const mic = audioContext.createMediaStreamSource(stream);

        mic.connect(analyser);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        animate();
    } catch (error) {
        console.error("Microphone error:", error);
        alert("Microphone access blocked or unavailable!");
    }
});

function animate() {
    requestAnimationFrame(animate);

    if (!analyser) return;

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const radius = 120;
    const bars = dataArray.length;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < bars; i++) {
        let barHeight = dataArray[i] / 2;
        let angle = (i * Math.PI * 2) / bars;

        let x1 = centerX + Math.cos(angle) * radius;
        let y1 = centerY + Math.sin(angle) * radius;

        let x2 = centerX + Math.cos(angle) * (radius + barHeight);
        let y2 = centerY + Math.sin(angle) * (radius + barHeight);

        ctx.strokeStyle = `hsl(${i * 3}, 100%, 50%)`;
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}
// -------- WebSocket Connection --------
const socket = new WebSocket("ws://127.0.0.1:8080/audio-stream");

socket.onopen = () => {
    console.log("WebSocket connected");
    // send a test audio chunk
    socket.send(new Uint8Array([1, 2, 3, 4]));
};

socket.onmessage = (event) => {
    console.log("Message from backend:", event.data);
};

socket.onerror = (error) => {
    console.error("WebSocket error:", error);
};
