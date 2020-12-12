var express = require('express');
var router = express.Router();
var query=require('../queries/index');
/* GET home page. */

router.get('/',function(req,res,next){
  res.render('index',{msg:''});
});

router.get('/logout/:id',function(req,res,next){
  res.render('index',{msg:''});
});

router.post('/signIn', function(req,res){
  var person={
    userID: req.body.userID,
      password: req.body.password
  }

  async function signin(){
      var isUser=await query.signIn(person);
      if(isUser>0){
        user=person.userID;
        res.redirect('/home/'+person.userID);
      }else{
        res.render('index',{msg:'invalid password'});
      }
    }
  signin();
});

router.get('/home/:id',function(req,res,next){
  
    async function home(){
      var student=await query.home(req.params.id);
      res.render('home',{std: student});
    }
    home();
  
});

router.get('/adviser/:id',function(req,res,next){
  async function adviser(){
    var instructor=await query.adviser(req.params.id);
    res.render('adviser',{instructor: instructor});
  }

  adviser();
});

router.get('/change_password/:id',function(req,res,next){
  console.log('password change');
  res.render('password',{msg: '',std_id : req.params.id});
});

router.post('/password/:id',function(req,res,next){
  var current=req.body.current;
  var password1=req.body.password;
  var password2=req.body.password2;
  var isValid=true;
  var person={
    userID: req.params.id,
    password: current
  }
  var person2={
    id: req.params.id,
    newpassword: password2
  }
  async function password(){
    var check=await query.signIn(person);
      if(check==0) {
        isValid=false;
      }
      console.log('check :',check);
    if(password1!= password2){
      isValid=false;
    }
      if(password1=='' || password2==''){
          isValid=false;
      }
      
      
      if(isValid){
          await query.passwordChange(person2);
          res.render('success',{std_id: req.params.id, msg: ''});
      }else{
        res.render('password',{msg :'password change unsuccesful', std_id: req.params.id});
      }
      
  }
  password();
});


module.exports = router;
