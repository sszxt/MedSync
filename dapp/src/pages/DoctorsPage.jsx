import React, { useState } from 'react';
import { FaStethoscope, FaRegClock, FaPhone, FaEnvelope, FaStar, FaUserMd } from 'react-icons/fa';
import Modal from 'react-modal';

const DoctorsPage = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      experience: 12,
      rating: 4.8,
      available: true,
      image: 'https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg',
      education: 'MD, Harvard Medical School',
      languages: ['English', 'Spanish'],
      nextAvailable: 'Today 3:00 PM',
      contact: {
        phone: '+1 (555) 123-4567',
        email: 'sarahj@medsync.com'
      },
      bio: 'Board-certified cardiologist with extensive experience in preventive cardiology and heart failure management.'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Orthopedics',
      experience: 8,
      rating: 4.6,
      available: false,
      image: '/doctor1.jpeg',
      education: 'MD, Johns Hopkins University',
      languages: ['English', 'Mandarin'],
      nextAvailable: 'Tomorrow 10:00 AM',
      contact: {
        phone: '+1 (555) 987-6543',
        email: 'michaelc@medsync.com'
      },
      bio: 'Orthopedic surgeon specializing in sports injuries and joint replacement surgeries.'
    },
    // Add 5 more doctors following the same structure
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pediatrics',
      experience: 10,
      rating: 4.9,
      available: true,
      image: '/doctor1.jpeg',
      education: 'MD, Stanford University',
      languages: ['English', 'Spanish'],
      nextAvailable: 'Today 2:30 PM',
      contact: {
        phone: '+1 (555) 234-5678',
        email: 'emilyr@medsync.com'
      },
      bio: 'Pediatrician focused on child development and preventive care.'
    },
    {
      id: 4,
      name: 'Dr. David Wilson',
      specialty: 'Neurology',
      experience: 15,
      rating: 4.7,
      available: true,
      image: '/doctor1.jpeg',
      education: 'MD, Yale School of Medicine',
      languages: ['English', 'French'],
      nextAvailable: 'Today 4:00 PM',
      contact: {
        phone: '+1 (555) 345-6789',
        email: 'davidw@medsync.com'
      },
      bio: 'Neurologist specializing in migraine treatment and neurodegenerative diseases.'
    },
    {
      id: 5,
      name: 'Dr. Priya Patel',
      specialty: 'Dermatology',
      experience: 7,
      rating: 4.5,
      available: false,
      image: '/doctor1.jpeg',
      education: 'MD, University of Pennsylvania',
      languages: ['English', 'Hindi'],
      nextAvailable: 'Tomorrow 9:00 AM',
      contact: {
        phone: '+1 (555) 456-7890',
        email: 'priyap@medsync.com'
      },
      bio: 'Cosmetic dermatologist expert in skin rejuvenation and acne treatment.'
    }
  ];

  const specialties = ['all', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology', 'Dermatology'];

  const filteredDoctors = doctors.filter(doctor => 
    selectedSpecialty === 'all' ? true : doctor.specialty === selectedSpecialty
  );

  return (
    <div className="doctors-page">
      <header className="page-header">
        <h1><FaUserMd /> Our Medical Experts</h1>
        <p>Meet our team of highly qualified healthcare professionals</p>
        
        <div className="filters">
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          {showFilters && (
            <div className="filter-options">
              <div className="filter-group">
                <label>Specialty:</label>
                <select 
                  value={selectedSpecialty} 
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>
                      {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="doctors-grid">
        {filteredDoctors.map(doctor => (
          <div key={doctor.id} className="doctor-card">
            <div className="card-header">
              <img src={doctor.image} alt={doctor.name} />
              <div className="availability">
                <span className={`status ${doctor.available ? 'available' : 'busy'}`}>
                  {doctor.available ? 'Available' : 'Busy'}
                </span>
                <span className="rating">
                  <FaStar /> {doctor.rating}
                </span>
              </div>
            </div>
            
            <div className="card-body">
              <h3>{doctor.name}</h3>
              <p className="specialty"><FaStethoscope /> {doctor.specialty}</p>
              <p className="experience">{doctor.experience} years experience</p>
              
              <div className="contact-info">
                <p><FaPhone /> {doctor.contact.phone}</p>
                <p><FaEnvelope /> {doctor.contact.email}</p>
              </div>

              <div className="next-available">
                <FaRegClock /> Next available: {doctor.nextAvailable}
              </div>
            </div>

            <div className="card-footer">
              <button 
                className="view-profile"
                onClick={() => setSelectedDoctor(doctor)}
              >
                View Full Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selectedDoctor}
        onRequestClose={() => setSelectedDoctor(null)}
        className="doctor-modal"
        overlayClassName="modal-overlay"
      >
        {selectedDoctor && (
          <div className="modal-content">
            <button 
              className="close-modal"
              onClick={() => setSelectedDoctor(null)}
            >
              &times;
            </button>
            
            <div className="modal-header">
              <img src={selectedDoctor.image} alt={selectedDoctor.name} />
              <div className="header-info">
                <h2>{selectedDoctor.name}</h2>
                <p className="specialty">{selectedDoctor.specialty}</p>
                <div className="rating">
                  <FaStar /> {selectedDoctor.rating} ({selectedDoctor.experience} years experience)
                </div>
              </div>
            </div>

            <div className="modal-body">
              <h3>About</h3>
              <p className="bio">{selectedDoctor.bio}</p>
              
              <div className="details-grid">
                <div>
                  <h4>Education</h4>
                  <p>{selectedDoctor.education}</p>
                </div>
                <div>
                  <h4>Languages</h4>
                  <ul>
                    {selectedDoctor.languages.map(lang => (
                      <li key={lang}>{lang}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Contact</h4>
                  <p><FaPhone /> {selectedDoctor.contact.phone}</p>
                  <p><FaEnvelope /> {selectedDoctor.contact.email}</p>
                </div>
                <div>
                  <h4>Availability</h4>
                  <p className={selectedDoctor.available ? 'available' : 'busy'}>
                    {selectedDoctor.available ? 'Available Now' : 'Busy - Next Available: ' + selectedDoctor.nextAvailable}
                  </p>
                </div>
              </div>

              <button className="book-appointment">
                Book Appointment
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorsPage;