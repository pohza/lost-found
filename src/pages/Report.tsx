import "./../App.css";
import logo from "./../assets/logo.png";
import profileAvatar from "./../assets/profile.jpg";
import lostIcon from "./../assets/lost.png";
import foundIcon from "./../assets/found.png";
import { Link } from "react-router-dom";

function ReportPage() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner home-topbar-inner">
          <div className="logo">
            <img src={logo} alt="Logo" className="logo-image" />
          </div>

          <nav className="home-nav">
            <Link to="/home" className="home-nav-link">
              HOME
            </Link>
            <Link to="/claims" className="home-nav-link">
              CLAIM
            </Link>
            <Link to="/report" className="home-nav-link active">
              REPORT
            </Link>
            <Link to="/notifications" className="home-nav-link">
              NOTIFICATION
            </Link>
            <Link to="/messages" className="home-nav-link">
              MESSAGES
            </Link>
            <Link to="/profile" className="home-avatar-link">
              <img
                src={profileAvatar}
                alt="Profile"
                className="home-avatar-image"
              />
            </Link>
          </nav>
        </div>
      </header>

      <main className="report-main">
        <h1 className="report-title">Report Item</h1>
        <p className="report-subtitle">Choose your category</p>

        <section className="report-cards">
          <Link to="/report/lost" className="report-card">
            <div className="report-icon-wrapper report-icon-lost">
              <img src={lostIcon} alt="Lost item" className="report-icon" />
            </div>
            <h2 className="report-card-title">I Lost an Item</h2>
            <p className="report-card-subtitle">ฉันทำของหาย</p>
            <p className="report-card-desc">
              Report an Item you&apos;ve lost
            </p>
          </Link>

          <Link to="/report/found" className="report-card">
            <div className="report-icon-wrapper report-icon-found">
              <img src={foundIcon} alt="Found item" className="report-icon" />
            </div>
            <h2 className="report-card-title">I Found an Item</h2>
            <p className="report-card-subtitle">ฉันเจอของหาย</p>
            <p className="report-card-desc">
              Report an Item you&apos;ve found
            </p>
          </Link>
        </section>
      </main>

      <footer className="footer" />
    </div>
  );
}

export default ReportPage;

