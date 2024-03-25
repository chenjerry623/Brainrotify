import handlePreviousVideo from '../constants/video-navigation/handlePreviousVideo';
import handleNextVideo from '../constants/video-navigation/handleNextVideo';
import React from 'react';

import left from './../images/left.png'
import right from './../images/right.png';

interface VideoPlayerProps {
    videoUrls: string[],
    selectedVideo: string,
    setSelectedVideo: (url: string) => void,
    uploading: boolean,
}

const VideoPlayer = (props: VideoPlayerProps) => {

    const handlePreviousVideoCallback = () => {
        handlePreviousVideo(props.videoUrls, props.selectedVideo, props.setSelectedVideo);
    }

    const handleNextVideoCallback = () => {
        handleNextVideo(props.videoUrls,
            props.selectedVideo, props.setSelectedVideo);
    }

    return (
        <div>
        {(props.selectedVideo && !(props.uploading)) && (
            <div className='display'>
                <button onClick={handlePreviousVideoCallback} className='leftButton'>
                    <img className='left' src={left} alt='Next Video' />
                </button>


                <video controls width="500" src={props.selectedVideo} loop autoPlay>
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

    )
    
}

export default VideoPlayer;