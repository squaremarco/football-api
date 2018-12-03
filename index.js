const { DB_HOST, DB_PORT, DB_NAME, DASHBOARD_PORT } = process.env;

const express = require('express');
const app = express();
const port = 3000;

const mongoose = require('mongoose');
const flatten = require('lodash/flatten');

const { CompetitionModel } = require('./model/competition');
const { MatchModel } = require('./model/match');
const { TeamModel } = require('./model/team');

const logger = require('./utils/logger');

mongoose.connect(
  `mongodb://${DB_HOST}:${DB_PORT}`,
  { useNewUrlParser: true, dbName: DB_NAME }
);

app.get('/', (_, res) => {
  return res.redirect(`http://localhost:${DASHBOARD_PORT}`);
});

app.get('/api/competitions', async (_, res) => {
  return res.send(await CompetitionModel.find().lean());
});

app.get('/api/competitions/:id', async (req, res) => {
  return req.params.id.match(/^\d+$/)
    ? res.send(await CompetitionModel.findOne({ id: req.params.id }).lean())
    : res.send(await CompetitionModel.findOne({ code: req.params.id }).lean());
});

app.get('/api/competitions/:id/matches', async (req, res) => {
  const competition = await CompetitionModel.findOne({ id: req.params.id }).lean();

  if (!competition) return res.send(null);

  if (req.query.currentSeason)
    return await MatchModel.find({ 'season.id': competition.currentSeason.id }).lean();

  return res.send(
    flatten(await Promise.all(competition.seasons.map(season => MatchModel.find({ 'season.id': season.id }).lean())))
  );
});

app.get('/api/matches', async (_, res) => {
  return res.send(await MatchModel.find().lean());
});

app.get('/api/matches/:id', async (req, res) => {
  return res.send(await MatchModel.find({ id: req.params.id }).lean());
});

app.get('/api/teams', async (_, res) => {
  return res.send(await TeamModel.find().lean());
});

app.get('/api/teams/:id', async (req, res) => {
  return req.params.id.match(/^\d+$/)
    ? res.send(await TeamModel.find({ id: req.params.id }).lean())
    : res.send(await TeamModel.find({ tla: req.params.id }).lean());
});

app.listen(port, () => logger.info(`App listening on port ${port}!`));
