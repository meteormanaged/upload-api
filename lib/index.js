const log = require('./utils/log').child({
  file: 'lib/index (main app)'
});
const upload = require('./upload');
const db = require('./db');
const express = require('express');
const app = express();

app.post('/upload', upload);

const server = app.listen(8080, () => {
  db();
  log.info(`Listening on port ${server.address().port}.`);
});

module.exports = server;
