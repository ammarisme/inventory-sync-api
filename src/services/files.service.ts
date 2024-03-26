const fs = require('fs');

function convertToCSV(object_rows: any[]) {
    try {
        fs.unlinkSync(`./transfer_sheet.csv`);
    } catch (error) {
    }
    // Get the header row from object keys
    const headers = Object.keys(object_rows[0]);

    // Function to escape special characters for CSV
    const escapeForCSV = (value) => {
        // Replace double quotes with escaped double quotes
        return value;//.toString().replace(/"/g, '""');
    }

    // Create the CSV content
    let csvContent = "";

    // Add header row
    csvContent += headers.map(escapeForCSV).join(",") + "\n";

    // Add data rows
    object_rows.forEach(item => {
        // Use Object.values to extract values from the object
        csvContent += Object.values(item).map(escapeForCSV).join(",") + "\n";
      });
    // Write the CSV content to a file
    fs.writeFile('transfer_sheet.csv', csvContent, (err) => {
        if (err) {
            console.error("Error writing CSV file:", err);
        } else {
            console.log("CSV file created successfully!");
        }
    });
    return;
}

export = {
    convertToCSV
}