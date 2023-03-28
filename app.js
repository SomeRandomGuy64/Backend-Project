const express = require("express");
const { getCategories } = require('./controllers/getCategories.controller');
const { getReviewByID } = require('./controllers/getReviewByID.controller');

const app = express();

app.get("/api/categories", getCategories);

app.get('/api/reviews/:review_id', getReviewByID);

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    }
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid input' });
    }
    res.status(500).send({msg: 'Internal Server Error'});
  });

module.exports = app;