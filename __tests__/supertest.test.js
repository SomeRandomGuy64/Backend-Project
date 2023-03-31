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
        reviews.forEach((review) => {
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
        });
        expect(reviews).toBeSorted("created_at", {
          descending: true,
        });
        expect(reviews.length).toBe(13);
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  it("should return an array of comment objects for the given review_id with the following properties: comment_id, votes, created_at, author, body, review_id", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((res) => {
        const comments = res.body.comments;
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            review_id: expect.any(Number),
          });
        });
        expect(comments).toBeSorted("created_at", {
          descending: true,
        });
        expect(comments.length).toBe(3);
      });
  });
  it("no comments for given review id, responds with a 200", () => {
    return request(app).get("/api/reviews/1/comments").expect(200);
  });
  it("review id is not a valid number, responds with a 400", () => {
    return request(app)
      .get("/api/reviews/dog/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  it("review id doesn't exist, responds with a 404", () => {
    return request(app)
      .get("/api/reviews/99999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toContain("No review found for review_id");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  it("should add a comment to the comments table and then return it", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "dav3rid", body: "comment" })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          author: "dav3rid",
          body: "comment",
        });
      });
  });
  it("review id doesn't exist, responds with a 404", () => {
    return request(app)
      .post("/api/reviews/99999/comments")
      .send({ username: "dav3rid", body: "comment" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toContain("No review found for review_id");
      });
  });
  it("review id is not a valid number, responds with a 400", () => {
    return request(app)
      .post("/api/reviews/dog/comments")
      .send({ username: "dav3rid", body: "comment" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toContain("Invalid input");
      });
  });
  it("username doesn't exist, responds with a 400", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ username: "faizan", body: "comment" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username not found");
      });
  });
  it("missing required fields, responds with a 400", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Missing required field(s) - username and/or body"
        );
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  it("should accept an object in the form { inc_votes: newVote } and then increment the votes of the review by newVote before responding with the updated review", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 10 })
      .expect(200)
      .then((res) => {
        const review = res.body.review;
        console.log(review);
        expect(review.review_id).toBe(1);
        expect(review.title).toBe("Agricola");
        expect(review.designer).toBe("Uwe Rosenberg");
        expect(review.owner).toBe("mallionaire");
        expect(review.review_img_url).toBe(
          "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700"
        );
        expect(review.review_body).toBe("Farmyard fun!");
        expect(review.created_at).toBe("2021-01-18T10:00:20.514Z");
        expect(review.votes).toBe(11);
      });
  });
  it("review id doesn't exist, responds with a 404", () => {
    return request(app)
      .patch("/api/reviews/99999")
      .send({ inc_votes: 10 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toContain("No review found for review_id");
      });
  });
  it("review id is not a valid number, responds with a 400", () => {
    return request(app)
      .patch("/api/reviews/dog")
      .send({ inc_votes: 10 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toContain("Invalid input");
      });
  });
  it("missing inc_votes, responds with a 400", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("No input found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("should delete a comment by the given comment_id and return a 204", () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204);
  });
  it("comment id doesn't exist, responds with a 404", () => {
    return request(app)
    .delete("/api/comments/9999999")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toContain("No comment found for comment_id")
    })
  });
});

describe('GET /api/users', () => {
  it('should return an array of objects with ech objects having the folllowing properties: username, name, avatar_url', () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        const users = res.body.users;
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
        expect(users.length).toBe(4);
      });
  })
})
