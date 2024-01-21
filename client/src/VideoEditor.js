import React, { useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import left from './images/left.png';
import right from './images/right.png';
import upload from './images/upload.png';

const VideoEditor = () => {
  const [inputVideo, setInputVideo] = useState(null);
  const [outputVideo, setOutputVideo] = useState(null);
  const [videoUrls, setVideoUrls] = useState([])

  const [selectedVideo, setSelectedVideo] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [currIndex, setCurrIndex] = useState(0);

  const [stateChange, setStateChange] = useState(false);

  const [uploading, setUploading] = useState(false);

  const STORAGE_URL = 'http://localhost:3001/videos/';

  const videoRef = useRef(null);

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


  async function processVideo(inputFile, additionalVideoPath) {
    setUploading(true);
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

      setStateChange(!stateChange);

      if (!response.ok) {
        throw new Error(`Server responded with error code: ${response.status}`);
      }

      // Fetch updated list of videos after upload
      const videoListResponse = await fetch('http://localhost:3001/list-videos');
      const updatedVideoUrls = await videoListResponse.json();

      setVideoUrls(updatedVideoUrls);
      setStatusMessage('Video uploaded successfully.');

      // Use updatedVideoUrls directly and add cache-busting query parameter
      const newVideoUrl = STORAGE_URL + updatedVideoUrls[0] + `?timestamp=${Date.now()}`;
      setCurrIndex(0);
      setSelectedVideo(newVideoUrl);


      setUploading(false);
    } catch (error) {
      console.error('Error uploading video:', error);
      setErrorMessage(`Upload failed: ${error.message}`);
      setStatusMessage();
      setUploading(false);
    }
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

  function handlePreviousVideo() {
    const index = videoUrls.indexOf(selectedVideo.replace(STORAGE_URL, ''));
    if (index > 0) {
      const newVideoUrl = STORAGE_URL + videoUrls[index - 1];
      setSelectedVideo(newVideoUrl);
      
    }
  }


  function handleNextVideo() {
    if (currIndex == 0) {
      const newVideoUrl = STORAGE_URL + videoUrls[1];
      setSelectedVideo(newVideoUrl);
      setCurrIndex(1);
    }  else {
      const index = videoUrls.indexOf(selectedVideo.replace(STORAGE_URL, ''));
      if (index < videoUrls.length - 1) {
        const newVideoUrl = STORAGE_URL + videoUrls[index + 1];
        setSelectedVideo(newVideoUrl);
        
      }
    }
    
  }

  return (
    <div className='application'>
      <head>
        <title>My first website</title>
      </head>
      
      <h1 className='title'>Brainrotify</h1>

      <div className='fileStuff'>
        <input type="file" accept="video/*" onChange={handleFileSelect} id='file' class='custom-file-upload'/>
      </div>
      
      <div className='uploadDiv'>
        <button onClick={processVideo} className='uploadButton'>
          <img className='upload' src={upload} alt='Upload'/>
        </button>
      </div>
      

      {statusMessage && <div className='status'>Status: {statusMessage}</div>}
      {errorMessage && <div style={{ color: 'red' }}>Error: {errorMessage}</div>}

      {uploading && <div className='statusRot'>Generating Brainrot...</div>}
      {(selectedVideo && !(uploading)) && (


        <div className='display'>
          <button onClick={handlePreviousVideo} className='leftButton'>
            <img className='left' src={left} alt='Next Video'/>
          </button>


          <video controls width="500" src={selectedVideo}>

            Your browser does not support the video tag.
          </video>

          <div className='rightDiv'>
            <button onClick={handleNextVideo} className='rightButton'>
              <img className='right' src={right} alt='Next Video'/>
            </button>
          </div>
        </div>

      )}


    </div>
  );
};

export default VideoEditor;