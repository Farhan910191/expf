import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FiArrowUpRight, FiArrowDownLeft, FiDollarSign, FiTrendingUp, FiPlus } from 'react-icons/fi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const COLORS = ['#014BAA', '#3D7DFF', '#7BA7FF', '#A9C8FF', '#DCEBFF'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Dashboard() {
  const { totalExpense, totalIncome, balance, expenses, incomes, categories, budgets } = useApp();
  const navigate = useNavigate();

  // Use ALL categories with expenses (not hardcoded list)
  const catData = categories.map(cat => {
    const total = expenses.filter(e => e.category === cat.name).reduce((a, e) => a + parseFloat(e.amount), 0);
    return { name: cat.name, value: total, icon: cat.icon };
  }).filter(c => c.value > 0);

  // Compute real monthly budget remaining
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const totalBudgetLimit = budgets.reduce((a, b) => a + parseFloat(b.limit || 0), 0);
  const currentMonthExpense = expenses
    .filter(e => { const d = new Date(e.date); return d.getMonth() === currentMonth && d.getFullYear() === currentYear; })
    .reduce((a, e) => a + parseFloat(e.amount || 0), 0);
  const budgetLeft = totalBudgetLimit - currentMonthExpense;

  // Compute real month-over-month changes
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const prevMonthIncome = incomes
    .filter(i => { const d = new Date(i.date); return d.getMonth() === prevMonth && d.getFullYear() === prevYear; })
    .reduce((a, i) => a + parseFloat(i.amount || 0), 0);
  const curMonthIncome = incomes
    .filter(i => { const d = new Date(i.date); return d.getMonth() === currentMonth && d.getFullYear() === currentYear; })
    .reduce((a, i) => a + parseFloat(i.amount || 0), 0);
  const prevMonthExpense = expenses
    .filter(e => { const d = new Date(e.date); return d.getMonth() === prevMonth && d.getFullYear() === prevYear; })
    .reduce((a, e) => a + parseFloat(e.amount || 0), 0);
  const incomeChange = prevMonthIncome > 0 ? ((curMonthIncome - prevMonthIncome) / prevMonthIncome * 100).toFixed(1) : 0;
  const expenseChange = prevMonthExpense > 0 ? ((currentMonthExpense - prevMonthExpense) / prevMonthExpense * 100).toFixed(1) : 0;
  const balanceChange = prevMonthIncome - prevMonthExpense !== 0
    ? (((curMonthIncome - currentMonthExpense) - (prevMonthIncome - prevMonthExpense)) / Math.abs(prevMonthIncome - prevMonthExpense) * 100).toFixed(1)
    : 0;

  // ── Real Monthly Data — computed from actual expenses & incomes ──
  const monthlyData = (() => {
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
      months.push({ name: MONTH_NAMES[m], income: monthIncome, expense: monthExpense });
    }
    return months;
  })();

  // ── Real Weekly Data — computed from actual expenses in last 7 days ──
  const weeklyData = (() => {
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayAmount = expenses
        .filter(exp => exp.date === dateStr)
        .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
      days.push({ name: DAY_NAMES[d.getDay()], amount: dayAmount });
    }
    return days;
  })();

  const recentTransactions = expenses.slice(0, 5);

  return (
    <div className="fade-in">
      {/* Stat Cards */}
      <div className="grid grid-4" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-icon accent"><FiDollarSign /></div>
          <div className="stat-value">₹{balance.toLocaleString()}</div>
          <div className="stat-label">Total Balance</div>
          <div className={`stat-change ${Number(balanceChange) >= 0 ? 'up' : 'down'}`}>{Number(balanceChange) >= 0 ? '↑' : '↓'} {Math.abs(Number(balanceChange))}% from last month</div>
        </div>
        <div className="stat-card" style={{ position: 'relative' }}>
          <div className="stat-icon green"><FiArrowDownLeft /></div>
          <div className="stat-value">₹{totalIncome.toLocaleString()}</div>
          <div className="stat-label">Total Income</div>
          <div className={`stat-change ${Number(incomeChange) >= 0 ? 'up' : 'down'}`}>{Number(incomeChange) >= 0 ? '↑' : '↓'} {Math.abs(Number(incomeChange))}%</div>
          <button className="btn btn-primary btn-icon" style={{ position: 'absolute', bottom: '24px', right: '24px', boxShadow: '0 4px 12px rgba(1, 75, 170, 0.2)' }} onClick={() => navigate('/income', { state: { openAdd: true } })} title="Add Income"><FiPlus size={20} /></button>
        </div>
        <div className="stat-card" style={{ position: 'relative' }}>
          <div className="stat-icon primary"><FiArrowUpRight /></div>
          <div className="stat-value">₹{totalExpense.toLocaleString()}</div>
          <div className="stat-label">Total Expenses</div>
          <div className={`stat-change ${Number(expenseChange) >= 0 ? 'down' : 'up'}`}>{Number(expenseChange) >= 0 ? '↑' : '↓'} {Math.abs(Number(expenseChange))}%</div>
          <button className="btn btn-primary btn-icon" style={{ position: 'absolute', bottom: '24px', right: '24px', boxShadow: '0 4px 12px rgba(1, 75, 170, 0.2)' }} onClick={() => navigate('/expenses', { state: { openAdd: true } })} title="Add Expense"><FiPlus size={20} /></button>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><FiTrendingUp /></div>
          <div className="stat-value">₹{totalBudgetLimit > 0 ? budgetLeft.toLocaleString() : '—'}</div>
          <div className="stat-label">Monthly Budget Left</div>
          <div className="stat-change up">{totalBudgetLimit > 0 ? `${((budgetLeft / totalBudgetLimit) * 100).toFixed(0)}% remaining` : 'No budget set'}</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-2" style={{ marginBottom: '32px' }}>
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Income vs Expense</div><div className="card-subtitle">Last 5 months</div></div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px' }} />
              <Legend />
              <Bar dataKey="income" fill="#014BAA" radius={[6,6,0,0]} />
              <Bar dataKey="expense" fill="#3D7DFF" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Spending by Category</div><div className="card-subtitle">Current month</div></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <ResponsiveContainer width="50%" height={250}>
              <PieChart>
                <Pie data={catData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {catData.map((c, i) => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '13px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{c.icon} {c.name}</span>
                  <span style={{ fontWeight: 600 }}>₹{c.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Weekly Spending</div><div className="card-subtitle">This week</div></div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px' }} />
              <Line type="monotone" dataKey="amount" stroke="#014BAA" strokeWidth={3} dot={{ fill: '#014BAA', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Recent Transactions</div><div className="card-subtitle">Last 5 entries</div></div>
          </div>
          <div>
            {recentTransactions.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(26,26,26,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    {categories.find(c => c.name === t.category)?.icon || '💸'}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{t.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.date}</div>
                  </div>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--error)' }}>-₹{parseFloat(t.amount).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}