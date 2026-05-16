const express = require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync")
const reviewController=require("../controllers/reviews.js")
const {isLoggedIn,validateReview,isReviewAuthor}=require("../middleware.js")
//reviews
router.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.postReview))
//deleting review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview))
module.exports=router