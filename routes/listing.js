const express = require("express");
const multer  = require('multer');

const router=express.Router();
const wrapAsync=require("../utils/wrapAsync")
// const Listing = require("../models/listing.js");
const listingController=require("../controllers/listings.js")
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js")
const {storage,cloudinary}=require("../cloudConfig.js");
const upload = multer({ storage,cloudinary});

router.route("/")
.get(wrapAsync(listingController.display))//display listing
.post(
    isLoggedIn,
     upload.single("listing[image]"),
    validateListing, 
     wrapAsync(listingController.createListing)
)
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateForm))
.delete( isLoggedIn,isOwner,wrapAsync(listingController.deleteForm));

router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.editForm));
module.exports=router