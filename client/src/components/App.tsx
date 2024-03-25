
import './../style/App.css';
import VideoEditor from './VideoEditor';
import Title from './Title';
import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';

function App() {

  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  return (
    <div className='App'>
      <Title />
      <VideoEditor
        videoUrls={videoUrls}
        setVideoUrls={setVideoUrls}
        selectedVideo={selectedVideo}
        setSelectedVideo={setSelectedVideo}
        uploading={uploading}
        setUploading={setUploading}
      />
      <VideoPlayer
        videoUrls={videoUrls}
        selectedVideo={selectedVideo}
        setSelectedVideo={setSelectedVideo}
        uploading={uploading}
      />
      <div className='empty'></div>
    </div>

  );
}

export default App;
