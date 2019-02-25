const Game = require('../models/game');
const mongoose = require('mongoose');

require('dotenv').load();
//Need a query to:
//find all unique values in a subdocument eg. genres, tags, etc...
//THEN sum/average review_count, price, etc for all unique genres
//
//query([uniqueGenres]) => query([uniqueGenres:[gamesInGenre]] => query(uniquegenres: sumOfGamesInGenre)

mongoose.connect(
  process.env.REACT_APP_DB,
  {useNewUrlParser: true},
);

var db = mongoose.connection;

exports.graphPoint = async (x, y) => {
  if (x === 'name') {
    return await graphPointSimple(x, y);
  } else {
    return await graphPointNested(x, y);
  }
};

graphPointSimple = async (x, y) => {
  let data = await Game.find();
  data = data.map(game => ({xAxis: game[x], yAxis: game[y]}));
  console.log(data);
  return data;
};

graphPointNested = async (x, y) => {
  let data = await Game.aggregate([
    {
      $unwind: {
        path: '$genre',
        preserveNullAndEmptyArrays: true,
      },
    },
    {$sort: {'genre.name': -1}},
  ]);
  console.log(data);
  data = data.map(game => ({xAxis: game[x], yAxis: game[y]}));
  return data;
};
exports.graphPoint('genre', 'review_count');
