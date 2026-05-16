require('dotenv').config();
const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("connection was successful");
    initDB();
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "6a085b75963398e39a8eba91",
    
  }));

  await Listing.insertMany(initdata.data);

  console.log("Database initialized");
};