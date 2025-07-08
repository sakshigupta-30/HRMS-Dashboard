import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const CandidateDetails = ({ data, updateData }) => {
  const handleChange = (field, value) => {
    updateData({
      ...data,
      [field]: value
    });
  };
  return (
    <section className="form-section">
      <h3>Candidate Details</h3>
      <div className="form-grid two-column">
        <div>
          <label>
            Email ID <span style={{ color: 'red' }}>*</span>
          </label>
          <input 
            type="email" 
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
        <div>
          <label>
            First Name <span style={{ color: 'red' }}>*</span>
          </label>
          <input 
            type="text" 
            value={data.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
        </div>
       <div>
        <label>
            Phone <span style={{ color: 'red' }}>*</span>
        </label>
        <PhoneInput
            country={'in'}
            enableSearch={true}
            value={data.phone}
            onChange={(value) => handleChange('phone', value)}
            inputProps={{
            name: 'phone',
            required: true,
            autoFocus: false,
            }}
            containerStyle={{ width: '100%' }}
            inputStyle={{ width: '100%' }}
        />
        </div>

        <div>
          <label>
            Last Name <span style={{ color: 'red' }}>*</span>
          </label>
          <input 
            type="text" 
            value={data.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
        </div>
        <div>
          <label>UAN Number</label>
          <input 
            type="text" 
            value={data.uanNumber}
            onChange={(e) => handleChange('uanNumber', e.target.value)}
          />
        </div>
        <div>
          <label>Official Email</label>
          <input 
            type="email" 
            value={data.officialEmail}
            onChange={(e) => handleChange('officialEmail', e.target.value)}
          />
        </div>
        <div>
          <label>Aadhaar Card Number</label>
          <input 
            type="text" 
            value={data.aadhaarNumber}
            onChange={(e) => handleChange('aadhaarNumber', e.target.value)}
          />
        </div>
        <div>
          <label>PAN Card Number</label>
          <input 
            type="text" 
            value={data.panNumber}
            onChange={(e) => handleChange('panNumber', e.target.value)}
          />
        </div>
        <div className="full-width">
          <label>Photo</label>
          <div className="custom-file-upload">
            <p>
              Upload from <a href="#">Desktop</a> / <a href="#">Drive</a> / <a href="#">Others</a>
            </p>
            <input type="file" accept="image/*" />
            <div className="photo-info">
              <small>Files supported: JPG, PNG, GIF, JPEG</small><br />
              <small>Max. size is 5 MB</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CandidateDetails;
