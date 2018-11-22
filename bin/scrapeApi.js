const { DB_HOST, DB_PORT, DB_NAME, API_BASE_URL, API_TOKEN, API_PLAN } = process.env;

const mongoose = require('mongoose');
const axios = require('axios').create({
  baseURL: API_BASE_URL,
  headers: { 'X-Auth-Token': API_TOKEN }
});

const logger = require('../utils/logger');
const mongooseExit = require('../utils/mongooseExit');

const CompetitionModel = require('../model/competition').competitionModel;
const MatchModel = require('../model/match').matchModel;

mongoose.connect(
  `mongodb://${DB_HOST}:${DB_PORT}`,
  { useNewUrlParser: true, dbName: DB_NAME }
);

mongoose.connection.on('error', err => {
  logger.error(`[${err.name}]: ${err.message}`);
});

process
  .on('SIGTERM', () => mongooseExit('info', 'SIGTERM received. Gracefully closing connection with the database.', 0))
  .on('SIGINT', () => mongooseExit('info', 'SIGINT received. Gracefully closing connection with the database.', 0));

mongoose.connection.once('connected', () => {
  logger.info(`Connected to ${mongoose.connection.db.databaseName}`);

  //get competitions (2072 ENG - 2077 EU - 2081 FRA - 2114 ITA)
  logger.info('Pulling Competitions from API');
  axios
    .get(`competitions?plan=${API_PLAN}&areas=2072,2081,2114`)
    .then(res => {
      const competitions = res.data.competitions;

      competitions.forEach(comp => {
        axios.get(`competitions/${comp.id}`).then(res => {
          const competition = res.data;
        });
      });
    })
    .catch(error => mongooseExit('error', error, -1));
});
