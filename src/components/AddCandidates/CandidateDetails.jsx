import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// Define reusable style constants for consistency
const labelClasses = "block font-medium mb-1 text-slate-800";
const inputClasses = "w-full p-2 border border-slate-300 rounded-md bg-white text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none";

const CandidateDetails = ({ data, updateData }) => {
  const handleChange = (field, value) => {
    updateData({
      ...data,
      [field]: value
    });
  };

  return (
    <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-slate-200">
      <h3 className="text-xl font-semibold text-slate-800 mb-5 pb-2 border-b border-slate-200">
        Candidate Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <label className={labelClasses}>
            Email ID <span className="text-red-500">*</span>
          </label>
          <input 
            type="email" 
            className={inputClasses}
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClasses}>
            First Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            className={inputClasses}
            value={data.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClasses}>
            Last Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            className={inputClasses}
            value={data.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClasses}>
            Phone <span className="text-red-500">*</span>
          </label>
          <PhoneInput
            country={'in'}
            enableSearch={true}
            value={data.phone}
            onChange={(value) => handleChange('phone', value)}
            // Use the library's props to apply Tailwind classes instead of inline styles
            containerClass="w-full"
            inputClass={inputClasses} 
          />
        </div>
        <div>
          <label className={labelClasses}>UAN Number</label>
          <input 
            type="text" 
            className={inputClasses}
            value={data.uanNumber}
            onChange={(e) => handleChange('uanNumber', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClasses}>Official Email</label>
          <input 
            type="email" 
            className={inputClasses}
            value={data.officialEmail}
            onChange={(e) => handleChange('officialEmail', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClasses}>Aadhaar Card Number</label>
          <input 
            type="text" 
            className={inputClasses}
            value={data.aadhaarNumber}
            onChange={(e) => handleChange('aadhaarNumber', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClasses}>PAN Card Number</label>
          <input 
            type="text" 
            className={inputClasses}
            value={data.panNumber}
            onChange={(e) => handleChange('panNumber', e.target.value)}
          />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <label className={labelClasses}>Photo</label>
          <div className="p-4 bg-slate-50 border border-dashed border-slate-400 rounded-md">
            <p className="text-sm text-slate-700">
              Upload from <a href="#" className="text-blue-600 font-medium hover:underline">Desktop</a> / <a href="#" className="text-blue-600 font-medium hover:underline">Drive</a> / <a href="#" className="text-blue-600 font-medium hover:underline">Others</a>
            </p>
            <input type="file" accept="image/*" className="text-sm" />
            <div className="text-xs text-slate-500 mt-1">
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