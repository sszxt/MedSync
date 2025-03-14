const mongoose = require('mongoose')

const PatientdetailsSchema = new mongoose.Schema({
    name : String,
    age : Number,
    gender : String,
    height: Number,
    weight: Number,
    activeAllergies: String,
    currentMedications: String,
    previousMedications: String,
    currentConditions: String,
    previousConditions: String,
    otherIssues: String
})

const PatientdetailsModel = mongoose.model("Patientdetails",PatientdetailsSchema)

module.exports = PatientdetailsModel