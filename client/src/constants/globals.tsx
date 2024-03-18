// ALL CONSTANTS IN ONE FILE FOR NOW, MIGHT WANT TO SPLIT INTO URLs, VALUES, etc LATER

const CONSTANTS = {
    STORAGE_URL: 'http://localhost:3001/videos/',
    ACCEPTED_FILE_TYPES: ['video/mp4', 'video/avi'],
    FILE_SIZE_LIMIT: 5 * 1024 * 1024 * 1024, // 5 GB
};

export default CONSTANTS;