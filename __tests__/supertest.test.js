const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => connection.end());

describe("GET /api/categories", () => {
  it("serves an array of all categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        const categories = res.body.categories;
        categories.forEach((category) => {
          expect(Object.keys(category)).toMatchObject(["slug", "description"]);
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
        expect(categories.length).toBe(4);
      });
  });
});
