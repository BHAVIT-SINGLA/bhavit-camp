var express= require("express")
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware/index.js");
var flash=require("connect-flash");


router.get("/",function(req,res)
{
   Campground.find({},function(err,campgrounds)
 {
   if(err)
   {
     console.log(err);
   }
   else {
     {
         res.render("campgrounds",{campground:campgrounds,message: req.flash("success")});
     }
   }

 })

});

router.post("/",middleware.isLoggedIn,function(req,res)
{
  var name=req.body.name;
  var image=req.body.image;
  var description=req.body.description;
  var id=req.user._id;
  var author_name=req.user.username;

  var camp={name:name,image:image,description:description,
  author:{
    id:id,
    username:author_name
  }};

  Campground.create(camp,function(err,nwecamp)
{
  if(err)
  {
    consloe.log(err);
  }
  else {
    res.redirect("/campground");
  }
})

//  campground.push(camp);

})
//new
router.get("/new",middleware.isLoggedIn,function(req,res)
{
//  console.log(req.user);
  res.render("newcampground");
})
//==============================
//show
router.get("/:id",function(req,res)
{
  Campground.findById(req.params.id).populate("comments").exec(function(err,campground)
{
  if(err)
  {
    console.log(err);
  }
  else {
    //console.log(campground);
    res.render("show",{campground:campground})
  }
})

})
//========================================
// update
router.get("/:id/edit",middleware.campground_authorised,function(req,res)
{

  Campground.findById(req.params.id,function(err,campground)
{    res.render("editcamp",{campground:campground});
})


})
//==============================
//update put
router.put("/:id",middleware.campground_authorised,function(req,res)
{


  var name=req.body.name;
  var image=req.body.image;
  var description=req.body.description;
  var camp={name:name,image:image,description:description,
  };
  Campground.findByIdAndUpdate(req.params.id,camp,function(err,ucamp)
{
    if(err)
    {
      console.log(err)

    }
    else {


      res.redirect("/campground/"+req.params.id);
    }
});
//==============================================
//delete route
})
router.delete("/:id",middleware.campground_authorised,function(req,res)
{
  Campground.findByIdAndRemove(req.params.id,function(err)
{
  if(err)
  {
    console.log(err);;
  }
  else
  {
    res.redirect("/campground");
  }
})
})

module.exports=router;
