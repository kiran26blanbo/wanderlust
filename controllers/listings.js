const listings = require("../models/listing.js");
const Listing = require("../models/listing.js");

//display listing
module.exports.display=async (req, res) => {
  let data = await Listing.find({});
  res.render("./listings/home.ejs", { data })
}

//create listing
module.exports.renderNewForm=(req, res) => {
  res.render("listings/new.ejs");
}

module.exports.showListing=async (req, res) => {
  let { id } = req.params;
  let eachData = await Listing.findById(id).populate({
    path:"reviews",
    populate:{path:"author"},
  }).populate("owner");
  if(!eachData){
    req.flash("error","Listing Not Found");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { eachData });
  console.log(eachData);
}

module.exports.createListing=async (req, res, next) => {
  let url=req.file.path
  let filename=req.file.filename
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  newListing.image={url,filename}
  await newListing.save();
  req.flash("success","New listing added");
  res.redirect("/listings");
}

module.exports.editForm=async (req, res) => {
  let { id } = req.params;
  // console.log(id)
  let eachData = await Listing.findById(id);
  if(!eachData){
    req.flash("error","Listing Not Found");
    return res.redirect("/listings");
  }
  // let originalImage=eachData.image.url;
  // console.log(originalImage)
  // originalImage= originalImage.replace("/upload","/upload/w_250")
  res.render("./listings/edit", { eachData});
}

module.exports.updateForm=async (req, res) => {
   const { id } = req.params;
  let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   let url=req.file.path
  let filename=req.file.filename
  if(typeof req.file!="undefined"){
    listing.image={url,filename}
    await listing.save()
  }
  req.flash("success"," listing Updated");
  res.redirect(`/listings/${id}`);
}
module.exports.deleteForm=async (req, res) => {
  let { id } = req.params;
  const deleteddata = await Listing.findByIdAndDelete(id);
  console.log("new content", deleteddata);
  req.flash("success"," listing deleted");
  res.redirect("/listings");
}