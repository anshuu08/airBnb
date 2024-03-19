const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
main().then(() => {
    console.log("Connected to DB");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}
app.get("/", (req, res) => {
    res.send("working");
});
// app.get("/testlisting", async (req, res) => {
//     let samplelisting = new Listing({
//         title: "My new Villa",
//         description: "beach view",
//         price: 1200,
//         location: "goa",
//         country: "India"
//     })
//     await samplelisting.save();
//     console.log("sample saved");
//     res.send("successfully saved");
// });
app.get("/listings", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
});
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});
app.listen(8080, () => {
    console.log("app is listening to port 8080");
});