/* global console */
const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, '/dist/frontend-epictours')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Send all requests to index.html
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist/frontend-epictours/index.html'));
});

// Error handling
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the app by listening on the default Railway port
const port = process.env.PORT || 4200;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
  console.log(`Serving static files from: ${path.join(__dirname, '/dist/frontend-epictours')}`);
});
