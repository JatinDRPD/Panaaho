                                        //PANAAHO

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');

const MongoURL = 'mongodb://127.0.0.1:27017/Panaaho';


async function main() {
    await mongoose.connect(MongoURL);
}

main().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

//INDEX ROUTE
app.get('/', (req, res) => {
    res.send('Hello World!');
});

//LISTING ROUTE
app.get('/testlisting', async (req, res) => {
    let sampleListing = new Listing({
        title: ' <My New villa>',
        description: 'By the beach.',
        price: 1200,
        location: 'Calangute,Goa',
        country: 'India',
    });

    await sampleListing.save();
    res.send('Sample listing created!');
});

app.listen(8081, () => {
    console.log('Server is running on port 8081');
});