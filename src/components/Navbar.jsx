import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 mb-4 shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          💸 Expense Manager
        </Link>
        <div className="d-flex align-items-center gap-2">
          {setDarkMode && (
            <button
              className="btn btn-sm btn-light me-3"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          )}
          {token ? (
            <>
              <Link className="btn btn-outline-light btn-sm" to="/">
                Dashboard
              </Link>
              <button className="btn btn-danger btn-sm" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline-light btn-sm" to="/login">
                Login
              </Link>
              <Link className="btn btn-success btn-sm" to="/signup">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
