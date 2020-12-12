var express = require('express');
var router = express.Router();
var grades=require('../queries/grade');

router.get('/:id',function(req,res,next){
    async function terms(){
        var terms=await grades.getSessions(req.params.id);
        res.render('grade',{std_id : req.params.id,terms: terms});
    }
    terms();
    
});

router.post('/show/:id',function(req,res,next){
    async function grd(){
        console.log('session: ',req.body.session);
        if(req.body.session!= ''){
            var student={
                id: req.params.id,
                term: req.body.session
            };
            var terms=await grades.getSessions(req.params.id);
            var term_id=req.body.session;
            var std_id=req.params.id;
            var term=await grades.academicTerm(term_id);
            var std=await grades.std_dept(std_id);
            var avg=await grades.avgCgpa(std_id,term_id);
            var gpa=await grades.getCgpa(std_id,term_id);
            var grade=await grades.termGrade(student);   
               console.log(avg);
               console.log(gpa); 
            
            res.render('show_grade',{
                terms: terms,
                term: term,
                std : std,
                avg: avg,
                gpa: gpa,
                grades: grade
            });
        }else{
            res.redirect('/grade/'+req.params.id);
        }
    }
    grd();
});



module.exports=router;