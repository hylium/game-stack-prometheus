'use strict';

process.env.DB_HOSTNAME = process.env.DB_HOSTNAME || 'localhost';
process.env.DB_PORT = process.env.DB_PORT || 27017;
process.env.DB_USERNAME = process.env.DB_USERNAME || '';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || '';
process.env.DB_NAME = process.env.DB_NAME || 'test-gs-prometheus';

exports.connectorConf = {
  hostname: process.env.DB_HOSTNAME,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME
};
