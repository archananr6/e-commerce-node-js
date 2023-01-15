require("dotenv").config();
const moduleName = require("./config/express");
const sql = require("./config/database");
let mysql = require("mysql");
var bcrypt = require("bcrypt-nodejs");

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "ecom_db",
});
connection.connect((err) => {
  if (err) {
    return console.error("error: " + err.message);
  }

  console.log("Connected to the MySQL server.");
});
const jwt = require("jsonwebtoken");
const req = require("express/lib/request");
const secretKey = "archana";

moduleName.app.get("/post",moduleName.urlencodedParser,authenticateToken,(req, res) => {
    console.log(res);
    res.json("hello");
  }
);

//Register
moduleName.app.post("/register", (req, res) => {

  connection.query(`INSERT INTO signup ( name, email, password,user_type) VALUES ("${req.body.name}", "${req.body.email}",  "${bcrypt.hashSync(req.body.password, null, null)}","${"user"}")`,
    function (err, result) {
      if (err) console.log(`Error executing the query - ${err}`);
      else console.log("Result: ", result);
      res.json(result);
    }
  );
});

//Login
moduleName.app.post("/login", (req, res) => {
  console.log(req.body)
  const email = req.body.username;
  const password = req.body.password;
  const query = `select * from signup where email = '${email}'`;
  connection.query(query, (err, result) => {
    console.log(result)
    if(result.length==0){
      res.json({message: "Invalid username or password",invalid:true});
    }
    else{
        username = result[0].email;
     loginpassword =result[0].password; 
     let userId = result[0].id;
    let usertype = result[0].user_type;
    if (username === email && bcrypt.compareSync(password, loginpassword)) {
      const acessToken = jwt.sign(username, secretKey);
      res.send(JSON.stringify({ acessToken: acessToken,userId:userId,usertype:usertype,inavlid:false}));

    } 
    }
    
  });
});


//page
// moduleName.app.get("/getproduct", authenticateToken, (req, res) => {
//     connection.query("select * from productlist;", (err, result) => {
//     res.json(result);
//   });
// });

//fashion

moduleName.app.get("/getfashion", (req, res) => {
    connection.query("select * from fashion;", (err, result) => {
    res.json(result);
  });
});
// addfashion
moduleName.app.post("/addfashion", (req, res) => {
  console.log(req)
  connection.query(`INSERT INTO fashion ( image, description, price) VALUES ("${req.body.image}", "${req.body.description}", "${req.body.price}")`,
    function (err, result) {
      if (err) console.log(`Error executing the query - ${err}`);
      else console.log("Result: ", result);
      res.json(result);
    }
  );
});
//addelectronic
moduleName.app.post('/addelectronic',(req,res)=>{
connection.query(`INSERT INTO electronic (image, description, price) VALUES ("${req.body.image}","${req.body.description}","${req.body.price}")`,
  function(err,result) {
    if(err)
    console.log(`Error executing the query - ${err}`);
    else console.log("Result: ", result);
    res.json(result);
  }
)
})
//cart items
moduleName.app.get("/getcart", (req, res) =>  {
  connection.query("select * from fashion  join carts on fashion.id = carts.fashion_id union select * from electronic  join carts on electronic.id = carts.electronic_id;", (err, result) => {
  res.json(result);
});

});
 //fashion addcart
moduleName.app.get("/fashion/addcart/:id", (req, res) => {
  connection.query(`insert into carts (fashion_id) values('${req.params.id}')`,(err,result)=>{
  console.log("result",result);
  // console.log("err",err);
  res.json(result);
});
});
//electronic addcart
moduleName.app.get("/electronic/addcart/:id",(req,res)=>{
  connection.query(`insert into carts (electronic_id) values('${req.params.id}')`,(err,result)=>{
    res.json(result);
  })
})
//delete cart fashion
moduleName.app.delete("/fashion/deletecart/:id", (req, res) => {
  connection.query(`delete from carts where fashion_id=('${req.params.id}') ` , (err, result) => {
    res.json(result);
  })
})
//delete cart electronic
moduleName.app.delete("/electronic/deletecart/:id",(req,res)=>{
  connection.query(`delete from carts where electronic_id=('${req.params.id}')`,(err,result)=>{
    res.json(result)
  })
})
//electronic
moduleName.app.get("/getelectronic", (req, res) => {
  connection.query("select * from electronic;", (err, result) => {
  res.json(result);
});
});
//admin deletefashion
moduleName.app.delete("/deletefashion/:id", (req, res) =>{
connection.query(`delete from fashion where id=('${req.params.id}');`, (err, result) => {
  res.json(result);
});
});
//admin update fashion
moduleName.app.put("/updatefashion/:id",(req,res)=>{
  connection.query(`update fashion set image=('${req.body.image}'),description=('${req.body.description}'),price=('${req.body.price}') where id=('${req.params.id}');`,(err, result)=>{
    res.json(result);
  })
})
//one row details
moduleName.app.get("/fashion/:id",(req,res)=>{
  connection.query(`select * from fashion where id=('${req.params.id}')`,(err,result)=>{
    res.json(result);
  })
    
  })



function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    console.log(user);
    req.user = user;
    next();
  });
}

moduleName.app.listen(3000);
