import React from "react";
import { Link } from "react-router-dom";

export const Login = () => {
  // const handleLogin = () => {
  //   window.open("http://localhost:3000/login", "_blank", "noopener,noreferrer");
  // };

  return (
      // <a onClick={handleLogin} href="#">Student-Corner</a>
      <Link to="/cseatemp/student">Student-Corner</Link>
  );
};
