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
const {listingSchema,reviewSchema}=require("./schema.js");//JOI for validate listing function
const Review=require("./models/review.js");

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

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



//--------------------------------------------------------Listings route-----------------------------------------------------------

app.use("/listings",listings);

//-------------------------------------------------------Reviews Route--------------------------------------------------------------
app.use("/listings/:id/reviews",reviews);



app.all("/{*splat}",(req,res,next)=>
{
  next(new ExpressError(404,"Page not found"));//for any type of wrong rout error
});

app.use((err,req,res,next)=>
{
  // res.send("Problem Occured")
  let {statusCode=500,msg="something went wrong"}=err;
  console.log(err);
  // res.status(statusCode).send(msg);
res.render("listings/error.ejs",{msg});
});


app.listen(8081, () => {
    console.log('Server is running on port 8081');
});