import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/status', {
          credentials: 'include',
        });
        const data = await response.json();

        if (data.isAuthenticated) {
          // Store Google ID if available
          if (data.googleId) {
            localStorage.setItem('googleId', data.googleId);
          }
          // Mark the user as logged in and redirect
          onLogin();
          navigate('/home');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    checkAuthStatus();

    // Handle Google ID from the query parameters (if redirected after Google login)
    const urlParams = new URLSearchParams(window.location.search);
    const googleIdFromUrl = urlParams.get('googleId');
    if (googleIdFromUrl) {
      localStorage.setItem('googleId', googleIdFromUrl);
      // Clean up the URL to remove query parameters
      window.history.replaceState({}, document.title, '/home');
    }
  }, [onLogin, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Ensure both username and password are provided
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('googleId', data.googleId || 'dummy-google-id');
        onLogin();
        navigate('/home'); // Redirect to home
      } else {
        setError(data.message || 'Invalid username or password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div
      className={styles['login-page']}
      style={{
        backgroundImage: `url("${process.env.PUBLIC_URL}/background.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className={styles['login-container']}>
        <h1 className={styles['title']}>Welcome to Mini-CRM</h1>
        <p className={styles['subtitle']}>Seamlessly foster deeper connections with your customers.</p>
        <div className={styles['login-box']}>
          {/* Username and Password Login Form */}
          <form onSubmit={handleLogin} className={styles['login-form']}>
            <div className={styles['form-group']}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles['login-input']}
              />
            </div>
            <div className={styles['form-group']}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles['login-input']}
              />
            </div>
            <button type="submit" className={styles['login-btn']}>
              Login
            </button>
            {error && <div className={styles['error-message']}>{error}</div>}
          </form>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className={styles['login-with-google-btn']}
          >
            <span>Login with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
