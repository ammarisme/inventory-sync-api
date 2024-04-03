
function log(message) {
    console.log("log:" + message)
}
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms * 1000));
}
function generateRandomNumberString(length = 5) {
    // Create an array of digits (0-9)
    const digits = '0123456789';

    // Use a loop to build the random string
    let result = '';
    for (let i = 0; i < length; i++) {
        result += digits[Math.floor(Math.random() * digits.length)];
    }

    return result;
}
function convertToIndiaTime(utcTimeString) {
    // Parse the UTC time string
    const utcTime = new Date(utcTimeString);
  
    // Create a timezone object for UTC+5:30 (India Standard Time)
    const indiaTimeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
  
    // Convert the UTC time to India time
    const indiaTime = new Date(utcTime.toLocaleString('en-US', { timeZone: indiaTimeZone }));
  
    // Format the India time in a human-readable format
    const formattedTime = indiaTime.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Use 24-hour format
    });
  
    return formattedTime;
  }
  
export = { log: log, sleep: sleep, generateRandomNumberString:generateRandomNumberString,convertToIndiaTime};