const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");



// index rought
router.get("/",  wrapAsync (async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
  }));
  
  
  // new route api
  router.get("/new", isLoggedIn,(req, res)=> {
      res.render("./listings/new.ejs");
  });
  
  // show rought api
  router.get("/:id", async(req, res) => {
      let {id} = req.params;
      const listing = await Listing.findById(id)
      .populate({ 
        path: "reviews", 
        populate: {
        path: "author",
        // console.log()
      },
      })
      .populate("Owner");
      if(!listing) {
        req.flash("success", "Listing Does Not Exist");
        res.redirect("/listing");
      }
      res.render("./listings/show.ejs", {listing});
  });
   
  
// Create Rought api
router.post("/",
isLoggedIn,

        async (req, res, next) => {
   let {title,description,location,country,price,image} = req.body.listing;
   image = {
    url: image,
    filename: "",
   };
   const newListing = new Listing({title,description,location,country,price,image});
   newListing.Owner = req.user._id;
     const listing =  await newListing.save();
     req.flash("success", "New Listing Created");
       res.redirect("/listings");
    
  }
);

// Edit rought
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync ( async (req, res) => {
   let {id} = req.params;
   const listing = await Listing.findById(id);
   if(!listing) {
    req.flash("success", "Listing Does Not Exist");
    res.redirect("/listing");
  }
   res.render("./listings/edit.ejs", {listing});
}));

// update Rought
router.put("/:id",
isLoggedIn,
isOwner,
//  validateListing,
wrapAsync ( async (req, res) => {
   let { id } = req.params;
   const {title,description,location,country,price,image} = req.body.listing
   await Listing.findByIdAndUpdate(id, {title,description,location,country,price,image:{url:image}});
   req.flash("success", "Listing Updated");
   res.redirect(`/listings/${id}`);
 }));



 // Delete Rought
 router.delete("/:id", isLoggedIn, isOwner, wrapAsync (async (req, res) => {
   let { id } = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success", "Listing Deleted");
   res.redirect("/listings");
 }));


 module.exports= router;
