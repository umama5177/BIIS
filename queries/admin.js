const { autoCommit } = require('oracledb');
var oracledb=require('oracledb');

var config={
    user: 'biis',
    password:'biis',
    connectString: 'localhost:1521/DATABASE'
}


async function signIn(person){    
    let connection
    let query="select psswrd  from admin  where id='"+person.userID+"' and psswrd= hash_password('"+person.password+"')"; 
    try{
        connection=await oracledb.getConnection(config);
        const result=await connection.execute(query);
        var user = result.rows.length;
        console.log(user);
        console.log(person.userID);
        return user;
    }catch(e){
        console.log("Error occured: ",e);
        
    }finally{
        if(connection){
            await connection.close();
        }
    }
    
}

async function getTerms(std_id){
    let connection
    let query="select distinct(term_id) from registration where student_id= '"+std_id+"' order by term_id desc";
    
    try{
        connection=await oracledb.getConnection(config);
        const result=await connection.execute(query);
        var terms=[]
        for(var i=0;i<result.rows.length;i++){
            terms.push(result.rows[i][0]);
        }
        return terms;
    }catch(e){
        console.log(e);
    }finally{
        if(connection){
            await connection.close();
        }
    }
}

async function updateCGPA(courses,term_id,std){
    let connection
    try{
        connection=await oracledb.getConnection(config);
        for (const course of courses) {
            let query="update registration set obtained_grade_point="+course.grade+" where student_id="+std+" and course_id='"+course.id+"' and term_id='"+term_id+"'";
            let query2="commit";
            const result=await connection.execute(query);
            const result2 = await connection.execute(query2);
        }
    }catch(e){
        console.log(e);
    }finally{
        if(connection){
            await connection.close();
        }
    }
}

async function getCourses(student){
    let connection
    let query="select course_id, nvl(obtained_grade_point,0) from registration where student_id ='"+student.id+"' and term_id ='"+student.termid+"'  ";
    try{
        connection=await oracledb.getConnection(config);
        const result=await connection.execute(query);
        var courses=[]
        for(var i=0;i<result.rows.length;i++){
            courses.push({
                course_id: result.rows[i][0],
                grade : result.rows[i][1]
            });
        }
        console.log(result);
        return courses;
    }catch(e){
        console.log(e);
    }finally{
        if(connection){
            await connection.close();
        }
    }
}
async function levelTerm(std,termId){
    let connection
    try{
        connection=await oracledb.getConnection(config);
        var result=await connection.execute(
            'select lvl,trm,sssn from academic_term where term_id =: term',
            [termId]
        );
        var student={
            id: std,
            term_id: termId,
            level: result.rows[0][0],
            term: result.rows[0][1],
            session: result.rows[0][2]
        }
        return student;
    }catch(e){
        console.log(e);
    }finally{
        if(connection){
            await connection.close();
        }
    }
}
async function publish(){
    let connection
    let query="update registration set published=1";
    let query2="commit";
    try{
        connection=await oracledb.getConnection(config);
        var result=await connection.execute(query);
        var result2=await connection.execute(query2);

    }catch(e){
        console.log(e);
    }finally{
        if(connection){
            await connection.close();
        }
    }
}
async function is_published_all(){
    let connection
    let query="select count(*) from registration where published=0";
    try{
        connection=await oracledb.getConnection(config);
        var result=await connection.execute(query);
        var is_all_published=result.rows[0][0];
        return is_all_published;
    }catch(e){
        console.log(e);
    }finally{
        if(connection){
            await connection.close();
        }
    }
}

module.exports.signIn=signIn;
module.exports.getTerms=getTerms;
module.exports.updateCGPA=updateCGPA;
module.exports.getCourses=getCourses;
module.exports.levelTerm=levelTerm;
module.exports.publish=publish;
module.exports.is_all_published=is_published_all;