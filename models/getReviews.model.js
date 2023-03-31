const db = require("../db/connection");

exports.selectReviews = (category, sort_by, order) => {
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }

  let query =
    "SELECT reviews.review_id, reviews.title, reviews.category, reviews.designer, reviews.owner, reviews.review_img_url, reviews.created_at, reviews.votes, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id";

  const params = [];

  let filterQuery = "";
  if (category !== "") {
    filterQuery = " WHERE reviews.category = $1";
    params.push(category);
  }

  const validateCategory = () => {
    if (filterQuery !== "") {
      const categoryQuery = "SELECT * FROM categories WHERE slug = $1";
      return db.query(categoryQuery, [category]).then((res) => {
        if (res.rows.length === 0) {
          return Promise.reject({ status: 400, msg: "Invalid input" });
        }
      });
    } else {
      return Promise.resolve();
    }
  };

  const validateSortBy = () => {
    const sortQuery =
      "SELECT * FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = $1";
    return db.query(sortQuery, [sort_by]).then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 400, msg: "Invalid input" });
      }
    });
  };

  const validateParams = () => {
    return Promise.all([validateCategory(), validateSortBy()]);
  };

  const executeQuery = () => {
    const fullQuery =
      query +
      filterQuery +
      " GROUP BY reviews.review_id ORDER BY " +
      sort_by +
      " " +
      order;
    return db.query(fullQuery, params).then((result) => result.rows);
  };

  return validateParams().then(executeQuery);
};
