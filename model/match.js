const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
  id: Number,
  season: {
    id: Number,
    startDate: Date,
    endDate: Date,
    currentMatchday: Number
  },
  utcDate: Date,
  status: String,
  matchday: Number,
  stage: String,
  group: String,
  lastUpdated: Date,
  score: {
    winner: String,
    duration: String,
    fullTime: {
      homeTeam: Number,
      awayTeam: Number
    },
    halfTime: {
      homeTeam: Number,
      awayTeam: Number
    },
    extraTime: {
      homeTeam: Number,
      awayTeam: Number
    },
    penalties: {
      homeTeam: Number,
      awayTeam: Number
    }
  },
  homeTeam: {
    id: Number,
    name: String
  },
  awayTeam: {
    id: Number,
    name: String
  }
});

const MatchModel = mongoose.model('match', MatchSchema);

module.exports = {
  MatchSchema,
  MatchModel
};
