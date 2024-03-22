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
import VideoPlayer from './VideoPlayer';

interface VideoEditorProps {
  videoUrls: string[],
  setVideoUrls: (urls: string[]) => void,
  selectedVideo: string,
  setSelectedVideo: (url: string) => void,
  uploading: boolean,
  setUploading: (state: boolean) => void
}

const VideoEditor = (props: VideoEditorProps) => {
  const [inputVideo, setInputVideo] = useState<File | null>(null);

  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // TODO: maybe remove
  const [stateChange, setStateChange] = useState<boolean>(false);


  // CALLBACKS TO HELPER FUNCTIONS:

  const handleDropCallback = (files: File[]) => {
    handleDrop(files, setInputVideo);
  }

  const handleFileSelectCallback = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event, setInputVideo, setStatusMessage, setErrorMessage);
  }

  const processVideoCallback = () => {
    processVideo(inputVideo, stateChange, props.setUploading, setStateChange, setErrorMessage, setStatusMessage,
      props.setSelectedVideo, props.setVideoUrls);
  }

  ////////////////////////////////

  useEffect(() => {
    fetch('http://localhost:3001/list-videos')
      .then(response => response.json()) // return the promise from response.json()
      .then(data => {
        console.log(data);
        props.setVideoUrls(data);
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

      {/*TODO: make this a loading bar */}
      {props.uploading && <div className='statusRot'>Generating Brainrot...</div>}


    </div>
  );
};

export default VideoEditor;