import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

function Navbar() {
  const [hasNotification, setHasNotification] = useState(true);

  const handleBellClick = () => {
    setHasNotification(false);
  };

  return (
    <nav className="navbar">
      {/* Left Side: Brand Text */}
      <div className="navbar-left">
        <Link
        to="/"
        className="logo-brand-text"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Spark-Story-AI
        </Link>
      </div>

      {/* Right Side: Actions & Profile Logo */}
      <div className="navbar-right">
        {/* Interactive Notification Bell */}
        <button
          className="nav-bell-btn"
          aria-label="Notifications"    
          onClick={() => setHasNotification(false)}
        >
          <span className="bell-emoji">🔔</span>

          {hasNotification && (
            <span className="bell-dot-indicator"></span>
          )}
        </button>

        {/* Right End: Letter 'R' Logo */}
        <div className="nav-profile-circle-logo">R</div>
      </div>
    </nav>
  );
}

export default Navbar;