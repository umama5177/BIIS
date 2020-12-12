var oracledb=require('oracledb');

var config={
    user: 'biis',
    password:'biis',
    connectString: 'localhost:1521/DATABASE'
}


async function approveRegistration(person,courses){
    let connection
   
    try{
        connection=await oracledb.getConnection(config);
        for (const course of courses) {
            let query="insert into registration values("+person.id+",'"+course+"','"+person.term_id+"',NULL,0)";
            let query2="commit";            
            const result=await connection.execute(query);               
            const result2 = await connection.execute(query2);              
           
        }
    }catch(e){
        console.log('error: ',e);
    }finally{
        if(connection){
            await connection.close;
        }
    }
}

async function courseRegistration(person){
    let connection
    let query="select course_id,(select course_title from courses c where c.course_id=r.course_id) course_title,(select credit_hour from courses c where c.course_id=r.course_id) credit_hour from registration r where student_id="+person.id+"and term_id='"+person.term_id+"'";
    let query1="select  sum(c.credit_hour) registered_credit_hours from registration r join courses c on(r.course_id=c.course_id) where r.student_id="+person.id+"and r.term_id='"+person.term_id+"'";
    try{
        connection=await oracledb.getConnection(config);
        var result=await connection.execute(query);
        var result2=await connection.execute(query1);        
        if(result.rows.length==0)
        {
            let query2="select course_id,(select course_title from courses c where c.course_id=t.course_id) course_title,(select credit_hour from courses c where c.course_id=t.course_id) credit_hour from courseinterm t where term_id='"+person.term_id+"' and available_dept='"+person.available_dept+"'";
            result=await connection.execute(query2);
            let query3="select sum(c.credit_hour) total_credit_hour from courses c join courseinterm  t on(c.course_id=t.course_id) where t.term_id='"+person.term_id+"' and available_dept='"+person.available_dept+"'";
            result2=await connection.execute(query3);    
            total_credit_hour=result2.rows[0][0];
            var alreadyRegistered=false;
            
        }else{
            total_credit_hour=result2.rows[0][0];
            var alreadyRegistered=true;
        }
        var courses=[];
            for(var i=0;i<result.rows.length;i++){
                courses.push({
                    course_id : result.rows[i][0],
                    course_title : result.rows[i][1],
                    cr_hr : result.rows[i][2]
                });        
            }
            var reg={
                alreadyRegistered: alreadyRegistered,
                total_credit_hour: total_credit_hour,
                courses : courses
            };
            return reg;
   
    }catch(e){
        console.log(e);
        
    }finally{
        if(connection){
            await connection.close();
        }
    }
}

async function getStudent(std){
    let connection
    try{
        connection=await oracledb.getConnection(config);
        var result=await connection.execute(
            'select s.student_name,s.term_id ,s.dept_id , t.lvl,t.trm,t.sssn '+
            'from students s join academic_term t '+
            'on t.term_id=s.term_id  '+
            'where student_id = :id', 
            [std]
        );
        var student={
            id: std,
            name: result.rows[0][0],
            term_id: result.rows[0][1],
            dept : result.rows[0][2],
            level: result.rows[0][3],
            term : result.rows[0][4],
            session :result.rows[0][5],
        };
        return student;
    }catch(e){
        console.log('error: ',e);
    }finally{
        if(connection) {
            await connection.close();
        }
    }
}
module.exports.courseRegistration=courseRegistration;
module.exports.approveRegistration=approveRegistration;
module.exports.getStudent=getStudent;