import React from 'react';
import { useApp } from '../context/AppContext';
import { FiCheck, FiAlertTriangle, FiInfo, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const iconMap = {
  warning: { icon: <FiAlertTriangle />, bg: 'rgba(255,152,0,0.1)', color: '#FF9800' },
  info: { icon: <FiInfo />, bg: 'rgba(92,107,192,0.1)', color: '#5C6BC0' },
  success: { icon: <FiCheckCircle />, bg: 'rgba(76,175,80,0.1)', color: '#4CAF50' },
  error: { icon: <FiXCircle />, bg: 'rgba(229,57,53,0.1)', color: '#E53935' },
};

export default function Notifications() {
  const { notifications, markNotifRead, clearNotifs, unreadNotifs } = useApp();

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '28px', marginBottom: '4px' }}>Notifications</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{unreadNotifs} unread notifications</p>
        </div>
        {unreadNotifs > 0 && (
          <button className="btn btn-secondary" onClick={clearNotifs}><FiCheck /> Mark All Read</button>
        )}
      </div>

      <div className="card">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <h3>No Notifications</h3>
            <p>You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          notifications.map(n => {
            const style = iconMap[n.type] || iconMap.info;
            return (
              <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`} onClick={() => markNotifRead(n.id)} style={{ cursor: 'pointer' }}>
                <div className="notif-icon" style={{ background: style.bg, color: style.color }}>{style.icon}</div>
                <div className="notif-content">
                  <div className="notif-title">{n.title}</div>
                  <div className="notif-text">{n.text}</div>
                  <div className="notif-time">{n.time}</div>
                </div>
                {!n.read && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: '4px' }} />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
