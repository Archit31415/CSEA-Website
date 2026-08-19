import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navigation } from "./navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Verify OTP
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { text, type: "success" | "error" }
  
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/cseatemp/student";

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.endsWith("@iitg.ac.in")) {
      setMessage({
        text: "Only IIT Guwahati email addresses (@iitg.ac.in) are allowed.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setMessage({ text: `OTP sent successfully to ${cleanEmail}. Please check your inbox.`, type: "success" });
        setStep(2);
      } else {
        setMessage({ text: data.error || "Failed to send OTP.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Server error. Please ensure the backend server is running.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!otp.trim() || otp.trim().length !== 6) {
      setMessage({ text: "Please enter a valid 6-digit OTP.", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim() }),
        credentials: "include", // Essential for storing session cookies
      });
      const data = await response.json();

      if (data.success) {
        setMessage({ text: "Verification successful! Logging you in...", type: "success" });
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      } else {
        setMessage({ text: data.error || "Incorrect or expired OTP.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Server error. Please verify the backend status.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navigation />
      <div className="login-page-container">
        <div className="login-card">
          <h2>Student Portal Login</h2>
          <p>Verify your IITG identity to access CSEA games and resources</p>

          {message && (
            <div className={`login-alert ${message.type}`}>
              {message.text}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <div className="login-form-group">
                <label htmlFor="email">IITG Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="username@iitg.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="btn-login"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Request Verification Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="login-form-group">
                <label htmlFor="otp">Enter 6-Digit OTP</label>
                <input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="login-input"
                  style={{ letterSpacing: "4px", textAlign: "center", fontSize: "20px" }}
                  required
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="btn-login"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP & Login"}
              </button>
              <div className="login-footer-link">
                Didn't get the code? <a onClick={() => setStep(1)}>Go back and try again</a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
