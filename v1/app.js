var express=require("express");
var app=express();
var mongoose =require("mongoose");
var passport =require("passport");
var methodOverride=require("method-override")
var LocalStrategy =require("passport-local");
var passportLocalMongoose= require("passport-local-mongoose");
var flash=require("connect-flash");
var Campground=require("./models/campground")
var Comment = require("./models/comments")
var User =require("./models/user");
var bodyParser=require("body-parser")
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost:27017/yelpcamp",{useNewUrlParser: true,
useUnifiedTopology: true});
var indexRoute      =require("./routes/index")
var campgroundRoute =require("./routes/campground");
//;
var commentRoute    =require("./routes/comment");
app.set('view engine','ejs');
app.use(flash());
app.use(require("express-session")(
  {
    secret : "Bhavit",
    resave: false,
    saveUninitialized: false
  }
))


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.deserializeUser(User.deserializeUser());
passport.serializeUser(User.serializeUser());

var seedDB= require("./seeds")
//schema
//seedDB();
app.use(function(req, res, next){
  console.log(req.user);
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success= req.flash("success");
   next();
});
app.use("/",indexRoute);
app.use("/campground",campgroundRoute);
app.use("/campground/:id/comment",commentRoute);


app.listen(3000,function()
{
  console.log("Server has started");
});