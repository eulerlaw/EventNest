import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import ExploreEvents from './pages/ExploreEvents';
import EventDetails from './pages/EventDetails';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import RecommendedEvents from './pages/student/RecommendedEvents';
import MyRegistrations from './pages/student/MyRegistrations';
import StudentProfile from './pages/student/StudentProfile';

// Organizer Pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import CreateEvent from './pages/organizer/CreateEvent';
import ManageEvent from './pages/organizer/ManageEvent';
import EventAnalytics from './pages/organizer/EventAnalytics';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import EventModeration from './pages/admin/EventModeration';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<ExploreEvents />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Student Protected Routes */}
                <Route
                  path="/student"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/recommended"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <RecommendedEvents />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/registrations"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <MyRegistrations />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/student/profile"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'organizer', 'admin']}>
                      <StudentProfile />
                    </ProtectedRoute>
                  }
                />

                {/* Organizer Protected Routes */}
                <Route
                  path="/organizer"
                  element={
                    <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                      <OrganizerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/events/new"
                  element={
                    <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                      <CreateEvent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/events/:id/attendees"
                  element={
                    <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                      <ManageEvent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/events/:id/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                      <EventAnalytics />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/events"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <EventModeration />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <ChatbotWidget />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
