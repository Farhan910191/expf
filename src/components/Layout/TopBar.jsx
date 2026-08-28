import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FiSearch, FiBell, FiMenu, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ title }) {
  const { unreadNotifs, user, setSidebarOpen, expenses, incomes, categories } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Combine expenses and incomes for searching
  const allTransactions = [
    ...expenses.map(e => ({ ...e, txType: 'expense' })),
    ...incomes.map(i => ({ ...i, txType: 'income' })),
  ];

  // Filter results based on search query
  const searchResults = searchQuery.trim().length > 0
    ? allTransactions.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 8)
    : [];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowResults(e.target.value.trim().length > 0);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Navigate to transactions page with search pre-filled
      navigate('/transactions', { state: { searchQuery: searchQuery.trim() } });
      setSearchQuery('');
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
  };

  const handleResultClick = (tx) => {
    // Navigate to the relevant page
    if (tx.txType === 'expense') {
      navigate('/expenses');
    } else {
      navigate('/income');
    }
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-btn" onClick={() => setSidebarOpen(o => !o)} style={{ display: 'none' }} id="menu-toggle">
          <FiMenu />
        </button>
        <h1>{title}</h1>
      </div>
      <div className="topbar-right">
        <div className="topbar-search" style={{ position: 'relative' }}>
          <FiSearch style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
            onFocus={() => searchQuery.trim() && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                padding: '2px', flexShrink: 0
              }}
            >
              <FiX size={16} />
            </button>
          )}

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="search-dropdown">
              {searchResults.length > 0 ? (
                <>
                  <div className="search-dropdown-header">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                  </div>
                  {searchResults.map((tx) => {
                    const cat = categories.find(c => c.name === tx.category);
                    return (
                      <div
                        key={`${tx.txType}-${tx.id}`}
                        className="search-result-item"
                        onMouseDown={() => handleResultClick(tx)}
                      >
                        <span className="search-result-icon" style={{
                          background: tx.txType === 'income' ? 'rgba(22,163,74,0.1)' : 'rgba(26,26,26,0.08)'
                        }}>
                          {cat?.icon || '💸'}
                        </span>
                        <div className="search-result-info">
                          <div className="search-result-title">{tx.title}</div>
                          <div className="search-result-meta">
                            <span className={`badge ${tx.txType === 'income' ? 'badge-green' : 'badge-red'}`} style={{ padding: '2px 8px', fontSize: '11px' }}>
                              {tx.txType === 'income' ? 'Income' : 'Expense'}
                            </span>
                            <span>{tx.category}</span>
                            <span>{tx.date}</span>
                          </div>
                        </div>
                        <div className="search-result-amount" style={{
                          color: tx.txType === 'income' ? 'var(--success)' : 'var(--error)'
                        }}>
                          {tx.txType === 'income' ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                  <div
                    className="search-dropdown-footer"
                    onMouseDown={() => {
                      navigate('/transactions', { state: { searchQuery: searchQuery.trim() } });
                      setSearchQuery('');
                      setShowResults(false);
                    }}
                  >
                    <FiSearch size={14} />
                    View all results for "{searchQuery}"
                  </div>
                </>
              ) : (
                <div className="search-no-results">
                  <span style={{ fontSize: '28px', marginBottom: '8px' }}>🔍</span>
                  <span>No results found for "{searchQuery}"</span>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="topbar-btn" style={{ position: 'relative' }} onClick={() => navigate('/notifications')}>
          <FiBell />
          {unreadNotifs > 0 && <span className="notif-count">{unreadNotifs}</span>}
        </button>

        <div 
          className="avatar-btn" 
          onClick={() => navigate('/profile')}
          style={{ cursor: 'pointer', overflow: 'hidden' }}
          title="Profile & Settings"
        >
          {user.profileImage ? <img src={user.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.avatar}
        </div>
      </div>
    </header>
  );
}
