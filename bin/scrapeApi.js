const { DB_HOST, DB_PORT } = process.env;

const mongooseConnection = require('./mongooseConnection');
const getCompetitionsHandler = require('./getCompetitions');
const getMatchesHandler = require('./getMatches');
const logger = require('../utils/logger');
const mongooseExit = require('../utils/mongooseExit');
const apiQueryErrorHandler = require('../utils/apiQueryErrorHandler');

const CompetitionModel = require('../model/competition').competitionModel;
const MatchModel = require('../model/match').matchModel;

process
  .on('SIGTERM', () => mongooseExit(mongooseConnection, 'info', 'SIGTERM received. Gracefully closing connection with the database.', 0))
  .on('SIGINT', () => mongooseExit(mongooseConnection, 'info', 'SIGINT received. Gracefully closing connection with the database.', 0));

mongooseConnection.once('connected', async () => {
  logger.info(`Connected to ${DB_HOST}:${DB_PORT}/${mongooseConnection.db.databaseName}`);

  logger.info('Pulling competitions data from API');
  const competitions = await getCompetitionsHandler().catch(apiQueryErrorHandler);

  logger.info('Pushing competition data to database');
  await Promise.all(
    competitions.map(competition =>
      CompetitionModel.findOne({ id: competition.id })
        .exec()
        .then(doc => {
          if (!doc) {
            logger.info(`Adding new competition data ${competition.name} [id: ${competition.id}]`);
            return new CompetitionModel(competition).save();
          } else if (doc && new Date(competition.lastUpdated) - doc.lastUpdated) {
            logger.info(`Updating competition data ${competition.name} [id: ${competition.id}]`);
            return doc.set(competition).save();
          } else {
            logger.warn(`Unchanged competition data ${competition.name} [id: ${competition.id}], ignoring...`);
          }
        })
        .catch(err => mongooseExit(mongooseConnection, 'error', err, 1))
    )
  );

  logger.info('Pulling matches data from API');
  const matches = await getMatchesHandler(competitions.map(el => el.id)).catch(apiQueryErrorHandler);
  const matchList = matches.reduce((flat, toFlat) => flat.concat(toFlat), []);

  logger.info('Pushing matches data to database');
  await Promise.all(
    matchList.map(match =>
      MatchModel.findOne({ id: match.id })
        .exec()
        .then(doc => {
          if (!doc) {
            logger.info(`Adding new match data [id: ${match.id}]`);
            return new MatchModel(match).save();
          } else if (doc && new Date(match.lastUpdated) - doc.lastUpdated) {
            logger.info(`Updating match data [id: ${match.id}]`);
            return doc.set(match).save();
          } else {
            logger.warn(`Unchanged match data [id: ${match.id}], ignoring...`);
          }
        })
        .catch(err => mongooseExit(mongooseConnection, 'error', err, 1))
    )
  );

  logger.info(`Closing connection to ${DB_HOST}:${DB_PORT}/${mongooseConnection.db.databaseName}`);
  mongooseConnection.close();
});
