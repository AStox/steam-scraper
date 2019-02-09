var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GameSchema = new Schema({
  steam_id: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  coming_soon: {type: Boolean, required: true},
  release_date: {type: Date},
  review_count: {type: Number, required: true, default: 0},
  is_free: {type: Boolean, required: true},
  full_price: {type: Number},
  genre: [
    {
      name: {type: String, required: true},
    },
  ],
  tag: [
    {
      name: {type: String, required: true},
    },
  ],
  developer: [
    {
      name: {type: String, required: true},
    },
  ],
  publisher: [
    {
      name: {type: String, required: true},
    },
  ],
});

module.exports = mongoose.model('Game', GameSchema);
