var express = require('express');
var router = express.Router();
var query=require('../queries/registration');

router.get('/:id', function(req, res, next) {
    async function regis(){
      console.log('registration');
      var student=await query.getStudent(req.params.id);
    var person={
      id: req.params.id,
      term_id : student.term_id,
      available_dept : student.dept
    };
    var reg=await query.courseRegistration(person);
    //console.log(reg);
    if(reg.alreadyRegistered==true){
      res.render('registeredCourses',{
        std_id : req.params.id,
        student: student,
        total_credit_hour : reg.total_credit_hour,
        courses :reg.courses
      });
    }else{
      res.render('offeredCourses',{
        std_id : req.params.id,
        student: student,
        total_credit_hour : reg.total_credit_hour,
        courses :reg.courses
      });
    }
    }
     regis();
   });

   router.post('/approve/:id',function(req,res,next){
    async function approve(){
        var check=req.body.check;
        var term=req.body.term;
        if(check!= undefined){
          if(Array.isArray(check)){
            var courses=[]
            for(var i=0;i<check.length;i++){
              courses.push(check[i]);
            }
          }else{
            var courses=check;
          }
          var person={
            id : req.params.id,
            term_id : term
          }
          await query.approveRegistration(person,courses);
          res.redirect('/registration/'+req.params.id);
        }else{
          res.redirect('/registration/'+req.params.id);
        }
    }
    approve();
   });
   module.exports=router;