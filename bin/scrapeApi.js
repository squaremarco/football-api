const { DB_HOST, DB_PORT } = process.env;

const flatten = require('lodash/flatten');

const mongooseConnection = require('./mongooseConnection');
const getCompetitionsHandler = require('./getCompetitions');
const getMatchesHandler = require('./getMatches');
const getTeamsHandler = require('./getTeams');
const logger = require('../utils/logger');
const mongooseExit = require('../utils/mongooseExit');
const apiQueryErrorHandler = require('../utils/apiQueryErrorHandler');

const { CompetitionModel } = require('../model/competition');
const { MatchModel } = require('../model/match');
const { TeamModel } = require('../model/team');

process
  .on('SIGTERM', () =>
    mongooseExit(mongooseConnection, 'info', 'SIGTERM received. Gracefully closing connection with the database.', 0)
  )
  .on('SIGINT', () =>
    mongooseExit(mongooseConnection, 'info', 'SIGINT received. Gracefully closing connection with the database.', 0)
  );

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
  const matches = flatten(await getMatchesHandler(competitions.map(el => el.id)).catch(apiQueryErrorHandler));

  logger.info('Pushing matches data to database');
  await Promise.all(
    matches.map(match =>
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

  logger.info('Pulling teams data from API');
  const teams = flatten(await getTeamsHandler(competitions.map(el => el.id)).catch(apiQueryErrorHandler));

  logger.info('Pushing team data to database');
  await Promise.all(
    teams.map(team =>
      TeamModel.findOne({ id: team.id })
        .exec()
        .then(doc => {
          if (!doc) {
            logger.info(`Adding new team data [id: ${team.id}]`);
            return new TeamModel(team).save();
          } else if (doc && new Date(team.lastUpdated) - doc.lastUpdated) {
            logger.info(`Updating team data [id: ${team.id}]`);
            return doc.set(team).save();
          } else {
            logger.warn(`Unchanged team data [id: ${team.id}], ignoring...`);
          }
        })
        .catch(err => mongooseExit(mongooseConnection, 'error', err, 1))
    )
  );

  logger.info(`Closing connection to ${DB_HOST}:${DB_PORT}/${mongooseConnection.db.databaseName}`);
  mongooseConnection.close();
});
