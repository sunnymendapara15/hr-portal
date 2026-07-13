import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

const Header = () => {
  const { auth, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="app-title">HR Portal</div>
      <div className="header-actions">
        {auth?.token ? (
          <> 
            <span className="header-user">{auth.user.email}</span>
            <button type="button" onClick={logout} className="ghost-button ghost-button--light">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="ghost-button ghost-button--light">
              Login
            </Link>
            <Link to="/signup" className="ghost-button ghost-button--light">
              Signup
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

const AppRoutes = () => {
  const { auth } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={auth?.token ? '/dashboard' : '/login'} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const AppShell = () => (
  <div className="app-shell">
    <Header />
    <main className="app-main">
      <AppRoutes />
    </main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppShell />
      </Router>
    </AuthProvider>
  );
}

export default App;
