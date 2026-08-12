const mongoose= require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');

const MongoURL = 'mongodb://127.0.0.1:27017/Panaaho';

async function main() {
    await mongoose.connect(MongoURL);
    console.log('Connected to MongoDB');
}

main()
  .then(() => {
    console.log('Connected to MongoDBs');
  })
  .catch((err) => {
    console.log(err);
  });


  //delete the data if present and then initialize data from data.js

  const initDB=async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
  }
  initDB();