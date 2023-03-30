const db = require("../db/connection");

exports.selectComments = (review_id) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
    .then(({ rows }) => {
      const review = rows[0];
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id: ${review_id}`,
        });
      }
      return db
        .query(
          "SELECT * FROM comments WHERE comments.review_id=$1 ORDER BY created_at DESC",
          [review_id]
        )
        .then(({ rows }) => {
          const comments = rows;
          if (comments.length === 0) {
            return Promise.reject({
              status: 204,
              msg: `No comments found for review_id: ${review_id}`,
            });
          }
          return comments;
        });
    });
};
