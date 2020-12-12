
var oracledb=require('oracledb');

var config={
    user: 'biis',
    password:'biis',
    connectString: 'localhost:1521/DATABASE'
}
let connection

async function contactInfo(std_id){
    let query="select s.student_id,s.student_name,s.mobile_number,s.contact_person_name,s.contact_person_number,s.address,t.lvl,t.trm,s.email,s.profile_picture from students s join academic_term t on t.term_id=s.term_id where s.student_id="+std_id;
    try{
        connection=await oracledb.getConnection(config);
        const result=await connection.execute(query);
        var student={
            id: result.rows[0][0],
            name: result.rows[0][1],
            mobile: result.rows[0][2],            
            c_name: result.rows[0][3],
            c_num: result.rows[0][4],
            address: result.rows[0][5],
            level: result.rows[0][6],
            term: result.rows[0][7],
            email: result.rows[0][8],
            profile: result.rows[0][9]
        };
        return student;
        
    }catch(e){
        console.log(e);
    }
}

async function edit(student){
    let query="update students set mobile_number='"+student.phone+"',email ='"+student.email+"',contact_person_name='"+student.contact_person_name+"',contact_person_number='"+student.contact_person_number+"',address='"+student.address+"' where student_id="+student.id;
    let query2="commit";
    try{
        const result=await connection.execute(query);      
        const result2 = await connection.execute(query2);
        
    }catch(e){
        console.log(e);
    }
}

module.exports.contactInfo=contactInfo;
module.exports.edit=edit;