import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FiUsers, FiActivity, FiDatabase, FiShield } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#014BAA', '#3D7DFF', '#7BA7FF', '#A9C8FF', '#DCEBFF'];

const DEMO_USERS = [
  { id: 1, name: 'Farhan', email: 'farhan@example.com', role: 'Admin', status: 'Active', joined: '2026-01-15', transactions: 24 },
  { id: 2, name: 'Ayesha Khan', email: 'ayesha@example.com', role: 'User', status: 'Active', joined: '2026-02-20', transactions: 18 },
  { id: 3, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'User', status: 'Active', joined: '2026-03-10', transactions: 31 },
  { id: 4, name: 'Priya Patel', email: 'priya@example.com', role: 'User', status: 'Inactive', joined: '2026-03-22', transactions: 7 },
  { id: 5, name: 'Vikram Singh', email: 'vikram@example.com', role: 'Moderator', status: 'Active', joined: '2026-04-05', transactions: 15 },
];

export default function Admin() {
  const { expenses, incomes, totalExpense, totalIncome } = useApp();
  const [tab, setTab] = useState('overview');

  const platformData = [
    { name: 'Jan', users: 120, transactions: 890 },
    { name: 'Feb', users: 145, transactions: 1020 },
    { name: 'Mar', users: 178, transactions: 1340 },
    { name: 'Apr', users: 210, transactions: 1580 },
    { name: 'May', users: 248, transactions: 1820 },
  ];

  const roleData = [
    { name: 'Users', value: 230 },
    { name: 'Admins', value: 5 },
    { name: 'Moderators', value: 13 },
  ];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '4px' }}>Admin Panel</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>System management and analytics</p>
      </div>

      <div className="tabs" style={{ marginBottom: '24px', display: 'inline-flex' }}>
        {['overview','users','analytics'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div className="grid grid-4" style={{ marginBottom: '28px' }}>
            <div className="stat-card"><div className="stat-icon primary"><FiUsers /></div><div className="stat-value">248</div><div className="stat-label">Total Users</div><div className="stat-change up">↑ 18%</div></div>
            <div className="stat-card"><div className="stat-icon accent"><FiActivity /></div><div className="stat-value">1,820</div><div className="stat-label">Transactions</div><div className="stat-change up">↑ 15%</div></div>
            <div className="stat-card"><div className="stat-icon green"><FiDatabase /></div><div className="stat-value">₹{(totalIncome * 248).toLocaleString()}</div><div className="stat-label">Platform Volume</div></div>
            <div className="stat-card"><div className="stat-icon blue"><FiShield /></div><div className="stat-value">99.9%</div><div className="stat-label">Uptime</div></div>
          </div>
          <div className="grid grid-2">
            <div className="card">
              <div className="card-header"><div className="card-title">Platform Growth</div></div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px' }} />
                  <Bar dataKey="users" fill="#1A1A1A" radius={[6,6,0,0]} name="Users" />
                  <Bar dataKey="transactions" fill="#555555" radius={[6,6,0,0]} name="Transactions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="card-header"><div className="card-title">User Roles</div></div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={roleData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {roleData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {tab === 'users' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)' }}><div className="card-title">All Users</div></div>
          <div className="table-container">
            <table className="data-table">
              <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Joined</th><th>Transactions</th></tr></thead>
              <tbody>
                {DEMO_USERS.map(u => (
                  <tr key={u.id}>
                    <td data-label="User">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px' }}>
                          {u.name.charAt(0)}
                        </div>
                        <div><div style={{ fontWeight: 600 }}>{u.name}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{u.email}</div></div>
                      </div>
                    </td>
                    <td data-label="Role"><span className={`badge ${u.role === 'Admin' ? 'badge-primary' : u.role === 'Moderator' ? 'badge-accent' : 'badge-blue'}`}>{u.role}</span></td>
                    <td data-label="Status"><span className={`badge ${u.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{u.status}</span></td>
                    <td data-label="Joined" style={{ color: 'var(--text-secondary)' }}>{u.joined}</td>
                    <td data-label="Transactions" style={{ fontWeight: 600 }}>{u.transactions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'analytics' && (
        <div className="grid grid-2">
          <div className="card">
            <div className="card-header"><div className="card-title">System Stats</div></div>
            {[
              { label: 'API Response Time', value: '45ms', pct: 15, color: 'green' },
              { label: 'Server Load', value: '32%', pct: 32, color: 'green' },
              { label: 'Database Usage', value: '68%', pct: 68, color: 'accent' },
              { label: 'Storage Used', value: '4.2 GB', pct: 42, color: 'primary' },
            ].map(s => (
              <div key={s.label} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px' }}>
                  <span>{s.label}</span><span style={{ fontWeight: 600 }}>{s.value}</span>
                </div>
                <div className="progress-bar"><div className={`progress-fill ${s.color}`} style={{ width: `${s.pct}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Recent Activity</div></div>
            {[
              { text: 'New user registered: Priya Patel', time: '2 min ago', type: 'success' },
              { text: 'Budget alert triggered for user #142', time: '15 min ago', type: 'warning' },
              { text: 'System backup completed', time: '1 hour ago', type: 'info' },
              { text: 'API rate limit hit by user #87', time: '2 hours ago', type: 'error' },
              { text: 'Database optimization completed', time: '5 hours ago', type: 'success' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: i < 4 ? '1px solid var(--border-light)' : 'none' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', marginTop: '6px', flexShrink: 0, background: a.type === 'success' ? 'var(--success)' : a.type === 'warning' ? 'var(--warning)' : a.type === 'error' ? 'var(--error)' : 'var(--info)' }} />
                <div><div style={{ fontSize: '14px' }}>{a.text}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{a.time}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
