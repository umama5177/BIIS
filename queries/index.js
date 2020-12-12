var oracledb=require('oracledb');

var config={
    user: 'biis',
    password:'biis',
    connectString: 'localhost:1521/DATABASE'
}
let connection

async function signIn(person){    
    let query="select psswrd  from students  where student_id='"+person.userID+"' and psswrd= hash_password('"+person.password+"')"; 
    try{
        connection=await oracledb.getConnection(config);
        const result=await connection.execute(query);
        var user = result.rows.length;
        return user;
    }catch(e){
        console.log("Error occured: ",e);
        
    }finally{
        if(connection){
            await connection.close();
        }
    }
    
}


async function home(std_id){
    let query="select student_id,profile_picture,student_name,lvl,trm,sssn,hall_name,hall_status,(select dept_name from departments d where d.dept_id=s.dept_id) from students s join academic_term t on t.term_id=s.term_id where student_id='"+std_id+"' ";
    try{
        connection=await oracledb.getConnection(config);
        const result=await connection.execute(query);
        
        var student={
            id: result.rows[0][0],
            profile: result.rows[0][1],
            name: result.rows[0][2],
            level: result.rows[0][3],
            term: result.rows[0][4],
            session: result.rows[0][5],
            hall_name: result.rows[0][6],
            hall_status: result.rows[0][7],
            dept : result.rows[0][8]
        }
        console.log(student);
        return student;
    }catch(e){
        console.log("Error occured: ",e);
        
    }finally{
        if(connection){
            await connection.close();
        }
    }
    
}

async function adviser(std_id){
    let query="select i.ins_name,i.designation,i.profile_picture,(select dept_name from departments d where d.dept_id=i.dept_id)  from instructors i join students s on s.ins_id=i.ins_id where s.student_id="+std_id;
   
    try{
        connection=await oracledb.getConnection(config);
        const result=await connection.execute(query);
        
        var instructor={
            id: std_id,
            name: result.rows[0][0],
            designation: result.rows[0][1],
            profile: result.rows[0][2],
            dept: result.rows[0][3]
        }
        
        return instructor;
    }catch(e){
        console.log(e);
        
    }finally{
        if(connection){
            await connection.close();
        }
    }
}

async function passwordChange(person){
    let connection
    let query="update students set psswrd='"+person.newpassword+"' where student_id='"+person.id+"' ";
    let query2="commit";
    try{
        connection=await oracledb.getConnection(config);
        const result=await connection.execute(query);
        const result2 = await connection.execute(query2);
    }catch(e){
        console.log(e);
    }finally{
        if(connection){
            await connection.close();
        }
    }
}

module.exports.signIn=signIn;
module.exports.home=home;
module.exports.adviser=adviser;
module.exports.passwordChange=passwordChange;