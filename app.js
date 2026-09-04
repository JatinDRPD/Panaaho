                                        //PANAAHO

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const methodOverride = require("method-override");
const path=require("path");
const ejsMate=require("ejs-mate");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const MongoURL = 'mongodb://127.0.0.1:27017/Panaaho';
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");//JOI for validate listing function

const Review=require("./models/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const { expression } = require('joi');

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

const sessionOptions={
    secret:"MySuperSecretCode",
    resave:false,
    saveUninitialized:true,
    cookie:{
      expires: Date.now() + 7*24*60*60*1000,
      maxAge:7*24*60*60*1000,
      httpOnly:true
    }
  
};

//INDEX ROUTE
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use(session(sessionOptions));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});

//this route after using passport knowldge

app.get("/demouser",async(req,res)=>{
  let fakeUser=new User({
    email:"student@gmail.com",
    username:"delta-studemfeewft"
  });

  let registeredUser=await User.register(fakeUser,"HelloWorld");
  res.send(registeredUser);
})





//--------------------------------------------------------Listings route-----------------------------------------------------------

app.use("/listings",listingRouter);

//-------------------------------------------------------Reviews Route--------------------------------------------------------------
app.use("/listings/:id/reviews",reviewRouter);

//----------------------------------------------------------User route------------------------------------------------------------------
app.use("/",userRouter)


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