const { insertComment } = require("../models/addComment.model");

exports.addComment = (req, res, next) => {
  const { review_id } = req.params;
  insertComment(req.body, review_id)
    .then((comment) => res.status(201).send({ comment })).catch(next);
};
