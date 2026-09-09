const express=require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js");//yhn laane ke baa humne path me ..
// const ExpressError=require("../utils/ExpressError.js");
// const {listingSchema,reviewSchema}=require("../schema.js");//JOI for validate listing function
const Listing = require('../models/listing');
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")

const listingController=require("../contollers/listings.js")

const multer=require("multer");
const { storage } = require("../cloudConfig.js");
const upload=multer({storage:storage})//this is for storing the file in uploads folder


//Index Route and Create Route
//USING THE HELP OF ROUTER.ROUTE()

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
      upload.single("listing[image]"),
      validateListing,
  wrapAsync(listingController.createListing));


//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show,update and delete routes
router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner,wrapAsync(listingController.deleteListing));


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListing));



module.exports = router;