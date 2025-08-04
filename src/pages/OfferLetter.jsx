import React, { useEffect, useRef, useState } from "react";
import { candidateAPI } from "../services/api";
import html2pdf from "html2pdf.js";
import logo from "../assets/logo.png"; // ✅ Correct logo import (must be in /assets)

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
      {/* Header - Centered */}
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
        filename: `Offer_Letter_${
          candidate.personalDetails?.firstName || "candidate"
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
        <h2
          style={{
            marginBottom: "28px",
            fontSize: "1.55rem",
            fontWeight: 700,
            color: "#222",
            letterSpacing: ".01em",
          }}
        >
          Generate Offer Letters
        </h2>
        {employees.length === 0 ? (
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
                  <th
                    style={{
                      padding: "16px",
                      borderBottom: "2px solid #ececec",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "#3d68b3",
                      textAlign: "left",
                    }}
                  >
                    Code
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      borderBottom: "2px solid #ececec",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "#3d68b3",
                      textAlign: "left",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      borderBottom: "2px solid #ececec",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "#3d68b3",
                      textAlign: "left",
                    }}
                  >
                    Designation
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      borderBottom: "2px solid #ececec",
                      fontWeight: 600,
                      fontSize: "1rem",
                      color: "#3d68b3",
                      textAlign: "center",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => {
                  const fullName = `${emp.personalDetails?.firstName || ""} ${
                    emp.personalDetails?.lastName || ""
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
                      <td style={{ padding: "16px", textAlign: "center" }}>
                        <button
                          onClick={() => handleGenerateOfferLetter(emp)}
                          style={{
                            background:
                              "linear-gradient(90deg, #3972fa, #54afff)",
                            color: "#fff",
                            padding: "9px 28px",
                            fontSize: "1rem",
                            fontWeight: 500,
                            border: "none",
                            borderRadius: "6px",
                            boxShadow: "0 2px 10px #54aef750",
                            cursor: "pointer",
                            transition: "background 0.2s, box-shadow 0.2s",
                          }}
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferLetter;
