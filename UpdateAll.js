const scraper = require('./scraper_util');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const Game = require('./models/game');
require('dotenv').load();

function connectToDB() {
  const mongoDB = process.env.REACT_APP_DB;
  mongoose.connect(
    mongoDB,
    { useNewUrlParser: true },
  );
  mongoose.Promise = global.Promise;
  const db = mongoose.connection;

  // Bind connection to error event (to get notification of connection errors)
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}

connectToDB();
Game.find({}, 'steam_id', (err, docs) => {
  const result = docs.map(i => i.steam_id);
  scraper.updateIds(result);
});
