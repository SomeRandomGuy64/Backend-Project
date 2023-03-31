const db = require("../db/connection");

exports.incrementVotes = (newVotes, review_id) => {
  const { inc_votes } = newVotes;
  
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1;", [Number(review_id)])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id ${review_id}`,
        });
      }

      return db.query(
        "UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *",
        [inc_votes, review_id]
      );
    })
    .then((result) => result.rows[0]);
};
