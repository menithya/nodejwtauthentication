var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./models/user'); // get our mongoose model
var mongoose = require('mongoose');

mongoose.connect(config.database);


var app = express();
var router = express.Router();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('superSecret',config.secret);
console.log(config.database);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.post('/login',function(req,res){

   console.log(req.body.name)
  User.findOne({
    name:req.body.name
  },function(err,user){
    if(err) throw err;

    if(!user){
      res.json({sucess:false,message:'user not found'})
    }else{
             console.log(req.body.password)
      if(req.body.password !== user.password){
        res.json({
          sucess:false,
          message:"Wrong passwrod"
        })
      }else{
        var token=jwt.sign(user,req.app.get('superSecret'));
        res.json({
          sucess:true,
          message:"Hello",
          token:token
        })
      }
      
    }
  })
})
//--------------------------------------------------------------
  //protect routes
//------------------------------------------------------------------

app.use(function(req,res,next){
  var token=req.body.token || req.param('token') || req.headers['x-acess-token'];
  if(token){
    jwt.verify(token,app.get('superSecret'),function(err,decoded){
      if(err){
        return res.json({success:false,message:'invalid token'})
      }else{
        req.decoded=decoded;
        next();
      }
    })
  }else{
    return res.status(403).send({ 
      success: false, 
      message: 'No token provided.'
    });
  }
});
app.use('/users', users);

app.get('/setup', function(req, res) {

  // create a sample user
  var nithya = new User({ 
    name: 'nithya', 
    password: 'password',
    admin: true 
  });

  // save the sample user
  nithya.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
