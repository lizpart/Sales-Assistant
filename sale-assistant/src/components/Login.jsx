// components/Login.jsx
import { useState } from 'react';
import StatusAlert from './common/StatusAlert';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Hardcoded credentials
  const VALID_USERNAME = 'sales';
  const VALID_PASSWORD = 'password';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    // Hardcoded authentication check
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      localStorage.setItem('auth_token', 'demo_token');
      localStorage.setItem('user', JSON.stringify({ name: username }));
      setLoading(false);
      onLogin(true);
    } else {
      setError('Invalid username or password');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Sales Conversion Assistant</h2>

        {error && <StatusAlert severity="error" message={error} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;