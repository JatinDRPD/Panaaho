                                        //PANAAHO

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const methodOverride = require("method-override");
const path=require("path");
const ejsMate=require("ejs-mate");

const MongoURL = 'mongodb://127.0.0.1:27017/Panaaho';


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

app.get("/listings",async (req,res)=>{

    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    
});

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//SHOW Route
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;//req.params.id
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing})

});

//Create Route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);//in new.ejs we have stored it in form of key value pair so we get here like this
  await newListing.save();
  res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});


app.listen(8081, () => {
    console.log('Server is running on port 8081');
});