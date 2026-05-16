if(process.env.NODE_ENV!="production"){
require('dotenv').config({ quiet: true })
}
const express = require("express");
const path = require("path")
const methodOverride = require("method-override");
const app = express();

const engine = require('ejs-mate');
app.engine('ejs', engine);
const mongoose = require("mongoose");
// const wrapAsync=require("./utils/wrapAsync")
// const Listing = require("./models/listing.js");
// const Review = require("./models/review.js");
// var cookieParser = require('cookie-parser');
const  session=require("express-session");
const flash=require("connect-flash")
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
const listings=require("./routes/listing.js")
const reviews=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const passport=require("passport");
const LocalStratergy=require("passport-local");


const User=require("./models/user.js")
const port = 8080;

main().then(() => { console.log("connection was succesful") }).catch((err) => {
  console.log(err);
})
async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // for JSON data  
app.use(express.urlencoded({ extended: true })); // for form data

app.use(methodOverride("_method"));

const sessionOptions={secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
cookie:{
  expires:Date.now + 7 *24*60*60*1000,
  maxAge:7 *24*60*60*1000,
  httpOnly:true
}}
app.use(session(sessionOptions));
app.use(flash());

//passport middleware
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStratergy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.curUser=req.user;
  next();
})

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/",userRouter);
app.use("/listings",listings)
app.use("/listings/:id/reviews",reviews);



//for inavlid route
app.all("*splat", async (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  res.render("error.ejs", { status, message });
});

app.listen(port, () => {
  console.log("port is running");
});