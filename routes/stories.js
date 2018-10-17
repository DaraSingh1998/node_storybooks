const express = require('express');
const router=express.Router();
const {ensureAuthenticated,ensureGuest}=require('../helpers/auth.js');

router.get('/',(req,res)=>{
  res.render('stories/index');
});

// Add Stories
router.get('/add',ensureAuthenticated,(req,res)=>{
  res.render('stories/add');
});

module.exports=router;
