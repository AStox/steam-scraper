const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const query = require('./query');
const Game = require('../models/game');

require('dotenv').load();

const app = express();
app.use(cors());
mongoose.connect(
  process.env.REACT_APP_DB,
  { useNewUrlParser: true },
);

const db = mongoose.connection;
db.on('error', () => {
  console.log('----FAILED TO CONNECT TO MONGOOSE----');
});
db.once('open', () => {
  console.log('+++Connected to mongoose');
});

const schema = buildSchema(`
  type Query {
    games: [Game]
    graphData(x: String!, y: Axis!, sort: Axis!, order: Int!, filter: [String]): [GraphPoint]
  }

  type GraphPoint {
    xAxis: String,
    yAxis: Float,
  }

  input Axis {
    name: String!,
    label: String,
    avg: Boolean,
  }

  type Game {
    id: ID,
    steam_id: String,
    name: String,
    coming_soon: String,
    release_date: String,
    review_count: Int,
    followers: Int,
    is_free: String,
    full_price: String,
    genre: [Genre],
    tag: [Tag],
    developer: [Developer],
    publisher: [Publisher],
  }
  
  type Genre {
    name: String,
  }
  type Tag {
    name: String,
  }
  type Developer {
    name: String,
  }
  type Publisher {
    name: String,
  }
`);

const root = {
  games: Game.find(),
  graphData: ({ x, y, sort, order, filter }) => query.graphPoint(x, y, sort, order, filter),
};

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  }),
);

const PORT = process.env.REACT_APP_GQL_PORT || 3001;

app.listen(PORT, () => {
  console.log('+++Express Server is Running!!!');
});
