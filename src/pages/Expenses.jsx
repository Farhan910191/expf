import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FiPlus, FiEdit2, FiTrash2, FiArrowUpRight, FiAlertCircle } from 'react-icons/fi';

export default function Expenses() {
  const { expenses, addExpense, deleteExpense, editExpense, categories, addCategory, totalExpense } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ title: '', amount: '', category: '', date: '', notes: '' });

  const openAdd = () => { setEditing(null); setForm({ title: '', amount: '', category: categories[0]?.name || '', customCategory: '', date: new Date().toISOString().split('T')[0], notes: '' }); setShowModal(true); };
  const openEdit = (exp) => { setEditing(exp); setForm({ ...exp, notes: exp.notes || '', customCategory: '' }); setShowModal(true); };

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.openAdd) {
      openAdd();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let finalData = { ...form };
    if (form.category === 'Others' && form.customCategory) {
      addCategory({ name: form.customCategory, icon: '📌', color: '#6366F1' });
      finalData.category = form.customCategory;
    }
    if (editing) { editExpense({ ...editing, ...finalData }); } else { addExpense(finalData); }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (confirmDelete) { deleteExpense(confirmDelete.id); setConfirmDelete(null); }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '28px', marginBottom: '4px' }}>Expense Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Track and manage all your expenses</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add Expense</button>
      </div>

      <div className="grid grid-3" style={{ marginBottom: '28px' }}>
        <div className="stat-card">
          <div className="stat-icon primary"><FiArrowUpRight /></div>
          <div className="stat-value">₹{totalExpense.toLocaleString()}</div>
          <div className="stat-label">Total Expenses</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon accent"><span style={{ fontSize: '20px' }}>📅</span></div>
          <div className="stat-value">₹{Math.round(totalExpense / 30 * 7).toLocaleString()}</div>
          <div className="stat-label">This Week (est.)</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><span style={{ fontSize: '20px' }}>📊</span></div>
          <div className="stat-value">{expenses.length}</div>
          <div className="stat-label">Total Entries</div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="card desktop-only" style={{ padding: 0, overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)' }}>
          <div className="card-title">All Expenses</div>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Expense</th><th>Category</th><th>Amount</th><th>Date</th><th>Notes</th><th>Actions</th></tr></thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id}>
                  <td style={{ fontWeight: 600 }}>{exp.title}</td>
                  <td><span className="badge badge-primary">{categories.find(c => c.name === exp.category)?.icon} {exp.category}</span></td>
                  <td style={{ fontWeight: 700, color: 'var(--error)' }}>-₹{parseFloat(exp.amount).toLocaleString()}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{exp.date}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{exp.notes || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(exp)}><FiEdit2 /></button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }} onClick={() => setConfirmDelete(exp)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Expense Cards */}
      <div className="mobile-only" style={{ marginBottom: '24px' }}>
        <div style={{ padding: '0 4px 16px', fontWeight: 600 }}>All Expenses</div>
        {expenses.map(exp => (
          <div className="mobile-tx-card" key={`mobile-${exp.id}`}>
            <div className="mobile-tx-icon" style={{ background: 'rgba(26,26,26,0.08)' }}>
              {categories.find(c => c.name === exp.category)?.icon || '💸'}
            </div>
            <div className="mobile-tx-details">
              <div className="mobile-tx-title">{exp.title}</div>
              <div className="mobile-tx-meta">
                <span className="badge badge-primary" style={{ padding: '2px 6px', fontSize: '11px' }}>{exp.category}</span>
              </div>
            </div>
            <div className="mobile-tx-amount-section">
              <div className="mobile-tx-amount" style={{ color: 'var(--error)' }}>
                -₹{parseFloat(exp.amount).toLocaleString()}
              </div>
              <div className="mobile-tx-date">{exp.date}</div>
              <div className="mobile-tx-actions">
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(exp)} style={{ padding: '4px' }}><FiEdit2 size={14} /></button>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setConfirmDelete(exp)} style={{ color: 'var(--error)', padding: '4px' }}><FiTrash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editing ? 'Edit Expense' : 'Add Expense'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-2">
                <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="What did you spend on?" required /></div>
                <div className="form-group"><label className="form-label">Amount (₹)</label><input className="form-input" type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0.00" required /></div>
                <div className="form-group"><label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                {form.category === 'Others' && (
                  <div className="form-group">
                    <label className="form-label">New Category Name</label>
                    <input className="form-input" value={form.customCategory || ''} onChange={e => setForm({...form, customCategory: e.target.value})} placeholder="e.g. Subscriptions" required />
                  </div>
                )}
                <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
              </div>
              <div className="form-group"><label className="form-label">Notes</label><textarea className="form-input" rows="3" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Any additional details..." /></div>
              <button type="submit" className="btn btn-primary w-full">{editing ? 'Update' : 'Add'} Expense</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}><FiAlertCircle style={{ color: 'var(--error)' }} /></div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Delete Expense?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              Delete <strong>"{confirmDelete.title}"</strong> (₹{parseFloat(confirmDelete.amount).toLocaleString()})? This cannot be undone.
            </p>
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
