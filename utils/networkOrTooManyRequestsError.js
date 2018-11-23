module.exports = () => error =>
  (!error.response ||
    error.response.status === 429 ||
    (error.response.status >= 500 && error.response.status <= 599)) &&
  Boolean(error.code) &&
  error.code !== 'ECONNABORTED';
