var connection=require("../config/database")
module.exports={
    read:function(){
        connection.connection.query("select * from users",(err,result)=>{
            console.log(result)
        })
    }
}