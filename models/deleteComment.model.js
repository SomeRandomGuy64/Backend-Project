const db = require("../db/connection");

exports.removeComment = (comment_id) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1;", [Number(comment_id)])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment_id ${comment_id}`,
        });
      }

      return db.query("DELETE FROM comments WHERE comment_id = $1", [
        comment_id,
      ]);
    });
};
