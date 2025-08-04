import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
const logoImage = require("../assets/logo.png"); // Use your logo path

const OfferLetterTemplate = ({ candidateName, position, salary }) => {
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
          fontSize: "14.5px",
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
              Your Company Pvt Ltd
            </h2>
            <p style={{ margin: 0 }}>{today}</p>
          </div>
        </div>

        {/* Body */}
        <p>
          <strong>Subject:</strong> Employment Offer from Your Company Pvt Ltd
        </p>

        <p>
          Dear <strong>{candidateName}</strong>,
        </p>

        <p>
          We are pleased to{" "}
          <strong>offer you the position of {position}</strong> at Your Company
          Pvt Ltd.
        </p>

        <p>
          Your annual cost to company (CTC) will be{" "}
          <strong>₹{salary.toLocaleString()}</strong>
          (Rupees {salary.toLocaleString()} only). Detailed breakdown is
          attached in Annexure A.
        </p>

        <p>
          Your joining date is <strong>10/01/2024</strong> at our{" "}
          <strong>KHEDKI</strong> office. You will be a part of the{" "}
          <em>[Team Name]</em> team and will report to
          <em> [Manager Name & Designation]</em>.
        </p>

        <p>
          Please confirm your acceptance by signing and returning this offer
          letter by <em>[expiry date]</em>. Upon confirmation, we’ll initiate
          onboarding and provide asset handover instructions.
        </p>

        <p>
          We are excited to welcome you aboard and believe you will thrive in
          our dynamic and growing organization.
        </p>

        <p>Warm Regards,</p>
        <p>
          <strong>HR Team</strong>
          <br />
          Your Company Pvt Ltd
        </p>

        {/* Footer */}
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
            This is a system-generated document and does not require a physical
            signature.
          </p>
        </div>
      </div>
    </>
  );
};

export default OfferLetterTemplate;
