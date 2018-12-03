const axiosInstance = require('./axiosInstance');

module.exports = async competitionsID => {
  return Promise.all(
    competitionsID.map(el => axiosInstance.get(`competitions/${el}/standings`).then(res => {
      res.data.lastUpdated = res.data.competition.lastUpdated;
      return res.data;
    }))
  );
};
