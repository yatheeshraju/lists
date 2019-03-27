const express = require('express');
const path  = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

//connect to db

mongoose.connect(config.database, {useNewUrlParser: true});
let db = mongoose.connection;
// check connection 
db.once('open',function () {
    console.log('connected to mongodb ....');
});
// check for db errors 
db.on('error',function (err) {
   console.log(err); 
});

// inti app
const app = express();

// bring in models 

let list_item = require('./models/listitem');

// load view engine 
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// set public folder 
app.use(express.static(path.join(__dirname,'public')));

//express session middleware 
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express messaging middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

//passport config 

require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// home route 
app.get('/',function (req,res) {
    list_item.find({},function (err,list_items) {
       if(err){
           console.log(err);
       }else{
        res.render('index',{
            title:'Lists',
            list_items:list_items
        });
       }
   });
    
});

// router files

let list = require('./routes/list');
let users = require('./routes/users');
app.use('/list',list);
app.use('/users',users);


var port = 8080
app.listen(port,'10.139.100.219',function () {
    console.log('server started on 80 .....');
});