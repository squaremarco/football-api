const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchSchema = new Schema({
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
  },
  referees: [
    {
      id: Number,
      name: String,
      nationality: String
    }
  ]
});

const matchModel = mongoose.model('match', matchSchema);

module.exports = {
  matchSchema,
  matchModel
};
