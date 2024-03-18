
import './../style/App.css';
import VideoEditor from './VideoEditor';
import Title from './Title';
import React from 'react';

function App() {
  return (
    <div className='App'>
      <Title/>
      <VideoEditor/>
      <div className='empty'></div>
    </div>
    
  );
}

export default App;
