import { useNavigate } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Layout/Sidebar';
import TopBar from '../components/Layout/TopBar';

export default function NotFound() {
  const { isAuth } = useApp();
  const navigate = useNavigate();

  const cardContent = (
    <div className="notfound-card">
      <div className="notfound-icon">🔍</div>
      <h1 className="notfound-title">404</h1>
      <h2 className="notfound-subtitle">Page Not Found</h2>
      <p className="notfound-text">
        The page you are looking for might have been moved, renamed, or deleted. Please check the web address for typos or use the navigation below to get back on track.
      </p>
      <div className="notfound-actions">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          <FiArrowLeft /> Go Back
        </button>
        <button onClick={() => navigate(isAuth ? '/' : '/login')} className="btn btn-primary">
          <FiHome /> {isAuth ? 'Dashboard' : 'Login'}
        </button>
      </div>
    </div>
  );

  if (isAuth) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-area">
          <TopBar title="Page Not Found" />
          <div className="page-content fade-in">
            <div className="notfound-container">
              {cardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
      <div className="notfound-container">
        {cardContent}
      </div>
    </div>
  );
}
