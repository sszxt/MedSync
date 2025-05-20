// server.js
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const  PatientModel = require("./models/patient")
const PatientdetailsModel = require("./models/patientdetails")

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB patients
mongoose.connect("mongodb://localhost:27017/patients");

//Connect to MongoDB patientdetails
// mongoose.connect("mongodb://localhost:27017/patientdetails")

//login
app.post('/login',(req,res)=>{
  const {email,password} = req.body
  PatientModel.findOne({email:email})
  .then(user=>{
    if(user){
      if(user.password === password){
        res.json("Success")
      }else{
        res.json("the password is incorrect")
      }
    }
    else{
      
      res.json("No record existed")
    }
  })
})


//register
app.post('/register',(req,res)=>{
  PatientModel.create(req.body)
  .then(patient=>res.json(patient))
  .catch(err=>res.json(err))
})

//patientdetails
app.post("/patientr",(req,res)=>{
  PatientdetailsModel.create(req.body).then(patientdetails=>res.json(patientdetails)).catch(err=>res.json(err))
})



// Start Server
app.listen(5000, () => console.log("Server running on http://localhost:5173"));

