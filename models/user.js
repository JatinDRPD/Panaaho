const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose").default;//default is added extra using gpt

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    }
});
userSchema.plugin(passportLocalMongoose);//this will add username and password field to the schema and also add some methods to the schema like authenticate,serializeUser,deserializeUser
module.exports=mongoose.model("User",userSchema);