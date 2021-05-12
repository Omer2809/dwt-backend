const winston = require('winston');
const express = require('express');
const config = require("config");
const app = express();

require('./startup/logging')();
require("./startup/cors")(app);
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () => winston.info(`Server started on port ${port}...`));

module.exports = server;

// for web
// {
//   "assetsBaseUrl": "http://localhost:3000/assets/",
//   "port": 3000
// }

// for mobile
// {
//   "assetsBaseUrl": "http://192.168.31.228:9000/assets/",
//   "port": 9000
// }

// assetBaseUrl is actually used by the 