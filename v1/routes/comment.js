var express= require("express")
var router=express.Router({mergeParams:true});
var Campground=require("../models/campground");
var Comment =require("../models/comments");
var middleware=require("../middleware/index");
//===============================
//Comment New

router.get("/new",middleware.isLoggedIn,function(req,res)
{
  Campground.findById(req.params.id,(function(err,campground)
{
  if(err)
  {
    console.log(err);
  }
  else {
  //  console.log(campground);
    res.render("newcomment",{campground:campground})
  }
}))

});
//====================================
//post for new comment

router.post("/",middleware.isLoggedIn,function(req,res)
{

  var text=req.body.text;
  var id=req.user._id;
  var author_name=req.user.username
  var newcomment={
    author: {
      id: id,
      username:author_name
    },
    text: text
  }


    Campground.findById(req.params.id,function(err,campground)
  {
    if(err)
    {
      console.log(err);
    }
    else {
      Comment.create(newcomment,function(err,comment)
    {
      if(err)
      {
        consloe.log(err);
      }
      else {


        campground.comments.push(comment);
        campground.save();

        res.redirect("/campground/"+ campground._id);
      }
    })
    }
  })

});
//==============================
//UPDATE COMMENT

router.get("/:comment_id/edit",middleware.comment_authorised,function(req,res)
{
  Campground.findById(req.params.id,function(err,camp)
{
  if(err)
  {
    console.log(err);
  }
  else {
    Comment.findById(req.params.comment_id,function(err,comment)
  {
    if(err)
    {
      conslole.log(err);
    }
    else {
      res.render("editcomment",{comment:comment,campground:camp});
    }
  })
  }
})
})
///////////================================
//UPDATE COMMENT
router.put("/:comment_id",middleware.comment_authorised,function(req,res)
{
  var comment=
  {
    text: req.body.text,
  //  id: req.params.comment_id,
  //  username: req.user.username
  };
  Comment.findByIdAndUpdate(req.params.comment_id,comment,function(err,ucomment)
{
  if(err)
  {
    console.log(err);
  }
  else {
    res.redirect("/campground/"+ req.params.id);
  }
})
})
//=============================
//DELETE ROUTE
router.delete("/:comment_id",middleware.comment_authorised,function(req,res)
{
  Comment.findByIdAndRemove(req.params.comment_id,function(err,comment)
{
  if(err)
  {
    console.log(err);
  }
  else {
      req.flash("success","Successfully Destroyed comment")
      res.redirect("/campground/"+ req.params.id);
  }
})
})


module.exports=router;
