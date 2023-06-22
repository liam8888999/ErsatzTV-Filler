const express = require('express');
const app = express();

// Array of valid license keys
const validLicenseKeys = [
  'ABC123',
  'DEF456',
  'GHI789'
  // Add more valid license keys here
];

// Endpoint to retrieve the valid license keys
app.get('/license-keys', (req, res) => {
  res.json({ validLicenseKeys });
});

// Start the server
app.listen(3000, () => {
  console.log('Remote API is running on http://localhost:3000');
});










//   key server    on remote system Code

const express = require('express');
const app = express();

app.use(express.json()); // Enable JSON body parsing

// Array of valid license keys
let validLicenseKeys = [
  'ABC123',
  'DEF456',
  'GHI789'
  // Add more valid license keys here
];

// Endpoint to retrieve the valid license keys
app.get('/license-keys', (req, res) => {
  res.json({ validLicenseKeys });
});

// Endpoint to add a new license key
app.post('/license-keys', (req, res) => {
  const { licenseKey } = req.body;
  if (licenseKey && typeof licenseKey === 'string') {
    validLicenseKeys.push(licenseKey);
    res.status(201).json({ message: 'License key added successfully' });
  } else {
    res.status(400).json({ error: 'Invalid license key' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Remote API is running on http://localhost:3000');
});





curl -X POST -H "Content-Type: application/json" -d '{"licenseKey":"NEWKEY123"}' http://localhost:3000/license-keys
