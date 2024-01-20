import React, { useState, useEffect } from 'react';

const VideoEditor = () => {
  const [inputVideo, setInputVideo] = useState(null);
  const [videoUrls, setVideoUrls] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/list-videos')
      .then(response => response.json())
      .then(data => setVideoUrls(data.videoUrls))
      .catch(error => console.error('Error fetching video URLs:', error));
  }, []);

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

      // Fetch updated list of videos after upload
      const data = await response.json();
      setVideoUrls(prev => [...prev, data.videoUrl]);
      setStatusMessage('Video uploaded successfully.');
    } catch (error) {
      console.error('Error uploading video:', error);
      setErrorMessage(`Upload failed: ${error.message}`);
      setStatusMessage('');
    }
  };

  const handleVideoSelection = (event) => {
    setSelectedVideo(event.target.value);
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileSelect} />
      <button onClick={handleUpload}>Upload Video</button>

      {statusMessage && <div>Status: {statusMessage}</div>}
      {errorMessage && <div style={{ color: 'red' }}>Error: {errorMessage}</div>}

      <h2>Select a Video</h2>
      <select onChange={handleVideoSelection} value={selectedVideo}>
        <option value="">Select a video</option>
        {videoUrls.map((url, index) => (
          <option key={index} value={url}>
            Video {index + 1}
          </option>
        ))}
      </select>

      {selectedVideo && (
        <div>
          <p>Selected Video:</p>
          <video controls width="500" src={selectedVideo}>
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};


export default VideoEditor;
