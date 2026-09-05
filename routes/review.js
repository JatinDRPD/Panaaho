const express=require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
// const {listingSchema,reviewSchema}=require("../schema.js");//JOI for validate listing function
const Review=require("../models/review.js");
const Listing = require('../models/listing');
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js")




//Reviews

//post route

router.post("/",validateReview,isLoggedIn,wrapAsync(async(req,res)=>{
  let listing=await Listing.findById(req.params.id);
  let newReview =new Review(req.body.review);
  newReview.author=req.user._id;

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

    req.flash("success","New Review Created!");


  // console.log("new review saved");

  // res.send("new review saved");

  res.redirect(`/listings/${listing._id}`);

  }));

  //delete reviews route

  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
      let {id,reviewId}=req.params;
      await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
      await Review.findByIdAndDelete(reviewId);

      req.flash("success","Review Deleted");

      res.redirect(`/listings/${id}`);
  }));

  module.exports=router;