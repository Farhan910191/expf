import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card slide-up">
        <div className="auth-logo">
          <div className="logo-mark">🔑</div>
          {!sent ? (
            <>
              <h1>Forgot <span>Password?</span></h1>
              <p>Enter your email to receive a reset link</p>
            </>
          ) : (
            <>
              <h1>Check <span>Email</span></h1>
              <p>We've sent a password reset link to your email</p>
            </>
          )}
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" style={{ paddingLeft: '42px' }} type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-full">Send Reset Link</button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✉️</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              We sent a verification code to <strong>{email}</strong>. Check your inbox and follow the instructions.
            </p>
            <button className="btn btn-primary btn-lg w-full" onClick={() => setSent(false)}>Resend Email</button>
          </div>
        )}

        <div className="auth-footer">
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)' }}>
            <FiArrowLeft /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
