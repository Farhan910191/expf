import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FiPlus, FiTrash2, FiAlertTriangle, FiAlertCircle } from 'react-icons/fi';

export default function Budget() {
  const { budgets, addBudget, deleteBudget, categories, expenses } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ category: '', limit: '' });

  const budgetsWithSpent = budgets.map(b => {
    const spent = expenses.filter(e => e.category === b.category).reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    return { ...b, spent };
  });

  const totalBudget = budgetsWithSpent.reduce((a, b) => a + parseFloat(b.limit || 0), 0);
  const totalSpent = budgetsWithSpent.reduce((a, b) => a + parseFloat(b.spent || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addBudget({ ...form, limit: parseFloat(form.limit) });
    setShowModal(false);
    setForm({ category: '', limit: '' });
  };

  const handleDelete = async () => {
    if (confirmDelete) { await deleteBudget(confirmDelete.id); setConfirmDelete(null); }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '28px', marginBottom: '4px' }}>Budget Planning</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Set limits and control your spending</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm({ category: categories[0]?.name || '', limit: '' }); setShowModal(true); }}><FiPlus /> Set Budget</button>
      </div>

      <div className="grid grid-3" style={{ marginBottom: '28px' }}>
        <div className="stat-card"><div className="stat-icon primary"><span style={{ fontSize: '20px' }}>🎯</span></div><div className="stat-value">₹{totalBudget.toLocaleString()}</div><div className="stat-label">Total Budget</div></div>
        <div className="stat-card"><div className="stat-icon primary"><span style={{ fontSize: '20px' }}>💸</span></div><div className="stat-value">₹{totalSpent.toLocaleString()}</div><div className="stat-label">Total Spent</div></div>
        <div className="stat-card"><div className="stat-icon accent"><span style={{ fontSize: '20px' }}>✅</span></div><div className="stat-value">₹{(totalBudget - totalSpent).toLocaleString()}</div><div className="stat-label">Remaining</div></div>
      </div>

      {totalBudget > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <div className="card-title">Monthly Budget Overview</div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>
              {((totalSpent / totalBudget) * 100).toFixed(0)}% used
            </span>
          </div>
          <div className="progress-bar" style={{ height: '12px' }}>
            <div className="progress-fill primary" style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }} />
          </div>
        </div>
      )}

      {budgets.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-icon">🎯</div><h3>No Budgets Set</h3><p>Set monthly budgets to control your spending by category.</p>
          <button className="btn btn-primary" onClick={() => { setForm({ category: categories[0]?.name || '', limit: '' }); setShowModal(true); }}><FiPlus /> Set Your First Budget</button>
        </div></div>
      ) : (
        <div className="grid grid-2">
          {budgetsWithSpent.map(b => {
            const spent = parseFloat(b.spent || 0);
            const limit = parseFloat(b.limit || 1);
            const pct = (spent / limit) * 100;
            const cat = categories.find(c => c.name === b.category);
            const isOver = pct >= 90;
            return (
              <div key={b.id} className="card" style={{ border: isOver ? '1px solid var(--primary-light)' : undefined }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '28px' }}>{cat?.icon || '📦'}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '16px' }}>{b.category}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>₹{spent.toLocaleString()} of ₹{limit.toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isOver && <FiAlertTriangle style={{ color: 'var(--primary)' }} />}
                    <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--text-muted)' }} onClick={() => setConfirmDelete(b)}><FiTrash2 /></button>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className={`progress-fill ${isOver ? 'primary' : 'accent'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px' }}>
                  <span style={{ color: isOver ? 'var(--primary)' : 'var(--text-muted)' }}>{pct.toFixed(0)}% used</span>
                  <span style={{ color: 'var(--text-muted)' }}>₹{(limit - spent).toLocaleString()} left</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3 className="modal-title">Set Category Budget</h3><button className="modal-close" onClick={() => setShowModal(false)}>×</button></div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-2">
                <div className="form-group"><label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Monthly Limit (₹)</label><input className="form-input" type="number" value={form.limit} onChange={e => setForm({...form, limit: e.target.value})} placeholder="e.g. 5000" required /></div>
              </div>
              <button type="submit" className="btn btn-primary w-full">Set Budget</button>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}><FiAlertCircle style={{ color: 'var(--error)' }} /></div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Delete Budget?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Remove the budget for <strong>{confirmDelete.category}</strong>?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
