import React from 'react';
import './ProfileCard.css';

const ProfileCard = () => {
  return (
    <div className="profile-card">
      <div className="avatar-circle">👤</div>

      <div className="month-info">
        <h3>April 2024</h3>
        <p>July 2024</p>
      </div>

      <h2 className="salary">₹50,000</h2>

      <button className="view-btn">View</button>
    </div>
  );
};

export default ProfileCard;
