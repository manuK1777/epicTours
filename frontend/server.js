const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(__dirname + '/dist/frontend-epictours'));

// Send all requests to index.html
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/frontend-epictours/index.html'));
});

// Start the app by listening on the default Railway port
const port = process.env.PORT || 4200;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
