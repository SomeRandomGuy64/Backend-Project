const db = require("../../../connection");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories").then((result) => result.rows);
};
