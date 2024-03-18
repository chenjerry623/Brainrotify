import CONSTANTS from "./../globals";

// INPUT: Array of Files, Callback for setting input video on caller
// Performs checks on file validity, then uses the callback function to set input video
const handleDrop = (acceptedFiles: File[],
   setInputVideo: (file: File) => void) => {
    const file: File = acceptedFiles[0];

    // Check file type
    if (!CONSTANTS.ACCEPTED_FILE_TYPES.includes(file.type)) {
      console.error('Unsupported file type:', file.type);
      return;
    }

    // Check file size
    if (file.size > CONSTANTS.FILE_SIZE_LIMIT) {
      console.error('File size exceeds limit:', file.size);
      return;
    }

    setInputVideo(file);
};

export default handleDrop;