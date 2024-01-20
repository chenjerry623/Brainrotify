const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const fluentFFmpeg = require('fluent-ffmpeg');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/videos', express.static('videos'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Temporary folder for uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

function processVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    console.log("Process Video: Starting with input file", inputPath);

    fluentFFmpeg(inputPath)
      .setStartTime(10)  // Example start time
      .duration(10)      // Example duration
      .on('start', function(commandLine) {
        console.log("ffmpeg process started:", commandLine);
      })
      .on('error', function(err) {
        console.error("ffmpeg process error:", err);
        reject({ code: 1001, error: err });
      })
      .on('end', function() {
        console.log("ffmpeg process completed");
        resolve(outputPath);
      })
      .saveToFile(outputPath);
  });
}


app.post('/process-video', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).send({ code: 1000, message: 'No file uploaded' });
    }

    const inputFile = path.join(__dirname, 'uploads', req.file.filename);
    const outputFile = path.join(__dirname, 'videos', `processed-${req.file.filename}`);
    console.log("Starting video processing for:", inputFile);

    processVideo(inputFile, outputFile)
      .then((processedFilePath) => {
        console.log("Video processing successful for:", processedFilePath);
        const videoUrl = `${req.protocol}://${req.get('host')}/videos/${path.basename(processedFilePath)}`;
        res.json({ videoUrl: videoUrl });
      })
      .catch(error => {
        console.error("Video processing failed:", error);
        res.status(500).send({ code: error.code, message: 'Error processing video', error: error.error });
      });
  } catch (error) {
    console.error('Unexpected error during video processing:', error);
    res.status(500).send({ code: 1002, message: 'Internal Server Error', error: error });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
