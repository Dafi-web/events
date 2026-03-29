import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import News from './pages/News';
import Directory from './pages/Directory';
import DirectoryDetail from './pages/DirectoryDetail';
import JoinUs from './pages/JoinUs';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminTutorials from './pages/AdminTutorials';
import Tutorials from './pages/Tutorials';
import TestAPI from './pages/TestAPI';
import SimpleLoginTest from './pages/SimpleLoginTest';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <ScrollToTop />
            <Routes>
            {/* Public routes with layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="courses" element={<Courses />} />
              <Route
                path="courses/:id"
                element={
                  <ProtectedRoute>
                    <CourseDetail />
                  </ProtectedRoute>
                }
              />
              <Route path="events" element={<Navigate to="/courses" replace />} />
              <Route path="events/:id" element={<Navigate to="/courses" replace />} />
              <Route path="news" element={<News />} />
              <Route path="directory" element={<Directory />} />
              <Route path="directory/:id" element={<DirectoryDetail />} />
              <Route path="join" element={<JoinUs />} />
              <Route path="contact" element={<Contact />} />
              <Route path="tutorials" element={<Tutorials />} />
              <Route path="test-api" element={<TestAPI />} />
              <Route path="simple-test" element={<SimpleLoginTest />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              {/* Protected admin routes */}
              <Route path="admin" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="admin/tutorials" element={
                <ProtectedRoute adminOnly>
                  <AdminTutorials />
                </ProtectedRoute>
              } />
            </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
