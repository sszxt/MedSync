const mongoose = require('mongoose')

const PatientSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
})

const PatientModel = mongoose.model("Patients",PatientSchema)

module.exports = PatientModel