const Game = require('../models/game');

const graphPointSimple = async (x, y, sort, order, filter) => {
  let data = await Game.aggregate([
    { $sort: { [`${sort.name}`]: order } },
  ]);
  data = data.map(game => ({ xAxis: game[x], yAxis: game[y.name] }));
  return data;
};

const graphPointNested = async (x, y, sort, order, filter) => {
  console.log(filter);
  let data = await Game.aggregate([
    {
      $match: {
        [`${x}`]: {
          $all: filter,
        },
      },
    },
    {
      $unwind: {
        path: `$${x}`,
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: `$${x}.name`,
        [`${y.name}`]: { [y.avg ? '$avg' : '$sum']: `$${y.name}` },
        [`${sort.name}`]: { [sort.avg ? '$avg' : '$sum']: `$${sort.name}` }
      },
    },
    { $sort: { [`${sort.name}`]: order } },
  ]);
  data = data.map(game => ({ xAxis: game._id, yAxis: game[y.name] }));
  return data;
};

exports.graphPoint = async (x, y, sort, order, filter) => {
  if (x === 'name') {
    return graphPointSimple(x, y, sort, order, filter);
  }
  return graphPointNested(x, y, sort, order, filter);
};
