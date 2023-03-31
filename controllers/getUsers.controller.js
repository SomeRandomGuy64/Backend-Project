const { selectUsers } = require("../models/getUsers.model");

exports.getUsers = (req, res) => {
  selectUsers().then((users) => res.status(200).send({ users }));
};
