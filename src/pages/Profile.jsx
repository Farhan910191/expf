import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import API from '../api/api';
import { FiUser, FiLock, FiSun, FiMoon, FiSave, FiGlobe, FiCamera } from 'react-icons/fi';

export default function Profile() {
  const { user, setUser, theme, toggleTheme } = useApp();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passMsg, setPassMsg] = useState({ text: '', type: '' });
  const [currency, setCurrency] = useState('INR');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await API.patch('profile/', { name: form.name, email: form.email });
      setUser({ ...user, ...form, avatar: form.name.charAt(0).toUpperCase() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profileImage: reader.result });
        localStorage.setItem(`profileImage_${user.name}`, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '4px' }}>Profile & Settings</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Manage your account preferences</p>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Sidebar Nav */}
        <div className="card" style={{ width: '240px', padding: '12px', flexShrink: 0, height: 'fit-content' }}>
          {[
            { id: 'profile', icon: <FiUser />, label: 'Profile Info' },
            { id: 'password', icon: <FiLock />, label: 'Change Password' },
            { id: 'preferences', icon: <FiGlobe />, label: 'Preferences' },
          ].map(item => (
            <button key={item.id} className={`nav-item w-full ${tab === item.id ? 'active' : ''}`} onClick={() => setTab(item.id)}
              style={{ background: tab === item.id ? 'rgba(26,26,26,0.08)' : 'transparent', color: tab === item.id ? 'var(--primary)' : 'var(--text-secondary)', width: '100%', textAlign: 'left', fontWeight: tab === item.id ? 600 : 400 }}>
              {item.icon}<span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="card" style={{ flex: 1 }}>
          {tab === 'profile' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 800, color: '#fff', overflow: 'hidden' }}>
                    {user.profileImage ? <img src={user.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.avatar}
                  </div>
                  <label style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--surface)', padding: '6px', borderRadius: '50%', cursor: 'pointer', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', boxShadow: 'var(--shadow-sm)' }} title="Change profile picture">
                    <FiCamera size={14} />
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                  </label>
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>{user.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{user.email}</p>
                </div>
              </div>
              <form onSubmit={handleSave}>
                <div className="grid grid-2">
                  <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                  <FiSave /> {saved ? 'Saved!' : 'Save Changes'}
                </button>
              </form>
            </>
          )}

          {tab === 'password' && (
            <form onSubmit={async (e) => {
              e.preventDefault();
              setPassMsg({ text: '', type: '' });
              if (passForm.newPass !== passForm.confirm) {
                setPassMsg({ text: 'New passwords do not match', type: 'error' });
                return;
              }
              if (passForm.newPass.length < 8) {
                setPassMsg({ text: 'Password must be at least 8 characters', type: 'error' });
                return;
              }
              try {
                await API.post('change-password/', {
                  old_password: passForm.current,
                  new_password: passForm.newPass,
                });
                setPassMsg({ text: 'Password updated successfully!', type: 'success' });
                setPassForm({ current: '', newPass: '', confirm: '' });
              } catch (err) {
                const msg = err.response?.data?.error || err.response?.data?.detail || 'Failed to change password';
                setPassMsg({ text: msg, type: 'error' });
              }
            }}>
              <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>Change Password</h3>
              {passMsg.text && (
                <div style={{ padding: '12px 16px', background: passMsg.type === 'error' ? 'rgba(229,57,53,0.08)' : 'rgba(76,175,80,0.08)', border: `1px solid ${passMsg.type === 'error' ? 'rgba(229,57,53,0.2)' : 'rgba(76,175,80,0.2)'}`, borderRadius: '10px', color: passMsg.type === 'error' ? 'var(--error)' : 'var(--success)', fontSize: '14px', marginBottom: '20px' }}>
                  {passMsg.text}
                </div>
              )}
              <div className="form-group"><label className="form-label">Current Password</label><input className="form-input" type="password" value={passForm.current} onChange={e => setPassForm({...passForm, current: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">New Password</label><input className="form-input" type="password" value={passForm.newPass} onChange={e => setPassForm({...passForm, newPass: e.target.value})} required /></div>
              <div className="form-group"><label className="form-label">Confirm Password</label><input className="form-input" type="password" value={passForm.confirm} onChange={e => setPassForm({...passForm, confirm: e.target.value})} required /></div>
              <button type="submit" className="btn btn-primary"><FiSave /> Update Password</button>
            </form>
          )}

          {tab === 'preferences' && (
            <>
              <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>Preferences</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>{theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Toggle between light and dark theme</div>
                </div>
                <label className="toggle"><input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} /><span className="toggle-slider" /></label>
              </div>
              <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>💱 Currency</div>
                <select className="form-select" style={{ maxWidth: '250px' }} value={currency} onChange={e => setCurrency(e.target.value)}>
                  <option value="INR">₹ INR — Indian Rupee</option>
                  <option value="USD">$ USD — US Dollar</option>
                  <option value="EUR">€ EUR — Euro</option>
                  <option value="GBP">£ GBP — British Pound</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>🔔 Email Notifications</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Receive budget alerts via email</div>
                </div>
                <label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-slider" /></label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
