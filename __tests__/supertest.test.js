const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');

beforeEach(() => {
    return seed(testData);
})
afterAll(() => connection.end());

describe("GET /api/categories", () => {
  it("serves an array of all categories", () => {
    return request(app).get("/api/categories").expect(200).then((res) => {
        expect(res.body.categories.length).toBe(4);
    });
  });
});

