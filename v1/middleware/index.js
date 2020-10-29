var Campground=require("../models/campground")
var Comment = require("../models/comments")
var User =require("../models/user");
var flash=require("connect-flash");
var middleware={};
//========================
//AUTHENTICATE
middleware.isLoggedIn=function(req,res,next)
{
  if(req.isAuthenticated())
  {
    return next();
  }
    req.flash("error","Please login first")
    res.redirect("/login")
}
//=================================
//COMMENT AUTHORISED
middleware.comment_authorised=function(req,res,next)
{
  if(req.isAuthenticated())
{
  Comment.findById(req.params.comment_id,function(err,comment)
{
  if(err)
  {
      req.flash("error","Comment not found");;
  }
  else {
    //conslole.log(campground)
    if(comment.author.id.equals(req.user._id))
    {
    //  console.log(campground.author.id);
    //  console.log(req.user._id);
    next();
  }
  else {
    req.flash("error","You are not authorised to do that");
      res.redirect("/login");
  }
  }
})
}
else {
  req.flash("error","You need to be logged in");
  res.redirect("/login");
}
}
//==============================
//Campground AUTHORISED
middleware.campground_authorised=function(req,res,next)
{
  if(req.isAuthenticated())
{
  Campground.findById(req.params.id,function(err,campground)
{
  if(err)
  {
    req.flash("error","Campground not found");
  }
  else {
    //conslole.log(campground)
    if(campground.author.id.equals(req.user._id))
    {
    //  console.log(campground.author.id);
    //  console.log(req.user._id);
    next();
  }
  else {
    req.flash("error","You are not authorised to do that");
    res.redirect("back");
  }
  }
})
}
else {
  req.flash("error","YOU NEED TO BE LOOGED IN");
  res.redirect("/login");
}

}
module.exports= middleware;
