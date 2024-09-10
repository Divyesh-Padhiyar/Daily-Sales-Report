// server.js

const express = require('express');
const cors = require('cors');
const xlsx = require('xlsx');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let entries = [];

// Endpoint to add entry
app.post('/add-entry', (req, res) => {
    const entry = req.body;
    entries.push(entry);
    res.status(200).json({ message: 'Entry added successfully!' });
});

// Endpoint to get all data
app.get('/data', (req, res) => {
    res.status(200).json(entries);
});

// Endpoint to export data to Excel
app.get('/export-to-excel', (req, res) => {
    // Create a new workbook and add the entries data
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(entries);
    xlsx.utils.book_append_sheet(wb, ws, 'Entries');

    // Write workbook to a file
    const filePath = 'Entries.xlsx';
    xlsx.writeFile(wb, filePath);

    // Read the file and send it as a response
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading the file:', err);
        }
        // Delete the file after sending it
        fs.unlinkSync(filePath);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
