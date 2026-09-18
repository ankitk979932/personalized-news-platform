import { Eye, EyeOff, Lock, Mail, Radio, Sparkles, UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const initialForm = {
  name: "",
  email: "",
  password: ""
};

const validateForm = (form, isSignup) => {
  const nextErrors = {};

  if (isSignup && !form.name.trim()) {
    nextErrors.name = "Name is required.";
  }

  if (!form.email.trim()) {
    nextErrors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    nextErrors.email = "Enter a valid email address.";
  }

  if (!form.password) {
    nextErrors.password = "Password is required.";
  } else if (isSignup && form.password.length < 8) {
    nextErrors.password = "Password must be at least 8 characters.";
  }

  return nextErrors;
};

const Login = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
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
    setIsSignup(false);
    setForm({ name: "", email: "ankit@example.com", password: "password123" });
    setErrors({});
    setServerError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm(form, isSignup);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      const credentials = {
        email: form.email.trim(),
        password: form.password
      };

      if (isSignup) {
        await signup({ ...credentials, name: form.name.trim() });
      } else {
        await login(credentials);
      }
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
            {!isSignup && (
              <button className="demo-button" type="button" onClick={fillDemo}>
                Demo login
              </button>
            )}
          </div>

          <div className="login-copy">
            <span className="login-eyebrow">
              <Sparkles size={15} />
              Personalized news briefing
            </span>
            <h1>{isSignup ? "Create your account" : "Good morning"}</h1>
            <p>
              {isSignup
                ? "Start your personalized AI-ranked news queue."
                : "Sign in to continue your AI-ranked news queue."}
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {isSignup && (
              <label className={`field ${errors.name ? "has-error" : ""}`}>
                <span>Full name</span>
                <span className="field-control">
                  <UserRound size={18} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={updateField}
                    autoComplete="name"
                  />
                </span>
                {errors.name && <small>{errors.name}</small>}
              </label>
            )}

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
                  autoComplete={isSignup ? "new-password" : "current-password"}
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
              {isLoading ? (isSignup ? "Creating account..." : "Signing in...") : isSignup ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="login-switch">
            {isSignup ? "Already have an account?" : "New to Nuzio AI?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignup((current) => !current);
                setForm(initialForm);
                setErrors({});
                setServerError("");
              }}
            >
              {isSignup ? "Sign in" : "Create an account"}
            </button>
          </p>
          {!isSignup && <p className="login-footnote">Demo: ankit@example.com / password123</p>}
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
