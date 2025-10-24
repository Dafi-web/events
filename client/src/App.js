import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import News from './pages/News';
import Directory from './pages/Directory';
import DirectoryDetail from './pages/DirectoryDetail';
import JoinUs from './pages/JoinUs';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminTutorials from './pages/AdminTutorials';
import Tutorials from './pages/Tutorials';
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
              <Route path="events" element={<Events />} />
              <Route path="events/:id" element={<EventDetail />} />
              <Route path="news" element={<News />} />
              <Route path="directory" element={<Directory />} />
              <Route path="directory/:id" element={<DirectoryDetail />} />
              <Route path="join" element={<JoinUs />} />
              <Route path="contact" element={<Contact />} />
              <Route path="tutorials" element={<Tutorials />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
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
