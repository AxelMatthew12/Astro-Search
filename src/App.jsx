import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import All Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext'; // <-- Import added
import { SearchProvider } from './context/SearchContext'; // <-- Import added

// Import Pages
import Home from './pages/Home';
import Results from './pages/Results';
import Article from './pages/Article';
import About from './pages/About';
import Documentation from './pages/Documentation';
import Login from './pages/Login';
import Register from './pages/Register';
import ApiSettings from './pages/ApiSettings';
import Profile from './pages/Profile'; // <-- Import added

// Import Components & Layout
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

export default function App() {
  return (
    // Wrap the entire app with ALL necessary context providers
    <ThemeProvider>
      <SearchProvider>
        <AuthProvider>
          <Router>
            <MainLayout>
              <Routes>
                {/* 🟢 PUBLIC ROUTES */}
                <Route path="/" element={<Home />} />
                <Route path="/results" element={<Results />} />
                <Route path="/article/:id" element={<Article />} />
                <Route path="/about" element={<About />} />
                <Route path="/docs" element={<Documentation />} />
                
                {/* 🟡 AUTH ROUTES */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />

                {/* 🔴 PROTECTED ROUTES */}
                <Route 
                  path="/settings/api" 
                  element={
                    <ProtectedRoute>
                      <ApiSettings />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </MainLayout>
          </Router>
        </AuthProvider>
      </SearchProvider>
    </ThemeProvider>
  );
}