const mongoose = require("mongoose");
const LocalStrategy = require("passport-local").Strategy;

//  setting up the appointment format
const appointmentSchema = mongoose.Schema({
  userName: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  service: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

let Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
