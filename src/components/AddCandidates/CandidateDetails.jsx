import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const CandidateDetails = () => {
  return (
    <section className="form-section">
      <h3>Candidate Details</h3>
      <div className="form-grid two-column">
        <div>
          <label>
            Email ID <span style={{ color: 'red' }}>*</span>
          </label>
          <input type="email" />
        </div>
        <div>
          <label>
            First Name <span style={{ color: 'red' }}>*</span>
          </label>
          <input type="text" />
        </div>
       <div>
        <label>
            Phone <span style={{ color: 'red' }}>*</span>
        </label>
        <PhoneInput
            country={'in'}
            enableSearch={true}
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
          <input type="text" />
        </div>
        <div>
          <label>UAN Number</label>
          <input type="text" />
        </div>
        <div>
          <label>Official Email</label>
          <input type="email" />
        </div>
        <div>
          <label>Aadhaar Card Number</label>
          <input type="text" />
        </div>
        <div>
          <label>PAN Card Number</label>
          <input type="text" />
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
