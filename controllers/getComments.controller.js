const { selectComments } = require("../models/getComments.model");

exports.getComments = (req, res, next) => {
  const { review_id } = req.params;
  selectComments(review_id)
    .then((comments) => res.status(200).send({ comments }))
    .catch(next);
};
