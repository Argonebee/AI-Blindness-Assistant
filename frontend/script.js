const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const capturedImage = document.getElementById("capturedImage");
const resultBox = document.getElementById("resultBox");

const describeBtn = document.getElementById("describeBtn");
const readBtn = document.getElementById("readBtn");
const voiceBtn = document.getElementById("voiceBtn");

// Start camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert("Camera access denied or not available!");
    console.error(err);
  });

// Text to Speech
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.7;     // speed (0.5 = slow, 1 = normal, 1.5 = fast)
  utterance.pitch = 1.5;    // pitch (0 = low, 1 = normal, 2 = high)
  speechSynthesis.speak(utterance);
}

// Capture + Send to backend
async function captureAndAnalyze(mode) {
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL("image/png");
  capturedImage.src = imageData;

  resultBox.innerText = "Analyzing image...";
  speak("Analyzing image");

  try {
    const response = await fetch("http://localhost:3000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image: imageData,
        mode: mode
      })
    });

    const data = await response.json();

    resultBox.innerText = data.result;
    speak(data.result);

  } catch (error) {
    console.error("Error:", error);
    resultBox.innerText = "Error connecting to server.";
    speak("Error connecting to server.");
  }
}

// Button handlers
describeBtn.addEventListener("click", () => {
  speak("Describing the scene");
  captureAndAnalyze("describe");
});

readBtn.addEventListener("click", () => {
  speak("Reading the text");
  captureAndAnalyze("read");
});

// Voice Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  voiceBtn.addEventListener("click", () => {
    speak("Listening for command");
    recognition.start();
  });

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    console.log("Heard:", command);

    if (command.includes("describe")) {
      speak("Describing the scene");
      captureAndAnalyze("describe");
    } else if (command.includes("read")) {
      speak("Reading the text");
      captureAndAnalyze("read");
    } else {
      speak("Sorry, I did not understand. Please say describe or read.");
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    speak("There was an error with voice recognition.");
  };
} else {
  alert("Speech Recognition not supported in this browser.");
}
