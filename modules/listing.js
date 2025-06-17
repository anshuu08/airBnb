const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url: String,
  filename: String
});

// Listing Schema
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: imageSchema,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review"
  }],
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
}, { timestamps: true });

// Text Index for Search
listingSchema.index({
  title: "text",
  description: "text",
  location: "text",
  country: "text"
});

// Delete associated reviews when a listing is removed
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

// Export model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
