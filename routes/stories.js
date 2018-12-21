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
    .sort({date:'desc'})
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

// Edit Stories
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
  Story.findOne({
    _id:req.params.id
  })
  .then(story=>{
    if(story.user!=req.user.id){
      res.redirect('/stories');
    }
    else{
      res.render('stories/edit',{
        story:story
      });
    }
  });
});

// Show Single Stories
router.get('/show/:id',(req,res)=>{
  Story.findOne({
    _id:req.params.id
  })
  .populate({path:'user',model:User})
  .populate('comments.commentUser')
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

// Edit Form Process
router.put('/:id',(req,res)=>{
  Story.findOne({
    _id:req.params.id
  })
  .then(story=>{
    let allowComments;
    // Check If allowComments is present or not
    if(req.body.allowComments){
      allowComments=true;
    }else {
      allowComments=false;
    }
    // Set New Values
    story.title=req.body.title;
    story.body=req.body.body;
    story.status=req.body.status;
    story.allowComments=allowComments;

    story.save()
      .then(story=>{
        res.redirect('/dashboard');
      })
  });
});

// Delete Story
router.delete('/:id',(req,res)=>{
  Story.deleteOne({_id:req.params.id})
    .then(()=>{
      res.redirect('/dashboard');
    });
});

// Add Comments
router.post('/comment/:id',(req,res)=>{
  Story.findOne({
    _id:req.params.id
  })
    .then(story=>{
      const newComment={
        commentBody:req.body.commentBody,
        commentUser:req.user.id
      }
      // Add to comment array
      story.comments.unshift(newComment);
      story.save()
        .then(story=>{
          res.redirect(`/stories/show/${story.id}`);
        })
    });
});


module.exports=router;
