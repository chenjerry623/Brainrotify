import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const VideoEditor = () => {
  const [inputVideo, setInputVideo] = useState(null);
  const [outputVideo, setOutputVideo] = useState(null);
  const [videoUrls, setVideoUrls] = useState([])

  const [selectedVideo, setSelectedVideo] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [uploading, setUploading] = useState(false);

  const STORAGE_URL = 'http://localhost:3001/videos/';

  useEffect(() => {
    fetch('http://localhost:3001/list-videos')
      .then(response => response.json()) // return the promise from response.json()
      .then(data => {
        console.log(data);
        setVideoUrls(data);
      })
      .catch(error => console.error('Error fetching video URLs:', error));
  }, []);

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    // Check file type
    const acceptedFileTypes = ['video/mp4', 'video/avi']; // Add more types as needed
    if (!acceptedFileTypes.includes(file.type)) {
      console.error('Unsupported file type:', file.type);
      return;
    }

    // Check file size (limit to 100MB for example)
    const fileSizeLimit = 100 * 1024 * 1024; // 100MB
    if (file.size > fileSizeLimit) {
      console.error('File size exceeds limit:', file.size);
      return;
    }

    setInputVideo(file);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setInputVideo(file);
      setStatusMessage(`File selected: ${file.name}`);
      setErrorMessage('');
    } else {
      setErrorMessage('No file selected.');
    }
  };

  const handleVideoSelection = (event) => {
    setSelectedVideo(STORAGE_URL + event.target.value);
    console.log(STORAGE_URL + event.target.value);
  };

  async function processVideo(inputFile, additionalVideoPath) {
    setUploading(true);
    return new Promise(async (resolve, reject) => {
      if (!inputVideo) {
        setErrorMessage('No file selected for upload.');
        return;
      }

      const formData = new FormData();
      formData.append('video', inputVideo);
      setStatusMessage('Uploading video...');

      try {
        const response = await fetch('http://localhost:3001/process-video', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Server responded with error code: ${response.status}`);
        }

        // Fetch updated list of videos after upload
        setStatusMessage('Video uploaded successfully.');
        setSelectedVideo(STORAGE_URL + videoUrls[0]);
        setUploading(false);
        resolve(); // Resolve the promise
      } catch (error) {
        console.error('Error uploading video:', error);
        setErrorMessage(`Upload failed: ${error.message}`);
        setStatusMessage();
        reject(error); // Reject the promise
      }
    });
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

  function handlePreviousVideo() {
    const index = videoUrls.indexOf(selectedVideo.replace(STORAGE_URL, ''));
    if (index > 0) {
      setSelectedVideo(STORAGE_URL + videoUrls[index - 1]);
    }
  }

  function handleNextVideo() {
    const index = videoUrls.indexOf(selectedVideo.replace(STORAGE_URL, ''));
    if (index < videoUrls.length - 1) {
      setSelectedVideo(STORAGE_URL + videoUrls[index + 1]);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <input type="file" accept="video/*" onChange={handleFileSelect}/>
      <button onClick={processVideo}>Upload Video</button>

      {statusMessage && <div>Status: {statusMessage}</div>}
      {errorMessage && <div style={{ color: 'red' }}>Error: {errorMessage}</div>}

      {uploading && <div>Generating Brainrot...</div>}
      {(selectedVideo && !(uploading)) && (

        <div>
          <button onClick={handlePreviousVideo}>Previous Video</button>
          <video controls width="500" src={selectedVideo}>
            Your browser does not support the video tag.
          </video>
          <button onClick={handleNextVideo}>Next Video</button>
        </div>
      )}
    </div>
  );
};

export default VideoEditor;