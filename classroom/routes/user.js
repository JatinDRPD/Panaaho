const express=require("express");
const router=express.Router();

router.get("/users/:id", (req, res) => {
    console.log("Show User");
});

// Index Users
router.get("/users", (req, res) => {
    console.log("Index Users");
});

// Delete User
router.delete("/users/:id", (req, res) => {
    console.log("Delete User");
});

module.exports=router;