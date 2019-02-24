const Game = require('../models/game');
//Need a query to:
//find all unique values in a subdocument eg. genres, tags, etc...
//THEN sum/average review_count, price, etc for all unique genres
//
//query([uniqueGenres]) => query([uniqueGenres:[gamesInGenre]] => query(uniquegenres: sumOfGamesInGenre)

exports.format = async (x, y) => {
  let data = await Game.find();
  data = data.map(game => ({xAxis: game[x], yAxis: game[y]}));
  return data;
};
