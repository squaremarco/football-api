const { DB_HOST, DB_PORT, DB_NAME, API_BASE_URL, API_TOKEN, API_PLAN } = process.env;

const mongoose = require('mongoose');
const axios = require('axios').create({
  baseURL: API_BASE_URL,
  headers: { 'X-Auth-Token': API_TOKEN }
});
const retry = require('axios-retry');

const logger = require('../utils/logger');
const mongooseExit = require('../utils/mongooseExit');

const CompetitionModel = require('../model/competition').competitionModel;
const MatchModel = require('../model/match').matchModel;

retry(axios, {
  retryCondition: () => error =>
    (!error.response ||
      error.response.status === 429 ||
      (error.response.status >= 500 && error.response.status <= 599)) &&
    Boolean(error.code) &&
    error.code !== 'ECONNABORTED',
  retryDelay: (_, err) => {
    logger.error(`${err}, retrying...`);
    return 60000;
  },
  shouldResetTimeout: true,
  retries: 1
});

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
  logger.info(`Connected to ${DB_HOST}:${DB_PORT}/${mongoose.connection.db.databaseName}`);

  //get competitions (2072 ENG - 2077 EU - 2081 FRA - 2114 ITA)
  logger.info('Pulling competitions from API');
  axios
    .get(`competitions?plan=${API_PLAN}&areas=2072,2081,2114`)
    .then(res => {
      const competitions = res.data.competitions;

      competitions.forEach(comp => {
        axios
          .get(`competitions/${comp.id}`)
          .then(res => {
            const competition = res.data;

            CompetitionModel.findOne({ id: competition.id }, (err, doc) => {
              if (err) mongooseExit('error', err, -1);

              if (!doc) {
                logger.info(`Adding new competition ${competition.name} [id: ${competition.id}]`);
                new CompetitionModel(competition).save();
              } else if (doc && new Date(competition.lastUpdated) - doc.lastUpdated) {
                logger.info(`Updating competition ${competition.name} [id: ${competition.id}]`);
                doc.set(competition).save();
              } else {
                logger.warn(`Unchanged competition ${competition.name} [id: ${competition.id}], ignoring...`);
              }
            });
          })
          .catch(err => logger.error(err));
      });
    })
    .catch(err => logger.error(err));
  CompetitionModel.find((err, docs) => {});
});
