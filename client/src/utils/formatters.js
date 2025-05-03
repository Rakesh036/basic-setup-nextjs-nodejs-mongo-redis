// utils/formatters.js

/**
 * Formats a date string to a localized date string
 * @param {string} dateString - ISO date string
 * @param {boolean} includeTime - Whether to include time
 * @returns {string} Formatted date string
 */
export function formatDate(dateString, includeTime = false) {
    if (!dateString) return '';

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return '';
    }

    if (includeTime) {
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return date.toLocaleDateString();
}

/**
 * Formats file size in bytes to a human-readable string
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Truncates text to specified length and adds ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

/**
 * Calculates time ago from date
 * @param {string} dateString - ISO date string
 * @returns {string} Human-readable time ago
 */
export function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);

    // Less than a minute
    if (seconds < 60) {
        return 'just now';
    }

    // Less than an hour
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }

    // Less than a day
    const hours = Math.round(minutes / 60);
    if (hours < 24) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }

    // Less than a week
    const days = Math.round(hours / 24);
    if (days < 7) {
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }

    // Less than a month
    if (days < 30) {
        const weeks = Math.round(days / 7);
        return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    }

    // Less than a year
    if (days < 365) {
        const months = Math.round(days / 30);
        return `${months} month${months !== 1 ? 's' : ''} ago`;
    }

    // More than a year
    const years = Math.round(days / 365);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
}

/**
 * Gets file type icon based on file extension
 * @param {string} fileName - Name of the file
 * @returns {string} Icon name for react-icons
 */
export function getFileTypeIcon(fileName) {
    if (!fileName) return 'FaFile';

    const extension = fileName.split('.').pop().toLowerCase();

    // Image files
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
        return 'FaImage';
    }

    // Document files
    if (['doc', 'docx'].includes(extension)) {
        return 'FaFileWord';
    }
    if (['xls', 'xlsx', 'csv'].includes(extension)) {
        return 'FaFileExcel';
    }
    if (['ppt', 'pptx'].includes(extension)) {
        return 'FaFilePowerpoint';
    }
    if (extension === 'pdf') {
        return 'FaFilePdf';
    }
    if (['txt', 'md'].includes(extension)) {
        return 'FaFileAlt';
    }

    // Code files
    if (['html', 'css', 'js', 'jsx', 'ts', 'tsx', 'json', 'xml'].includes(extension)) {
        return 'FaFileCode';
    }

    // Archive files
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
        return 'FaFileArchive';
    }

    // Audio files
    if (['mp3', 'wav', 'ogg', 'flac'].includes(extension)) {
        return 'FaFileAudio';
    }

    // Video files
    if (['mp4', 'mov', 'avi', 'webm', 'flv'].includes(extension)) {
        return 'FaFileVideo';
    }

    // Default
    return 'FaFile';
}

/**
 * Formats member count for display
 * @param {number} count - Number of members
 * @returns {string} Formatted count
 */
export function formatMemberCount(count) {
    if (!count && count !== 0) return '';

    if (count === 0) return 'No members';
    if (count === 1) return '1 member';

    return `${count} members`;
}

/**
 * Creates an avatar placeholder from a name
 * @param {string} name - User name
 * @returns {string} Initials for avatar
 */
export function getInitials(name) {
    if (!name) return '';

    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Formats a quiz score for display
 * @param {number} score - Score (0-1)
 * @returns {string} Formatted score
 */
export function formatQuizScore(score) {
    if (score === undefined || score === null) return 'Not taken';

    const percentage = Math.round(score * 100);
    return `${percentage}%`;
}



/**
 * Format bytes to human readable size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size with unit
 */
export const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format seconds to days, hours, minutes
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatUptime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
};

/**
 * Calculate status health percentage
 * @param {Object} results - Status results object
 * @returns {number} Percentage of healthy services
 */
export const calculateHealthPercentage = (results) => {
    if (!results) return 0;

    const services = Object.values(results);
    const healthyServices = services.filter((service) => service.status === 'OK');

    return Math.round((healthyServices.length / services.length) * 100);
};

/**
 * Get appropriate color class based on percentage
 * @param {number} percentage - Value between 0-100
 * @returns {string} Tailwind color class
 */
export const getHealthColorClass = (percentage) => {
    if (percentage >= 90) return 'text-green-500';
    if (percentage >= 75) return 'text-yellow-500';
    return 'text-red-500';
};
