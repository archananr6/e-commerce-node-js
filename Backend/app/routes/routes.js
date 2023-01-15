module.exports = app =>{
    // const app = require("./config/express");
const controllers=require("../controllers/ecom.controller")
const model=require("../model/ecom.model")
app.get("/get",(req,res)=>{
    model.read()
    res.send("hiii")
})

}
