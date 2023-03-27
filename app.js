const express = require("express");
const { getCategories } = require('./db/data/development-data/controllers/getCategories.controller');

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

module.exports = app;