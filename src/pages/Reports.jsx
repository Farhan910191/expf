import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FiDownload } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area } from 'recharts';

const COLORS = ['#014BAA', '#3D7DFF', '#7BA7FF', '#A9C8FF', '#DCEBFF'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Reports() {
  const { expenses, incomes, categories, totalExpense, totalIncome } = useApp();
  const [tab, setTab] = useState('monthly');

  const catData = categories.map(cat => {
    const total = expenses.filter(e => e.category === cat.name).reduce((a, e) => a + parseFloat(e.amount), 0);
    return { name: cat.name, value: total, icon: cat.icon || '📦' };
  }).filter(c => c.value > 0);

  // ── Real Monthly Trend — computed from actual expenses & incomes ──
  const monthlyTrend = (() => {
    const now = new Date();
    const months = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      const monthIncome = incomes
        .filter(inc => { const dt = new Date(inc.date); return dt.getMonth() === m && dt.getFullYear() === y; })
        .reduce((sum, inc) => sum + parseFloat(inc.amount || 0), 0);
      const monthExpense = expenses
        .filter(exp => { const dt = new Date(exp.date); return dt.getMonth() === m && dt.getFullYear() === y; })
        .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
      months.push({
        name: MONTH_NAMES[m],
        income: monthIncome,
        expense: monthExpense,
        savings: monthIncome - monthExpense,
      });
    }
    return months;
  })();

  const handleExport = () => {
    const csvRows = ['Title,Category,Amount,Date,Type'];
    expenses.forEach(e => csvRows.push(`${e.title},${e.category},${e.amount},${e.date},Expense`));
    incomes.forEach(i => csvRows.push(`${i.title},${i.category},${i.amount},${i.date},Income`));
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'expense_report.csv'; a.click();
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '28px', marginBottom: '4px' }}>Reports & Analytics</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Deep insights into your finances</p>
        </div>
        <button className="btn btn-accent" onClick={handleExport}><FiDownload /> Export CSV</button>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: '24px', display: 'inline-flex' }}>
        {['monthly','category','trends'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'monthly' ? 'Monthly Report' : t === 'category' ? 'Category Analysis' : 'Spending Trends'}
          </button>
        ))}
      </div>

      {tab === 'monthly' && (
        <div className="grid grid-2">
          <div className="card">
            <div className="card-header"><div className="card-title">Income vs Expense</div></div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px' }} />
                <Legend />
                <Bar dataKey="income" fill="#014BAA" radius={[6,6,0,0]} name="Income" />
                <Bar dataKey="expense" fill="#3D7DFF" radius={[6,6,0,0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Savings Trend</div></div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px' }} />
                <Area type="monotone" dataKey="savings" stroke="#555555" fill="rgba(85,85,85,0.15)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === 'category' && (
        <div className="grid grid-2">
          <div className="card">
            <div className="card-header"><div className="card-title">Expense Distribution</div></div>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie data={catData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Category Breakdown</div></div>
            {catData.map((c, i) => (
              <div key={c.name} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px' }}>
                  <span style={{ fontWeight: 600 }}>{c.icon} {c.name}</span>
                  <span style={{ fontWeight: 700 }}>₹{c.value.toLocaleString()}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(c.value / totalExpense) * 100}%`, background: COLORS[i % COLORS.length] }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'trends' && (
        <div className="card">
          <div className="card-header"><div className="card-title">5-Month Financial Trend</div></div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px' }} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#014BAA" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="expense" stroke="#3D7DFF" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="savings" stroke="#7BA7FF" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
