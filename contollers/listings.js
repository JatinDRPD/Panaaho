const Listing=require("../models/listing.js");

module.exports.index=async (req,res)=>{

    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    
}

module.exports.renderNewForm=(req,res)=>{
  res.render("listings/new.ejs");
}

module.exports.showListing=async(req,res)=>{
    let {id} = req.params;//req.params.id
    const listing=await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    console.log(listing);
    if(!listing){
      req.flash("error","Listing u requested for does not exist");
      return res.redirect("/listings");
    }
      res.render("listings/show.ejs",{listing})

}

module.exports.createListing=async (req, res,next) => {
      let url=req.file.path; 
      let filename=req.file.filename;
      const newListing = new Listing(req.body.listing);//in new.ejs we have stored it in form of key value pair so we get here like this
      newListing.owner=req.user._id;//we have added owner field in listing schema so we can add it here
      newListing.image={url,filename};//we have added image field in listing schema so we can add it here
      await newListing.save();
      req.flash("success","New Listing Created!");
      res.redirect("/listings"); 
}

module.exports.editListing=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
   if(!listing){
      req.flash("error","Listing u requested for does not exist");
      return res.redirect("/listings");
    }
    let origImageUrl=listing.image.url;
    origImageUrl=origImageUrl.replace("/upload","/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, origImageUrl });
};

module.exports.updateListing=async (req, res) => {

  if(!req.body.listing)
      throw new ExpressError(400,"Send valid data for listing");//catched by wrap async catch and the 2nd err middleware called
    let { id } = req.params;
    const listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
        let url=req.file.path; 
        let filename=req.file.filename;
        listing.image={url,filename};
    await listing.save();}

    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success","Listing Deleted");
  res.redirect("/listings");
}