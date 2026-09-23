import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';

// Code-split pages for much faster initial load times
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Income = lazy(() => import('./pages/Income'));
const Expenses = lazy(() => import('./pages/Expenses'));
const Categories = lazy(() => import('./pages/Categories'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Budget = lazy(() => import('./pages/Budget'));
const Reports = lazy(() => import('./pages/Reports'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="spinner-border text-primary" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

function PrivateRoute({ children, title }) {
  const { isAuth } = useApp();
  if (!isAuth) return <Navigate to="/login" />;
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <TopBar title={title} />
        <div className="page-content fade-in">
          <Suspense fallback={<PageLoader />}>
            {children}
          </Suspense>
        </div>
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
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  );
}