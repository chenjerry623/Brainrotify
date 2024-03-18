import CONSTANTS from "../globals";

// INPUTS: array of all video clips, URL of current video, callback to set videos
// If possible, set current video to previous video in array

const handlePreviousVideo = (videoUrls : string[], selectedVideo: string,
    setSelectedVideo: (url: string) => void) => {
    const index: number = videoUrls.indexOf(selectedVideo.replace(CONSTANTS.STORAGE_URL, ''));
    if (index > 0) {
        const newVideoUrl: string = CONSTANTS.STORAGE_URL + videoUrls[index - 1];
        setSelectedVideo(newVideoUrl);
    }
};

export default handlePreviousVideo;