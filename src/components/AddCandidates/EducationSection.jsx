import React from 'react';

const EducationSection = () => {
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
          <tr>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td><textarea /></td>
          </tr>
        </tbody>
      </table>
      <button className="add-row-btn">Add Row</button>
    </section>
  );
};

export default EducationSection;
