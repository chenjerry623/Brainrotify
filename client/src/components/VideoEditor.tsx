import React, { useState, useEffect, useRef, ChangeEvent } from 'react';



//import left from './../images/left.png';

import left from './../images/left.png'
import right from './../images/right.png';
import upload from './../images/upload.png';

import CONSTANTS from './../constants/globals'

import handleDrop from '../constants/file-selection/handleDrop';
import handleFileSelect from '../constants/file-selection/handleFileSelect';
import handlePreviousVideo from '../constants/video-navigation/handlePreviousVideo';
import handleNextVideo from '../constants/video-navigation/handleNextVideo';
import processVideo from '../constants/processVideo';

const VideoEditor = () => {
  const [inputVideo, setInputVideo] = useState<File | null>(null);
  const [videoUrls, setVideoUrls] = useState<string[]>([])

  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [currIndex, setCurrIndex] = useState<number>(0);

  const [stateChange, setStateChange] = useState<boolean>(false);

  const [uploading, setUploading] = useState<boolean>(false);


  // CALLBACKS TO HELPER FUNCTIONS:
  const handleDropCallback = (files: File[]) => {
    handleDrop(files, setInputVideo);
  }

  const handleFileSelectCallback = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event, setInputVideo, setStatusMessage, setErrorMessage);
  }

  const handlePreviousVideoCallback = () => {
    handlePreviousVideo(videoUrls, selectedVideo, setSelectedVideo);
  }

  const processVideoCallback = () => {
    processVideo(inputVideo, stateChange, setUploading, setStateChange, setErrorMessage, setStatusMessage,
      setSelectedVideo, setVideoUrls, setCurrIndex);
  }

  const handleNextVideoCallback = () => {
    handleNextVideo(currIndex, videoUrls, selectedVideo, setSelectedVideo, setCurrIndex);
  }
  ////////////////////////////////

  useEffect(() => {
    fetch('http://localhost:3001/list-videos')
      .then(response => response.json()) // return the promise from response.json()
      .then(data => {
        console.log(data);
        setVideoUrls(data);
      })
      .catch(error => console.error('Error fetching video URLs:', error));
  }, []);



  return (
    <div className='application'>

      <div className='fileStuff'>
        <input type="file" accept="video/*" onChange={handleFileSelectCallback} id='file' className='custom-file-upload' />
      </div>

      <div className='uploadDiv'>
        <button onClick={processVideoCallback} className='uploadButton'>
          <img className='upload' src={upload} alt='Upload' />
        </button>
      </div>


      {statusMessage && <div className='status'>Status: {statusMessage}</div>}
      {errorMessage && <div style={{ color: 'red' }}>Error: {errorMessage}</div>}

      {uploading && <div className='statusRot'>Generating Brainrot...</div>}
      {(selectedVideo && !(uploading)) && (


        <div className='display'>
          <button onClick={handlePreviousVideoCallback} className='leftButton'>
            <img className='left' src={left} alt='Next Video' />
          </button>


          <video controls width="500" src={selectedVideo}>
            Your browser does not support the video tag.
          </video>

          <div className='rightDiv'>
            <button onClick={handleNextVideoCallback} className='rightButton'>
              <img className='right' src={right} alt='Next Video' />
            </button>
          </div>
        </div>

      )}


    </div>
  );
};

export default VideoEditor;