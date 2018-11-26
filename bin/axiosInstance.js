const { API_BASE_URL, API_TOKEN } = process.env;

const axios = require('axios');
const retry = require('axios-retry');

const isNetworkOrTooManyRequestsError = require('../utils/networkOrTooManyRequestsError');
const logger = require('../utils/logger');

const retryInterval = 1000;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'X-Auth-Token': API_TOKEN }
});

retry(axiosInstance, {
  retryCondition: isNetworkOrTooManyRequestsError,
  retryDelay: (_, err) => {
    logger.warn(
      `${err.syscall} [${err.code || err.errno}] ${err.hostname} ${err.hostname}:${err.port}, retrying in ~${retryInterval / 1000}s...`
    );
    return retryInterval;
  },
  shouldResetTimeout: true,
  retries: 1
});

module.exports = axiosInstance;
