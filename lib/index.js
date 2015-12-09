const log = require('./utils/log').child({
  file: 'lib/index (main app)'
});
const express = require('express');
const app = express();


const upload = require('./upload');

app.post('/upload', upload);

const server = app.listen(8080, () => {
  log.info(`Listening on port ${server.address().port}.`);
});

module.exports = server;
