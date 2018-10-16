const express = require('express');
const passport = require('passport');
const router=express.Router();

router.get('/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res)=> {
    res.redirect('/dashboard');
  });
router.get('/verify',(req,res)=>{
  if(req.user){
    console.log(req.user);
  }else {
    console.log('Not Authenticated');
  }
});
router.get('/logout',(req,res)=>{
req.logout();
res.redirect('/');
});

module.exports=router;
