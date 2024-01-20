import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const VideoEditor = () => {
  const [inputVideo, setInputVideo] = useState(null);
  const [outputVideo, setOutputVideo] = useState(null);

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

  const processVideo = async () => {
    try {
      const formData = new FormData();
      formData.append('video', inputVideo);

      const response = await fetch('http://localhost:3001/process-video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Video processing failed');
      }

      const processedVideoBlob = await response.blob();
      setOutputVideo(URL.createObjectURL(processedVideoBlob));
    } catch (error) {
      console.error('Error processing video:', error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag and drop a video file here, or click to select one</p>
      </div>
      {inputVideo && (
        <div>
          <p>Input Video: {inputVideo.name}</p>
          <button onClick={processVideo}>Process Video</button>
        </div>
      )}
      {outputVideo && (
        <div>
          <p>Output Video:</p>
          <video controls width="400" src={outputVideo} />
        </div>
      )}
    </div>
  );
};

export default VideoEditor;