import React from 'react';

// A slightly more compact version of our input styles for use inside tables.
const tableInputClasses = "w-full p-2 border border-slate-300 rounded-md bg-white text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition";

const EducationSection = ({ data, updateData }) => {
  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    updateData(newData);
  };

  const addRow = () => {
    updateData([...data, {
      schoolName: '',
      degree: '',
      fieldOfStudy: '',
      dateOfCompletion: '',
      additionalNotes: ''
    }]);
  };

  return (
    <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-slate-200">
      <h3 className="text-xl font-semibold text-slate-800 mb-5 pb-2 border-b border-slate-200">
        Education
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr>
              <th className="p-3 border border-slate-200 bg-slate-50 font-semibold text-slate-800 text-sm text-left">School Name</th>
              <th className="p-3 border border-slate-200 bg-slate-50 font-semibold text-slate-800 text-sm text-left">Degree/Diploma</th>
              <th className="p-3 border border-slate-200 bg-slate-50 font-semibold text-slate-800 text-sm text-left">Field(s) of Study</th>
              <th className="p-3 border border-slate-200 bg-slate-50 font-semibold text-slate-800 text-sm text-left">Date of Completion</th>
              <th className="p-3 border border-slate-200 bg-slate-50 font-semibold text-slate-800 text-sm text-left">Additional Notes</th>
            </tr>
          </thead>
          <tbody>
            {data.map((edu, index) => (
              <tr key={index}>
                <td className="p-2 border border-slate-200 align-top">
                  <input 
                    type="text" 
                    value={edu.schoolName}
                    onChange={(e) => handleChange(index, 'schoolName', e.target.value)}
                    className={tableInputClasses}
                  />
                </td>
                <td className="p-2 border border-slate-200 align-top">
                  <input 
                    type="text" 
                    value={edu.degree}
                    onChange={(e) => handleChange(index, 'degree', e.target.value)}
                    className={tableInputClasses}
                  />
                </td>
                <td className="p-2 border border-slate-200 align-top">
                  <input 
                    type="text" 
                    value={edu.fieldOfStudy}
                    onChange={(e) => handleChange(index, 'fieldOfStudy', e.target.value)}
                    className={tableInputClasses}
                  />
                </td>
                <td className="p-2 border border-slate-200 align-top">
                  <input 
                    type="text" 
                    value={edu.dateOfCompletion}
                    onChange={(e) => handleChange(index, 'dateOfCompletion', e.target.value)}
                    className={tableInputClasses}
                  />
                </td>
                <td className="p-2 border border-slate-200 align-top">
                  <textarea 
                    value={edu.additionalNotes}
                    onChange={(e) => handleChange(index, 'additionalNotes', e.target.value)}
                    className={tableInputClasses}
                    rows="1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button 
        className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
        onClick={addRow}
      >
        Add Row
      </button>
    </section>
  );
};

export default EducationSection;