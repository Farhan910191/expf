import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState({ name: '', email: '', currency: '₹', avatar: 'U' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  // Fetch all data when authenticated
  const fetchAll = useCallback(async () => {
    if (!localStorage.getItem('token')) return;
    setLoading(true);
    try {
      const [expRes, incRes, budRes, notRes, profRes, catRes] = await Promise.all([
        API.get('expenses/'),
        API.get('incomes/'),
        API.get('budgets/'),
        API.get('notifications/'),
        API.get('profile/'),
        API.get('categories/'),
      ]);
      setExpenses(expRes.data);
      setIncomes(incRes.data);
      setBudgets(budRes.data);
      setCategories(catRes.data);
      setNotifications(notRes.data);
      setUser({
        name: profRes.data.name || profRes.data.username,
        email: profRes.data.email || localStorage.getItem(`email_${profRes.data.username}`) || '',
        currency: profRes.data.currency === 'INR' ? '₹' : profRes.data.currency === 'USD' ? '$' : profRes.data.currency === 'EUR' ? '€' : '₹',
        avatar: profRes.data.avatar || 'U',
        profileImage: localStorage.getItem(`profileImage_${profRes.data.username}`) || null,
      });
      setIsAdmin(profRes.data.is_admin || false);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAuth) fetchAll();
  }, [isAuth, fetchAll]);

  // Auth
  const login = async (username, password) => {
    try {
      const res = await API.post('login/', { username, password });
      localStorage.setItem('token', res.data.access);
      if (res.data.refresh) localStorage.setItem('refreshToken', res.data.refresh);
      setIsAuth(true);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Invalid credentials' };
    }
  };

  const signup = async (username, email, password) => {
    try {
      await API.post('signup/', { username, email, password });
      return { success: true };
    } catch (err) {
      const errors = err.response?.data;
      const msg = errors ? Object.values(errors).flat().join(', ') : 'Signup failed';
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setIsAuth(false);
    setExpenses([]);
    setIncomes([]);
    setBudgets([]);
    setNotifications([]);
  };

  // Expenses CRUD
  const addExpense = async (data) => {
    try {
      const res = await API.post('expenses/', data);
      setExpenses(prev => [res.data, ...prev]);
      // Refresh notifications (budget alerts may have been created)
      const notRes = await API.get('notifications/');
      setNotifications(notRes.data);
      return true;
    } catch (err) { console.error(err); return false; }
  };
  const deleteExpense = async (id) => {
    try { await API.delete(`expenses/${id}/`); setExpenses(prev => prev.filter(e => e.id !== id)); return true; }
    catch (err) { console.error(err); return false; }
  };
  const editExpense = async (updated) => {
    try {
      const res = await API.put(`expenses/${updated.id}/`, updated);
      setExpenses(prev => prev.map(e => e.id === updated.id ? res.data : e));
      return true;
    } catch (err) { console.error(err); return false; }
  };

  // Income CRUD
  const addIncome = async (data) => {
    try {
      const res = await API.post('incomes/', data);
      setIncomes(prev => [res.data, ...prev]);
      const notRes = await API.get('notifications/');
      setNotifications(notRes.data);
      return true;
    } catch (err) { console.error(err); return false; }
  };
  const deleteIncome = async (id) => {
    try { await API.delete(`incomes/${id}/`); setIncomes(prev => prev.filter(i => i.id !== id)); return true; }
    catch (err) { console.error(err); return false; }
  };
  const editIncome = async (updated) => {
    try {
      const res = await API.put(`incomes/${updated.id}/`, updated);
      setIncomes(prev => prev.map(i => i.id === updated.id ? res.data : i));
      return true;
    } catch (err) { console.error(err); return false; }
  };


  // Categories CRUD
  const addCategory = async (cat) => {
    // Prevent duplicate names
    if (categories.find(c => c.name.toLowerCase() === cat.name.toLowerCase())) return false;
    try {
      const res = await API.post('categories/', cat);
      setCategories(prev => [...prev, res.data]);
      return true;
    } catch (err) { console.error(err); return false; }
  };
  const deleteCategory = async (id) => {
    try {
      await API.delete(`categories/${id}/`);
      setCategories(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err) { console.error(err); return false; }
  };

  // Budgets CRUD
  const addBudget = async (data) => {
    try {
      const now = new Date();
      const payload = { ...data, month: now.getMonth() + 1, year: now.getFullYear() };
      const res = await API.post('budgets/', payload);
      setBudgets(prev => [...prev, res.data]);
      return true;
    } catch (err) { console.error(err); return false; }
  };
  const deleteBudget = async (id) => {
    try { await API.delete(`budgets/${id}/`); setBudgets(prev => prev.filter(b => b.id !== id)); return true; }
    catch (err) { console.error(err); return false; }
  };

  // Notifications
  const markNotifRead = async (id) => {
    try {
      await API.patch(`notifications/${id}/mark_read/`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) { console.error(err); }
  };
  const clearNotifs = async () => {
    try {
      await API.post('notifications/mark_all_read/');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) { console.error(err); }
  };

  // Computed
  const totalExpense = expenses.reduce((a, e) => a + parseFloat(e.amount || 0), 0);
  const totalIncome = incomes.reduce((a, i) => a + parseFloat(i.amount || 0), 0);
  const balance = totalIncome - totalExpense;
  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      user, setUser, theme, toggleTheme, isAuth, isAdmin, login, signup, logout, loading,
      expenses, addExpense, deleteExpense, editExpense,
      incomes, addIncome, deleteIncome, editIncome,
      categories, addCategory, deleteCategory,
      budgets, addBudget, deleteBudget, setBudgets,
      notifications, markNotifRead, clearNotifs, unreadNotifs,
      totalExpense, totalIncome, balance,
      sidebarOpen, setSidebarOpen, fetchAll,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
export default AppContext;
