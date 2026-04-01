import "./../App.css";
import logo from "./../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../services/auth";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/home");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="logo">
            <img src={logo} alt="Logo" className="logo-image" />
          </div>
          <Link to="/signup">
            <button className="topbar-signup">Sign Up</button>
          </Link>
        </div>
      </header>

      <main className="main">
        <section className="login-card">
          <h1 className="login-title">Login</h1>

          {error && <p className="login-error" style={{ color: "#c00", marginBottom: "0.5rem" }}>{error}</p>}

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field-label">Email</span>
              <input
                type="email"
                className="field-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </label>

            <label className="field">
              <span className="field-label">Password</span>
              <input
                type="password"
                className="field-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </label>

            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Loading..." : "Continue"}
            </button>

            <Link to="/forgot-password" className="link-button" style={{ textAlign: "center", display: "block" }}>
              Forgot Password
            </Link>

            <div className="divider">
              <span className="divider-line" />
              <span className="divider-text">Or</span>
              <span className="divider-line" />
            </div>

            <button type="button" className="social-button">
              <span className="social-icon">G</span>
            </button>
          </form>

          <p className="signup-hint">
            Don&apos;t have an account?{" "}
            <Link to="/signup">
              <button type="button" className="inline-signup">
                Sign Up
              </button>
            </Link>
          </p>
        </section>
      </main>

      <footer className="footer" />
    </div>
  );
}

export default LoginPage;