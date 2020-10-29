var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var flash=require("connect-flash");
router.get("/", function(req, res){
    res.redirect("/campground");
});


router.get("/register", function(req, res){
   res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error",err.message);
             res.redirect("back");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success","Successfully registered")
           res.redirect("/campground");
        });
    });
});

//show login form
router.get("/login", function(req, res){

   res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campground",
        failureRedirect: "/login"
    }), function(req, res){

});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success","Logged out successfully")
   res.redirect("/campground");
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
console.log(router);

module.exports = router;
