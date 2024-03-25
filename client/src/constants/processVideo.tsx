import CONSTANTS from "./globals";

const processVideo = async (inputVideo: File | null, 
    setUploading: (state: boolean) => void,
    setErrorMessage: (message: string) => void,
    setStatusMessage: (message: string) => void,
    setSelectedVideo: (url: string) => void,
    setVideoUrls: (state: string[]) => void,
    ) => {
    setUploading(true);
    if (!inputVideo) {
        setErrorMessage('No file selected for upload.');
        return;
    }

    const formData: FormData = new FormData();
    formData.append('video', inputVideo);
    setStatusMessage('Uploading video...');

    try {
        const response: Response = await fetch('http://localhost:3001/process-video', {
            method: 'POST',
            body: formData,
        });


        if (!response.ok) {
            throw new Error(`Server responded with error code: ${response.status}`);
        }

        // Fetch updated list of videos after upload
        const videoListResponse: Response = await fetch('http://localhost:3001/list-videos');
        const updatedVideoUrls: string[] = await videoListResponse.json();

        setVideoUrls(updatedVideoUrls);
        setStatusMessage('Video uploaded successfully.');

        // Use updatedVideoUrls directly and add cache-busting query parameter
        const newVideoUrl: string = CONSTANTS.STORAGE_URL + updatedVideoUrls[0] + `?timestamp=${Date.now()}`;

        // Set and display initial clip
        setSelectedVideo(newVideoUrl);

        setUploading(false);
    } catch (error: any) {
        console.error('Error uploading video:', error);
        setErrorMessage(`Upload failed: ${error.message}`);
        setStatusMessage('');
        setUploading(false);
    }
};

export default processVideo;