const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const app=express();

// Passport Config
require('./config/passport')(passport);

// Routes
const auth=require('./routes/auth');

const PORT=process.env.PORT||3000;

app.get('/',(req,res)=>{
  res.send('It Works');
});

// Use Routes
app.use('/auth',auth);

app.listen(PORT,()=>{
  console.log(`Server started on port ${PORT}`);
});
