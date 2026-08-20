
const express=require("express");
const router=express.Router();

router.get("/posts/:id", (req, res) => {
    console.log("Show Post");
});

// Index Posts
router.get("/posts", (req, res) => {
    console.log("Index Posts");
});

// Delete Post
router.delete("/posts/:id", (req, res) => {
    console.log("Delete Post");
});

module.exports=router;
