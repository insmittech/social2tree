import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PublicProfile from './pages/PublicProfile';
import Analytics from './pages/Analytics';
import Themes from './pages/Themes';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminSettings from './pages/AdminSettings';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSecurity from './pages/AdminSecurity';
import LinksPage from './pages/Links';
import Plan from './pages/Plan';
import SavedLinks from './pages/SavedLinks';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import { ToastProvider } from './src/context/ToastContext';
import { ToastContainer } from './components/Toast';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is logged in by calling /auth/me.php
        const { default: client } = await import('./src/api/client');
        const response = await client.get('/auth/me.php');

        if (response.data.user) {
          setIsAuthenticated(true);
          setIsAdmin(response.data.user.role === 'admin');
          setUserProfile(response.data.user);
        }
      } catch (err) {
        // Not authenticated
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (isAdminUser: boolean = false, user: any = null) => {
    setIsAuthenticated(true);
    setIsAdmin(isAdminUser);
    if (user) setUserProfile(user);
  };

  const handleLogout = async () => {
    try {
      const { default: client } = await import('./src/api/client');
      await client.post('/auth/logout.php');
    } catch (err) {
      console.error('Logout error:', err);
    }
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserProfile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage isAuthenticated={isAuthenticated} userProfile={userProfile} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />} />
          <Route path="/register" element={<Register isAuthenticated={isAuthenticated} />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Layout userProfile={userProfile} onLogout={handleLogout}><Dashboard onLogout={handleLogout} /></Layout> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard/profile"
            element={isAuthenticated ? <Layout userProfile={userProfile} onLogout={handleLogout}><Profile /></Layout> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard/links"
            element={isAuthenticated ? <Layout userProfile={userProfile} onLogout={handleLogout}><LinksPage onLogout={handleLogout} /></Layout> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard/analytics"
            element={isAuthenticated ? <Layout userProfile={userProfile} onLogout={handleLogout}><Analytics onLogout={handleLogout} /></Layout> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard/themes"
            element={isAuthenticated ? <Layout userProfile={userProfile} onLogout={handleLogout}><Themes onLogout={handleLogout} /></Layout> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard/plan"
            element={isAuthenticated ? <Layout userProfile={userProfile} onLogout={handleLogout}><Plan /></Layout> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard/saved"
            element={isAuthenticated ? <Layout userProfile={userProfile} onLogout={handleLogout}><SavedLinks /></Layout> : <Navigate to="/login" />}
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={isAuthenticated && isAdmin ? <Layout userProfile={userProfile} onLogout={handleLogout} isAdmin><AdminDashboard onLogout={handleLogout} /></Layout> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/admin/users"
            element={isAuthenticated && isAdmin ? <Layout userProfile={userProfile} onLogout={handleLogout} isAdmin><AdminUsers onLogout={handleLogout} /></Layout> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/admin/analytics"
            element={isAuthenticated && isAdmin ? <Layout userProfile={userProfile} onLogout={handleLogout} isAdmin><AdminAnalytics onLogout={handleLogout} /></Layout> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/admin/security"
            element={isAuthenticated && isAdmin ? <Layout userProfile={userProfile} onLogout={handleLogout} isAdmin><AdminSecurity onLogout={handleLogout} /></Layout> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/admin/settings"
            element={isAuthenticated && isAdmin ? <Layout userProfile={userProfile} onLogout={handleLogout} isAdmin><AdminSettings onLogout={handleLogout} /></Layout> : <Navigate to="/dashboard" />}
          />

          {/* Public Profile View */}
          <Route path="/:username" element={<PublicProfile />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
