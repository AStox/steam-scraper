const Game = require('../models/game');

const graphPointSimple = async (x, y, sort, order) => {
  let data = await Game.aggregate([
    { $sort: { [`${sort}`]: order } },
  ]);
  data = data.map(game => ({ xAxis: game[x], yAxis: game[y] }));
  return data;
};

const graphPointNested = async (x, y) => {
  let data = await Game.aggregate([
    {
      $unwind: {
        path: `$${x}`,
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: `$${x}.name`,
        [`${y}`]: { $sum: `$${y}` },
      },
    },

    { $sort: { _id: 1 } },
  ]);
  data = data.map(game => ({ xAxis: game._id, yAxis: game[y] }));
  return data;
};

exports.graphPoint = async (x, y, sort, order) => {
  if (x === 'name') {
    return graphPointSimple(x, y, sort, order);
  }
  return graphPointNested(x, y);
};
