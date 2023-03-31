const { removeComment } = require("../models/deleteComment.model");

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then((comment) => res.status(204).send({ comment })).catch(next);
};
