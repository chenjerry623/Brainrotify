import React, { useState } from 'react';

const VideoEditor = () => {
  const [inputVideo, setInputVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleUpload = async () => {
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

      const data = await response.json();
      setVideoUrl(data.videoUrl);
      setStatusMessage('Video uploaded successfully.');
    } catch (error) {
      console.error('Error uploading video:', error);
      setErrorMessage(`Upload failed: ${error.message}`);
      setStatusMessage('');
    }
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileSelect} />
      <button onClick={handleUpload}>Upload Video</button>

      {statusMessage && <div>Status: {statusMessage}</div>}
      {errorMessage && <div style={{ color: 'red' }}>Error: {errorMessage}</div>}

      {videoUrl && (
        <div>
          <p>Uploaded Video:</p>
          <video controls width="500" src={videoUrl}>
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default VideoEditor;
