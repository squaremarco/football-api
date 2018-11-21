const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const competitionSchemaConfig = {};

const competitionSchema = new Schema(
  {
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
    /*seasons: [
      new Schema({
        id: Number,
        startDate: Date,
        endDate: Date,
        currentMatchday: Number
      })
    ],*/
    lastUpdated: Date
  },
  competitionSchemaConfig
);

const competitionModel = mongoose.model('competition', competitionSchema);

module.exports = {
  competitionSchema,
  competitionModel
};
