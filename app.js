const express = require("express");
const { getCategories } = require("./controllers/getCategories.controller");
const { getReviewByID } = require("./controllers/getReviewByID.controller");
const { getReviews } = require('./controllers/getReviews.controller');
const { resStatus400 } = require('./error/status400Code22P02');
const { resStatus500 } = require('./error/status500');
const { customErr } = require('./error/customErr');

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewByID);

app.get("/api/reviews", getReviews);

app.use((err, req, res, next) => {
  customErr(res, err);
  resStatus400(res, err);
  resStatus500(res);
});

module.exports = app;
