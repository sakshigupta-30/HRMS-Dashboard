import React from 'react';

const labelClasses = "block font-medium mb-1.5 text-sm";
const inputClasses = "w-full py-2 px-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none";

const ProfessionalDetails = ({ data, updateData }) => {
  const handleChange = (field, value) => {
    updateData({
      ...data,
      [field]: value
    });
  };

  return (
    <section className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold mb-5">
        Professional Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-10">

        <div>
          <label className={labelClasses}>Experience</label>
          <input 
            type="text" 
            className={inputClasses}
            value={data.experience}
            onChange={(e) => handleChange('experience', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClasses}>Location</label>
          <input 
            type="text" 
            className={inputClasses}
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Enter location"
          />
        </div>

        <div>
          <label className={labelClasses}>Source of Hire</label>
          <input 
            type="text" 
            className={inputClasses}
            value={data.sourceOfHire}
            onChange={(e) => handleChange('sourceOfHire', e.target.value)}
            placeholder="Enter source"
          />
        </div>

       <div>
        <label className={labelClasses}>Designation</label>
        <div className="flex flex-col gap-2.5 mt-1.5">
          {['Picker&Packar', 'SG', 'HK'].map(role => (
            <label key={role} className="flex items-center gap-2.5 font-normal text-sm text-gray-800 cursor-pointer">
              <input
                type="radio"
                name="designation"
                value={role}
                checked={data.designation === role}
                onChange={(e) => handleChange('designation', e.target.value)}
                className="w-[18px] h-[18px] accent-blue-600 focus:ring-2 focus:ring-offset-1 focus:ring-blue-300"
              />
              {role}
            </label>
          ))}
        </div>
      </div>


        <div>
          <label className={labelClasses}>Skill Set</label>
          <textarea 
            rows="2" 
            className={inputClasses}
            value={data.skillSet}
            onChange={(e) => handleChange('skillSet', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClasses}>Current Salary</label>
          <input 
            type="text" 
            className={inputClasses}
            value={data.currentSalary}
            onChange={(e) => handleChange('currentSalary', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClasses}>Highest Qualification</label>
          <input 
            type="text" 
            className={inputClasses}
            value={data.highestQualification}
            onChange={(e) => handleChange('highestQualification', e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClasses}>Additional Information</label>
          <textarea 
            rows="2" 
            className={inputClasses}
            value={data.additionalInformation}
            onChange={(e) => handleChange('additionalInformation', e.target.value)}
          />
        </div>

        <div>
          <label className={labelClasses}>Offer Letter</label>
          <div className="border border-gray-300 rounded-md p-2.5 text-sm bg-gray-50">
            Upload from 
            <a href="#" className="text-blue-600 hover:underline mx-1">Desktop</a> / 
            <a href="#" className="text-blue-600 hover:underline mx-1">Drive</a> / 
            <a href="#" className="text-blue-600 hover:underline mx-1">Others</a>
            <p className="text-xs text-gray-500 mt-1">Max. size is 5 MB</p>
          </div>
        </div>

        <div>
          <label className={labelClasses}>Tentative Joining Date</label>
          <input 
            type="date" 
            className={inputClasses}
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
