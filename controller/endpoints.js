const endpoints = require("../endpoints.json");

const getEndpoints = (request, response, next) => {
  response.status(200).send(endpoints);
};

module.exports = { getEndpoints };
