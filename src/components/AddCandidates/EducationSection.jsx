import React from 'react';

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
    <section className="education-section">
      <div className="section-title">Education</div>
      <table>
        <thead>
          <tr>
            <th>School Name</th>
            <th>Degree/Diploma</th>
            <th>Field(s) of Study</th>
            <th>Date of Completion</th>
            <th>Additional Notes</th>
          </tr>
        </thead>
        <tbody>
          {data.map((edu, index) => (
            <tr key={index}>
              <td>
                <input 
                  type="text" 
                  value={edu.schoolName}
                  onChange={(e) => handleChange(index, 'schoolName', e.target.value)}
                />
              </td>
              <td>
                <input 
                  type="text" 
                  value={edu.degree}
                  onChange={(e) => handleChange(index, 'degree', e.target.value)}
                />
              </td>
              <td>
                <input 
                  type="text" 
                  value={edu.fieldOfStudy}
                  onChange={(e) => handleChange(index, 'fieldOfStudy', e.target.value)}
                />
              </td>
              <td>
                <input 
                  type="text" 
                  value={edu.dateOfCompletion}
                  onChange={(e) => handleChange(index, 'dateOfCompletion', e.target.value)}
                />
              </td>
              <td>
                <textarea 
                  value={edu.additionalNotes}
                  onChange={(e) => handleChange(index, 'additionalNotes', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-row-btn" onClick={addRow}>Add Row</button>
    </section>
  );
};

export default EducationSection;
