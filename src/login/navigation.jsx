import { Link } from "react-router-dom";

export const Navigation = (props) => {
  const handleLogout = () => {
    fetch("http://localhost:3000/auth/logout", { method: "POST", credentials: "include" })
      .then(() => {
        window.location.href = "/cseatemp/";
      })
      .catch((err) => {
        console.error("Logout failed:", err);
        window.location.href = "/cseatemp/";
      });
  };

  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <Link className="navbar-brand page-scroll" to="/cseatemp/student">
            CSEA | Student Corner
          </Link>{" "}
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <Link to="/cseatemp/" className="page-scroll">
                Home
              </Link>
            </li>
            <li>
              <Link to="/cseatemp/student/intern" className="page-scroll">
                Intern
              </Link>
            </li>
            <li>
              <Link to="/cseatemp/student/sail" className="page-scroll">
                SAIL
              </Link>
            </li>
            <li>
              <Link to="/cseatemp/student/games" className="page-scroll">
                Games
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="page-scroll btn-logout-nav"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#8c85b5",
                  padding: "15px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "600",
                  fontFamily: "inherit"
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
