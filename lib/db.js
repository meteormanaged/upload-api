const log = require('./utils/log').child({
  file: 'lib/db'
});
const loki = require('lokijs');
const db_location = require('path').dirname(require.main.filename) + '/db.json';
const db = new loki(db_location, {
  autosave: true,
  autoload: true,
});

const defaults = {
  url: 'http://localhost/',
};

var isInitialized = false;

const initializeDefault = cb => {
  'use strict';
  let config = db.addCollection('config');
  config.insert(defaults);
  db.saveDatabase({}, () => {
    log.info({
      data: config.data
    }, `Stored default config`);
    cb(db.getCollection('config'));;
  });
};

const checkConfig = (configDb, cb) => {
  'use strict';
  if (configDb) {
    cb(configDb.data[0].url);
  } else {
    initializeDefault(config => {
      cb(config.data[0].url);
    });
  }
};

const loadConfig = cb => {
  'use strict';
  db.loadDatabase({}, (err) => {
    if (err) {
      log.error(err);
      return false;
    }
    let configDb = db.getCollection('config');
    checkConfig(configDb, res => {
      if (res) {
        cb(res);
      }
    });
  });
};

const _init = cb => {
  'use strict';
  if (!isInitialized) {
    log.info('Initializing.');
    loadConfig(res => {
      log.info({
        data: res
      }, `Loaded config data`);
      isInitialized = true;
      cb(db);
    });
  } else {
    log.info('DB initialized so do stuff.');
    cb(db);
  }
};

module.exports = {
  _init,
  db
};
