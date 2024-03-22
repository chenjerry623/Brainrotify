import CONSTANTS from "../globals";

// INPUTS: current array index, array of all video clips, URL of current video, callback to set videos
// If possible, set current video to next video in array

// TODO: see if currIndex logic can be improved
const handleNextVideo = (videoUrls: string[], selectedVideo: string,
    setSelectedVideo: (url: string) => void) => {
        
    let index: number = 0;
    if (videoUrls.indexOf(selectedVideo.replace(CONSTANTS.STORAGE_URL, ''))) {
        index = videoUrls.indexOf(selectedVideo.replace(CONSTANTS.STORAGE_URL, ''));
    }
     
    if (index === 0) {
        const newVideoUrl: string = CONSTANTS.STORAGE_URL + videoUrls[1];
        setSelectedVideo(newVideoUrl);
    } else {
        if (index < videoUrls.length - 1) {
            const newVideoUrl: string = CONSTANTS.STORAGE_URL + videoUrls[index + 1];
            setSelectedVideo(newVideoUrl);

        }
    }

};

export default handleNextVideo;