import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { candidateAPI } from '../../services/api'; // <-- Import candidateAPI

const labelClasses = "block font-medium mb-1 text-slate-800";
const inputClasses = "w-full p-2 border border-slate-300 rounded-md bg-white text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none";

const CandidateDetails = ({ data, updateData, aadhaarCheck, handleAadhaarCheck }) => {
  // const [aadhaarCheck, setAadhaarCheck] = useState({
  //   checked: false,
  //   loading: false,
  //   error: "",
  //   exists: false,
  // });

  const handleChange = (field, value) => {
    updateData({
      ...data,
      [field]: value
    });
  };

  //  const handleAadhaarCheck = async () => {
  //   setAadhaarCheck({ ...aadhaarCheck, loading: true, error: "", exists: false });
  //   try {
  //     const res = await candidateAPI.checkAadhar(data.aadhaarNumber);
  //     if (res.exists) {
  //       setAadhaarCheck({
  //         checked: true,
  //         loading: false,
  //         error: "Aadhaar already exists in the system.",
  //         exists: true,
  //       });
  //     } else {
  //       setAadhaarCheck({
  //         checked: true,
  //         loading: false,
  //         error: "",
  //         exists: false,
  //       });
  //     }
  //   } catch (err) {
  //     setAadhaarCheck({
  //       checked: true,
  //       loading: false,
  //       error: "Error checking Aadhaar. Please try again.",
  //       exists: false,
  //     });
  //   }
  // };


  // All fields except Aadhaar are disabled until Aadhaar is checked and does not exist
  const fieldsDisabled = !aadhaarCheck.checked || aadhaarCheck.exists;

  return (
    <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-slate-200">
      <h3 className="text-xl font-semibold text-slate-800 mb-5 pb-2 border-b border-slate-200">
        Candidate Details
      </h3>
      <div>
          <label className={labelClasses}>
            Aadhaar Card Number <span className="text-red-500">*</span>
          </label>
          <div className="flex w-full gap-2">
            <input
              type="text"
              className={`max-w-xl p-2 border border-slate-300 rounded-md bg-white text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
              value={data.aadhaarNumber}
              onChange={(e) => handleChange('aadhaarNumber', e.target.value)}
              disabled={aadhaarCheck.checked && !aadhaarCheck.exists}
              maxLength={12}
              pattern="\d{12}"
              placeholder="Enter 12-digit Aadhaar"
            />
            <button
              type="button"
              className="bg-blue-600 w-[19%] text-white px-4 h-10 rounded disabled:opacity-60"
              onClick={()=>handleAadhaarCheck(data.aadhaarNumber)}
              disabled={
                aadhaarCheck.loading ||
                !data.aadhaarNumber ||
                data.aadhaarNumber.length !== 12 ||
                aadhaarCheck.checked
              }
            >
              {aadhaarCheck.loading ? "Checking..." : "Next"}
            </button>
          </div>
          {aadhaarCheck.error && (
            <div className="text-red-600 text-sm mt-1 mb-3">{aadhaarCheck.error}</div>
          )}
          {aadhaarCheck.checked && !aadhaarCheck.exists && (
            <div className="text-green-600 text-sm mt-1  mb-3">Aadhaar is unique. Continue filling the form.</div>
          )}
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Aadhaar Card Number with Next Button */}
        
        {/* Email */}
        <div>
          <label className={labelClasses}>
            Email ID <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className={inputClasses}
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            disabled={fieldsDisabled}
          />
        </div>
        {/* First Name */}
        <div>
          <label className={labelClasses}>
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={inputClasses}
            value={data.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            disabled={fieldsDisabled}
          />
        </div>
        {/* Last Name */}
        <div>
          <label className={labelClasses}>
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={inputClasses}
            value={data.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            disabled={fieldsDisabled}
          />
        </div>
        {/* Last Name */}
        <div>
          <label className={labelClasses}>
            Father/Husband Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={inputClasses}
            value={data.fatherName}
            onChange={(e) => handleChange('fatherName', e.target.value)}
            disabled={fieldsDisabled}
          />
        </div>
        {/* Phone */}
        <div>
          <label className={labelClasses}>
            Phone <span className="text-red-500">*</span>
          </label>
          <PhoneInput
            country={'in'}
            enableSearch={true}
            value={data.phone}
            onChange={(value) => handleChange('phone', value)}
            containerClass="w-full"
            inputClass={inputClasses}
            disabled={fieldsDisabled}
          />
        </div>
        {/* UAN Number */}
        <div>
          <label className={labelClasses}>UAN Number</label>
          <input
            type="text"
            className={inputClasses}
            value={data.uanNumber}
            onChange={(e) => handleChange('uanNumber', e.target.value)}
            disabled={fieldsDisabled}
          />
        </div>
        {/* Official Email */}
        <div>
          <label className={labelClasses}>Official Email</label>
          <input
            type="email"
            className={inputClasses}
            value={data.officialEmail}
            onChange={(e) => handleChange('officialEmail', e.target.value)}
            disabled={fieldsDisabled}
          />
        </div>
        {/* PAN Card Number */}
        <div>
          <label className={labelClasses}>PAN Card Number</label>
          <input
            type="text"
            className={inputClasses}
            value={data.panNumber}
            onChange={(e) => handleChange('panNumber', e.target.value)}
            disabled={fieldsDisabled}
          />
        </div>
        {/* Photo */}
        <div className="md:col-span-2 lg:col-span-3">
          <label className={labelClasses}>Photo</label>
          <div className="p-4 bg-slate-50 border border-dashed border-slate-400 rounded-md">
            <p className="text-sm text-slate-700">
              Upload from <a href="#" className="text-blue-600 font-medium hover:underline">Desktop</a> / <a href="#" className="text-blue-600 font-medium hover:underline">Drive</a> / <a href="#" className="text-blue-600 font-medium hover:underline">Others</a>
            </p>
            <input type="file" accept="image/*" className="text-sm" disabled={fieldsDisabled} />
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