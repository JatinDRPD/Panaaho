const express=require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js");//yhn laane ke baa humne path me ..
// const ExpressError=require("../utils/ExpressError.js");
// const {listingSchema,reviewSchema}=require("../schema.js");//JOI for validate listing function
const Listing = require('../models/listing');
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")

const listingController=require("../contollers/listings.js")

//Index Route
router.get("/",wrapAsync(listingController.index));

// //Index Route

// router.get("/",wrapAsync(async (req,res)=>{

//     const allListings=await Listing.find({});
//     res.render("listings/index.ejs",{allListings});
    
// }));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//SHOW Route
router.get("/:id",wrapAsync(listingController.showListing));


//Create Route
router.post("/",isLoggedIn,validateListing,
  wrapAsync(listingController.createListing));


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListing));

//Update Route  
router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/:id",isLoggedIn, isOwner,wrapAsync(listingController.deleteListing));

module.exports = router;