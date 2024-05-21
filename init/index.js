const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
.then ( () => {
console.log("connect to DB");
})
.catch((err) => {
console.log(err);
});

async function main () {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, Owner: "664c0beb0f16796dfc88fbbb"}));
    await Listing.insertMany(initData.data);
    console.log("data was initializea");
};
initDB();