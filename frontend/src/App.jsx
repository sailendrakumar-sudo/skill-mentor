import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import Discover from './pages/Discover';
import Recommendations from './pages/Recommendations';
import StudentProfile from './pages/StudentProfile';
import Requests from './pages/Requests';
import Messages from './pages/Messages';
import Sessions from './pages/Sessions';
import Reviews from './pages/Reviews';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#0B0F19] text-slate-100">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Core Student Exchange Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<ProfileEdit />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/student/:id" element={<StudentProfile />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/reviews" element={<Reviews />} />

              {/* Catch-all redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
