const Listing = require("../modules/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const defaultImg = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

// 🔍 INDEX with SEARCH + FILTERS
module.exports.index = async (req, res) => {
  const { q, country, maxPrice } = req.query;

  let filter = {};

  if (q) {
    const regex = new RegExp(q, "i");
    filter.$or = [
      { title: regex },
      { description: regex },
      { location: regex },
      { country: regex }
    ];
  }

  if (country) filter.country = country;
  if (maxPrice) filter.price = { $lte: Number(maxPrice) };

  const allListings = await Listing.find(filter);

  res.render("listings/index", {
    allListings,
    searchQuery: q || "",
    selectedCountry: country || "",
    selectedPrice: maxPrice || ""
  });
};

// ➕ Render Create Form
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// 🆕 CREATE Listing
module.exports.createListing = async (req, res) => {
  const geoData = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  }).send();

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  } else {
    newListing.image = {
      url: defaultImg,
      filename: "default-unsplash"
    };
  }

  newListing.geometry = geoData.body.features[0]?.geometry || null;

  await newListing.save();
  req.flash("success", "New listing created");
  res.redirect("/listings");
};

// 🔎 SHOW Listing
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};

// ✏️ RENDER EDIT FORM
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const OriginalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
  res.render("listings/edit", { listing, OriginalImageUrl });
};

// ♻️ UPDATE Listing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
    await listing.save();
  }

  req.flash("success", "Listing updated");
  res.redirect(`/listings/${listing._id}`);
};

// ❌ DELETE Listing
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};
