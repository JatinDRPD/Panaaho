const express = require("express");
const app = express();
const user=require("./routes/user.js");
const post=require("./routes/posts.js");


// ==================== USERS ====================
app.use("/users",user);//jitne bhi routes hei wo users pr hjaye or we can remove /users from both side so only / can work for /users

// Show User


// ==================== POSTS ====================
app.use("/posts",post);//jitne bhi routes hei wo users pr hjaye


app.listen(3000, () => {
    console.log("Server running on port 3000");
}); 