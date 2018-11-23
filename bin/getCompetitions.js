const { API_PLAN } = process.env;

const axiosInstance = require('./axiosInstance');

module.exports = async () => {
  //areas 2072 -> ENG / 2077 -> EU / 2081 -> FRA / 2114 -> ITA
  const competitionsQuery = await axiosInstance
    .get(`competitions?plan=${API_PLAN}&areas=2072,2081,2114`)
    .then(res => res.data.competitions);
  return Promise.all(
    competitionsQuery.map(el => axiosInstance.get(`competitions/${el.id}`).then(res => res.data))
  );
};
