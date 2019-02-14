const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const {buildSchema} = require('graphql');
const mongoose = require('mongoose');
const Game = require('../models/game');
var path = require('path');
require('dotenv').load();

var app = express();
app.use(cors());
console.log(process.env.REACT_APP_DB);
mongoose.connect(
  process.env.REACT_APP_DB,
  {useNewUrlParser: true},
);

var db = mongoose.connection;
db.on('error', () => {
  console.log('----FAILED TO CONNECT TO MONGOOSE----');
});
db.once('open', () => {
  console.log('+++Connected to mongoose');
});

async function gamesList() {
  console.log(await Game.find());
}
const blah = async () => {
  console.log(await Game.find());
};
//gamesList();

const schema = buildSchema(`
  type Query {
    games: [Game]
    game(id: ID!): Game
  }

  type Game {
    id: ID,
    steam_id: String,
    name: String,
    coming_soon: String,
    release_date: String,
    review_count: String,
    is_free: String,
    full_price: String,
    genre: String,
    tag: String,
    developer: String,
    publisher: String,
  }
`);

const mapGame = (game, id) => game && {id, ...game};

const root = {
  // games: async () => {
  //   await Game.find();
  // },
  games: Game.find((err, games) => games),
  game: ({id}) => {
    Game.find({steam_id: id}, (err, game) => game);
  },
};

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  }),
);

const PORT = process.env.REACT_APP_GQL_PORT || 3000;

app.listen(PORT, () => {
  console.log('+++Express Server is Running!!!');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
