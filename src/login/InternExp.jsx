import React, { useState } from "react";

// Mock Database containing nested structure (Year -> Company -> Person)
const INTERN_DATABASE = {
  "Year 1": {
    "Company 1": [
      {
        name: "Person 1",
        role: "Software Engineering Intern",
        experience: "Excellent experience learning cloud-native technologies. Handled scaling backend routes and containerized microservices. The interview had one DSA round and one system design round.",
        tips: "Focus on Graph algorithms, OS threading concepts, and system design basics."
      },
      {
        name: "Person 2",
        role: "Product Management Intern",
        experience: "Worked closely with the design team on user workflows and metrics tracking. The interview focused on product thinking, case interviews, and behavioral questions.",
        tips: "Practice product estimation and structure responses using framework guidelines."
      }
    ],
    "Company 2": [
      {
        name: "Person 1",
        role: "Data Science Intern",
        experience: "Worked on predictive demand forecasting algorithms using time-series models. Interview process was heavily focused on probability, SQL, and machine learning fundamentals.",
        tips: "Review fundamental statistics, linear regression assumptions, and practice SQL joins."
      },
      {
        name: "Person 2",
        role: "Quantitative Analyst Intern",
        experience: "Developed mathematical frameworks for risk assessment and automated trading strategies. Fast-paced coding and math tests.",
        tips: "Be extremely fast with mental math, expectation values, and basic probability puzzles."
      }
    ]
  },
  "Year 2": {
    "Company 1": [
      {
        name: "Person 1",
        role: "Software Development Intern",
        experience: "Implemented clean backend architectures using Node.js and MongoDB. Focus was on DB indexes and payload optimization.",
        tips: "Master relational database basics, index mechanisms, and REST API standards."
      },
      {
        name: "Person 2",
        role: "Security Research Intern",
        experience: "Conducted security audits, code vulnerability reviews, and security framework configurations. Interview had active CTF challenges.",
        tips: "Practice CTF tasks and study web app vulnerabilities (XSS, CSRF, Injection)."
      }
    ],
    "Company 2": [
      {
        name: "Person 1",
        role: "Hardware Engineering Intern",
        experience: "Designed VLSI circuits and ran comprehensive verification test benches. Deep focus on digital logic design.",
        tips: "Understand setup and hold times, Verilog programming, and logic gates."
      },
      {
        name: "Person 2",
        role: "Business Analyst Intern",
        experience: "Created complex marketing attribution models and dashboards. The interview involved building a live Excel scenario and explaining slides.",
        tips: "Understand corporate finance basics, pivot tables, and statistical distribution graphs."
      }
    ]
  }
};

export const InternExp = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Styling Objects
  const containerStyle = {
    padding: "60px 20px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif"
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: "50px"
  };

  const titleStyle = {
    fontSize: "44px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "16px",
    letterSpacing: "-0.5px"
  };

  const subtitleStyle = {
    fontSize: "18px",
    color: "#64748b",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: "1.6"
  };

  const breadcrumbStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px",
    maxWidth: "1000px",
    margin: "0 auto 30px auto",
    fontSize: "14px",
    fontWeight: "600",
    color: "#64748b"
  };

  const breadcrumbLinkStyle = {
    cursor: "pointer",
    color: "#3b82f6",
    textDecoration: "none",
    transition: "color 0.2s ease"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    maxWidth: "1000px",
    margin: "0 auto"
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "32px 24px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "180px",
    textAlign: "center"
  };

  const cardHoverStyle = {
    transform: "translateY(-6px)",
    boxShadow: "0 12px 20px -8px rgba(59, 130, 246, 0.15), 0 4px 12px -2px rgba(59, 130, 246, 0.1)",
    borderColor: "#3b82f6"
  };

  const cardTitleStyle = {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "8px"
  };

  const cardSubtitleStyle = {
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };

  const listContainerStyle = {
    maxWidth: "1000px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  };

  const personCardStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s ease"
  };

  const nameHeaderStyle = {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "4px"
  };

  const roleBadgeStyle = {
    display: "inline-block",
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "13px",
    fontWeight: "600",
    padding: "6px 12px",
    borderRadius: "20px",
    marginBottom: "20px"
  };

  const sectionTitleStyle = {
    fontSize: "14px",
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "8px"
  };

  const textBodyStyle = {
    fontSize: "15px",
    color: "#334155",
    lineHeight: "1.6",
    marginBottom: "20px"
  };

  const tipsBoxStyle = {
    backgroundColor: "#f0fdf4",
    borderLeft: "4px solid #22c55e",
    borderRadius: "0 8px 8px 0",
    padding: "16px 20px"
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setSelectedCompany(null);
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
  };

  const resetAll = () => {
    setSelectedYear(null);
    setSelectedCompany(null);
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h2 style={titleStyle}>Internship Corner</h2>
        <p style={subtitleStyle}>
          Discover placement test reviews, interview experiences, and key preparation tips from student interns.
        </p>
      </div>

      {/* Breadcrumbs Navigation */}
      {(selectedYear || selectedCompany) && (
        <div style={breadcrumbStyle}>
          <span style={breadcrumbLinkStyle} onClick={resetAll}>All Years</span>
          <span>&rarr;</span>
          {selectedYear && !selectedCompany ? (
            <span>{selectedYear}</span>
          ) : (
            <>
              <span style={breadcrumbLinkStyle} onClick={() => handleYearSelect(selectedYear)}>
                {selectedYear}
              </span>
              <span>&rarr;</span>
              <span>{selectedCompany}</span>
            </>
          )}
        </div>
      )}

      {/* Level 1: Select Year */}
      {!selectedYear && (
        <div style={gridStyle}>
          {Object.keys(INTERN_DATABASE).map((year) => (
            <div
              key={year}
              style={cardStyle}
              onClick={() => handleYearSelect(year)}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyle);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, cardStyle);
              }}
            >
              <div style={cardTitleStyle}>{year}</div>
              <div style={cardSubtitleStyle}>Select Year</div>
            </div>
          ))}
        </div>
      )}

      {/* Level 2: Select Company */}
      {selectedYear && !selectedCompany && (
        <div style={gridStyle}>
          {Object.keys(INTERN_DATABASE[selectedYear]).map((company) => (
            <div
              key={company}
              style={cardStyle}
              onClick={() => handleCompanySelect(company)}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyle);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, cardStyle);
              }}
            >
              <div style={cardTitleStyle}>{company}</div>
              <div style={cardSubtitleStyle}>View Interviews</div>
            </div>
          ))}
        </div>
      )}

      {/* Level 3: Show People in Selected Company */}
      {selectedYear && selectedCompany && (
        <div style={listContainerStyle}>
          {INTERN_DATABASE[selectedYear][selectedCompany].map((person, index) => (
            <div key={index} style={personCardStyle}>
              <div style={nameHeaderStyle}>{person.name}</div>
              <span style={roleBadgeStyle}>{person.role}</span>
              
              <div>
                <div style={sectionTitleStyle}>Placement Experience</div>
                <p style={textBodyStyle}>{person.experience}</p>
              </div>

              <div style={tipsBoxStyle}>
                <div style={{ ...sectionTitleStyle, color: "#166534" }}>Preparation Tips & Resources</div>
                <p style={{ ...textBodyStyle, color: "#14532d", margin: 0 }}>{person.tips}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternExp;