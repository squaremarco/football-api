const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompetitionSchema = new Schema({
  id: Number,
  name: String,
  code: String,
  emblemUrl: String,
  currentSeason: {
    id: Number,
    startDate: Date,
    endDate: Date,
    currentMatchday: Number,
    winner: { id: Number, name: String, shortName: String, tla: String, crestUrl: String }
  },
  seasons: [
    {
      id: Number,
      startDate: Date,
      endDate: Date,
      currentMatchday: Number,
      winner: { id: Number, name: String, shortName: String, tla: String, crestUrl: String }
    }
  ],
  lastUpdated: Date
});

const CompetitionModel = mongoose.model('competition', CompetitionSchema);

module.exports = {
  CompetitionSchema,
  CompetitionModel
};
