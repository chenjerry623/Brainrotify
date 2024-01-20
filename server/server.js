const express = require('express');
const multer = require('multer');
const fluentFFmpeg = require('fluent-ffmpeg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/process-video', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    console.log(req.file);

    const inputVideoBuffer = req.file.buffer;
    const additionalVideoPath = './testingVideo.mp4';

    const outputVideoBuffer = await processVideo(inputVideoBuffer, additionalVideoPath);

    res.send(outputVideoBuffer);
    //res.send("Hello");
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).send(error.message);
  }
});

function processVideo(inputBuffer, additionalVideoPath) {
  return new Promise((resolve, reject) => {
    console.log(inputBuffer);
    fluentFFmpeg()
      .input(inputBuffer)
      .inputFormat('mp4')
      .input(additionalVideoPath)
      .inputFormat('mp4')
      .complexFilter('[0:v][1:v]vstack=inputs=2[v]')
      .on('end', () => {
        console.log('Processing ended');
        resolve();
      })
      .on('error', (err) => {
        console.log('Error occurred:', err);
        reject(err);
      })
      .toFormat('mp4')
      .on('data', (chunk) => {
        console.log('Data chunk received');
        // Save the output buffer chunks
        resolve(chunk);
      })
      .on('end', () => {
        console.log('End of data');
        // Signal the end of the buffer
        resolve(null);
      })
      .run();
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});