const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../modules/listing.js");
const Review = require("../modules/review.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const reviewController = require("../controlls/review.js");


//revies
//post route
router.post("/",
    isLoggedIn,
    validateReview,wrapAsync(reviewController.postReview));

//reviews
//delete route
router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview));

module.exports=router;