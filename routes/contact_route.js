var express = require('express');
var router = express.Router();
var query=require('../queries/contact_query');

router.get('/:id',function(req,res,next){
    async function contact(){
        var student=await query.contactInfo(req.params.id);
        console.log(student);
        res.render('contactInfo',{std: student});
    }
    contact();
});
router.get('/edit/:id',function(req,res,next){
    async function contact(){
        var student=await query.contactInfo(req.params.id);
        res.render('edit',{std: student});
    }
    contact();
});

router.post('/edit/save/:id',function(req,res,next){
    var contact=req.body.contact.split(',');
    var student={
        id: req.params.id,
        phone: req.body.mobile,
        email: req.body.email,
        address: req.body.address,
        contact_person_name:contact[0],
        contact_person_number: contact[1] 
    }
   async function edit(){
       await query.edit(student);
       res.redirect('/contact_info/'+req.params.id);
   }
   edit();
});

module.exports=router;