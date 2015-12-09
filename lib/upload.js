const log = require('./utils/log').child({
  file: 'lib/upload'
});
const db = require('./db').db;

// var db;

const formidable = require('formidable');

const sendError = (res) => {
  log.error(err);
  res.send({
    status: 500
  });
};

const insertRecord = (collection, record, res) => {
  collection.insert(record => {
    db.saveDatabase({}, (err) => {
      if (err) {
        sendError(res);
        return false;
      }
      log.info({
        data: record
      }, `Saved 'file' info`);
      res.send({
        status: 200,
        url: `${url}retrieve/${files.files.path.substring(15)}`,
      });
    });
  });
};

const saveMetaData = (err, fields, files, res) => {
  'use strict';
  db.loadDatabase({}, err => {
    if (err) {
      sendError(res);
    }
    let collection = db.getCollection('files', (err) => {
      if (err) {
        sendError(res);
        return false;
      }
      if (!files) {
        collection = db.addCollection('files', (err) => {
          if (err) {
            sendError(res);
            return false;
          }
          let record = files.file;

          insertRecord(collection, record, res);
        });
      }

    });

  });
};

const upload = (req, res) => {
  'use strict';
  let form = new formidable.IncomingForm();
  form.uploadDir = require('path').dirname(require.main.filename) + '/storage';
  form.parse(req, (err, fields, files) => {
    saveMetaData(err, fields, files, res);
  });
};

module.exports = upload;
