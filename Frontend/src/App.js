import React, { useState } from 'react';
import './App.css';
import {
  GraduationCap,
  Users,
  BookOpen,
  FileCheck,
  LayoutDashboard,
  LogOut,
  ChevronRight
} from 'lucide-react';
import SkillManager from './components/SkillManager';
import StudentManager from './components/StudentManager';
import RequirementManager from './components/RequirementManager';
import EligibilityChecker from './components/EligibilityChecker';
import LoginPage from './components/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('skills');
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'skills', label: 'Skills', icon: BookOpen, desc: 'Manage skills' },
    { id: 'students', label: 'Students', icon: Users, desc: 'Student profiles' },
    { id: 'requirements', label: 'Requirements', icon: LayoutDashboard, desc: 'Track requirements' },
    { id: 'checker', label: 'Eligibility', icon: FileCheck, desc: 'Check matches' },
  ];

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-icon-wrapper">
            <GraduationCap className="logo-icon" />
          </div>
          <div>
            <h1 className="logo-text">PickOut</h1>
            <span className="logo-sub">Placement Hub</span>
          </div>
        </div>

        <nav className="nav-menu">
          <span className="nav-label">MENU</span>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              >
                <div className="nav-item-icon">
                  <Icon size={20} />
                </div>
                <div className="nav-item-text">
                  <span className="nav-item-label">{item.label}</span>
                  <span className="nav-item-desc">{item.desc}</span>
                </div>
                {activeTab === item.id && <ChevronRight size={16} className="nav-arrow" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.username || 'User'}</span>
              <span className="user-email">{user?.email || ''}</span>
            </div>
          </div>
          <button onClick={logout} className="logout-btn" title="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="content-wrapper">
          {activeTab === 'skills' && <SkillManager />}
          {activeTab === 'students' && <StudentManager />}
          {activeTab === 'requirements' && <RequirementManager />}
          {activeTab === 'checker' && <EligibilityChecker />}
        </div>
      </main>
    </div>
  );
}

function App() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Dashboard /> : <LoginPage />;
}

function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWrapper;
