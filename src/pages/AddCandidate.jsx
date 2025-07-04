import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AddCandidate.css';
import CandidateDetails from '../components/AddCandidates/CandidateDetails';
import AddressSection from '../components/AddCandidates/AddressSection';
import ProfessionalDetails from '../components/AddCandidates/ProfessionalDetails';
import EducationSection from '../components/AddCandidates/EducationSection';
import ExperienceSection from '../components/AddCandidates/ExperienceSection';

const AddCandidate = () => {
  const navigate = useNavigate();
  return (
    <div className="add-candidate-page">
      <div className="form-section form-header-section">
        <div className="form-header">
          <h2>Add Candidate</h2>
          <button className="close-button" onClick={() => navigate('/')}>&times;</button>
        </div>
      </div>

      <CandidateDetails />
      <AddressSection />
      <ProfessionalDetails />
      <EducationSection />
      <ExperienceSection />

      <div className="form-footer">
        <button className="primary">Submit</button>
        <button className="primary">Submit and New</button>
        <button className="secondary">Save Draft</button>
        <button className="secondary">Cancel</button>
      </div>
    </div>
  );
};

export default AddCandidate;
