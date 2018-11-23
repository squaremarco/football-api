const axiosInstance = require('./axiosInstance');

module.exports = async competitionsID => {
  return Promise.all(
    competitionsID.map(el => axiosInstance.get(`competitions/${el}/matches`).then(res => res.data.matches))
  );
};
