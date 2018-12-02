const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  id: Number,
  name: String,
  shortName: String,
  season: {
    id: Number,
    startDate: Date,
    endDate: Date,
    currentMatchday: Number
  },
  tla: String,
  crestUrl: String,
  address: String,
  phone: String,
  website: String,
  email: String,
  founded: Number,
  clubColors: String,
  venue: String,
  lastUpdated: Date
});

const TeamModel = mongoose.model('team', TeamSchema);

module.exports = {
  TeamSchema,
  TeamModel
};
