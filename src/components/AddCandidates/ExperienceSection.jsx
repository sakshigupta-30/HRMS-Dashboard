import React from 'react';

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
    <section className="experience-section">
      <div className="section-title">Experience</div>
      <table>
        <thead>
          <tr>
            <th>Occupation</th>
            <th>Company</th>
            <th>Summary</th>
            <th>Duration</th>
            <th>Currently Work Here</th>
          </tr>
        </thead>
        <tbody>
          {data.map((exp, index) => (
            <tr key={index}>
              <td>
                <input 
                  type="text" 
                  value={exp.occupation}
                  onChange={(e) => handleChange(index, 'occupation', e.target.value)}
                />
              </td>
              <td>
                <input 
                  type="text" 
                  value={exp.company}
                  onChange={(e) => handleChange(index, 'company', e.target.value)}
                />
              </td>
              <td>
                <textarea 
                  value={exp.summary}
                  onChange={(e) => handleChange(index, 'summary', e.target.value)}
                />
              </td>
              <td>
                <input 
                  type="text" 
                  value={exp.duration}
                  onChange={(e) => handleChange(index, 'duration', e.target.value)}
                />
              </td>
              <td>
                <select 
                  value={exp.currentlyWorkHere ? 'yes' : 'no'}
                  onChange={(e) => handleChange(index, 'currentlyWorkHere', e.target.value === 'yes')}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-row-btn" onClick={addRow}>Add Row</button>
    </section>
  );
};

export default ExperienceSection;
