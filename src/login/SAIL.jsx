import React, { useState, useEffect } from "react";
import { Navigation } from "./navigation";
import { Header } from "./header";
import JsonData from "../data login/data.json";
import SmoothScroll from "smooth-scroll";
import "../App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
    speed: 1000,
    speedAsDuration: true,
});

const containerStyle = {
    padding: "30px 15px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh"
};

const filtersContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "30px",
    padding: "25px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e2e8f0"
};

const filterGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
};

const filterLabelStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "4px"
};

const selectStyle = {
    padding: "10px 12px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#374151",
    backgroundColor: "white",
    cursor: "pointer",
    transition: "all 0.2s ease",
    minWidth: "180px",
    outline: "none"
};

const tableContainerStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e2e8f0"
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white"
};

const tableHeaderStyle = {
    padding: "20px 24px",
    textAlign: "left",
    fontWeight: "700",
    backgroundColor: "#1e293b",
    color: "white",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "none"
};

const yearHeaderStyle = {
    ...tableHeaderStyle,
    width: "180px",
    textAlign: "left"
};

const tableCellStyle = {
    padding: "18px 24px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "15px",
    color: "#475569",
    fontWeight: "500"
};

const yearCellStyle = {
    ...tableCellStyle,
    width: "180px",
    textAlign: "left",
    padding: "18px 24px"
};

const tableRowStyle = {
    cursor: "pointer",
    backgroundColor: "white",
    transition: "all 0.2s ease"
};

const tableRowHoverStyle = {
    backgroundColor: "#f8fafc",
    transform: "translateY(-1px)"
};

const contactCardContainerStyle = {
    marginTop: "30px",
    padding: "30px",
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e2e8f0"
};

const cardNavigationStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
    padding: "16px 20px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    gap: "10px"
};

const navButtonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(59, 130, 246, 0.2)"
};

const navButtonDisabledStyle = {
    ...navButtonStyle,
    backgroundColor: "#cbd5e1",
    cursor: "not-allowed",
    boxShadow: "none"
};

const contactCardStyle = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "20px",
    padding: "0",
    color: "white",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    position: "relative",
    maxWidth: "500px",
    margin: "0 auto"
};

const cardHeaderStyle = {
    padding: "30px 30px 20px 30px",
    textAlign: "center",
    position: "relative"
};

const profileImageStyle = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    border: "4px solid rgba(255, 255, 255, 0.3)",
    margin: "0 auto 20px auto",
    objectFit: "cover",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)"
};

const roleTagStyle = {
    position: "absolute",
    top: "20px",
    right: "20px",
    padding: "6px 12px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    backdropFilter: "blur(10px)"
};

const nameStyle = {
    fontSize: "28px",
    fontWeight: "700",
    margin: "0 0 8px 0",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
};

const titleStyle = {
    fontSize: "16px",
    fontWeight: "500",
    opacity: "0.9",
    margin: "0"
};

const cardBodyStyle = {
    padding: "0 30px 30px 30px"
};

const infoSectionStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    backdropFilter: "blur(10px)"
};

const infoRowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px"
};

const infoIconStyle = {
    width: "20px",
    height: "20px",
    opacity: "0.9"
};

const infoTextStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.95)"
};

const socialLinksStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "16px"
};

const socialLinkStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "48px",
    height: "48px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    color: "white",
    textDecoration: "none",
    transition: "all 0.2s ease",
    backdropFilter: "blur(10px)"
};

const SAIL = () => {
    const [landingPageData, setLandingPageData] = useState({});
    const [alumni, setAlumni] = useState([]);
    const [filteredAlumni, setFilteredAlumni] = useState([]);
    const [connections, setConnections] = useState(null);
    const [companyFilter, setCompanyFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [hoveredRow, setHoveredRow] = useState(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    useEffect(() => {
        setLandingPageData(JsonData);

        fetch("http://localhost:3000/api/alumni")
            .then(res => res.json())
            .then(data => {
                setAlumni(data);
                setFilteredAlumni(data);
            })
            .catch(err => console.error("Error fetching alumni:", err));
    }, []);

    useEffect(() => {
        let filtered = alumni;

        if (companyFilter) {
            filtered = filtered.filter(a => a.company === companyFilter);
        }

        if (roleFilter) {
            filtered = filtered.filter(a => a.role === roleFilter);
        }

        if (yearFilter) {
            filtered = filtered.filter(a => a.passoutYear === parseInt(yearFilter));
        }

        setFilteredAlumni(filtered);
    }, [alumni, companyFilter, roleFilter, yearFilter]);

    const viewConnections = (selectedPersonId) => {
        // Find the selected person from the alumni data
        const selectedPerson = alumni.find(person => person.id === selectedPersonId);
        if (!selectedPerson) return;

        // Build the mentor chain by following mentorId recursively
        const buildMentorChain = (personId) => {
            const mentorChain = [];
            let currentPersonId = personId;
            const visited = new Set(); // Prevent infinite loops

            // Start with the current person and work our way up the mentor chain
            while (currentPersonId && !visited.has(currentPersonId)) {
                visited.add(currentPersonId);
                
                const currentPerson = alumni.find(p => p.id === currentPersonId);
                if (!currentPerson) break;

                // If this person has a mentor, find the mentor and add them to the chain
                if (currentPerson.mentorId) {
                    const mentor = alumni.find(m => m.id === currentPerson.mentorId);
                    if (mentor) {
                        mentorChain.push(mentor);
                        currentPersonId = mentor.id; // Continue with the mentor's mentor
                    } else {
                        break; // Mentor not found in data
                    }
                } else {
                    break; // No more mentors
                }
            }
            
            return mentorChain;
        };

        const mentorChain = buildMentorChain(selectedPersonId);
        
        setConnections({
            selectedPerson: selectedPerson,
            mentorChain: mentorChain
        });
        
        // Start viewing from the selected person (last position in chain)
        const totalChainLength = mentorChain.length + 1; // mentors + selected person
        setCurrentCardIndex(totalChainLength - 1); // Start at selected person
    };

    const buildContactChain = () => {
        if (!connections) return [];
        
        const chain = [];
        
        // Add mentors in hierarchy order (most senior first)
        // Create a copy and reverse it so we don't mutate the original array
        if (connections.mentorChain && connections.mentorChain.length > 0) {
            chain.push(...[...connections.mentorChain].reverse());
        }
        
        // Add the selected person at the end (most junior in the chain)
        chain.push({
            ...connections.selectedPerson,
            isSelected: true
        });
        
        return chain;
    };

    const navigateCard = (direction) => {
        const chain = buildContactChain();
        if (direction === 'prev' && currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
        } else if (direction === 'next' && currentCardIndex < chain.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
        }
    };

    const renderContactCard = (person, index) => {
        const gradients = [
            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
            "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
        ];
        
        const gradient = gradients[index % gradients.length];
        
        // Determine the person's role in the hierarchy
        const chain = buildContactChain();
        let personRole;
        
        if (person.isSelected) {
            personRole = "SELECTED PERSON";
        } else {
            const mentorLevel = chain.length - index - 2; // Calculate how many levels up
            if (mentorLevel === 0) {
                personRole = "DIRECT MENTOR";
            } else if (mentorLevel === 1) {
                personRole = "SENIOR MENTOR";
            } else {
                personRole = `SENIOR MENTOR (Level ${mentorLevel + 1})`;
            }
        }
        
        return (
            <div style={{...contactCardStyle, background: gradient}}>
                <div style={cardHeaderStyle}>
                    <div style={roleTagStyle}>
                        {personRole}
                    </div>
                    <img 
                        src={person.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&size=120&background=random`}
                        alt={person.name}
                        style={profileImageStyle}
                    />
                    <h2 style={nameStyle}>{person.name}</h2>
                    <p style={titleStyle}>{person.role} at {person.company}</p>
                </div>
                
                <div style={cardBodyStyle}>
                    <div style={infoSectionStyle}>
                        <div style={infoRowStyle}>
                            <svg style={infoIconStyle} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                            <span style={infoTextStyle}>{person.email || 'Email not available'}</span>
                        </div>
                        
                        <div style={infoRowStyle}>
                            <svg style={infoIconStyle} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                            </svg>
                            <span style={infoTextStyle}>{person.location || 'Location not specified'}</span>
                        </div>
                        
                        <div style={infoRowStyle}>
                            <svg style={infoIconStyle} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                            <span style={infoTextStyle}>Passout Year: {person.passoutYear || 'N/A'}</span>
                        </div>
                    </div>
                    
                    <div style={socialLinksStyle}>
                        <a 
                            href={person.linkedin || '#'} 
                            style={socialLinkStyle}
                            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                        >
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                        
                        <a 
                            href={`mailto:${person.email}`} 
                            style={socialLinkStyle}
                            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                        >
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.9.732-1.636 1.636-1.636h.749L12 10.927l9.615-7.106h.749A1.636 1.636 0 0 1 24 5.457z"/>
                            </svg>
                        </a>
                        
                        <a 
                            href={person.github || '#'} 
                            style={socialLinkStyle}
                            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                        >
                            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        );
    };

    // Get unique companies, roles, and years for filter options
    const uniqueCompanies = [...new Set(alumni.map(a => a.company))].sort();
    const uniqueRoles = [...new Set(alumni.map(a => a.role))].sort();
    const uniqueYears = [...new Set(alumni.map(a => a.passoutYear))].sort((a, b) => b - a);

    return (
        <div>
            <Navigation />
            <Header data={landingPageData.SAILHeader} />

            <div style={containerStyle}>
                {/* Filters */}
                <div style={filtersContainerStyle}>
                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Company</label>
                        <select
                            style={selectStyle}
                            value={companyFilter}
                            onChange={(e) => setCompanyFilter(e.target.value)}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        >
                            <option value="">All Companies</option>
                            {uniqueCompanies.map(company => (
                                <option key={company} value={company}>{company}</option>
                            ))}
                        </select>
                    </div>

                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Role</label>
                        <select
                            style={selectStyle}
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        >
                            <option value="">All Roles</option>
                            {uniqueRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Passout Year</label>
                        <select
                            style={selectStyle}
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        >
                            <option value="">All Years</option>
                            {uniqueYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div style={filterGroupStyle}>
                        <label style={filterLabelStyle}>Results</label>
                        <div style={{
                            padding: "10px 12px",
                            backgroundColor: "#f1f5f9",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#475569",
                            minWidth: "100px",
                            textAlign: "center"
                        }}>
                            {filteredAlumni.length} of {alumni.length}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div style={tableContainerStyle}>
                    <div style={{ maxHeight: "600px", overflowY: "auto", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                        <table style={tableStyle}>
                            <thead style={{ position: "sticky", top: "0", zIndex: "10" }}>
                                <tr>
                                    <th style={tableHeaderStyle}>Name</th>
                                    <th style={tableHeaderStyle}>Company</th>
                                    <th style={tableHeaderStyle}>Role</th>
                                    <th style={yearHeaderStyle}>Passout Year</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAlumni.map(a => (
                                    <tr
                                        key={a.id}
                                        style={{
                                            ...tableRowStyle,
                                            ...(hoveredRow === a.id ? tableRowHoverStyle : {})
                                        }}
                                        onClick={() => viewConnections(a.id)}
                                        onMouseEnter={() => setHoveredRow(a.id)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                    >
                                        <td style={{
                                            ...tableCellStyle,
                                            fontWeight: "600",
                                            color: "#1e293b"
                                        }}>{a.name}</td>
                                        <td style={tableCellStyle}>{a.company}</td>
                                        <td style={{
                                            ...tableCellStyle,
                                            color: "#6366f1",
                                            fontWeight: "500"
                                        }}>{a.role}</td>
                                        <td style={{
                                            ...yearCellStyle,
                                            color: "#059669",
                                            fontWeight: "600"
                                        }}>{a.passoutYear}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Contact Cards - Mentorship Chain */}
                {connections && (
                    <div style={contactCardContainerStyle}>
                        <div style={cardNavigationStyle}>
                            <button 
                                style={currentCardIndex > 0 ? navButtonStyle : navButtonDisabledStyle}
                                onClick={() => navigateCard('prev')}
                                disabled={currentCardIndex === 0}
                                onMouseOver={(e) => {
                                    if (currentCardIndex > 0) {
                                        e.target.style.backgroundColor = '#2563eb';
                                        e.target.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (currentCardIndex > 0) {
                                        e.target.style.backgroundColor = '#3b82f6';
                                        e.target.style.transform = 'translateY(0)';
                                    }
                                }}
                            >
                                ← Previous (Senior)
                            </button>
                            
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "4px"
                            }}>
                                <span style={{
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    color: "#1e293b"
                                }}>
                                    Mentorship Hierarchy
                                </span>
                                <span style={{
                                    fontSize: "14px",
                                    color: "#64748b"
                                }}>
                                    {currentCardIndex + 1} of {buildContactChain().length}
                                </span>
                            </div>
                            
                            <button 
                                style={currentCardIndex < buildContactChain().length - 1 ? navButtonStyle : navButtonDisabledStyle}
                                onClick={() => navigateCard('next')}
                                disabled={currentCardIndex >= buildContactChain().length - 1}
                                onMouseOver={(e) => {
                                    if (currentCardIndex < buildContactChain().length - 1) {
                                        e.target.style.backgroundColor = '#2563eb';
                                        e.target.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (currentCardIndex < buildContactChain().length - 1) {
                                        e.target.style.backgroundColor = '#3b82f6';
                                        e.target.style.transform = 'translateY(0)';
                                    }
                                }}
                            >
                                Next (Junior) →
                            </button>
                        </div>
                        
                        {buildContactChain()[currentCardIndex] && renderContactCard(buildContactChain()[currentCardIndex], currentCardIndex)}
                        
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "8px",
                            marginTop: "20px"
                        }}>
                            {buildContactChain().map((_, index) => (
                                <div
                                    key={index}
                                    style={{
                                        width: "12px",
                                        height: "12px",
                                        borderRadius: "50%",
                                        backgroundColor: currentCardIndex === index ? "#3b82f6" : "#cbd5e1",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease"
                                    }}
                                    onClick={() => setCurrentCardIndex(index)}
                                />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SAIL;