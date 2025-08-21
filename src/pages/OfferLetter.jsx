import React, { useEffect, useRef, useState } from "react";
import { candidateAPI } from "../services/api";
import html2pdf from "html2pdf.js";
import logo from "../assets/logo.png"; // ✅ Correct logo import (must be in /assets)
import axios from "axios";

const COMPANY_NAME = "Raymoon Services Private Limited";

function numberToWords(num) {
  if (typeof num !== "number" || isNaN(num)) return "N/A";
  if (num === 0) return "zero";

  const a = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const b = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  function inWords(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1_000)
      return (
        a[Math.floor(n / 100)] +
        " hundred" +
        (n % 100 ? " " + inWords(n % 100) : "")
      );
    if (n < 1_00_000)
      return (
        inWords(Math.floor(n / 1_000)) +
        " thousand" +
        (n % 1_000 ? " " + inWords(n % 1_000) : "")
      );
    if (n < 1_00_00_000)
      return (
        inWords(Math.floor(n / 1_00_000)) +
        " lakh" +
        (n % 1_00_000 ? " " + inWords(n % 1_00_000) : "")
      );
    return (
      inWords(Math.floor(n / 1_00_00_000)) +
      " crore" +
      (n % 1_00_00_000 ? " " + inWords(n % 1_00_00_000) : "")
    );
  }

  return inWords(num);
}

const OfferLetterTemplate = React.forwardRef(({ candidate }, ref) => {
  if (!candidate) return null;

  const name = `${candidate.personalDetails?.firstName || ""}`;
  const designation = candidate.professionalDetails?.designation || "N/A";
  const ctc = candidate.professionalDetails?.salary?.actualSalary ?? 0;
  const ctcInWords = numberToWords(ctc);
  const joiningDate = candidate.professionalDetails?.availableFrom
    ? new Date(candidate.professionalDetails.availableFrom).toLocaleDateString(
      "en-IN"
    )
    : "[joining date]";
  const location = candidate.client?.location || "[work location]";
  const currentDate = new Date().toLocaleDateString("en-IN");

  // Calculate offer expiry date (10 days after current date)
  const offerDate = new Date();
  const expiryDate = new Date();
  expiryDate.setDate(offerDate.getDate() + 10);
  const formattedExpiryDate = expiryDate.toLocaleDateString("en-IN");

  return (
    <div
      ref={ref}
      style={{
        padding: "30px 40px",
        width: "790px",
        fontFamily: "'Times New Roman', serif",
        color: "#000",
        background: "#fff",
        lineHeight: "1.6",
        fontSize: "15px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <img
          src={logo}
          alt="Company Logo"
          style={{ height: "60px", marginBottom: "10px" }}
        />
        <div style={{ fontWeight: "bold" }}>{COMPANY_NAME}</div>
        <div>{currentDate}</div>
      </div>

      {/* Subject */}
      <div
        style={{
          fontWeight: "bold",
          textDecoration: "underline",
          marginBottom: "20px",
        }}
      >
        Subject: Employment offer from {COMPANY_NAME}
      </div>

      {/* Body */}
      <div>
        Dear <b>{name}</b>,
        <br />
        <br />
        We are pleased to <b>offer you the position of {designation}</b> at{" "}
        {COMPANY_NAME}.
        <br />
        <br />
        Your annual cost to company is <b>₹ {ctc.toLocaleString()}</b> [
        {ctcInWords} rupees only]. The breakdown of your gross salary and
        details specific to employee benefits can be found in Annexure A.
        <br />
        <br />
        We would like you to start work on <b>{joiningDate}</b> from the base
        location, <b>{location}</b>.
        <br />
        You will work with the <b>{designation}</b> team and report directly to
        [manager's name and designation].
        <br />
        <br />
        If you choose to accept this job offer, please sign and return this
        letter by <b>{formattedExpiryDate}</b>. Once we receive your acceptance,
        we will provide further details regarding onboarding and other
        formalities.
        <br />
        <br />
        We are confident that you will find this opportunity fulfilling. On
        behalf of {COMPANY_NAME}, I assure you of a rewarding career in our
        organization.
        <br />
        <br />
        Sincerely,
        <br />
        <br />
        HR Team
        <br />
        {COMPANY_NAME}
        <br />
        <br />
        _______________________
        <br />
        Signature
      </div>
    </div>
  );
});

const OfferLetter = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const templateRef = useRef();

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await candidateAPI.getAllCandidates({
        isEmployee: true,
        page: 1,
        limit: 1000,
      });
      setEmployees(data.candidates || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };
  async function downloadOfferLetter(code) {
    try {
      const response = await fetch("https://hrms-backend-tawny.vercel.app/generate-offer-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeCode: code,
        }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "OfferLetter.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.log(e)
    }
  }
  async function sendOfferLetter(code) {
    try {
      const { data } = await axios.post("https://hrms-backend-tawny.vercel.app/send-offer-letter", {
        employeeCode: code || selectedWorker?.code || selectedWorker?._id,
      });

      alert(data.message);
    } catch (e) {
      console.log(e)
      alert(e?.response?.data?.message)
    }
  }
  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleGenerateOfferLetter = (candidate) => {
    setSelectedCandidate(candidate);

    setTimeout(() => {
      const element = templateRef.current;
      if (!element) return;

      const opt = {
        margin: 0.3,
        filename: `Offer_Letter_${candidate.personalDetails?.firstName || "candidate"
          }.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: {
          unit: "pt",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: { mode: ["avoid-all"] },
      };

      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => setSelectedCandidate(null));
    }, 200);
  };

  if (loading) return <div>Loading employees...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  // Filtering logic
  const filteredEmployees = employees.filter((emp) => {
    const code = emp.code?.toLowerCase() || "";
    const fullName = `${emp.personalDetails?.firstName || ""} ${emp.personalDetails?.lastName || ""
      }`.toLowerCase();
    return (
      code.includes(searchTerm.toLowerCase()) ||
      fullName.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f9fd",
        padding: "36px 0",
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      <div
        style={{
          margin: "0 auto",
          maxWidth: "1020px",
          padding: "32px 16px",
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 24px #458fff11, 0 1.5px 4px #0001",
          border: "1px solid #eaeaea",
        }}
      >
        {/* Title + Search Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "28px",
          }}
        >
          <h2
            style={{
              fontSize: "1.55rem",
              fontWeight: 700,
              color: "#222",
              letterSpacing: ".01em",
              margin: 0,
            }}
          >
            Generate Offer Letters
          </h2>
          <input
            type="text"
            placeholder="Search by Name or Code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "0.95rem",
              width: "240px",
              outline: "none",
            }}
          />
        </div>

        {filteredEmployees.length === 0 ? (
          <div style={{ color: "#888", textAlign: "center", padding: "32px" }}>
            No employee candidates found.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                minWidth: "100%",
                background: "#fff",
                borderCollapse: "separate",
                borderSpacing: 0,
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{ background: "#f0f4fa" }}>
                  <th style={thStyle}>Code</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Designation</th>
                  <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp, idx) => {
                  const fullName = `${emp.personalDetails?.firstName || ""} ${emp.personalDetails?.lastName || ""
                    }`.trim();
                  return (
                    <tr
                      key={emp._id}
                      style={{
                        textAlign: "left",
                        background: idx % 2 === 0 ? "#fbfcff" : "#f6f9fd",
                        transition: "background 0.2s",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#e9f1fe";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background =
                          idx % 2 === 0 ? "#fbfcff" : "#f6f9fd";
                      }}
                    >
                      <td style={{ padding: "16px" }}>{emp.code || "N/A"}</td>
                      <td style={{ padding: "16px" }}>{fullName}</td>
                      <td style={{ padding: "16px" }}>
                        {emp.professionalDetails?.designation || "N/A"}
                      </td>
                      <td style={{ padding: "16px", textAlign: "center", gap: 2 }}>
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleGenerateOfferLetter(emp)}
                            style={buttonStyle}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background =
                                "linear-gradient(90deg,#2453cc,#54afff)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background =
                                "linear-gradient(90deg, #3972fa, #54afff)";
                            }}
                          >
                            Generate Offer Letter
                          </button>
                          <button
                            onClick={() => downloadOfferLetter(emp.code)}
                            style={buttonStyle}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background =
                                "linear-gradient(90deg,#2453cc,#54afff)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background =
                                "linear-gradient(90deg, #3972fa, #54afff)";
                            }}
                          >
                            Swiggy Offer Letter
                          </button>
                          <button
                            onClick={() => sendOfferLetter(emp.code)}
                            style={buttonStyle}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background =
                                "linear-gradient(90deg,#2453cc,#54afff)";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background =
                                "linear-gradient(90deg, #3972fa, #54afff)";
                            }}
                          >
                            Send Offer Letter
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Hidden Printable Template */}
        <div
          style={{
            position: "fixed",
            left: "-9999px",
            top: "-9999px",
            zIndex: "-1",
          }}
        >
          {selectedCandidate && (
            <OfferLetterTemplate
              ref={templateRef}
              candidate={selectedCandidate}
              candidateName={`${selectedCandidate.personalDetails?.firstName || ""} ${selectedCandidate.personalDetails?.lastName || ""}`.trim()}
              position={selectedCandidate.professionalDetails?.designation || ""}
              dateOfAppointment={
                selectedCandidate.professionalDetails?.availableFrom
                  ? new Date(selectedCandidate.professionalDetails.availableFrom).toLocaleDateString("en-IN")
                  : ""
              }
              initialPosting={selectedCandidate.client?.location || "RAYMOON II Gurugram"}
              monthlyNTH={selectedCandidate.professionalDetails?.salary?.actualSalary?.toLocaleString("en-IN") || ""}
              location={selectedCandidate.client?.location || "Raymoon Service Pvt Ltd (Gurgaon)"}
              dateOfJoining={
                selectedCandidate.professionalDetails?.availableFrom
                  ? new Date(selectedCandidate.professionalDetails.availableFrom).toLocaleDateString("en-IN")
                  : ""
              }
              designation={selectedCandidate.professionalDetails?.designation || ""}
              terms={{
                revenueTarget: "7X",
                incentivePercent: "5%",
              }}
            />

          )}
        </div>
      </div>
    </div>
  );
};

// Common styles
const thStyle = {
  padding: "16px",
  borderBottom: "2px solid #ececec",
  fontWeight: 600,
  fontSize: "1rem",
  color: "#3d68b3",
  textAlign: "left",
};

const buttonStyle = {
  background: "linear-gradient(90deg, #3972fa, #54afff)",
  color: "#fff",
  padding: "9px 28px",
  fontSize: "1rem",
  fontWeight: 500,
  border: "none",
  borderRadius: "6px",
  boxShadow: "0 2px 10px #54aef750",
  cursor: "pointer",
  transition: "background 0.2s, box-shadow 0.2s",
};

export default OfferLetter;
