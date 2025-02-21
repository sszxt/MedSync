import React, { useState } from 'react';
import { FaBell, FaCheckCircle, FaExclamationTriangle, FaCalendarCheck, FaRegClock, FaRegEnvelope } from 'react-icons/fa';

const NotificationsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const notifications = [
    { id: 1, type: 'appointment', title: 'Appointment Confirmed', message: 'Your consultation with Dr. Smith on March 15th at 2:00 PM has been confirmed', time: '10:30 AM', date: '2024-03-10', read: false, urgent: false },
    { id: 2, type: 'reminder', title: 'Medication Reminder', message: 'Time to take your Metformin 500mg tablet', time: '9:00 AM', date: '2024-03-10', read: true, urgent: false },
    { id: 3, type: 'lab', title: 'Lab Results Available', message: 'Your blood test results from March 5th are now available', time: 'Yesterday', date: '2024-03-09', read: false, urgent: false },
    { id: 4, type: 'prescription', title: 'New Prescription', message: 'Dr. Johnson has issued a new prescription for Amoxicillin', time: '2 days ago', date: '2024-03-08', read: true, urgent: false },
    { id: 5, type: 'emergency', title: 'Emergency Alert', message: 'Flu shot booster available - schedule your appointment now', time: '1 hour ago', date: '2024-03-10', read: false, urgent: true }
  ];

  // Mapping notification types to category names
  const categoryMap = {
    Unread: (n) => !n.read,
    Medical: (n) => ['reminder', 'lab', 'prescription'].includes(n.type),
    Appointments: (n) => n.type === 'appointment',
    Alerts: (n) => n.type === 'emergency',
  };

  // Filter notifications based on selected category
  const filteredNotifications = selectedCategory === 'All' 
    ? notifications 
    : notifications.filter(categoryMap[selectedCategory]);

  const NotificationIcon = ({ type }) => {
    const iconSize = 24;
    switch(type) {
      case 'appointment': return <FaCalendarCheck size={iconSize} />;
      case 'reminder': return <FaRegClock size={iconSize} />;
      case 'lab': return <FaCheckCircle size={iconSize} />;
      case 'prescription': return <FaRegEnvelope size={iconSize} />;
      case 'emergency': return <FaExclamationTriangle size={iconSize} />;
      default: return <FaBell size={iconSize} />;
    }
  };

  return (
    <div className="notifications-container">
      <header className="notifications-header">
        <h1><FaBell /> Notifications</h1>
        <button className="mark-all-read">Mark All as Read</button>
      </header>

      {/* Category Buttons */}
      <div className="notification-categories">
        {['All', 'Unread', 'Medical', 'Appointments', 'Alerts'].map(category => (
          <div
            key={category}
            className={`category ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </div>
        ))}
      </div>

      {/* Notification List */}
      <div className="notifications-list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div key={notification.id} className={`notification-card ${notification.urgent ? 'urgent' : ''}`}>
              <div className="notification-icon">
                <NotificationIcon type={notification.type} />
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <h4>{notification.title}</h4>
                  <span className="notification-time">{notification.time}</span>
                </div>
                <p>{notification.message}</p>
                {notification.urgent && <div className="urgent-badge">URGENT</div>}
              </div>
              {!notification.read && <div className="unread-dot" />}
            </div>
          ))
        ) : (
          <p className="no-notifications">No notifications in this category.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
