import React from 'react';
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
import AdminMenus from './pages/AdminMenus';
import AdminThemes from './pages/AdminThemes';
import AdminPlans from './pages/AdminPlans';
import AdminRBAC from './pages/AdminRBAC';
import Plan from './pages/Plan';
import SavedLinks from './pages/SavedLinks';
import RequestVerification from './pages/RequestVerification';
import AdminVerification from './pages/AdminVerification';
import Profile from './pages/Profile';
import BioTrees from './pages/BioTrees';
import TreeEditor from './pages/TreeEditor';
import PageBuilder from './pages/PageBuilder';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Layout from './components/Layout';
import { ToastProvider } from './src/context/ToastContext';
import { ToastContainer } from './components/Toast';
import { AuthProvider, useAuth } from './src/context/AuthContext';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isAdmin, user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage isAuthenticated={isAuthenticated} userProfile={user} />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login onLogin={() => { }} isAuthenticated={isAuthenticated} />} />
        <Route path="/register" element={<Register isAuthenticated={isAuthenticated} />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Layout userProfile={user} onLogout={handleLogout}><Dashboard /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard/profile"
          element={isAuthenticated ? <Layout userProfile={user} onLogout={handleLogout}><Profile /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard/links"
          element={isAuthenticated ? <Navigate to="/dashboard/trees" /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard/trees"
          element={isAuthenticated ? <Layout userProfile={user} onLogout={handleLogout}><BioTrees /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard/trees/:id"
          element={isAuthenticated ? <Layout userProfile={user} onLogout={handleLogout}><TreeEditor /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard/builder"
          element={isAuthenticated ? <PageBuilder /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard/analytics"
          element={isAuthenticated ? <Layout userProfile={user} onLogout={handleLogout}><Analytics /></Layout> : <Navigate to="/login" />}
        />

        <Route
          path="/dashboard/themes"
          element={isAuthenticated ? <Layout userProfile={user} onLogout={handleLogout}><Themes /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard/plan"
          element={isAuthenticated ? <Layout userProfile={user} onLogout={handleLogout}><Plan /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard/saved"
          element={isAuthenticated ? <Layout userProfile={user} onLogout={handleLogout}><SavedLinks /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard/verification"
          element={isAuthenticated ? <Layout userProfile={user} onLogout={handleLogout}><RequestVerification /></Layout> : <Navigate to="/login" />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={isAuthenticated && isAdmin ? <Layout userProfile={user} onLogout={handleLogout} isAdmin><AdminDashboard onLogout={handleLogout} /></Layout> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/admin/users"
          element={isAuthenticated && isAdmin ? <Layout userProfile={user} onLogout={handleLogout} isAdmin><AdminUsers onLogout={handleLogout} /></Layout> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/admin/analytics"
          element={isAuthenticated && isAdmin ? <Layout userProfile={user} onLogout={handleLogout} isAdmin><AdminAnalytics onLogout={handleLogout} /></Layout> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/admin/security"
          element={isAuthenticated && isAdmin ? <Layout userProfile={user} onLogout={handleLogout} isAdmin><AdminSecurity onLogout={handleLogout} /></Layout> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/admin/settings"
          element={isAuthenticated && isAdmin ? <Layout userProfile={user} onLogout={handleLogout} isAdmin><AdminSettings onLogout={handleLogout} /></Layout> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/admin/settings/menus"
          element={isAuthenticated && isAdmin ? <Layout userProfile={user} onLogout={handleLogout} isAdmin><AdminMenus /></Layout> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/admin/settings/themes"
          element={isAuthenticated && isAdmin ? <Layout userProfile={user} onLogout={handleLogout} isAdmin><AdminThemes /></Layout> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/admin/settings/plans"
          element={isAuthenticated && isAdmin ? <Layout userProfile={user} onLogout={handleLogout} isAdmin><AdminPlans /></Layout> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/admin/rbac"
          element={isAuthenticated && isAdmin ? <Layout userProfile={user} onLogout={handleLogout} isAdmin><AdminRBAC /></Layout> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/admin/verification"
          element={isAuthenticated && isAdmin ? <Layout userProfile={user} onLogout={handleLogout} isAdmin><AdminVerification /></Layout> : <Navigate to="/dashboard" />}
        />

        {/* Public Profile View */}
        <Route path="/:username" element={<PublicProfile />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
