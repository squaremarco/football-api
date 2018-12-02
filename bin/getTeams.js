const axiosInstance = require('./axiosInstance');

module.exports = async competitionsID => {
  return Promise.all(
    competitionsID.map(el =>
      axiosInstance.get(`competitions/${el}/teams`).then(res =>
        res.data.teams.map(team => {
          team.season = res.data.season;
          return team;
        })
      )
    )
  );
};
