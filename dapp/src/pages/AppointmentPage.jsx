import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles
import { FaClock, FaCalendarAlt, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import Modal from 'react-modal';

const AppointmentPage = () => {
  const [date, setDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Available time slots
  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

  const handleDateChange = (newDate) => {
    if (newDate instanceof Date) {
      setDate(newDate);
      setSelectedSlot(null); // Reset selected slot when date changes
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSlot && patientInfo.name && patientInfo.email && patientInfo.phone) {
      setShowConfirmation(true);
    }
  };

  return (
    <div className="appointment-page">
      <header className="page-header">
        <h1>Book Your Appointment</h1>
        <p>Select a date and time for your medical consultation</p>
      </header>

      <div className="booking-container">
        {/* Calendar Section */}
        <div className="calendar-section">
          <div className="section-header">
            <FaCalendarAlt className="header-icon" />
            <h2>Select Date</h2>
          </div>
          <Calendar
            onChange={handleDateChange}
            value={date}
            minDate={new Date()} // Restrict past dates
            tileDisabled={({ date }) => date.getDay() === 0} // Disable Sundays
            className="react-calendar"
          />
          <p className="selected-date">📅 Selected Date: {date.toDateString()}</p>
        </div>

        {/* Time Slots Selection */}
        <div className="time-selection">
          <div className="section-header">
            <FaClock className="header-icon" />
            <h2>Available Time Slots</h2>
          </div>
          <div className="time-slots-grid">
            {timeSlots.map((time) => (
              <button
                key={time}
                className={`time-slot ${selectedSlot === time ? 'selected' : ''}`}
                onClick={() => setSelectedSlot(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Patient Information Form */}
        <form className="patient-form" onSubmit={handleSubmit}>
          <div className="section-header">
            <FaUser className="header-icon" />
            <h2>Patient Information</h2>
          </div>

          <div className="form-group">
            <label><FaUser className="input-icon" /> Full Name</label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={patientInfo.name}
              onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label><FaEnvelope className="input-icon" /> Email</label>
            <input
              type="email"
              required
              placeholder="john@example.com"
              value={patientInfo.email}
              onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label><FaPhone className="input-icon" /> Phone Number</label>
            <input
              type="tel"
              required
              placeholder="+1 234 567 890"
              value={patientInfo.phone}
              onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
            />
          </div>

          <button type="submit" className="submit-button">
            Confirm Appointment
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
        className="confirmation-modal"
        overlayClassName="modal-overlay"
      >
        <h2>📩 Appointment Request Sent!</h2>
        <p>⏳ Your booking is pending confirmation.</p>
        <p>✅ The doctor will review your request and accept it shortly.</p>
        <p>📲 You will receive an SMS update once your appointment is confirmed.</p>

        <div className="confirmation-details">
          <p><strong>Date:</strong> {date.toDateString()}</p>
          <p><strong>Time:</strong> {selectedSlot}</p>
          <p><strong>Patient:</strong> {patientInfo.name}</p>
        </div>

        <button className="close-button" onClick={() => setShowConfirmation(false)}>
          Close
        </button>
      </Modal>

      {/* Styling */}
      <style>{`
        .confirmation-modal {
          text-align: center;
          background: white;
          padding: 20px;
          border-radius: 10px;
          max-width: 400px;
          margin: auto;
        }
        .close-button {
          margin-top: 10px;
          padding: 10px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .close-button:hover {
          background: #45a049;
        }
      `}</style>
    </div>
  );
};

export default AppointmentPage;
