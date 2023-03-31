const { selectReviews } = require("../models/getReviews.model");

exports.getReviews = (req, res, next) => {
  const { category = "", sort_by = "created_at", order = "desc" } = req.query;
  selectReviews(category, sort_by, order)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};
