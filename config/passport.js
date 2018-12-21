const GoogleStrategy=require('passport-google-oauth20').Strategy;
const passport = require('passport');
const mongoose = require('mongoose');
const keys=require('./keys');
const {User}=require('../models/User');

module.exports=function () {
  passport.use(
    new GoogleStrategy({
      clientID:keys.googleClientID,
      clientSecret:keys.googleClientSecret,
      callbackURL:'/auth/google/callback',
      proxy:true
    },(accessToken, refreshToken, profile,done)=>{
      // console.log(accessToken);
      // console.log(profile);
      const image=profile.photos[0].value.substring(0,profile.photos[0].value.indexOf('?'));
      const newUser={
        googleID:profile.id,
        firstName:profile.name.givenName,
        lastName:profile.name.familyName,
        email:profile.emails[0].value,
        img:image
      }
      User.findOne({
        googleID:profile.id
      }).then(user=>{
        if(user){
          // Return User
          done(null,user);
        }else{
          // Create User
          new User(newUser)
            .save()
            .then(user=>done(null,user));
        }
      });done(null, profile);
    })
  );
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
  done(err, user);
  });
});
}
