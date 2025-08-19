import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const logoImage = require("../assets/logo.png"); // Update with your logo path

const OfferLetterTemplate = ({
  candidateName,
  position,
  dateOfAppointment,
  monthlyNTH,
  initialPosting,
  salaryIncrementPolicy,
  leavePolicy,
  travelPolicy,
  noticePeriod,
  resignationNotice,
  policeVerificationDeadline,
  transferClause,
  codeOfConduct,
  backgroundVerification,
  terms, // Array or object with fields: revenueTarget, failureClause, incentiveClause
  location,
  dateOfJoining,
  designation,
}) => {
  const printRef = useRef();
  const today = new Date().toLocaleDateString("en-GB");

  const handleDownload = () => {
    html2canvas(printRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Offer_Letter.pdf");
    });
  };

  return (
    <>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <button
          onClick={handleDownload}
          style={{
            padding: "10px 20px",
            backgroundColor: "#004080",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Download Offer Letter
        </button>
      </div>

      <div
        ref={printRef}
        style={{
          width: "800px",
          margin: "auto",
          padding: "50px",
          fontFamily: "'Segoe UI', sans-serif",
          fontSize: "15px",
          lineHeight: "1.8",
          color: "#000",
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            borderBottom: "2px solid #000",
            paddingBottom: "15px",
            marginBottom: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img
            src={logoImage}
            alt="Company Logo"
            style={{ height: "60px", objectFit: "contain" }}
          />
          <div style={{ textAlign: "right" }}>
            <h2 style={{ margin: 0, fontWeight: "600" }}>
              Raymoon Services Private Limited
            </h2>
            <p style={{ margin: 0 }}>{today}</p>
          </div>
        </div>

        {/* Offer Letter Body */}
        <h3 style={{ textAlign: "center", fontWeight: "bold" }}>
          OFFER CUM APPOINTMENT LETTER
        </h3>
        <p>
          Date: <span>{today}</span>
          <br />
          Dear: <strong>{candidateName}</strong>
        </p>
        <p>
          We are pleased to offer you the position of <strong>{position}</strong> on the following terms &amp; conditions.<br />
          We trust that your knowledge, skills and experience will be among our most valuable assets.
        </p>

        <p>
          <strong>DATE OF APPOINTMENT:</strong>
          <ul>
            <li>Your date of appointment will be <strong>{dateOfAppointment}</strong>.</li>
            <li>Your initial posting will be at <strong>{initialPosting || "RAYMOON II Gurugram"}</strong>.</li>
            <li>Your monthly NTH will be Rs. <strong>{monthlyNTH}</strong>.</li>
          </ul>
        </p>
        <p>
          <strong>SALARY INCREASE:</strong> {salaryIncrementPolicy ||
            "Increase in your salary will be reviewed periodically as per the policy of the Company. Increments in the salary range will be on the basis of demonstrated results and effectiveness of performance during the period of review."}
        </p>
        <p>
          <strong>LEAVE:</strong> {leavePolicy ||
            "You will be governed by the current Leave Policy of the company for permanent employees, till the probation period of six month you are not eligible for any paid leaves."}
        </p>
        <p>
          <strong>TRAVEL:</strong> {travelPolicy ||
            "Whenever you are required to undertake travel on Company work, you will be reimbursed travel expenses as per Company rules."}
        </p>
        <p>
          <strong>RESPONSIBILITY:</strong> In view of your office, you must effectively perform to ensure results. Your performance would be reviewed as per the Company’s Performance Management System.
        </p>
        <p>
          <strong>NOTICE PERIOD:</strong>
          <ul>
            <li>If company is closing the operations at site then this can be terminated with <strong>{noticePeriod || "seven days prior notice"}</strong> </li>
            <li>If you resign from the services then you have to serve <strong>{resignationNotice || "15 days’ notice period"}</strong>. Else there will be notice pay recovery.</li>
            <li>All employees need to submit their latest police verification certificate before or within <strong>{policeVerificationDeadline || "15 days of joining"}</strong>. Else salary will be on hold.</li>
          </ul>
        </p>
        <p>
          <strong>TRANSFER:</strong> {transferClause ||
            "You will be liable to be transferred to any other department or establishment or branch or subsidiary of the Company in India or abroad. In such a case, you will be governed by the terms and conditions of service as applicable to the new assignment."}
        </p>
        <p>
          <strong>CODE OF CONDUCT:</strong> {codeOfConduct ||
            "You shall not be engaged in any act subversion of discipline in the course of your duties for the client within the client’s organization or outside it, & if you are at any time found indulging in such act/s, the company reserves the right to initiate disciplinary action as deserved fit against you."}
        </p>
        <p>
          <strong>BACKGROUND VERIFICATION:</strong> {backgroundVerification ||
            "The company reserves the right to have your background verified directly or through an outside agency. If on such verification it is found that you have furnished wrong information or concealed any material information, your services are liable to be terminated."}
        </p>
        <p>
          <strong>GENERAL:</strong>
          The above terms and conditions are based on Company Policy, Procedures and other Rules and Regulations currently applicable to the Company’s employees and are subject to amendments and adjustments from time-to-time.<br />
          Please communicate your acceptance of this appointment by signing a copy of this letter and returning it to us. Here’s wishing you the very best in your assignment with us and as a token of your understanding and accepting the standard term of employment, you are requested to sign the duplicate copy of the letter and return within a day.
        </p>
        <p>
          <strong>Terms:</strong>
          <ul>
            <li>
              You need to achieve <strong>{terms?.revenueTarget || "7X"}</strong> revenue on your salary. If you failed to achieve you will get layout on performance basis.
            </li>
            <li>
              If you succeed to generate <strong>{terms?.revenueTarget || "7X"}</strong> revenue you will get <strong>{terms?.incentivePercent || "5%"}</strong> Incentive on total sourcing fee (Once payment received from clients) apart from salary.
            </li>
          </ul>
        </p>
        <p style={{ marginTop: "35px", marginBottom: "4px" }}>
          Name: <strong>{candidateName}</strong>
        </p>
        <p>
          Location: <strong>{location || "Raymoon Service Pvt Ltd (Gurgaon)"}</strong><br />
          Date of Joining: <strong>{dateOfJoining}</strong><br />
          Designation: <strong>{designation}</strong>
        </p>
        <br />
        <p>Yours Truly,</p>
        <p>
          For Raymoon Services Private Limited
          <br />
          <span style={{ marginTop: "35px", display: "block" }}>Authorized Signatory</span>
        </p>

        <div
          style={{
            borderTop: "1px solid #999",
            marginTop: "50px",
            paddingTop: "10px",
            fontSize: "12px",
            color: "#555",
            textAlign: "center",
          }}
        >
          <p>
            This is a system-generated document and does not require a physical signature.
          </p>
        </div>
      </div>
    </>
  );
};

export default OfferLetterTemplate;
