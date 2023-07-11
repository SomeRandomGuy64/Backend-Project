# Northcoders House of Games API

To create environment variables create two files names '.env.development' and '.env.test'.
copy the development data base from db/setup.sql and paste in PGDATABASE=<\development database> 
copy the test data base from db/setup.sql and paste in PGDATABASE=<\test database> 

# Available endpoints

## GET /api/categories
Responds with:

an array of category objects, each of which have the following properties:
- slug
- description

## GET /api/reviews:review_id
Responds with:

a review object, which has the following properties:
- review_id
- title
- review_body
- designer
- review_img_url
- votes
- category
- owner
- created_at
- comment_count

## GET /api/reviews
Responds with:

a reviews array of review objects, each of which has the following properties:
- owner
- title
- review_id
- category
- review_img_url
- created_at
- votes
- designer
- comment_count which is the total count of all the comments with this review_id

accepts the following queries:

- category, which selects the reviews by the category value specified in the query. If the query is omitted the endpoint should respond with all reviews.
- sort_by, which sorts the articles by any valid column (defaults to date)
- order, which can be set to asc or desc for ascending or descending (defaults to descending)


## GET /api/reviews/:review_id/comments
Responds with:

an array of comments for the given review_id of which each comment has the following properties:
- comment_id
- votes
- created_at
- author
- body
- review_id

## GET /api/users
Responds with:

- an array of objects, with the following properties:
    - username
    - name
    - avatar_url

## POST /api/reviews/:review_id/comments

Request body accepts:

- an object with the following properties:
    - username
    - body

Responds with:

- the posted comment

## PATCH /api/reviews/:review_id
Request body accepts:

- an object in the form { inc_votes: newVote }

- newVote will indicate how much the votes property in the database should be updated by
    e.g.

- { inc_votes : 1 } would increment the current review's vote property by 1

- { inc_votes : -100} would decrement the current review's vote property by 100

Responds with:

- the updated review

## DELETE /api/comments/:comment_id
Deletes the given comment by comment_id

Responds with:

- status 204 and no content