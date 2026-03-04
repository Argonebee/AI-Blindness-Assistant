# AI Blindness Assistant

An AI-powered vision assistant designed to help visually impaired users understand their surroundings through real-time image analysis and voice interaction. Built using AWS Rekognition for scene description and text detection.

## Features

- **Scene Description**: Identifies and describes people, objects, and devices in the camera view
- **Text Reading (OCR)**: Detects and reads text from images aloud
- **Voice Commands**: Hands-free operation using speech recognition
- **Text-to-Speech**: All results are spoken aloud for accessibility
- **Real-time Camera**: Live video feed with instant capture and analysis

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- Web Speech API (Speech Recognition & Speech Synthesis)
- MediaDevices API for camera access

### Backend
- Node.js with Express.js
- AWS SDK for JavaScript
- AWS Rekognition (Label Detection & Text Detection)

## Prerequisites

- Node.js (v14 or higher)
- AWS Account with Rekognition access
- AWS credentials configured locally (`~/.aws/credentials` or environment variables)
- Modern web browser with camera and microphone permissions

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AI-Blindness-Assistant.git
   cd AI-Blindness-Assistant
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure AWS credentials**
   
   Ensure your AWS credentials are set up with access to Rekognition:
   ```bash
   aws configure
   ```
   Or set environment variables:
   ```bash
   export AWS_ACCESS_KEY_ID=your_access_key
   export AWS_SECRET_ACCESS_KEY=your_secret_key
   export AWS_REGION=ap-south-1
   ```

## Usage

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The server will run on `http://localhost:3000`

2. **Open the frontend**
   
   Open `frontend/index.html` in a web browser, or serve it using a local server:
   ```bash
   # Using Python
   cd frontend
   python -m http.server 8080
   ```

3. **Allow camera and microphone access** when prompted

4. **Interact with the assistant**
   - Click **"Describe Scene"** to get a description of what's in front of the camera
   - Click **"Read Text"** to detect and read any text visible in the image
   - Click **"Use Voice Command"** and say "describe" or "read"

## API Endpoints

### POST `/analyze`

Analyzes an image using AWS Rekognition.

**Request Body:**
```json
{
  "image": "data:image/png;base64,...",
  "mode": "describe" | "read"
}
```

**Response:**
```json
{
  "success": true,
  "result": "I can see a person and a computer screen in front of you."
}
```

## Project Structure

```
AI-Blindness-Assistant/
├── backend/
│   ├── server.js        # Express server with AWS Rekognition integration
│   └── package.json     # Backend dependencies
├── frontend/
│   ├── index.html       # Main UI
│   ├── script.js        # Camera, voice, and API interaction logic
│   └── style.css        # Styling
└── README.md
```

## Voice Commands

| Command | Action |
|---------|--------|
| "describe" | Captures image and describes the scene |
| "read" | Captures image and reads any detected text |

## Configuration

The backend is configured to use the `ap-south-1` AWS region. To change this, modify the region in `backend/server.js`:

```javascript
AWS.config.update({ region: "your-preferred-region" });
```

## Limitations

- Used Free models for this project, paid models can provide more detailed and better results
- Requires stable internet connection for AWS Rekognition API calls
- Scene description is limited to detecting people, screens, and phones
- Text detection works best with clear, well-lit text
- Browser must support Web Speech API for voice features

## Future Improvements

- [ ] Add more object categories for scene description
- [ ] Implement face recognition for identifying known people
- [ ] Add offline mode with local ML models
- [ ] Mobile app version for better accessibility
- [ ] Multi-language support

## License

ISC

## Acknowledgments

- Powered by [AWS Rekognition](https://aws.amazon.com/rekognition/)
