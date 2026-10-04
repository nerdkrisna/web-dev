import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ProjectFormPage from './pages/ProjectFormPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="app-container" id="app-root">
            <Navbar />
            <main className="main-content" id="main-content-area">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<DashboardPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes (Step 4 Requirement: Protect at least 2 routes) */}
                <Route
                  path="/projects/new"
                  element={
                    <ProtectedRoute>
                      <ProjectFormPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/edit/:id"
                  element={
                    <ProtectedRoute>
                      <ProjectFormPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
