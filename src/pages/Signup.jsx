import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCamera } from 'react-icons/fi';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useApp();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError('');
    const result = await signup(username, email, password);
    if (result.success) {
      if (profileImage) {
        localStorage.setItem(`profileImage_${username}`, profileImage);
      }
      localStorage.setItem(`email_${username}`, email);
      navigate('/login');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card slide-up">
        <div className="auth-logo">
          <div className="logo-mark">₹</div>
          <h1>MONE<span>TRA</span></h1>
          <p>Start managing your finances today</p>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.2)', borderRadius: '10px', color: 'var(--error)', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 800, color: '#fff', overflow: 'hidden' }}>
                {profileImage ? <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FiUser />}
              </div>
              <label style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--surface)', padding: '6px', borderRadius: '50%', cursor: 'pointer', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', boxShadow: 'var(--shadow-sm)' }} title="Upload profile picture">
                <FiCamera size={14} />
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
              </label>
            </div>
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" style={{ paddingLeft: '42px' }} placeholder="Choose a username" value={username} onChange={e => setUsername(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" style={{ paddingLeft: '42px' }} type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" style={{ paddingLeft: '42px', paddingRight: '42px' }} type={showPass ? 'text' : 'password'} placeholder="Create password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" style={{ paddingLeft: '42px', paddingRight: '42px' }} type={showConfirmPass ? 'text' : 'password'} placeholder="Confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showConfirmPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-footer" style={{ marginTop: '24px' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}