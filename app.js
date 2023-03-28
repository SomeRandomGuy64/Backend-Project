const express = require("express");
const { getCategories } = require('./controllers/getCategories.controller');

const app = express();

app.get("/api/categories", getCategories);

module.exports = app;