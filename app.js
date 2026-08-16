                                        //PANAAHO

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const methodOverride = require("method-override");
const path=require("path");
const ejsMate=require("ejs-mate");

const MongoURL = 'mongodb://127.0.0.1:27017/Panaaho';
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");

async function main() {
    await mongoose.connect(MongoURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs", ejsMate);

main().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

//INDEX ROUTE
app.get('/', (req, res) => {
    res.send('Hello World!');
});

const validateListing=(req,res,next)=>
{
let {error}=listingSchema.validate(req.body);//or req.body.error
let errMsg=error.details.map((el)=>el.message).join(",");
      if(error){
        throw new ExpressError(400,errMsg);
      }
      else{
        next();
      }
}

// //test LISTING ROUTE
// app.get('/testlisting', async (req, res) => {
//     let sampleListing = new Listing({
//         title: ' <My New villa>',
//         description: 'By the beach.',
//         price: 1200,
//         location: 'Calangute,Goa',
//         country: 'India',
//     });

//     await sampleListing.save();
//     res.send('Sample listing created!');
// });


//Index Route

app.get("/listings",wrapAsync(async (req,res)=>{

    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    
}));

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//SHOW Route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;//req.params.id
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing})

}));

//Create Route
// app.post("/listings", async (req, res,next) => {
//   try{
//         const newListing = new Listing(req.body.listing);//in new.ejs we have stored it in form of key value pair so we get here like this
//       await newListing.save();
//       res.redirect("/listings");
//     }catch(err)
//   {
//     next(err);//it will ppass to error handling middleware-*
//   }
 
// });


//Create Route
app.post("/listings",validateListing,
  wrapAsync( async (req, res,next) => {
      // if(!req.body.listing)
      // throw new ExpressError(400,"Send valid data for listing");
      // let result=listingSchema.validate(req.body);
      // if(result.error){
      //   throw new ExpressError(400,result.error);
      // }
      // listingSchema.validate(req.body);

      const newListing = new Listing(req.body.listing);//in new.ejs we have stored it in form of key value pair so we get here like this
      await newListing.save();
      res.redirect("/listings"); 
}));


//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id",validateListing, wrapAsync(async (req, res) => {
  if(!req.body.listing)
      throw new ExpressError(400,"Send valid data for listing");
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));

app.all("/{*splat}",(req,res,next)=>
{
  next(new ExpressError(404,"Page not found"));//for any type of wrong rout error
});

app.use((err,req,res,next)=>
{
  // res.send("Problem Occured")
  let {statusCode=500,msg="something went wrong"}=err;
  // res.status(statusCode).send(msg);
res.render("listings/error.ejs",{msg});
});


app.listen(8081, () => {
    console.log('Server is running on port 8081');
});