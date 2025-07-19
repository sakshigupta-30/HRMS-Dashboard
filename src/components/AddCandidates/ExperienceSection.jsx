import React from 'react';

const tableInputClasses = "w-full p-2 border border-slate-300 rounded-md bg-white text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition";

const ExperienceSection = ({ data, updateData }) => {
  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    updateData(newData);
  };

  const addRow = () => {
    updateData([...data, {
      occupation: '',
      company: '',
      summary: '',
      duration: '',
      currentlyWorkHere: false
    }]);
  };

  return (
    <section className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-slate-200">
      <h3 className="text-xl font-semibold text-slate-800 mb-5 pb-2 border-b border-slate-200">
        Experience
      </h3>
      <div className="overflow-x-auto">
        {/* CHANGE 1: Added 'border-separate border-spacing-y-3' to the table */}
        <table className="w-full border-separate border-spacing-y-3 mb-4">
          <thead>
            <tr>
              {/* CHANGE 2: Removed borders from headers, adjusted padding */}
              <th className="p-2 font-semibold text-slate-800 text-sm text-left">Occupation</th>
              <th className="p-2 font-semibold text-slate-800 text-sm text-left">Company</th>
              <th className="p-2 font-semibold text-slate-800 text-sm text-left">Summary</th>
              <th className="p-2 font-semibold text-slate-800 text-sm text-left">Duration</th>
              <th className="p-2 font-semibold text-slate-800 text-sm text-left">Currently Work Here</th>
            </tr>
          </thead>
          <tbody>
            {data.map((exp, index) => (
              <tr key={index}>
                {/* CHANGE 3: Removed borders from cells, added bg-slate-50 and rounded corners */}
                <td className="p-2 align-top bg-slate-50 rounded-l-md">
                  <input type="text" value={exp.occupation} onChange={(e) => handleChange(index, 'occupation', e.target.value)} className={tableInputClasses} />
                </td>
                <td className="p-2 align-top bg-slate-50">
                  <input type="text" value={exp.company} onChange={(e) => handleChange(index, 'company', e.target.value)} className={tableInputClasses} />
                </td>
                <td className="p-2 align-top bg-slate-50">
                  <textarea value={exp.summary} onChange={(e) => handleChange(index, 'summary', e.target.value)} className={tableInputClasses} rows="1" />
                </td>
                <td className="p-2 align-top bg-slate-50">
                  <input type="text" value={exp.duration} onChange={(e) => handleChange(index, 'duration', e.target.value)} className={tableInputClasses} />
                </td>
                <td className="p-2 align-top bg-slate-50 rounded-r-md">
                  <select value={exp.currentlyWorkHere ? 'yes' : 'no'} onChange={(e) => handleChange(index, 'currentlyWorkHere', e.target.value === 'yes')} className={tableInputClasses}>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
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

export default ExperienceSection;