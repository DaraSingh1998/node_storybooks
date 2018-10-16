const express = require('express');
const mongoose = require('mongoose');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const passport = require('passport');
const {User}=require('./models/User');

const app=express();

const PORT=process.env.PORT||3000;

// Passport Config
require('./config/passport')(passport);
// Kyes config
const keys=require('./config/keys');

// Routes
const auth=require('./routes/auth');

// Map Global Promisses
mongoose.Promise=global.Promise;

// mongoose Connect
mongoose.connect(keys.mongoURI,{ useNewUrlParser: true })
  .then(()=>{
    console.log('MongoDb Connected');
  })
  .catch(err=>{
    console.log(err);
  });

// MiddleWares

// Cookir Parser
app.use(cookieParser())

// Express Session
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());

// Set Global Variables
app.use((req,res,next)=>{
  res.locals.user=req.user||null;
  next();
});

app.get('/',(req,res)=>{
  res.send('It Works');
});

// Use Routes
app.use('/auth',auth);

app.listen(PORT,()=>{
  console.log(`Server started on port ${PORT}`);
});
