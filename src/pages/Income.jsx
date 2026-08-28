import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FiPlus, FiEdit2, FiTrash2, FiArrowDownLeft, FiAlertCircle } from 'react-icons/fi';

export default function Income() {
  const { incomes, addIncome, deleteIncome, editIncome, categories, addCategory, totalIncome } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ title: '', amount: '', category: '', date: '', notes: '', recurring: false });

  const openAdd = () => { setEditing(null); setForm({ title: '', amount: '', category: categories[0]?.name || '', customCategory: '', date: new Date().toISOString().split('T')[0], notes: '', recurring: false }); setShowModal(true); };
  const openEdit = (inc) => { setEditing(inc); setForm({ ...inc, notes: inc.notes || '', customCategory: '' }); setShowModal(true); };

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
    if (editing) { editIncome({ ...editing, ...finalData }); } else { addIncome(finalData); }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (confirmDelete) { deleteIncome(confirmDelete.id); setConfirmDelete(null); }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '28px', marginBottom: '4px' }}>Income Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Track all your income sources</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add Income</button>
      </div>

      <div className="grid grid-3" style={{ marginBottom: '28px' }}>
        <div className="stat-card">
          <div className="stat-icon green"><FiArrowDownLeft /></div>
          <div className="stat-value">₹{totalIncome.toLocaleString()}</div>
          <div className="stat-label">Total Income</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon accent"><span style={{ fontSize: '20px' }}>💰</span></div>
          <div className="stat-value">{incomes.filter(i => i.recurring).length}</div>
          <div className="stat-label">Recurring Sources</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><span style={{ fontSize: '20px' }}>📊</span></div>
          <div className="stat-value">{incomes.length}</div>
          <div className="stat-label">Total Entries</div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="card desktop-only" style={{ padding: 0, overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)' }}>
          <div className="card-title">Income History</div>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Source</th><th>Category</th><th>Amount</th><th>Date</th><th>Recurring</th><th>Actions</th></tr></thead>
            <tbody>
              {incomes.map(inc => (
                <tr key={inc.id}>
                  <td><div style={{ fontWeight: 600 }}>{inc.title}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{inc.notes}</div></td>
                  <td><span className="badge badge-green">{categories.find(c => c.name === inc.category)?.icon} {inc.category}</span></td>
                  <td style={{ fontWeight: 700, color: 'var(--success)' }}>+₹{parseFloat(inc.amount).toLocaleString()}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{inc.date}</td>
                  <td>{inc.recurring ? <span className="badge badge-accent">Recurring</span> : <span className="badge" style={{ background: 'var(--mint-light)', color: 'var(--text-muted)' }}>One-time</span>}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(inc)}><FiEdit2 /></button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }} onClick={() => setConfirmDelete(inc)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Income Cards */}
      <div className="mobile-only" style={{ marginBottom: '24px' }}>
        <div style={{ padding: '0 4px 16px', fontWeight: 600 }}>Income History</div>
        {incomes.map(inc => (
          <div className="mobile-tx-card" key={`mobile-${inc.id}`}>
            <div className="mobile-tx-icon" style={{ background: 'rgba(76,175,80,0.1)' }}>
              {categories.find(c => c.name === inc.category)?.icon || '💸'}
            </div>
            <div className="mobile-tx-details">
              <div className="mobile-tx-title">{inc.title}</div>
              <div className="mobile-tx-meta">
                <span className="badge badge-green" style={{ padding: '2px 6px', fontSize: '11px' }}>{inc.category}</span>
                {inc.recurring && <span style={{ color: 'var(--accent)' }}>↻ Recurring</span>}
              </div>
            </div>
            <div className="mobile-tx-amount-section">
              <div className="mobile-tx-amount" style={{ color: 'var(--success)' }}>
                +₹{parseFloat(inc.amount).toLocaleString()}
              </div>
              <div className="mobile-tx-date">{inc.date}</div>
              <div className="mobile-tx-actions">
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(inc)} style={{ padding: '4px' }}><FiEdit2 size={14} /></button>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setConfirmDelete(inc)} style={{ color: 'var(--error)', padding: '4px' }}><FiTrash2 size={14} /></button>
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
              <h3 className="modal-title">{editing ? 'Edit Income' : 'Add Income'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-2">
                <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Income source name" required /></div>
                <div className="form-group"><label className="form-label">Amount (₹)</label><input className="form-input" type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0.00" required /></div>
                <div className="form-group"><label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                {form.category === 'Others' && (
                  <div className="form-group">
                    <label className="form-label">New Category Name</label>
                    <input className="form-input" value={form.customCategory || ''} onChange={e => setForm({...form, customCategory: e.target.value})} placeholder="e.g. Freelance" required />
                  </div>
                )}
                <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
              </div>
              <div className="form-group"><label className="form-label">Notes</label><input className="form-input" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Additional details" /></div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label className="toggle"><input type="checkbox" checked={form.recurring} onChange={e => setForm({...form, recurring: e.target.checked})} /><span className="toggle-slider" /></label>
                <span style={{ fontSize: '14px' }}>Recurring Income</span>
              </div>
              <button type="submit" className="btn btn-primary w-full">{editing ? 'Update' : 'Add'} Income</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}><FiAlertCircle style={{ color: 'var(--error)' }} /></div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Delete Income?</h3>
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
