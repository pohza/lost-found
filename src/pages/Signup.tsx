import "./../App.css";
import logo from "./../assets/logo.png";
import googleLogo from "./../assets/google-logo-icon-gsuite-hd-701751694791470gzbayltphh.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password || !fullName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, fullName: fullName.trim() }),
      });
      if (res.ok) {
        const data = (await res.json()) as { token?: string };
        if (data.token) localStorage.setItem("token", data.token);
        navigate("/home");
        return;
      }
      const err = (await res.json()) as { message?: string };
      setError(err.message || "Registration failed");
    } catch {
      setError("Network error");
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
          <Link to="/login">
            <button className="topbar-signup">Log in</button>
          </Link>
        </div>
      </header>

      <main className="main">
        <section className="login-card">
          <h1 className="login-title">Create an account</h1>

          <button type="button" className="google-button">
            <span className="google-icon-wrapper">
              <img
                src={googleLogo}
                alt="Google"
                className="google-icon"
              />
            </span>
            <span className="google-text">Continue With Google</span>
          </button>

          <div className="divider">
            <span className="divider-line" />
            <span className="divider-text">Or</span>
            <span className="divider-line" />
          </div>

          {error && <p className="signup-error" style={{ color: "#c00", marginBottom: "0.5rem" }}>{error}</p>}

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field-label">Email or Phone</span>
              <input
                type="text"
                className="field-input"
                placeholder="Enter your email or phone"
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
                autoComplete="new-password"
              />
            </label>

            <label className="field">
              <span className="field-label">Full Name</span>
              <input
                type="text"
                className="field-input"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </label>

            <button type="submit" className="primary-button wide-button" disabled={loading}>
              {loading ? "Loading..." : "Continue"}
            </button>
          </form>

          <p className="signup-hint">
            Already have an account?{" "}
            <Link to="/login" className="inline-link">
              Login
            </Link>
          </p>
        </section>
      </main>

      <footer className="footer" />
    </div>
  );
}

export default SignupPage;

