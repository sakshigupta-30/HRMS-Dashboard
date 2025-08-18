import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { candidateAPI } from '../services/api';
import { salarySummaryAPI } from '../services/api';
import axios from 'axios';
import SalarySlipTemplate from "../components/SalarySlipTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from 'react';
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]; // or define months array locally if not exported
// Reusable object for status badge styles
const statusStyles = {
  Applied: 'bg-blue-100 text-blue-800',
  Draft: 'bg-amber-100 text-amber-800',
  Interview: 'bg-purple-100 text-purple-800',
  Selected: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  Screening: 'bg-cyan-100 text-cyan-800',
  'On Hold': 'bg-gray-200 text-gray-700',
  default: 'bg-slate-100 text-slate-800',
};

// Reusable component for displaying detail items to reduce repetition
const DetailItem = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">{label}</label>
    <span className="text-base text-slate-800 break-words">{children || 'N/A'}</span>
  </div>
);

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [salarySlips, setSalarySlips] = useState([]);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [selectedSlipMonth, setSelectedSlipMonth] = useState('');
  const [selectedSlipYear, setSelectedSlipYear] = useState(new Date().getFullYear());
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const templateRef = useRef();
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

  // ...existing useEffect...

  const startEdit = () => {
    setEditData(JSON.parse(JSON.stringify(candidate))); // deep copy
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditData(null);
  };
  const arrayToCommaString = arr => (Array.isArray(arr) ? arr.join(', ') : '');
  const commaStringToArray = str => str.split(',').map(s => s.trim()).filter(Boolean);

  // ...existing state...

  // For dynamic education/experience editing
  const handleArrayChange = (section, index, field, value) => {
    setEditData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleAddArrayItem = (section, emptyObj) => {
    setEditData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), emptyObj]
    }));
  };

  const handleRemoveArrayItem = (section, index) => {
    setEditData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleEditChange = (section, field, value) => {
    setEditData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const saveEdit = async () => {
    try {
      await candidateAPI.updateCandidate(id, editData);
      setCandidate(editData);
      setEditMode(false);
      setEditData(null);
      alert('Candidate updated successfully!');
    } catch (error) {
      alert('Failed to update candidate');
    }
  };

  useEffect(() => {
    if (candidate?.code) {
      fetchSalarySlips(candidate.code);
    }
  }, [candidate]);

  const fetchSalarySlips = async (employeeCode) => {
    try {
      // Fetch all salary summaries for this employee
      const data = await salarySummaryAPI.getSalarySummariesByEmployee(employeeCode);
      setSalarySlips(data || []);
    } catch (err) {
      setSalarySlips([]);
    }
  };
  useEffect(() => {
    fetchCandidateDetails();
  }, [id]);

  const fetchCandidateDetails = async () => {
    try {
      setLoading(true);
      const data = await candidateAPI.getCandidateById(id);
      setCandidate(data);
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      setError('Failed to load candidate details');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (salaryData) => {
    // Find the month and year for this slip
    const slipMonth = salaryData.month
      ? months[parseInt(salaryData.month.split("-")[1], 10) - 1]
      : "";
    const slipYear = salaryData.month
      ? salaryData.month.split("-")[0]
      : "";

    setSelectedEmployee(salaryData);
    setTimeout(() => {
      const element = templateRef.current;
      if (!element) {
        setSelectedEmployee(null);
        return;
      }

      html2canvas(element, { scale: 2, useCORS: true })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

          const fileName = `${salaryData["Employee Code"] || salaryData.code || "EMP"
            }_${salaryData.Name || salaryData.name || ""
            }_${slipMonth}_${slipYear}_SalarySlip.pdf`;

          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save(fileName);
        })
        .catch((err) => {
          console.error("Failed to generate PDF:", err);
        })
        .finally(() => {
          setSelectedEmployee(null);
        });
    }, 300);
  };
  const handleStatusUpdate = async (newStatus) => {
    try {
      await candidateAPI.updateCandidate(id, { ...candidate, status: newStatus });
      setCandidate(prev => ({ ...prev, status: newStatus }));
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'N/A';

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading candidate details...</div>;
  }

  if (error || !candidate) {
    return (
      <div className="p-5 sm:p-10">
        <div className="text-center p-10 sm:p-16 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error ? 'Error' : 'Candidate Not Found'}</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested candidate could not be found.'}</p>
          <button onClick={() => navigate('/')} className="bg-gray-500 text-white py-2.5 px-4 rounded-md text-sm hover:bg-gray-600 transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white p-5 rounded-xl shadow-lg mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <button onClick={() => navigate('/')} className="hidden md:block bg-gray-500 text-white py-2.5 px-4 rounded-md text-sm hover:bg-gray-600 transition-colors self-start">
            ← Back
          </button>
          <div className="flex flex-col text-center md:flex-row md:text-left items-center gap-4 flex-1">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold uppercase flex-shrink-0">
              {(candidate.personalDetails?.firstName?.charAt(0) || '') + (candidate.personalDetails?.lastName?.charAt(0) || '')}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                {candidate.personalDetails?.firstName} {candidate.personalDetails?.lastName}
              </h1>
              <p className="text-gray-500 mt-1 mb-2">
                {candidate.professionalDetails?.designation || 'No title specified'}
              </p>
              <span className={`inline-block py-1.5 px-3 rounded-full text-xs font-bold ${statusStyles[candidate.status] || statusStyles.default}`}>
                {candidate.status || 'Applied'}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <select
              value={candidate.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="p-2 border-2 border-gray-200 rounded-md bg-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="Applied">Applied</option>
              <option value="Screening">Screening</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
              <option value="On Hold">On Hold</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <div className="flex items-start gap-x-2 p-2 pb-6">
            {!editMode && (
              <button
                onClick={startEdit}
                className="bg-yellow-500 text-white py-2.5 px-4 rounded-md text-sm hover:bg-yellow-600 transition-colors"
              >
                Edit
              </button>
            )}
            {editMode && (
              <>
                <button
                  onClick={saveEdit}
                  className="bg-green-600 text-white py-2.5 px-4 rounded-md text-sm hover:bg-green-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-gray-400 text-white py-2.5 px-4 rounded-md text-sm hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </header>

        {/* Content Grid */}
        <main className="grid gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-slate-800 mb-5 pb-2.5 border-b-2 border-slate-100">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
              {editMode ? (
                <>
                  <DetailItem label="Full Name">
                    <input
                      type="text"
                      className="border p-2 rounded w-full"
                      value={editData.personalDetails.firstName}
                      onChange={e => handleEditChange('personalDetails', 'firstName', e.target.value)}
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      className="border p-2 rounded w-full mt-1"
                      value={editData.personalDetails.lastName}
                      onChange={e => handleEditChange('personalDetails', 'lastName', e.target.value)}
                      placeholder="Last Name"
                    />
                  </DetailItem>
                  <DetailItem label="Email">
                    <input
                      type="email"
                      className="border p-2 rounded w-full"
                      value={editData.personalDetails.email}
                      onChange={e => handleEditChange('personalDetails', 'email', e.target.value)}
                    />
                  </DetailItem>
                  <DetailItem label="Phone">
                    <input
                      type="text"
                      className="border p-2 rounded w-full"
                      value={editData.personalDetails.phone}
                      onChange={e => handleEditChange('personalDetails', 'phone', e.target.value)}
                    />
                  </DetailItem>
                  <DetailItem label="Date of Birth">
                    <input
                      type="date"
                      className="border p-2 rounded w-full"
                      value={editData.personalDetails.dateOfBirth?.slice(0, 10) || ''}
                      onChange={e => handleEditChange('personalDetails', 'dateOfBirth', e.target.value)}
                    />
                  </DetailItem>
                  <DetailItem label="Gender">
                    <select
                      className="border p-2 rounded w-full"
                      value={editData.personalDetails.gender}
                      onChange={e => handleEditChange('personalDetails', 'gender', e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </DetailItem>
                  <DetailItem label="Nationality">
                    <input
                      type="text"
                      className="border p-2 rounded w-full"
                      value={editData.personalDetails.nationality}
                      onChange={e => handleEditChange('personalDetails', 'nationality', e.target.value)}
                    />
                  </DetailItem>
                </>
              ) : (<>
                <DetailItem label="Full Name">{candidate.personalDetails?.firstName} {candidate.personalDetails?.lastName}</DetailItem>
                <DetailItem label="Email">{candidate.personalDetails?.email}</DetailItem>
                <DetailItem label="Phone">{candidate.personalDetails?.phone}</DetailItem>
                <DetailItem label="Date of Birth">{formatDate(candidate.personalDetails?.dateOfBirth)}</DetailItem>
                <DetailItem label="Gender">{candidate.personalDetails?.gender}</DetailItem>
                <DetailItem label="Nationality">{candidate.personalDetails?.nationality}</DetailItem>
              </>)}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-slate-800 mb-5 pb-2.5 border-b-2 border-slate-100">Address Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
              {editMode ? (
                <>
                  <DetailItem label="Street">
                    <input
                      type="text"
                      className="border p-2 rounded w-full"
                      value={editData.address?.street || ''}
                      onChange={e => handleEditChange('address', 'street', e.target.value)}
                    />
                  </DetailItem>
                  <DetailItem label="City">
                    <input
                      type="text"
                      className="border p-2 rounded w-full"
                      value={editData.address?.city || ''}
                      onChange={e => handleEditChange('address', 'city', e.target.value)}
                    />
                  </DetailItem>
                  <DetailItem label="State">
                    <input
                      type="text"
                      className="border p-2 rounded w-full"
                      value={editData.address?.state || ''}
                      onChange={e => handleEditChange('address', 'state', e.target.value)}
                    />
                  </DetailItem>
                  <DetailItem label="Country">
                    <input
                      type="text"
                      className="border p-2 rounded w-full"
                      value={editData.address?.country || ''}
                      onChange={e => handleEditChange('address', 'country', e.target.value)}
                    />
                  </DetailItem>
                  <DetailItem label="Zip Code">
                    <input
                      type="text"
                      className="border p-2 rounded w-full"
                      value={editData.address?.zipCode || ''}
                      onChange={e => handleEditChange('address', 'zipCode', e.target.value)}
                    />
                  </DetailItem>
                </>
              ) : (
                <>
                  <DetailItem label="Street">{candidate.address?.street}</DetailItem>
                  <DetailItem label="City">{candidate.address?.city}</DetailItem>
                  <DetailItem label="State">{candidate.address?.state}</DetailItem>
                  <DetailItem label="Country">{candidate.address?.country}</DetailItem>
                  <DetailItem label="Zip Code">{candidate.address?.zipCode}</DetailItem>
                </>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-slate-800 mb-5 pb-2.5 border-b-2 border-slate-100">Professional Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
              {editMode ? (
                <>
                  <DetailItem label="Job Title">
                    <input
                      type="text"
                      className="border p-2 rounded w-full"
                      value={editData.professionalDetails?.designation || ''}
                      onChange={e => handleEditChange('professionalDetails', 'designation', e.target.value)}
                    />
                  </DetailItem>
                  <DetailItem label="Employment Type">
                    <input
                      type="text"
                      className="border p-2 rounded w-full"
                      value={editData.professionalDetails?.employmentType || ''}
                      onChange={e => handleEditChange('professionalDetails', 'employmentType', e.target.value)}
                    />
                  </DetailItem>
                  <DetailItem label="Current Salary">
                    <input
                      type="number"
                      className="border p-2 rounded w-full"
                      value={editData.professionalDetails?.currentSalary || ''}
                      onChange={e => handleEditChange('professionalDetails', 'currentSalary', e.target.value)}
                    />
                  </DetailItem>
                  <DetailItem label="Expected Salary">
                    <input
                      type="number"
                      className="border p-2 rounded w-full"
                      value={editData.professionalDetails?.expectedSalary || ''}
                      onChange={e => handleEditChange('professionalDetails', 'expectedSalary', e.target.value)}
                    />
                  </DetailItem>
                  <DetailItem label="Available From">
                    <input
                      type="date"
                      className="border p-2 rounded w-full"
                      value={editData.professionalDetails?.availableFrom?.slice(0, 10) || ''}
                      onChange={e => handleEditChange('professionalDetails', 'availableFrom', e.target.value)}
                    />
                  </DetailItem>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <DetailItem label="Skills">
                      <input
                        type="text"
                        className="border p-2 rounded w-full"
                        value={arrayToCommaString(editData.professionalDetails?.skills)}
                        onChange={e => handleEditChange('professionalDetails', 'skills', commaStringToArray(e.target.value))}
                        placeholder="Comma separated skills"
                      />
                    </DetailItem>
                  </div>
                </>
              ) : (
                <>
                  {/* ...existing professional display code... */}

                  <DetailItem label="Job Title">{candidate.professionalDetails?.designation}</DetailItem>

                  <DetailItem label="Employment Type">{candidate.professionalDetails?.employmentType}</DetailItem>
                  <DetailItem label="Current Salary">{candidate.professionalDetails?.currentSalary?.toLocaleString()}</DetailItem>
                  <DetailItem label="Expected Salary">{candidate.professionalDetails?.expectedSalary?.toLocaleString()}</DetailItem>
                  <DetailItem label="Available From">{formatDate(candidate.professionalDetails?.availableFrom)}</DetailItem>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <DetailItem label="Skills">
                      <div className="flex flex-wrap gap-2 mt-1">
                        {candidate.professionalDetails?.skills?.length > 0 ? (
                          candidate.professionalDetails.skills.map((skill, index) => (
                            <span key={index} className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-1 px-3 rounded-full text-xs font-medium">{skill}</span>
                          ))
                        ) : (<span>No skills listed</span>)}
                      </div>
                    </DetailItem>
                  </div>
                </>)}
            </div>
          </div>

          {candidate.education?.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-slate-800 mb-5 pb-2.5 border-b-2 border-slate-100">Education</h3>
              <div className="space-y-4">
                {editMode ? (
                  <>
                    {(editData.education || []).map((edu, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-lg border-l-4 border-blue-500 flex flex-col gap-2">
                        <input
                          type="text"
                          className="border p-2 rounded"
                          value={edu.degree || ''}
                          onChange={e => handleArrayChange('education', idx, 'degree', e.target.value)}
                          placeholder="Degree"
                        />
                        <input
                          type="text"
                          className="border p-2 rounded"
                          value={edu.institution || ''}
                          onChange={e => handleArrayChange('education', idx, 'institution', e.target.value)}
                          placeholder="Institution"
                        />
                        <input
                          type="date"
                          className="border p-2 rounded"
                          value={edu.endDate ? edu.endDate.slice(0, 10) : ''}
                          onChange={e => handleArrayChange('education', idx, 'endDate', e.target.value)}
                          placeholder="End Date"
                        />
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded w-fit"
                          onClick={() => handleRemoveArrayItem('education', idx)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
                      onClick={() => handleAddArrayItem('education', { degree: '', institution: '', endDate: '' })}
                    >
                      Add Education
                    </button>
                  </>
                ) : (
                  <>
                    {(candidate.education || []).length > 0 ? candidate.education.map((edu, index) => (
                      <div key={index} className="bg-slate-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-bold text-slate-800">{edu.degree || 'Degree not specified'}</h4>
                        <p className="text-sm text-gray-600"><strong>Institution:</strong> {edu.institution || 'N/A'}</p>
                        <p className="text-sm text-gray-600"><strong>End Date:</strong> {formatDate(edu.endDate)}</p>
                      </div>
                    )) : <div className="text-gray-500">No education listed.</div>}
                  </>
                )}
              </div>
            </div>
          )}

          {candidate.experience?.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-slate-800 mb-5 pb-2.5 border-b-2 border-slate-100">Work Experience</h3>
              <div className="space-y-4">
                {editMode ? (
                  <>
                    {(editData.experience || []).map((exp, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-lg border-l-4 border-blue-500 flex flex-col gap-2">
                        <input
                          type="text"
                          className="border p-2 rounded"
                          value={exp.position || ''}
                          onChange={e => handleArrayChange('experience', idx, 'position', e.target.value)}
                          placeholder="Position"
                        />
                        <input
                          type="text"
                          className="border p-2 rounded"
                          value={exp.company || ''}
                          onChange={e => handleArrayChange('experience', idx, 'company', e.target.value)}
                          placeholder="Company"
                        />
                        <input
                          type="date"
                          className="border p-2 rounded"
                          value={exp.startDate ? exp.startDate.slice(0, 10) : ''}
                          onChange={e => handleArrayChange('experience', idx, 'startDate', e.target.value)}
                          placeholder="Start Date"
                        />
                        <input
                          type="date"
                          className="border p-2 rounded"
                          value={exp.endDate ? exp.endDate.slice(0, 10) : ''}
                          onChange={e => handleArrayChange('experience', idx, 'endDate', e.target.value)}
                          placeholder="End Date"
                          disabled={exp.isCurrentJob}
                        />
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!exp.isCurrentJob}
                            onChange={e => handleArrayChange('experience', idx, 'isCurrentJob', e.target.checked)}
                          />
                          Current Job
                        </label>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded w-fit"
                          onClick={() => handleRemoveArrayItem('experience', idx)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
                      onClick={() => handleAddArrayItem('experience', { position: '', company: '', startDate: '', endDate: '', isCurrentJob: false })}
                    >
                      Add Experience
                    </button>
                  </>
                ) : (
                  <>
                    {(candidate.experience || []).length > 0 ? candidate.experience.map((exp, index) => (
                      <div key={index} className="bg-slate-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-bold text-slate-800">{exp.position || 'Position not specified'}</h4>
                        <p className="text-sm text-gray-600"><strong>Company:</strong> {exp.company || 'N/A'}</p>
                        <p className="text-sm text-gray-600"><strong>Duration:</strong> {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}</p>
                      </div>
                    )) : <div className="text-gray-500">No experience listed.</div>}
                  </>
                )}
              </div>
            </div>
          )}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-slate-800 mb-5 pb-2.5 border-b-2 border-slate-100">
              Salary Slips
            </h3>
            {salarySlips.length === 0 ? (
              <div className="text-gray-500">No salary slips found for this employee.</div>
            ) : (
              <>
                <div className="mb-4 flex flex-wrap gap-2">
                  {salarySlips.slice()
                    .sort((a, b) => {
                      const [yearA, monthA] = a.month.split('-').map(Number);
                      const [yearB, monthB] = b.month.split('-').map(Number);
                      return yearA - yearB || monthA - monthB; // compare year first, then month
                    })
                    .slice(-6) // last 6 months
                    .reverse()
                    .map((slip) => {
                      const date = new Date(`${slip.month}-01`);
                      const formatted = date.toLocaleString("en-US", {
                        month: "short", // "Jan", "Feb", etc.
                        year: "numeric" // "2025"
                      });

                      return (
                        <button
                          key={slip.month}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                          onClick={() => generatePDF({ ...slip.salaryDetails, ...slip, "Employee Code": slip.employeeCode })}
                        >
                          {formatted}
                        </button>
                      );
                    })}
                </div>

                {/* Month/Year Picker */}
                <div className="flex gap-2 items-center mb-2">
                  <select
                    value={selectedSlipMonth}
                    onChange={e => setSelectedSlipMonth(e.target.value)}
                    className="border p-2 rounded"
                  >
                    <option value="">Select Month</option>
                    {Array.from(new Set(salarySlips.map(s => s.month)))
                      .sort((a, b) => new Date(`${a}-01`) - new Date(`${b}-01`)) // sort months
                      .map(month => {
                        const date = new Date(`${month}-01`);
                        const monthName = date.toLocaleString("en-US", { month: "long" }); // "Aug"
                        return (
                          <option key={month} value={month}>
                            {monthName}
                          </option>
                        );
                      })}

                  </select>
                  <select
                    value={selectedSlipYear}
                    onChange={e => setSelectedSlipYear(Number(e.target.value))}
                    className="border p-2 rounded"
                  >
                    {Array.from({ length: 6 }, (_, i) => {
                      const year = new Date().getFullYear() - 3 + i;
                      return (
                        <option key={year} value={year}>{year}</option>
                      );
                    })}
                  </select>
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    onClick={() => generatePDF({ ...slip.salaryDetails, ...slip, "Employee Code": slip.employeeCode })}
                  >
                    Download Selected
                  </button>
                </div>
              </>
            )}
          </div>
          <div
            style={{
              position: "fixed",
              left: "-9999px",
              top: "-9999px",
              zIndex: "-1",
            }}
          >
            {selectedEmployee && (
              <div ref={templateRef}>
                <SalarySlipTemplate employee={selectedEmployee} />
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default CandidateDetail;