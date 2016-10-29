var express = require('express');
var User   = require('./../models/user'); // get our mongoose model
var jwt    = require('jsonwebtoken');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});  

router.post('/login',function(req,res){

	 console.log(req.app)
	User.findOne({
		name:req.body.name
	},function(err,user){
		if(err) throw err;

		if(!user){
			res.json({sucess:false,message:'user not found'})
		}else{
             console.log(req.body.passwrod)
			if(req.body.password !== user.passwrod){
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
module.exports = router;
