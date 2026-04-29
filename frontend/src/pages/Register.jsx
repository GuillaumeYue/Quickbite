import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/auth.css';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/menu');
    } catch (err) {
      const msg = err.response && err.response.data && err.response.data.message;
      setError(msg || 'Sign up failed');
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-side auth-side-register">
        <Link to="/" className="auth-brand">QuickBite</Link>
      </div>
      <div className="auth-main">
        <div className="auth-card">
          <h1>Welcome to QuickBite!</h1>
          <p className="auth-sub">Sign up to place orders and get live updates.</p>
          {error ? <div className="auth-error">{error}</div> : null}
          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={function(e) { setName(e.target.value); }}
                required
              />
            </div>
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
            <div className="auth-field">
              <label>Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={function(e) { setConfirm(e.target.value); }}
                required
              />
            </div>
            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
          <div className="auth-foot">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
