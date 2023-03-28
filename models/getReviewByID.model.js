const db = require("../db/connection");

exports.selectReviewByID = (review_id) => {
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
      if(typeof review_id != 'number') {
        console.log(review_id);
      }
      return review;
    });
};
