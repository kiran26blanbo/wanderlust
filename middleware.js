const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const { listingSchema ,reviewSchema} = require("./schema.js");
const review = require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;
    req.flash("error","You should be Logged in ");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner=async(req,res,next)=>{
  let { id } = req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.curUser._id)){
    req.flash("error","You are not the Owner of this Listing");
    return res.redirect(`/listings/${id}`)
  }
  next();
}

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",")
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
//creating validateReview function
 module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body); // ← Added convert: true
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};  
module.exports.isReviewAuthor=async(req,res,next)=>{
  let { id,reviewId } = req.params;
  console.log("Review ID:", reviewId);

  let review=await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.curUser._id)){
    req.flash("error","You are not the author of this review");
    return res.redirect(`/listings/${id}`)
  }
  next();
}