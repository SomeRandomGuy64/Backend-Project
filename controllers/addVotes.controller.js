const { incrementVotes } = require("../models/addVotes.model");

exports.addVotes = (req, res, next) => {
  const { review_id } = req.params;
  incrementVotes(req.body, review_id)
    .then((review) => res.status(200).send({ review })).catch(next);
};
