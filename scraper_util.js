const rp = require('request-promise');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const async = require('async');
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

async function getIds(steamUri) {
  const options = {
    uri: steamUri,
    method: 'GET',
    followRedirects: true,
    muteHttpExceptions: true,
    headers: {
      Cookie: 'birthtime=28801; path=/; domain=store.steampowered.com',
    },
  };
  const response = await rp(options);
  const regex = /\/(\d{3,6})\/(?![\s\S]*\/\1\/)/g; // Checkes for unique strings of numbers 3 to 6 digits long
  const ids = response.match(regex);
  return ids;
}

async function getFollowers(appid) {
  const uri = `https://steamcommunity.com/games/${appid}`;
  const options = {
    uri,
    method: 'GET',
    followRedirects: true,
    muteHttpExceptions: true,
    appid,
    headers: {
      Cookie: 'birthtime=28801; path=/; domain=steamcommunity.com',
    },
  };
  const response = await rp(options);
  const regex = />([\d,]+) Members</i;
  const followers = parseInt(response.match(regex)[1].replace(/,/g, ''), 10);
  return followers;
}

async function getGame(appid) {
  const uri = 'http://store.steampowered.com/api/appdetails?cc=us&appids='.concat(
    appid,
  );

  const options = {
    uri,
    method: 'GET',
    followRedirects: true,
    muteHttpExceptions: true,
    appid,
    headers: {
      Cookie: 'birthtime=28801; path=/; domain=store.steampowered.com',
    },
  };

  const response = await rp(options);
  const { data } = JSON.parse(response)[appid];

  if (data == null) {
    console.log(`AppId: ${appid} Something went wrong.`);
    return null;
  }

  if (data.type !== 'game') {
    console.log(`AppId: ${appid}  Not a game.`);
    return null;
  }

  const steamAppId = appid;
  const { name } = data;
  const comingSoon = data.release_date.coming_soon;
  const releaseDate = data.release_date.coming_soon ? null : data.release_date.date;

  const genre = data.genres.map(x => x.description);

  const tag = data.categories.map(x => x.description);

  const reviewCount = data.recommendations ? data.recommendations.total : 0;
  const isFree = data.is_free;
  const fullPrice = data.is_free || comingSoon ? 0 : data.price_overview.initial;

  const developer = data.developers;
  const publisher = data.publishers;

  const genres = [];
  genre.forEach(elem => genres.push({ name: elem }));

  const tags = [];
  tag.forEach(elem => tags.push({ name: elem }));
  const developers = [];
  developer.forEach(elem => developers.push({ name: elem }));
  const publishers = [];
  publisher.forEach(elem => publishers.push({ name: elem }));

  const followers = await getFollowers(appid);

  return {
    steam_id: steamAppId,
    name,
    coming_soon: comingSoon,
    release_date: releaseDate,
    review_count: reviewCount,
    followers,
    is_free: isFree,
    full_price: fullPrice,
    genre: genres,
    tag: tags,
    developer: developers,
    publisher: publishers,
  };
}

function CreateGameEntry(gameDetails) {
  if (gameDetails === null) {
    return;
  }
  Game.updateOne({ steam_id: gameDetails.steam_id }, gameDetails, { upsert: true }, (err, raw) => {
    if (err) {
      console.log(err.message);
      return;
    }
    if (raw.nModified > 0) {
      console.log(`Updated Game: ${gameDetails.steam_id}`);
      return;
    }
    console.log(`New Game: ${gameDetails.steam_id}`);
  });
}

async function loop(idsArr) {
  const ids = idsArr;
  for (let i = 0; i < ids.length; i += 1) {
    const regex = /(\d+)/;
    [ids[i]] = ids[i].match(regex);
    await new Promise(resolve => setTimeout(resolve, 1000));
    getGame(ids[i])
      .then(gameDetails => CreateGameEntry(gameDetails))
      .catch(err => console.log(`AppId: ${ids[i]}: err.name: ${err.message}`)); 
  }
}

function updateIds(ids) {
  connectToDB();
  console.log(`collected ${ids.length} ids`);
  loop(ids);
}

function scrapeURL(url) {
  connectToDB();
  getIds(url).then((ids) => {
    updateIds(ids);
  }).catch(err => console.log(err));
}

module.exports = { scrapeURL, updateIds };
