const db = require("../db/connection");

exports.insertComment = (newComment, review_id) => {
  const { username, body } = newComment;

  if (!username || !body) {
    return Promise.reject({
      status: 400,
      msg: "Missing required field(s) - username and/or body",
    });
  }

  return db
    .query("SELECT * FROM reviews WHERE review_id = $1;", [Number(review_id)])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id ${review_id}`,
        });
      }
      return db.query("SELECT * FROM users WHERE username = $1;", [username]);
    })
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Username not found`,
        });
      }
      return db.query(
        "INSERT INTO comments (body, review_id, author) VALUES ($1, $2, $3) RETURNING *;",
        [body, Number(review_id), username]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
