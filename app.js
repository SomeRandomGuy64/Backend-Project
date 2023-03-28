const express = require("express");
const { getCategories } = require('./db/data/development-data/controllers/getCategories.controller');

const app = express();

app.get("/api/categories", getCategories);

module.exports = app;