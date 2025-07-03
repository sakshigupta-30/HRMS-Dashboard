import React from 'react';

const ExperienceSection = () => {
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
          <tr>
            <td><input type="text" /></td>
            <td><input type="text" /></td>
            <td><textarea /></td>
            <td><input type="text" /></td>
            <td>
              <select>
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <button className="add-row-btn">Add Row</button>
    </section>
  );
};

export default ExperienceSection;
