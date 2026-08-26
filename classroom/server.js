const express = require("express");
const app = express();
const user = require("./routes/user.js");
const post = require("./routes/posts.js");
const session = require("express-session");
const flash=require("connect-flash");
const path=require("path");
const session=require("express-session");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));




const sessionOptions={secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    req.flash('success','User registered');
    res.redirect("/hello");
})

app.get("/hello",(req,res)=>{
res.render("page.ejs",{name:req.session.name,msg:req.flash('success')})});

// app.get("/test",(req,res)=>{
//     res.send("test successful");
// })

// app.get("/reqCount",(req,res)=>{

//     if(req.session.count)
//         req.session.count++;
    
//     else
//     req.session.count=1;

//     res.send(`You send a request ${req.session.count} times`)
// })

// const cookieParser=require("cookie-parser");

// app.use(cookieParser("secretcode"));

// app.get("/getCookies",(req,res)=>{
//     res.cookie("greet","hello");
//     res.cookie("madeIn","India");
//     res.cookie("name","jd");
//     res.cookie("name","jd");
//     res.cookie("name","jd");
//     res.send("send u some cookies");
// })

// app.get("/getSignedCookie",(req,res)=>{
//     res.cookie("madeIn","USA",{signed:true});
//     res.send("signed cookie sent");
// })

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
// }

// )

// app.get("/greet",(req,res)=>{
//     let{name="anonymous"}=req.cookies;
//     res.send(`Ji,${name}`);
// })
// //cookies above

// // ==================== USERS ====================
// app.use("/users",user);//jitne bhi routes hei wo users pr hjaye or we can remove /users from both side so only / can work for /users

// // Show User


// // ==================== POSTS ====================
// app.use("/posts",post);//jitne bhi routes hei wo users pr hjaye


app.listen(3000, () => {
    console.log("Server running on port 3000");
}); 