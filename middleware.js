 const Listing=require("./models/listing");
 const Review=require("./models/review");
 const ExpressError=require("./utils/ExpressError.js");
 const {listingSchema,reviewSchema}=require("./schema.js");//JOI for validate listing function
 
 
 
 module.exports.isLoggedIn=(req,res,next)=>{
  
 if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","You must be logged in to create listing");
    return res.redirect("/login");
  }
  next();
 }
 
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner=async(req,res,next)=>{
    let id=req.params.id;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error","You are not the owner of this listing");
      return res.redirect(`/listings/${id}`);
  }

  next();
  }

module.exports.validateListing=((req,res,next)=>
{
let {error}=listingSchema.validate(req.body);//or req.body.error

      if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
      }
      else{
        next();
      }
});

module.exports.validateReview=(req,res,next)=>
{
let {error}=reviewSchema.validate(req.body);//or req.body.error

      if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);//express auto moves this to error m/w using its pipeline
      }
      else{
        next();
      }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
      let {id,reviewId}=req.params;
    let listing=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error","You are not the owner of this review");
      return res.redirect(`/listings/${id}`);
  }

  next();
  }
  