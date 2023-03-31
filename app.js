const express = require("express");
const { getCategories } = require("./controllers/getCategories.controller");
const { getReviewByID } = require("./controllers/getReviewByID.controller");
const { getReviews } = require("./controllers/getReviews.controller");
const { getComments } = require("./controllers/getComments.controller");
const { addComment } = require("./controllers/addComment.controller");
const { addVotes } = require("./controllers/addVotes.controller");
const { deleteComment } = require("./controllers/deleteComment.controller");
const { getUsers } = require('./controllers/getUsers.controller');
const { resStatus400 } = require("./error/status400Code22P02");
const { res400err23502 } = require("./error/res400err23502");
const { resStatus500 } = require("./error/status500");
const { customErr } = require("./error/customErr");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewByID);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getComments);

app.post("/api/reviews/:review_id/comments", addComment);

app.patch("/api/reviews/:review_id", addVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.get('/api/users', getUsers)

app.use((err, req, res, next) => {
  customErr(res, err);
  resStatus400(res, err);
  res400err23502(res, err);
  resStatus500(res);
});

module.exports = app;
