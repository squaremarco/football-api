const { DB_HOST, DB_PORT, DB_NAME, API_BASE_URL, API_TOKEN } = require('../environment');

const mongoose = require('mongoose');
const axios = require('axios').create({
  baseURL: API_BASE_URL,
  headers: { 'X-Auth-Token': API_TOKEN }
});
const logger = require('../utils/logger');
const mongooseExit = require('../utils/mongooseExit');

const CompetitionModel = require('../model/competition').competitionModel;

mongoose.connect(
  `mongodb://${DB_HOST}:${DB_PORT}`,
  { useNewUrlParser: true, dbName: DB_NAME }
);

mongoose.connection.on('error', err => {
  logger.error(`[${err.name}]: ${err.message}`);
});

process
  .on('SIGTERM', () => mongooseExit('info', 'Gracefully closing connection with the database.', 0))
  .on('SIGINT', () => mongooseExit('info', 'Gracefully closing connection with the database.', 0));

mongoose.connection.once('connected', () => {
  logger.info(`Connected to ${mongoose.connection.db.databaseName}`);

  //get competitions
  axios.get('competitions?plan=TIER_ONE').then(res => {
    let competitions = res.data.competitions;

    //save them in the database
    competitions.forEach(c => {
      CompetitionModel.findOne({ id: c.id }, (err, doc) => {
        if (err) mongooseExit('error', 'Error while querying the database.', -1);
        if (!doc || new Date(c.lastUpdated) - new Date(doc.lastUpdated) !== 0) {
          new CompetitionModel(c).save();
        }
      });
    });
  });
});
