const mongoose = require("mongoose");
const Listing = require("./modules/listing.js");  // adjust path if needed
const {data:sampleListings} = require("./init/data.js");      // adjust path if needed

main()
  .then(() => {
    console.log("Cloud DB connected ✅");
  })
  .catch((err) => {
    console.log("Connection error ❌", err);
  });

async function main() {
  await mongoose.connect("mongodb+srv://kondruanshu:CQuLx4sNIwKzwvhS@cluster0.1hhdcov.mongodb.net/wanderlust");
}

const seedDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log("Old listings removed");

    const dummyOwnerId = "665ef3e3242a5690012a9e30";  // Replace with a real User _id from your DB

    const listingsWithOwner = sampleListings.map((listing) => {
      return {
        ...listing,
        owner: dummyOwnerId,
        geometry: {
          type: "Point",
          coordinates: [77.5946, 12.9716]  // Example: [longitude, latitude] of Bangalore
        }
      };
    });

    await Listing.insertMany(listingsWithOwner);
    console.log("Sample listings added ✅");

    mongoose.connection.close();
    console.log("DB connection closed");
  } catch (err) {
    console.log("Error seeding DB:", err);
  }
};

seedDB();

