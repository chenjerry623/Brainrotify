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
    // Access the uploaded video in req.file.buffer
    const inputVideoBuffer = req.file.buffer;

    // Additional video path
    const additionalVideoPath = './testingVideo.mp4';

    // Process the video using fluent-ffmpeg
    const outputVideoBuffer = await processVideo(inputVideoBuffer, additionalVideoPath);

    // Send the processed video back to the client
    res.send(outputVideoBuffer);
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).send('Internal Server Error');
  }
});

fluentFFmpeg({ source: 'NBA.mp4' })
  .setStartTime(10)
  .duration(10)
  .on('start', function(commandLine) {
    console.log("Processing Begun");
  })
  .on('error', function(err) {
    console.error("Error occurred:", err);
  })  
  .on('end', function() {
    console.log("Processing Completed");
  })
  .saveToFile("newVid.mp4");


  function processVideo(inputBuffer, additionalVideoPath) {
    return new Promise((resolve, reject) => {
      fluentFFmpeg()
        .input(inputBuffer)
        .inputFormat('mp4')
        .input(additionalVideoPath)
        .inputFormat('mp4')
        .complexFilter('[0:v][1:v]vstack=inputs=2[v]')
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .toFormat('mp4')
        .outputOptions('-c:v libx264')  // Optional: Specify video codec
        .on('data', (chunk) => {
          // Save the output buffer chunks
          resolve(chunk);
        })
        .on('end', () => {
          // Signal the end of the buffer
          resolve(null);
        })
        .run();  
    });
  }
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});