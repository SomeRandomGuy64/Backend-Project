const { selectReviewByID } = require("../models/getReviewByID.model");

exports.getReviewByID = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewByID(review_id).then((review) => 
    res.status(200).send({review})).catch(next);
  };

