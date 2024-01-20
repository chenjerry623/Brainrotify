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

// splice
fluentFFmpeg()
  .input("NBA.mp4")
  .setStartTime(20)
  .duration(10)
  .complexFilter('scale=640:480')
  .on('start', function (commandLine) {
    console.log("Processing Begun " + "nba");
  })
  .on('error', function (err) {
    console.error("Error occurred:", err);
  })
  .on('end', function () {
    console.log("Processing Completed " + "nba");
  })
  .saveToFile("newVid2.mp4");



// splice 2
fluentFFmpeg()
  .input("testingVideo.mp4")
  .setStartTime(20)
  .duration(10)
  .complexFilter('scale=640:480')
  .on('start', function (commandLine) {
    console.log("Processing Begun " + "surf");
  })
  .on('error', function (err) {
    console.error("Error occurred:", err);
  })
  .on('end', function () {
    console.log("Processing Completed " + "surf");
  })
  .saveToFile("shortSubway.mp4");

fluentFFmpeg()
  .input("newVid2.mp4")
  .input("shortSubway.mp4")
  .complexFilter('vstack=inputs=2')
  .on('start', function (commandLine) {
    console.log("Processing Begun " + "combine");
  })
  .on('error', function (err) {
    console.error("Error occurred:", err);
  })
  .on('end', function () {
    console.log("Processing Completed " + "combine");
  })
  .saveToFile("combined.mp4");


// combine
/*console.log("STARTING COMBINE");
fluentFFmpeg()
  .input("newVid.mp4")
  .input("shortSubway.mp4")
  .complexFilter([
    {
      filter: 'scale',
      options: { w: '640', h: '480' },
      inputs: '0:v',
      outputs: 'scaled0'
    },
    {
      filter: 'scale',
      options: { w: '640', h: '480' },
      inputs: '1:v',
      outputs: 'scaled1'
    },
    {
      filter: 'vstack',
      options: { inputs: 2 },
      inputs: ['scaled0', 'scaled1'],
      outputs: 'v'
    }
  ])
  .on('start', function (commandLine) {
    console.log("Processing Begun " + "combine");
  })
  .on('error', function (err) {
    console.error("Error occurred:", err);
  })
  .on('end', function () {
    console.log("Processing Completed " + "combine");
  })
  .saveToFile("combinedVid.mp4");
*/

function processVideo(inputBuffer, additionalVideoPath) {
  return new Promise((resolve, reject) => {
    console.log(inputBuffer);
    fluentFFmpeg()
      .input(inputBuffer)
      .input(additionalVideoPath)
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