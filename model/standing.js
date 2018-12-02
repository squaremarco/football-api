const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StandingSchema = new Schema({
  season: {
    id: Number,
    startDate: Date,
    endDate: Date,
    currentMatchday: Number,
    winner: String
  },
  standings: [
    {
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
    }
  ]
});

const StandingModel = mongoose.model('standing', StandingSchema);

module.exports = {
  StandingSchema,
  StandingModel
};
