const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/videos', express.static('videos')); // Serve static files from 'videos' directory

// Configure storage for multer to save files on disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'videos/'); // Save files in 'videos' directory
  },
  filename: (req, file, cb) => {
    // Create a unique filename
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/process-video', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // File is saved in 'videos' directory, create a URL to access it
    const videoUrl = `${req.protocol}://${req.get('host')}/videos/${req.file.filename}`;

    // Send the URL back to the client
    res.json({ videoUrl: videoUrl });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

