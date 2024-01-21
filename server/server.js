const express = require('express');
const multer = require('multer');
const fluentFFmpeg = require('fluent-ffmpeg');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const DURATION = 10;


app.post('/process-video', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
    const filePath = path.join(__dirname, 'uploads', 'uploadedVideo.mp4');
    console.log(filePath);
    // Write the buffer to a file
    fs.writeFileSync(filePath, req.file.buffer);

    // TODO: generate one randomly
    const additionalVideoPath = './shortSubway.mp4';

    console.log("starting splice")

    // array of clipped videos
    const shortenedVideoArray = await spliceVideo(filePath, additionalVideoPath);
    console.log("spliced");

    //const outputVideoArray = await processVideo(shortenedVideoBuffer, additionalVideoPath);

    res.send(shortenedVideoArray);
    //res.send("Hello");
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).send(error.message);
  }
});

async function spliceVideo(inputBuffer, additionalVideoPath) {
  // TODO: base it off of the length of the video instead of just 5
  let shortenedVideos = [];

  // splice into 5 sections of length DURATION
  for (let i = 0; i < 5; i++) {
    fluentFFmpeg()
      .input(inputBuffer)
      .setStartTime(i * DURATION)
      .duration(DURATION)
      .complexFilter('scale=640:480')
      .on('start', function (commandLine) {
        console.log("Processing Begun ");
      })
      .on('error', function (err) {
        console.error("Error occurred:", err);
      })
      .on('end', function () {
        console.log("Processing Completed ");
        shortenedVideos[i] = processVideo("./uploads/shortened/newVid" + i + ".mp4", additionalVideoPath, i);
      })
      .saveToFile("./uploads/shortened/newVid" + i + ".mp4");
  }
  return shortenedVideos;

}

// videoArray: [], array of video paths
// additionalVideoPath: string, path of subway surf video to add
//                      change to array later
// returns array of combined video paths
function processVideo(video, additionalVideoPath, index) {
  fluentFFmpeg()
    .input(video)
    .input(additionalVideoPath)
    .complexFilter('vstack=inputs=2')
    .on('start', function (commandLine) {
      console.log("Processing Begun " + "combine");
    })
    .on('error', function (err) {
      console.error("Error occurred:", err);
    })
    .on('end', function () {
      console.log("Processing Completed " + "combine");
      combinedPath = "./uploads/combined/combined" + index + ".mp4";
      return combinedPath;
    })
    .saveToFile("./uploads/combined/combined" + index + ".mp4");
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});