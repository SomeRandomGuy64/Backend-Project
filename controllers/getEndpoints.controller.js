const { selectEndpoints } = require("../models/getEndpoints.model");

exports.getEndpoints = (req, res) => {
  const endpoints = selectEndpoints();
  res.status(200).json(endpoints);
};
