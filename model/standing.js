const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StandingSchema = new Schema({
  season: {
    id: Number,
    startDate: Date,
    endDate: Date,
    currentMatchday: Number,
    winner: { id: Number, name: String, shortName: String, tla: String, crestUrl: String }
  },
  standings: [
    new Schema({
      stage: String,
      type: String,
      table: [
        {
          position: Number,
          team: {
            id: Number,
            name: String
          },
          playedGames: Number,
          won: Number,
          draw: Number,
          lost: Number,
          points: Number,
          goalsFor: Number,
          goalsAgainst: Number,
          goalDifference: Number
        }
      ]
    })
  ],
  lastUpdated: Date
});

const StandingModel = mongoose.model('standing', StandingSchema);

module.exports = {
  StandingSchema,
  StandingModel
};
