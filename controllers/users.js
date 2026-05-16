const User=require("../models/user.js");
module.exports.renderSignUp=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.SignUp=async(req,res)=>{
try{
    let {username,email,password}=req.body;
    console.log(username)
    let newUser=new User({email,username});
    let registerdUser=await User.register(newUser,password);
    // console.log(registerdUser);
    req.login(registerdUser,(err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","Logged in");
        res.redirect("/listings");
    })
    // req.flash("success","Welcome to WanderLust");
    // res.redirect("/listings")
}catch(err){
    req.flash("error","User is already registerd")
    res.redirect("/signup")
}
    
}

module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login=async(req,res)=>{
        req.flash("success","Welcome to WanderLust");
        let redirectUrl=res.locals.redirectUrl||"/listings"
        res.redirect(redirectUrl);
    }

module.exports.logout=(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","Logged Out!");
        res.redirect("/listings");
    })
}