import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/auth.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/menu');
    } catch (err) {
      const msg = err.response && err.response.data && err.response.data.message;
      setError(msg || 'Login failed');
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-side auth-side-login">
        <Link to="/" className="auth-brand">QuickBite</Link>
      </div>
      <div className="auth-main">
        <div className="auth-card">
          <h1>Welcome Back!</h1>
          <p className="auth-sub">Log in to your account to continue.</p>
          {error ? <div className="auth-error">{error}</div> : null}
          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={function(e) { setEmail(e.target.value); }}
                required
              />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={function(e) { setPassword(e.target.value); }}
                required
              />
            </div>
            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Log in'}
            </button>
          </form>
          <div className="auth-foot">
            New here? <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
