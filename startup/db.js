const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
  const db = process.env.DB || config.get('db');
  mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify:false
  })
    .then(() => winston.info(`Connected to ${db}...`));
}

// "db": "mongodb://localhost/gymnode",   put it in defaut.json
//    => DB=mongodb+srv://gymuser:12345gymuser@clustergym.yfd2c.mongodb.net/gym?retryWrites=true&w=majority  in .env