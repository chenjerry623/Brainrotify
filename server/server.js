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

app.post('/process-video', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const inputFile = path.join(__dirname, 'uploads', req.file.filename);
    const outputFile = path.join(__dirname, 'videos', `processed-${req.file.filename}`);

    processVideo(inputFile, outputFile)
      .then(() => {
        const videoUrl = `${req.protocol}://${req.get('host')}/videos/processed-${req.file.filename}`;
        res.json({ videoUrl: videoUrl });
      })
      .catch(error => {
        console.error("Error occurred:", error);
        res.status(500).send('Error processing video');
      });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).send('Internal Server Error');
  }
});

function processVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    fluentFFmpeg(inputPath)
      .setStartTime(10) // Example processing parameters
      .duration(10)
      .on('start', function() {
        console.log("Processing Begun");
      })
      .on('error', function(err) {
        console.error("Error occurred:", err);
        reject(err);
      })
      .on('end', function() {
        console.log("Processing Completed");
        resolve();
      })
      .saveToFile(outputPath);
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
