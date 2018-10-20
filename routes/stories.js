const express = require('express');
const router=express.Router();
const mongoose=require('mongoose');
const path = require('path');
// const Story = mongoose.model('stories');
// const User = mongoose.model('users');
const {Story}=require('../models/Story');
const {User}=require('../models/User');
const {ensureAuthenticated,ensureGuest}=require('../helpers/auth.js');

router.get('/',(req,res)=>{
  Story.find({status:'public'})
    // .populate('user')
    .populate({path:'user',model:User})
    .then(stories=>{
      res.render('stories/index',{
        stories:stories
      });
    });
});

// Add Stories
router.get('/add',ensureAuthenticated,(req,res)=>{
  res.render('stories/add');
});

// Show Single Stories
router.get('/show/:id',(req,res)=>{
  Story.findOne({
    _id:req.params.id
  })
  .populate({path:'user',model:User})
  .then(story=>{
    res.render('stories/show',{
      story:story
    });
  });
});

// Post Stories
router.post('/',(req,res)=>{
  let allowComments;
  // Check If allowComments is present or not
  if(req.body.allowComments){
    allowComments=true;
  }else {
    allowComments=false;
  }
  const newStory={
    title:req.body.title,
    body:req.body.body,
    status:req.body.status,
    allowComments:allowComments,
    user:req.user.id
  }
  // Create Story
  new Story(newStory)
    .save()
    .then(story=>{
      res.redirect(`/stories/show/${story.id}`);
    });
});

module.exports=router;
