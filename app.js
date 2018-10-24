const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs=require('express-handlebars');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const passport = require('passport');
const {User}=require('./models/User');
const {Story}=require('./models/Story');
// require('./models/User');
// require('./models/Story');

const app=express();

const PORT=process.env.PORT||3000;

// Passport Config
require('./config/passport')(passport);
// Kyes config
const keys=require('./config/keys');

// Helpers
const{truncate,stripTags,formatDate,select}=require('./helpers/hbs');

// mongoose Connect
mongoose.connect(keys.mongoURI,{ useNewUrlParser: true })
  .then(()=>{
    console.log('MongoDb Connected');
  })
  .catch(err=>{
    console.log(err);
  });

// Routes
const auth=require('./routes/auth');
const index=require('./routes/index');
const stories=require('./routes/stories');

// Map Global Promisses
mongoose.Promise=global.Promise;

// MiddleWares

// Express Handlebars
app.engine('handlebars', exphbs({
  helpers:{
    truncate:truncate,
    stripTags:stripTags,
    formatDate:formatDate,
    select:select
  },defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

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

// Boby-Parser MiddleWare
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set Global Variables
app.use((req,res,next)=>{
  res.locals.user=req.user||null;
  next();
});

// Set Static folder
app.use(express.static(path.join(__dirname,'public')));

// Use Routes
app.use('/auth',auth);
app.use('/',index);
app.use('/stories',stories);

app.listen(PORT,()=>{
  console.log(`Server started on port ${PORT}`);
});
