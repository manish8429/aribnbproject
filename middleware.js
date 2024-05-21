const Listing = require("./models/listing.js");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to Add New Listing");
        return res.redirect("/login");
      }
      next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
}
next();
};

module.exports.isOwner = async (req, res, next) =>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.Owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You Don,t have to permission to edit");
    return res.redirect(`/listings/${id}`);
}
next();
};

module.exports.validateListing = (req, res, next) =>{
  let (error) = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.mrssage).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let {error } = reviewSchema.validate(req.body);
  if(error) {
      let errMsg = error.details.map((el) => el.message).join(",");
   throw new ExpressError (400, errMsg);
  } else {
      next();
  }
};