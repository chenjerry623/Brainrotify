
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

app.use('/videos', express.static(path.join(__dirname, 'uploads', 'combined')));



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

    //const subwayIndex = Math.floor(Math.random() * 10 + 1);
    //const additionalVideoPath = './shortSubway' + subwayIndex + '.mp4';
    const additionalVideoPath = './gameplay/shortSubway';

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

app.get('/list-videos', (req, res) => {
  const directoryPath = path.join(__dirname, 'uploads', 'combined');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send('Unable to scan directory: ' + err);
    }

    // Filter out non-MP4 files
    const videoFiles = files.filter(file => path.extname(file) === '.mp4');

    // Send the list of video file names
    res.send(videoFiles);
  });
});


async function spliceVideo(inputBuffer, additionalVideoPath) {
  let combinedVideos = [];

  const promises = Array.from({ length: 5 }, (_, i) => {
    return new Promise((resolve, reject) => {
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
          reject(err);
        })
        .on('end', async function () {
          console.log("Processing Completed ");
          const processedVideo = await processVideo("./uploads/shortened/newVid" + i + ".mp4", additionalVideoPath, i);
          combinedVideos[i] = processedVideo;
          resolve();
        })
        .saveToFile("./uploads/shortened/newVid" + i + ".mp4");
    });
  });
console.log("1")
  await Promise.all(promises);
  console.log("2")
  return combinedVideos;
}

// videoArray: [], array of video paths
// additionalVideoPath: string, path of subway surf video to add
//                      change to array later
// returns array of combined video paths
function processVideo(video, additionalVideoPath, index) {
  return new Promise((resolve, reject) => {
    const subwayIndex = Math.floor(Math.random() * 10 + 1);
    fluentFFmpeg()
      .input(video)
      .input(additionalVideoPath + subwayIndex + '.mp4')
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
        resolve(combinedPath);
      })
      .saveToFile("./uploads/combined/combined" + index + ".mp4");
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});