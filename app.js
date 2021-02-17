require('dotenv').config();

const express= require("express");

const app = express();

console.log(process.env.API_KEY);
const ejs = require("ejs");
app.use(express.static("public"));


const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true,useUnifiedTopology: true  });
const encrypt = require("mongoose-encryption");
const userSchema  = new mongoose.Schema({
email:String,
password:String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ['password'] });

const  User = mongoose.model("User",userSchema);

app.post("/register",function(req,res){
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });

  newUser.save(function(err){
    if(err)
    console.log(err);
    else
    res.render("secrets");
  });

});

app.post("/login",function(req,res){
  const username= req.body.username;
  const password = req.body.password;

  User.findOne({email:username},function(err,foundUser){
    if(err)
    {
      console.log(err);
    }else{
      if(foundUser)
      {
        if(foundUser.password===password)
        res.render("secrets");
      }
    }


  });
});

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});


app.get("/register",function(req,res){
  res.render("register");
});

app.listen(3000,function(){
  console.log("the server is running on port 3000");
});



app.set("view engine","ejs");
