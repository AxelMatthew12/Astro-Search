import React, { useState } from 'react';
import { Moon, Sun, User, LogOut, Lock, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useSearch } from '../../context/SearchContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { resetSearch } = useSearch();
  const { user, logout } = useAuth(); 
  
  // MENGAMBIL NAMA DEPAN USER DENGAN AMAN (Ini yang sebelumnya hilang dan bikin error)
  const firstName = user?.full_name 
    ? user.full_name.split(' ')[0] 
    : user?.user_metadata?.full_name 
      ? user.user_metadata.full_name.split(' ')[0] 
      : (user?.username || user?.email?.split('@')[0] || 'User');

  // State untuk mengontrol visibilitas Modal Pop-up Auth
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Documentation', path: '/docs' },
    { name: 'API Settings', path: '/settings/api' },
  ];

  const handleHomeClick = () => {
    resetSearch();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavClick = (e, path) => {
    if (path === '/') {
      handleHomeClick();
    }
    
    // Auth Guard: Memunculkan Pop-up Kustom alih-alih window.alert
    if (path === '/settings/api' && !user) {
      e.preventDefault(); 
      setShowAuthAlert(true);
    }
  };

  return (
    <>
      <nav className="w-full border-b border-gray-200 dark:border-[#26282d] bg-white dark:bg-[#0d0e10] supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:dark:bg-[#0d0e10]/80 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
          
          {/* ======================= */}
          {/* KIRI: Logo */}
          {/* ======================= */}
          <Link 
            to="/" 
            onClick={handleHomeClick}
            className="text-[#dfb343] font-extrabold text-xl tracking-tight hover:opacity-80 transition-opacity cursor-pointer z-10"
          >
            AstroSearch
          </Link>

          {/* ======================= */}
          {/* TENGAH: Navigasi Utama */}
          {/* ======================= */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.name} 
                  to={link.path}
                  onClick={(e) => handleNavClick(e, link.path)}
                  className={`relative py-2 group transition-colors duration-300 cursor-pointer ${
                    isActive ? 'text-[#dfb343]' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                  <span 
                    className={`absolute left-0 bottom-0 w-full h-[2px] bg-[#dfb343] transition-transform duration-300 origin-center ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* ======================= */}
          {/* KANAN: Aksi (Auth & Tema) */}
          {/* ======================= */}
            <div className="flex items-center z-10">
            
            <div className="hidden md:flex items-center font-mono text-[11px] font-bold uppercase tracking-wider">
              {user ? (
                <>
                  {/* Tampilan Jika User Logged In (Murni menggunakan desain Anda) */}
                  <Link 
                    to="/profile" 
                    title="Go to Profile"
                    className="flex items-center gap-2 text-gray-900 dark:text-gray-200 mr-4 hover:opacity-70 hover:text-[#dfb343] transition-all duration-300 cursor-pointer"
                  >
                    <User size={14} className="text-[#dfb343]"/>
                    <span className="text-sm font-medium text-gray-900 dark:text-white font-sans capitalize">
                      {firstName}
                    </span>
                  </Link>
                  
                  <button 
                    onClick={handleLogout} 
                    className="px-3 py-1.5 text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut size={12} /> <span>Exit</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Tampilan Jika Guest */}
                  <Link to="/login" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer tracking-widest mr-5">
                    SIGN IN
                  </Link>
                  <Link to="/register" className="px-4 py-2 bg-[#dfb343] hover:bg-[#c99f30] text-black rounded transition-colors shadow-sm cursor-pointer tracking-wider">
                    CREATE ACCOUNT
                  </Link>
                </>
              )}
            </div>

            {/* Garis Pemisah */}
            <div className="h-5 w-px bg-gray-300 dark:bg-gray-700 mx-5 hidden md:block"></div>

            {/* Toggle Tema */}
            <button 
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <div className="transform transition-transform duration-500 hover:rotate-45">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </div>
            </button>
          </div>
          
        </div>
      </nav>

      {/* =========================================================
          CUSTOM POP-UP MODAL UNTUK AUTH GUARD
      ========================================================== */}
      {showAuthAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 dark:bg-black/60 supports-[backdrop-filter]:backdrop-blur-sm animate-fadeIn">
          
          <div className="bg-white dark:bg-[#141518] border border-gray-200 dark:border-[#26282d] rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative transform transition-all scale-100 opacity-100 font-sans text-center">
            
            {/* Tombol Tutup Silang di Kanan Atas */}
            <button 
              onClick={() => setShowAuthAlert(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Ikon & Konten */}
            <div className="w-14 h-14 mx-auto bg-gray-100 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#26282d] rounded-full flex items-center justify-center text-[#dfb343] mb-5">
              <Lock size={24} />
            </div>
            
            <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
              Akses Terbatas
            </h3>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Silakan <strong className="text-gray-700 dark:text-gray-300 font-medium">Sign In</strong> atau <strong className="text-gray-700 dark:text-gray-300 font-medium">Create Account</strong> terlebih dahulu untuk mengatur kredensial API dan Workspace Anda.
            </p>

            {/* Tombol Aksi */}
            <div className="flex flex-col space-y-3">
              <Link 
                to="/login"
                onClick={() => setShowAuthAlert(false)}
                className="w-full py-3 bg-[#dfb343] hover:bg-[#c99f30] text-black font-mono text-xs font-bold tracking-wider rounded-xl transition-colors shadow-sm flex justify-center uppercase"
              >
                Sign In to Workspace
              </Link>
              <button 
                onClick={() => setShowAuthAlert(false)}
                className="w-full py-3 bg-gray-50 dark:bg-[#1c1d22] hover:bg-gray-100 dark:hover:bg-[#26282d] border border-gray-200 dark:border-[#33363d] text-gray-700 dark:text-gray-300 font-mono text-xs font-bold tracking-wider rounded-xl transition-colors cursor-pointer uppercase"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}