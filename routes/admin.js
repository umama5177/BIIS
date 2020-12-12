var express = require('express');
var router = express.Router();
var query=require('../queries/admin');
var query2=require('../queries/registration');


router.get('/',function(req,res,next){
    res.render('adminIndex',{msg:''});
  });
  router.get('/home',function(req,res,next){
    res.render('inputStudent',{msg:''});
  });
  router.get('/publish',function(req,res,next){
    async function publish(){
      var is_published_all=await query.is_all_published();
      var msg;
      if(is_published_all>0){
        msg='';
      }else{
        msg='No pending result, nothing to publish!';
      }
      res.render('publish',{msg:msg});
    }
    publish();
  });
  router.post('/publish_result',function(req,res,next){
      async function publish(){
          await query.publish();
          res.render('publish',{msg:'The result has been published'});

      }
      publish();
  });

router.post('/login', function(req,res){
    var person={
      userID: req.body.userID,
        password: req.body.password
    }
  
    async function signin(){
        var isUser=await query.signIn(person);
        if(isUser>0){
          user=person.userID;
          res.redirect('/admin/home');
        }else{
          res.render('adminIndex',{msg:'invalid password'});
        }
      }
    signin();
  });

  //get the available terms to update courses for corrsponding student id
router.get('/getTerms/:id',function(req,res,next){
  async function term(){
    var terms=await query.getTerms(req.params.id);    
    res.render('term',{std_id : req.params.id, terms :terms});
   }
   term();
});
  //get student id and show the available terms to update courses
  router.post('/getstudent',function(req,res,next){
    var student=req.body.student_id;
    res.redirect('/admin/getTerms/'+student);
  });
  
  //get the courses to update the result
  router.post('/term/:id',function(req,res,next){
    var term=req.body.term;
    async function getCourses(){
      var person={
        id: req.params.id,
        termid: term
      };
      if(term==''){
        res.redirect('/admin/getTerms/'+req.params.id);
      }else{
        var student=await query.levelTerm(req.params.id,term);
      var courses=await query.getCourses(person);
      res.render('update_result',{student: student, courses: courses,error: []});
      }
    }
    getCourses();
  });

  router.post('/updateResult/:id',function(req,res,next){
    async function updateGrade(){
    var term=req.body.term;
    var grades=req.body.grade;
    var course=req.body.courses;    
    var courses=[]
    var valid_grades=['4.00','3.75','3.25','3.50','3.00','2.75','2.50','2.25','2.00','0.00'];
    var errors=[]
    for(var i=0;i<course.length;i++){
      var gr=parseFloat(grades[i]).toFixed(2);
      var g=gr.toString();
      if(valid_grades.indexOf(g)==-1){
        errors.push(course[i]);
      }
      courses.push({
        id: course[i],
        grade: grades[i]
      });
    }
    
    var person={
      id: req.params.id,
      termid: term
    };
    
      await query.updateCGPA(courses,term,req.params.id);
      var student=req.params.id;
      if(errors.length>0){
        var student=await query.levelTerm(req.params.id,term);
        var courses=await query.getCourses(person);
        res.render('update_result',{student: student, courses: courses,error: errors});
      }else{
        res.redirect('/admin/home');
      }
  }
  updateGrade();
  });
  module.exports=router;