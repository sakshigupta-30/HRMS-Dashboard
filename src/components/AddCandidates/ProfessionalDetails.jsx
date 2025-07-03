import React from 'react';
import './ProfessionalDetails.css';

const ProfessionalDetails = () => {
  return (
    <section className="form-section">
      <h2 className="form-title">Professional Details</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Experience</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>Location</label>
          <select><option>Select</option></select>
        </div>

        <div className="form-group">
          <label>Source of Hire</label>
          <select><option>Select</option></select>
        </div>
      <div className="form-group">
          <label>Title</label>
          <div className="radio-clean">
            <label><input type="radio" name="title" /> CEO</label>
            <label><input type="radio" name="title" /> Administration</label>
            <label><input type="radio" name="title" /> Manager</label>
            <label><input type="radio" name="title" /> Assistant Manager</label>
            <label><input type="radio" name="title" /> Team Member</label>
          </div>
        </div>



        <div className="form-group">
          <label>Skill Set</label>
          <textarea rows="2" />
        </div>
        <div className="form-group">
          <label>Current Salary</label>
          <input type="text" />
        </div>

        <div className="form-group">
          <label>Highest Qualification</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>Department</label>
          <select><option>Select</option></select>
        </div>

        <div className="form-group full-width">
          <label>Additional Information</label>
          <textarea rows="2" />
        </div>

        <div className="form-group">
          <label>Offer Letter</label>
          <div className="upload-box">
            Upload from 
            <a href="#"> Desktop </a> / 
            <a href="#"> Drive </a> / 
            <a href="#"> Others </a>
            <p className="file-info">Max. size is 5 MB</p>
          </div>
        </div>

        <div className="form-group">
          <label>Tentative Joining Date</label>
          <input type="date" placeholder="dd-MMM-yyyy" />
        </div>
      </div>
    </section>
  );
};

export default ProfessionalDetails;
