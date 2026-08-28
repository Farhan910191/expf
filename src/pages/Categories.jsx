import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FiPlus, FiTrash2, FiEdit2, FiChevronDown, FiChevronUp, FiAlertCircle } from 'react-icons/fi';

const ICON_OPTIONS = ['🍔', '🚗', '💡', '🛍️', '🏥', '🎮', '📚', '💰', '💻', '📈', '🏠', '✈️', '🎬', '🎵', '⚽', '👕', '💊', '📱', '🐾', '🎁'];
const COLOR_OPTIONS = ['#E53935', '#5C6BC0', '#FF9800', '#AB47BC', '#4CAF50', '#00BCD4', '#795548', '#C4944A', '#2196F3', '#607D8B'];

export default function Categories() {
  const { categories, addCategory, deleteCategory, expenses, incomes, deleteExpense, deleteIncome, editExpense, editIncome } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', icon: '🍔', color: '#E53935' });
  const [expandedCat, setExpandedCat] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // {type, id, title}
  const [editingTx, setEditingTx] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addCategory(form);
    setShowModal(false);
    setForm({ name: '', icon: '🍔', color: '#E53935' });
  };

  const getHistoryForCategory = (catName) => {
    const exp = expenses.filter(e => e.category === catName).map(e => ({ ...e, txType: 'expense' }));
    const inc = incomes.filter(i => i.category === catName).map(i => ({ ...i, txType: 'income' }));
    return [...exp, ...inc].sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const handleDeleteTx = () => {
    if (!confirmDelete) return;
    if (confirmDelete.txType === 'expense') deleteExpense(confirmDelete.id);
    else deleteIncome(confirmDelete.id);
    setConfirmDelete(null);
  };

  const handleDeleteCategory = (catId) => {
    setConfirmDelete({ type: 'category', id: catId, title: 'this category' });
  };

  const confirmDeleteCategory = () => {
    if (confirmDelete?.type === 'category') deleteCategory(confirmDelete.id);
    setConfirmDelete(null);
  };

  const openEditTx = (tx) => {
    setEditingTx(tx);
    setEditForm({ title: tx.title, amount: tx.amount, date: tx.date, notes: tx.notes || '', category: tx.category });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editingTx.txType === 'expense') editExpense({ ...editingTx, ...editForm });
    else editIncome({ ...editingTx, ...editForm });
    setEditingTx(null);
  };

  const toggleExpand = (catName) => {
    setExpandedCat(expandedCat === catName ? null : catName);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '28px', marginBottom: '4px' }}>Categories</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Organize your finances — click any category to view its full history</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><FiPlus /> Add Category</button>
      </div>

      {categories.length === 0 && (
        <div className="empty-state card" style={{ padding: '60px 20px', marginBottom: '24px' }}>
          <div className="empty-icon" style={{ fontSize: '64px', marginBottom: '20px' }}>📁</div>
          <h3 style={{ fontSize: '22px', marginBottom: '12px' }}>No Categories Found</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 24px' }}>
            It looks like you don't have any categories set up yet. You can create your own custom categories or load the default ones to get started quickly.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn btn-accent" onClick={() => {
              const defaults = [
                { name: 'Food', icon: '🍔', color: '#0F9D7A' },
                { name: 'Travel', icon: '🚗', color: '#3A86FF' },
                { name: 'Shopping', icon: '🛍️', color: '#F5A623' },
                { name: 'Bills', icon: '💡', color: '#E04A4A' },
                { name: 'Entertainment', icon: '🎬', color: '#AB47BC' },
                { name: 'Education', icon: '📚', color: '#00BCD4' },
                { name: 'Health', icon: '🏥', color: '#4CAF50' },
                { name: 'Salary', icon: '💰', color: '#0F9D7A' },
                { name: 'Others', icon: '🐾', color: '#607D8B' }
              ];
              defaults.forEach(cat => addCategory(cat));
            }}>
              Load Default Categories
            </button>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              Create Custom
            </button>
          </div>
        </div>
      )}

      {/* Category Cards with Expandable History */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {categories.map(cat => {
          const history = getHistoryForCategory(cat.name);
          const totalSpent = history.filter(h => h.txType === 'expense').reduce((a, h) => a + parseFloat(h.amount), 0);
          const totalEarned = history.filter(h => h.txType === 'income').reduce((a, h) => a + parseFloat(h.amount), 0);
          const isExpanded = expandedCat === cat.name;

          return (
            <div key={cat.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Category Header */}
              <div
                onClick={() => toggleExpand(cat.name)}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 24px', cursor: 'pointer', transition: 'background 0.2s', background: isExpanded ? 'var(--mint-light)' : 'transparent' }}
              >
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `${cat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>
                  {cat.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '2px' }}>{cat.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', gap: '16px' }}>
                    <span>{history.length} transaction{history.length !== 1 ? 's' : ''}</span>
                    {totalSpent > 0 && <span style={{ color: 'var(--error)' }}>Spent: ₹{totalSpent.toLocaleString()}</span>}
                    {totalEarned > 0 && <span style={{ color: 'var(--success)' }}>Earned: ₹{totalEarned.toLocaleString()}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: cat.color }} />
                  <button className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--error)' }} onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}><FiTrash2 /></button>
                  {isExpanded ? <FiChevronUp style={{ color: 'var(--text-muted)' }} /> : <FiChevronDown style={{ color: 'var(--text-muted)' }} />}
                </div>
              </div>

              {/* Expanded History */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--border-light)' }}>
                  {history.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                      No transactions in this category yet.
                    </div>
                  ) : (
                    <div className="table-container">
                      <table className="data-table">
                        <thead><tr><th>Title</th><th>Type</th><th>Amount</th><th>Date</th><th>Notes</th><th>Actions</th></tr></thead>
                        <tbody>
                          {history.map(tx => (
                            <tr key={`${tx.txType}-${tx.id}`}>
                              <td style={{ fontWeight: 600 }}>{tx.title}</td>
                              <td>
                                <span className={`badge ${tx.txType === 'income' ? 'badge-green' : 'badge-red'}`}>
                                  {tx.txType === 'income' ? '↓ Income' : '↑ Expense'}
                                </span>
                              </td>
                              <td style={{ fontWeight: 700, color: tx.txType === 'income' ? 'var(--success)' : 'var(--error)' }}>
                                {tx.txType === 'income' ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString()}
                              </td>
                              <td style={{ color: 'var(--text-secondary)' }}>{tx.date}</td>
                              <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{tx.notes || '—'}</td>
                              <td>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button className="btn btn-ghost btn-sm" onClick={() => openEditTx(tx)}><FiEdit2 /> Edit</button>
                                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }} onClick={() => setConfirmDelete({ ...tx, txType: tx.txType })}><FiTrash2 /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Category</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label className="form-label">Category Name</label><input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Groceries" required /></div>
              <div className="form-group">
                <label className="form-label">Icon</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {ICON_OPTIONS.map(icon => (
                    <button type="button" key={icon} onClick={() => setForm({ ...form, icon })} style={{ width: '44px', height: '44px', borderRadius: '10px', border: form.icon === icon ? '2px solid var(--primary)' : '1px solid var(--border)', background: form.icon === icon ? 'rgba(26,26,26,0.08)' : 'var(--surface)', fontSize: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {COLOR_OPTIONS.map(color => (
                    <button type="button" key={color} onClick={() => setForm({ ...form, color })} style={{ width: '36px', height: '36px', borderRadius: '50%', background: color, border: form.color === color ? '3px solid var(--text)' : '2px solid transparent', cursor: 'pointer' }} />
                  ))}
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full">Create Category</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}><FiAlertCircle style={{ color: 'var(--error)' }} /></div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Confirm Delete</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              Are you sure you want to delete <strong>{confirmDelete.title || 'this item'}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete.type === 'category' ? confirmDeleteCategory : handleDeleteTx}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {editingTx && (
        <div className="modal-overlay" onClick={() => setEditingTx(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit {editingTx.txType === 'income' ? 'Income' : 'Expense'}</h3>
              <button className="modal-close" onClick={() => setEditingTx(null)}>×</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="grid grid-2">
                <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} required /></div>
                <div className="form-group"><label className="form-label">Amount (₹)</label><input className="form-input" type="number" value={editForm.amount} onChange={e => setEditForm({ ...editForm, amount: e.target.value })} required /></div>
                <div className="form-group"><label className="form-label">Category</label>
                  <select className="form-select" value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })}>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} /></div>
              </div>
              <div className="form-group"><label className="form-label">Notes</label><input className="form-input" value={editForm.notes} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} /></div>
              <button type="submit" className="btn btn-primary w-full">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
