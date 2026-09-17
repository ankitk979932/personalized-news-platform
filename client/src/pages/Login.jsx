import { Eye, EyeOff, Lock, Mail, Radio, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const initialForm = {
  email: "",
  password: ""
};

const validateForm = (form) => {
  const nextErrors = {};

  if (!form.email.trim()) {
    nextErrors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    nextErrors.email = "Enter a valid email address.";
  }

  if (!form.password) {
    nextErrors.password = "Password is required.";
  }

  return nextErrors;
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setServerError("");
  };

  const fillDemo = () => {
    setForm({ email: "ankit@example.com", password: "password123" });
    setErrors({});
    setServerError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      await login({
        email: form.email.trim(),
        password: form.password
      });
      navigate("/news", { replace: true });
    } catch (error) {
      setServerError(error.message || "Unable to sign in right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-shell" aria-label="Nuzio AI login">
        <div className="login-panel">
          <div className="login-header">
            <div className="brand-lockup light">
              <span className="brand-mark">
                <Radio size={18} />
              </span>
              <span>Nuzio AI</span>
            </div>
            <button className="demo-button" type="button" onClick={fillDemo}>
              Demo login
            </button>
          </div>

          <div className="login-copy">
            <span className="login-eyebrow">
              <Sparkles size={15} />
              Personalized news briefing
            </span>
            <h1>Good morning</h1>
            <p>Sign in to continue your AI-ranked news queue.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className={`field ${errors.email ? "has-error" : ""}`}>
              <span>Email</span>
              <span className="field-control">
                <Mail size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="ankit@example.com"
                  value={form.email}
                  onChange={updateField}
                  autoComplete="email"
                />
              </span>
              {errors.email && <small>{errors.email}</small>}
            </label>

            <label className={`field ${errors.password ? "has-error" : ""}`}>
              <span>Password</span>
              <span className="field-control">
                <Lock size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={updateField}
                  autoComplete="current-password"
                />
                <button
                  className="ghost-icon"
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
              {errors.password && <small>{errors.password}</small>}
            </label>

            <ErrorMessage message={serverError} />

            <button className="primary-button" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="login-footnote">Demo: ankit@example.com / password123</p>
        </div>

        <aside className="preview-panel" aria-hidden="true">
          <div className="preview-phone first">
            <div className="phone-status" />
            <div className="mini-tabs">
              <span />
              <span />
              <span />
            </div>
            <h2>For you</h2>
            <div className="mini-story active">
              <span />
              <div>
                <strong>AI copilots enter daily tools</strong>
                <small>AI / 03:12</small>
              </div>
            </div>
            <div className="mini-story">
              <span />
              <div>
                <strong>Chip startups lower costs</strong>
                <small>Technology / 03:48</small>
              </div>
            </div>
            <div className="mini-player">
              <div />
              <span />
            </div>
          </div>

          <div className="preview-phone second">
            <div className="phone-status" />
            <div className="listen-orb">
              <Radio size={26} />
            </div>
            <h2>Listen now</h2>
            <p>Personalized stories ranked by your interests.</p>
            <div className="waveform">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Login;
