import React from 'react';
import './ProfessionalDetails.css';

const ProfessionalDetails = ({ data, updateData }) => {
  const handleChange = (field, value) => {
    updateData({
      ...data,
      [field]: value
    });
  };
  return (
    <section className="form-section">
      <h2 className="form-title">Professional Details</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Experience</label>
          <input 
            type="text" 
            value={data.experience}
            onChange={(e) => handleChange('experience', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input 
            type="text" 
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Enter location"
          />
        </div>

        <div className="form-group">
          <label>Source of Hire</label>
          <input 
            type="text" 
            value={data.sourceOfHire}
            onChange={(e) => handleChange('sourceOfHire', e.target.value)}
            placeholder="Enter source"
          />
        </div>
      <div className="form-group">
          <label>Title</label>
          <div className="radio-clean">
            <label><input type="radio" name="title" value="CEO" checked={data.title === 'CEO'} onChange={(e) => handleChange('title', e.target.value)} /> CEO</label>
            <label><input type="radio" name="title" value="Administration" checked={data.title === 'Administration'} onChange={(e) => handleChange('title', e.target.value)} /> Administration</label>
            <label><input type="radio" name="title" value="Manager" checked={data.title === 'Manager'} onChange={(e) => handleChange('title', e.target.value)} /> Manager</label>
            <label><input type="radio" name="title" value="Assistant Manager" checked={data.title === 'Assistant Manager'} onChange={(e) => handleChange('title', e.target.value)} /> Assistant Manager</label>
            <label><input type="radio" name="title" value="Team Member" checked={data.title === 'Team Member'} onChange={(e) => handleChange('title', e.target.value)} /> Team Member</label>
          </div>
        </div>



        <div className="form-group">
          <label>Skill Set</label>
          <textarea 
            rows="2" 
            value={data.skillSet}
            onChange={(e) => handleChange('skillSet', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Current Salary</label>
          <input 
            type="text" 
            value={data.currentSalary}
            onChange={(e) => handleChange('currentSalary', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Highest Qualification</label>
          <input 
            type="text" 
            value={data.highestQualification}
            onChange={(e) => handleChange('highestQualification', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Department</label>
          <select 
            value={data.department}
            onChange={(e) => handleChange('department', e.target.value)}
          >
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Additional Information</label>
          <textarea 
            rows="2" 
            value={data.additionalInformation}
            onChange={(e) => handleChange('additionalInformation', e.target.value)}
          />
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
          <input 
            type="date" 
            value={data.tentativeJoiningDate}
            onChange={(e) => handleChange('tentativeJoiningDate', e.target.value)}
            placeholder="dd-MMM-yyyy" 
          />
        </div>
      </div>
    </section>
  );
};

export default ProfessionalDetails;
