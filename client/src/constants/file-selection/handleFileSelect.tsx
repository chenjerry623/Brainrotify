import { ChangeEvent } from "react";

// INPUT: User Event, callbacks for setting video, status message and error message
// Checks if any files are selected, uploads files and sets text on user screen accordingly
const handleFileSelect = (event: ChangeEvent<HTMLInputElement>,
    setInputVideo: (file: File) => void,
    setStatusMessage: (message: string) => void,
    setErrorMessage: (message: string) => void,) => {

    if (event.target.files) {
        const file: File = event.target.files[0];
        setInputVideo(file);
        setStatusMessage(`File selected: ${file.name}`);
        setErrorMessage('');
    } else {
        setErrorMessage('No file selected.');
    }
};

export default handleFileSelect;