import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Categories from './pages/Categories';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';


function PrivateRoute({ children, title }) {
  const { isAuth } = useApp();
  if (!isAuth) return <Navigate to="/login" />;
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <TopBar title={title} />
        <div className="page-content fade-in">{children}</div>
      </div>
    </div>
  );
}

function AdminRoute({ children }) {
  const { isAdmin } = useApp();
  if (!isAdmin) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/" element={<PrivateRoute title="Dashboard"><Dashboard /></PrivateRoute>} />
      <Route path="/income" element={<PrivateRoute title="Income"><Income /></PrivateRoute>} />
      <Route path="/expenses" element={<PrivateRoute title="Expenses"><Expenses /></PrivateRoute>} />
      <Route path="/categories" element={<PrivateRoute title="Categories"><Categories /></PrivateRoute>} />
      <Route path="/transactions" element={<PrivateRoute title="Transactions"><Transactions /></PrivateRoute>} />
      <Route path="/budget" element={<PrivateRoute title="Budget Planning"><Budget /></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute title="Reports & Analytics"><Reports /></PrivateRoute>} />
      <Route path="/notifications" element={<PrivateRoute title="Notifications"><Notifications /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute title="Profile & Settings"><Profile /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute title="Admin Panel"><AdminRoute><Admin /></AdminRoute></PrivateRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}