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
