import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const PAGE_SIZE = 8;

export default function Transactions() {
  const { expenses, incomes, categories } = useApp();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCat, setFilterCat] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [page, setPage] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();

  // Accept search query from TopBar navigation state
  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearch(location.state.searchQuery);
      setPage(1);
      // Clear the state so it doesn't persist on subsequent visits
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const allTransactions = useMemo(() => {
    const exp = expenses.map(e => ({ ...e, txType: 'expense' }));
    const inc = incomes.map(i => ({ ...i, txType: 'income' }));
    return [...exp, ...inc];
  }, [expenses, incomes]);

  const filtered = useMemo(() => {
    let result = allTransactions;
    if (filterType !== 'all') result = result.filter(t => t.txType === filterType);
    if (filterCat !== 'all') result = result.filter(t => t.category === filterCat);
    if (search) result = result.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    result.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'amount') return parseFloat(b.amount) - parseFloat(a.amount);
      return a.title.localeCompare(b.title);
    });
    return result;
  }, [allTransactions, filterType, filterCat, search, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const uniqueCats = [...new Set(allTransactions.map(t => t.category))];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '4px' }}>Transaction History</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Complete record of all activities ({filtered.length} transactions)</p>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <div className="topbar-search" style={{ flex: '1 1 250px' }}>
            <FiSearch style={{ color: 'var(--text-muted)' }} />
            <input placeholder="Search transactions..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="form-select" style={{ width: 'auto', minWidth: '140px' }} value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select className="form-select" style={{ width: 'auto', minWidth: '140px' }} value={filterCat} onChange={e => { setFilterCat(e.target.value); setPage(1); }}>
            <option value="all">All Categories</option>
            {uniqueCats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="form-select" style={{ width: 'auto', minWidth: '140px' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Table (Desktop) */}
      <div className="card desktop-only" style={{ padding: 0, overflow: 'hidden', marginBottom: '24px' }}>
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Transaction</th><th>Type</th><th>Category</th><th>Amount</th><th>Date</th></tr></thead>
            <tbody>
              {pageData.map(t => (
                <tr key={`${t.txType}-${t.id}`}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ width: '40px', height: '40px', borderRadius: '10px', background: t.txType === 'income' ? 'rgba(76,175,80,0.1)' : 'rgba(26,26,26,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                        {categories.find(c => c.name === t.category)?.icon || '💸'}
                      </span>
                      <div><div style={{ fontWeight: 600 }}>{t.title}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.notes}</div></div>
                    </div>
                  </td>
                  <td><span className={`badge ${t.txType === 'income' ? 'badge-green' : 'badge-red'}`}>{t.txType === 'income' ? '↓ Income' : '↑ Expense'}</span></td>
                  <td><span className="badge badge-primary">{t.category}</span></td>
                  <td style={{ fontWeight: 700, color: t.txType === 'income' ? 'var(--success)' : 'var(--error)' }}>{t.txType === 'income' ? '+' : '-'}₹{parseFloat(t.amount).toLocaleString()}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Transaction Cards */}
      <div className="mobile-only" style={{ marginBottom: '24px' }}>
        {pageData.map(t => (
          <div className="mobile-tx-card" key={`mobile-${t.txType}-${t.id}`}>
            <div className="mobile-tx-icon" style={{ background: t.txType === 'income' ? 'rgba(76,175,80,0.1)' : 'rgba(26,26,26,0.08)' }}>
              {categories.find(c => c.name === t.category)?.icon || '💸'}
            </div>
            <div className="mobile-tx-details">
              <div className="mobile-tx-title">{t.title}</div>
              <div className="mobile-tx-meta">
                <span className={`badge ${t.txType === 'income' ? 'badge-green' : 'badge-red'}`} style={{ padding: '2px 6px', fontSize: '11px' }}>
                  {t.txType === 'income' ? 'Income' : 'Expense'}
                </span>
                <span>• {t.category}</span>
              </div>
            </div>
            <div className="mobile-tx-amount-section">
              <div className="mobile-tx-amount" style={{ color: t.txType === 'income' ? 'var(--success)' : 'var(--error)' }}>
                {t.txType === 'income' ? '+' : '-'}₹{parseFloat(t.amount).toLocaleString()}
              </div>
              <div className="mobile-tx-date">{t.date}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><FiChevronLeft /></button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
          ))}
          <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><FiChevronRight /></button>
        </div>
      )}
    </div>
  );
}
