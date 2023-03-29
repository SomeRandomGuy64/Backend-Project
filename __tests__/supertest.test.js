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
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
        expect(categories.length).toBe(4);
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  it("resonds with a review object of properties: review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then((res) => {
        const review = res.body.review;
        expect(review.review_id).toBe(1);
        expect(review.title).toBe("Agricola");
        expect(review.designer).toBe("Uwe Rosenberg");
        expect(review.owner).toBe("mallionaire");
        expect(review.review_img_url).toBe(
          "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700"
        );
        expect(review.review_body).toBe("Farmyard fun!");
        expect(review.created_at).toBe("2021-01-18T10:00:20.514Z");
        expect(review.votes).toBe(1);
      });
  });
  it("review id doesn't exist, responds with a 404", () => {
    return request(app)
      .get("/api/reviews/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toContain("No review found for review_id");
      });
  });
  it("review id is not a valid number, responds with a 400", () => {
    return request(app)
      .get("/api/reviews/dog")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("GET /api/reviews", () => {
  it("should return an array of review objects which should conatain all of the following properties: review_id, title, designer, owner, review_img_url, category, created_at, votes, comment_count", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        const reviews = res.body.reviews;
        reviews.forEach((review, index, arr) => {
          expect(review).toMatchObject({
            review_id: expect.any(Number),
            title: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
          if (index > 0) {
            expect(new Date(review.created_at).getTime()).toBeLessThanOrEqual(
              new Date(arr[index - 1].created_at).getTime()
            );
          }
        });
        expect(reviews.length).toBe(13);
      });
  });
});
