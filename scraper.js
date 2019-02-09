const rp = require('request-promise');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const async = require('async');
const Game = require('./models/game');
require('dotenv').load();

function connectToDB() {
  var mongoDB = `mongodb://${process.env.DB_USER}:${
    process.env.DB_PASS
  }@159.203.25.23:27017/steamdb`;
  mongoose.connect(mongoDB, {useNewUrlParser: true});
  mongoose.Promise = global.Promise;
  var db = mongoose.connection;

  //Bind connection to error event (to get notification of connection errors)
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}

async function getIds(uri) {
  var options = {
    uri: uri,
    method: 'GET',
    followRedirects: true,
    muteHttpExceptions: true,
    headers: {
      Cookie: 'birthtime=28801; path=/; domain=store.steampowered.com',
    },
  };
  let response = await rp(options);
  regex = /\/(\d{3,6})\/(?![\s\S]*\/\1\/)/g; //Checkes for unique strings of numbers 3 to 6 digits long
  ids = response.match(regex);
  return ids;
}

async function getGame(appid) {
  var uri = 'http://store.steampowered.com/api/appdetails?cc=us&appids='.concat(
    appid,
  );

  var options = {
    uri: uri,
    method: 'GET',
    followRedirects: true,
    muteHttpExceptions: true,
    appid: appid,
    headers: {
      Cookie: 'birthtime=28801; path=/; domain=store.steampowered.com',
    },
  };

  let response = await rp(options);
  data = JSON.parse(response)[appid].data;

  if (data == null) {
    console.log('AppId: ' + appid + ' Something went wrong.');
    return null;
  }

  if (data.type != 'game') {
    console.log('AppId: ' + appid + ' Not a game.');
    return null;
  }

  const steamAppId = appid;
  const name = data.name;
  const comingSoon = data.release_date.coming_soon;
  const releaseDate = data.release_date.coming_soon
    ? null
    : data.release_date.date;

  //genres
  const genre = data.genres.map(x => x.description);

  //tags
  const tag = data.categories.map(x => x.description);

  const reviewCount = data.recommendations ? data.recommendations.total : 0;
  const isFree = data.is_free;
  const fullPrice =
    data.is_free || comingSoon ? 0 : data.price_overview.initial;

  const developer = data.developers;
  const publisher = data.publishers;

  var genres = [];
  genre.forEach(elem => {
    genres.push({name: elem});
  });

  var tags = [];
  tag.forEach(elem => {
    tags.push({name: elem});
  });
  var developers = [];
  developer.forEach(elem => {
    developers.push({name: elem});
  });
  var publishers = [];
  publisher.forEach(elem => {
    publishers.push({name: elem});
  });

  return {
    steam_id: steamAppId,
    name: name,
    coming_soon: comingSoon,
    release_date: releaseDate,
    review_count: reviewCount,
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
  game = new Game(gameDetails);
  game.save(function(err) {
    if (err) {
      if (err.code == 11000) {
        console.log('AppId: ' + gameDetails.steam_id + ' Already in DB');
        //TODO: update DB entry instead
        return;
      } else {
        console.log(err.message);
        return;
      }
    }
    console.log('New Game: ' + game.steam_id);
  });
}

async function loop(ids) {
  for (let i = 0; i < ids.length; i++) {
    regex = /(\d+)/;
    ids[i] = ids[i].match(regex)[0];
    await new Promise(resolve => setTimeout(resolve, 1000));
    getGame(ids[i])
      .then(gameDetails => {
        CreateGameEntry(gameDetails);
      })
      .catch(err => {
        console.log('AppId: ' + ids[i] + ': ' + err.name + ': ' + err.message);
      });
  }
}

var addedCount = 0;
connectToDB();
getIds('https://store.steampowered.com/').then(ids => {
  console.log('collected ' + ids.length + ' ids');
  loop(ids);
});
