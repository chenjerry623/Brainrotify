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
  let combinedVideos = [];

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
        combinedVideos[i] = processVideo("./uploads/shortened/newVid" + i + ".mp4", additionalVideoPath, i);
      })
      .saveToFile("./uploads/shortened/newVid" + i + ".mp4");
  }
  return combinedVideos;

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
