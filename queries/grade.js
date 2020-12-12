var oracledb=require('oracledb');

var config={
    user: 'biis',
    password:'biis',
    connectString: 'localhost:1521/DATABASE'
}

async function getSessions(std_id){
    let conn
    try{    
        conn=await oracledb.getConnection(config);
        var trm=await conn.execute(
            'select distinct r.term_id,t.lvl,t.trm,t.sssn'+
            ' from registration r join academic_term t'+
            ' on t.term_id=r.term_id '+
            ' where r.student_id=: id and r.published=1 and r.obtained_grade_point is not null order by term_id desc',
            [std_id]
        );
        var terms=[]
        for(var i=0;i<trm.rows.length;i++){
            terms.push({
                term_id: trm.rows[i][0],
                level :trm.rows[i][1],
                term: trm.rows[i][2],
                session: trm.rows[i][3]

            });
        }
        
        return terms;
    }catch(e){
        console.log('error :',e);
    }finally{
        if(conn){
            await conn.close();
        }
    }
}

async function academicTerm(term_id){
    let conn
    try{    
        conn=await oracledb.getConnection(config);
        var trm=await conn.execute(
            'select lvl,trm,sssn from academic_term where term_id=: term_id',
            [term_id]
        );
        var term={            
                level :trm.rows[0][0],
                term: trm.rows[0][1],
                session: trm.rows[0][2]

            };
        
        
        return term;
    }catch(e){
        console.log('error :',e);
    }finally{
        if(conn){
            await conn.close();
        }
    }
}
async function termGrade(std){
    let conn
    let query="select r.course_id,c.course_title,c.credit_hour,nvl((select g.grade from grades g where g.grade_point=r.obtained_grade_point),'-'),nvl(r.obtained_grade_point,0) from registration r join courses c on r.course_id=c.course_id where r.student_id='"+std.id+"' and r.term_id='"+std.term+"'";
    try{    
        console.log('hello');
        conn=await oracledb.getConnection(config);
        var grd=await conn.execute(query);
        grades=[]
        for(var i=0;i<grd.rows.length;i++){
            grades.push({
                course_no: grd.rows[i][0],
                title: grd.rows[i][1],
                cr_hr :grd.rows[i][2],
                grade :  grd.rows[i][3],
                grade_point : grd.rows[i][4]
            });
        }
        return grades;
    }catch(e){
        console.log('error :',e);
    }finally{
        if(conn){
            await conn.close();
        }
    }
} 

async function avgCgpa(std_id,term_id){
    let conn
    try{    
        conn=await oracledb.getConnection(config);
        var grd=await conn.execute(
            'select trunc(avg(sum(nvl((select r.obtained_grade_point from registration r where r.student_id =: std_id and r.course_id=c.course_id and r.term_id=c.term_id),0)*(select c1.credit_hour from courses c1 where c1.course_id=c.course_id))/ (sum((select c1.credit_hour from courses c1 where c1.course_id=c.course_id)))),2) from courseinterm c where c.available_dept =(select dept_id from students where student_id =: std_id) and c.term_id in(select distinct term_id from registration where student_id=:std and term_id <=: term_id and published=1) group by c.term_id',

                [std_id,std_id,std_id,term_id]
            );
            
        return grd.rows[0][0];
    }catch(e){
        console.log('error :',e);
    }finally{
        if(conn){
            await conn.close();
        }
    }
}

async function getCgpa(std_id,term_id){
    let conn
    try{    
        conn=await oracledb.getConnection(config);
        
        var grd=await conn.execute(
            'select trunc(sum(nvl((select r.obtained_grade_point from registration r where r.published=1 and r.student_id =: std_id and r.course_id=c.course_id and r.term_id=c.term_id),0)*(select c1.credit_hour from courses c1 where c1.course_id=c.course_id))/ (sum((select c1.credit_hour from courses c1 where c1.course_id=c.course_id))),2) from courseinterm c where c.available_dept =(select dept_id from students where student_id=:std_id) and c.term_id =: term_id',
            [std_id,std_id,term_id]
        );
        console.log(grd.rows[0][0]);
        var registered_crhr=await conn.execute(
            'select sum(c.credit_hour) from registration r join courses c on r.course_id=c.course_id where r.published=1 and r.student_id=: std_id and r.term_id=: term_id ',
            [std_id,term_id]
        );
            console.log(registered_crhr.rows[0][0]);
        var earned_credit=await conn.execute(
            'select sum(c.credit_hour) from registration r join courses c on r.course_id=c.course_id where r.published=1 and r.student_id=: std_id and r.term_id=: term_id and r.obtained_grade_point <>0 ',
            [std_id,term_id]            
        );
        console.log(earned_credit.rows[0][0]);
        var total_crhr=await conn.execute(
            'select sum(sum(c.credit_hour)) from registration r join courses c on r.course_id=c.course_id where r.published=1 and r.student_id=: std_id and r.term_id<=: term_id and r.obtained_grade_point <>0 group by r.term_id ',
            [std_id,term_id]            
    );
    console.log(total_crhr);
        var grade={
            cgpa: grd.rows[0][0],
            registered_crhr: registered_crhr.rows[0][0],
            earned_crhr: earned_credit.rows[0][0],
            total_crhr: total_crhr.rows[0][0]
        }
        console.log(grade);
        return grade;
    }catch(e){
        console.log('error :',e);
    }finally{
        if(conn){
            await conn.close();
        }
    }
}
async function std_dept(std_id){
    let conn
    try{    
        conn=await oracledb.getConnection(config);
        var student=await conn.execute(
            'select s.student_name,d.dept_name from students s join departments d on s.dept_id=d.dept_id where s.student_id=: std_id',
            [std_id]
        );
        var std={
            std_id: std_id,
            name: student.rows[0][0],
            dept : student.rows[0][1]
        }
        
        return std;
    }catch(e){
        console.log('error :',e);
    }finally{
        if(conn){
            await conn.close();
        }
    }
}
module.exports.getSessions=getSessions;
module.exports.getCgpa=getCgpa;
module.exports.avgCgpa=avgCgpa;
module.exports.termGrade=termGrade;
module.exports.academicTerm=academicTerm;
module.exports.std_dept=std_dept;
