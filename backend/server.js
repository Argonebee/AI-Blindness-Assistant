const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

// Configure AWS
AWS.config.update({ region: "ap-south-1" });

const rekognition = new AWS.Rekognition();

function buildHumanDescription(labels) {
  // Normalize labels to lower-case for easier matching
  const lower = labels.map(l => l.toLowerCase());

  let hasPerson = 
    lower.includes("person")||
    lower.includes("photo")||
    lower.includes("portrait")||
    lower.includes("photography");
  let hasScreen =
    lower.includes("screen") ||
    lower.includes("monitor") ||
    lower.includes("computer") ||
    lower.includes("laptop") ||
    lower.includes("display");

  let hasPhone =
    lower.includes("mobile phone") ||
    lower.includes("cell phone") ||
    lower.includes("smartphone");

  let objects = [];

  if (hasPerson) objects.push("a person");
  if (hasScreen) objects.push("a computer screen");
  if (hasPhone) objects.push("a phone");

  if (objects.length === 0) {
    return "I could not detect any clear objects.";
  }

  // Build natural sentence: "a person and a computer screen"
  let sentence;
  if (objects.length === 1) {
    sentence = objects[0];
  } else if (objects.length === 2) {
    sentence = objects[0] + " and " + objects[1];
  } else {
    sentence =
      objects.slice(0, -1).join(", ") + ", and " + objects[objects.length - 1];
  }

  return "I can see " + sentence + " in front of you.";
}

app.post("/analyze", async (req, res) => {
  const { image, mode } = req.body;

  try {
    // Remove base64 header
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    if (mode === "describe") {
      const params = {
        Image: { Bytes: imageBuffer },
        MaxLabels: 10,
        MinConfidence: 80
      };

      const result = await rekognition.detectLabels(params).promise();

        const labels = result.Labels
        .filter(l => l.Confidence >= 80)
        .map(l => l.Name);

        const text = buildHumanDescription(labels);


      return res.json({ success: true, result: text });
    }

    if (mode === "read") {
      const params = {
        Image: { Bytes: imageBuffer }
      };

      const result = await rekognition.detectText(params).promise();

      const texts = result.TextDetections
        .filter(t => t.Type === "LINE" && t.Confidence > 85)
        .slice(0, 10)
        .map(t => t.DetectedText);


      const text = texts.length > 0
        ? "The text says: " + texts.join(". ")
        : "I could not find any readable text.";

      return res.json({ success: true, result: text });
    }

    res.json({ success: false, result: "Invalid mode" });

  } catch (error) {
    console.error("AWS Error:", error);
    res.status(500).json({ success: false, result: "Error analyzing image." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
