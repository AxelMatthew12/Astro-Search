import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2, ArrowRight, Sparkles, AtSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Destructure fungsi OAuth dari AuthContext
  const { register, loginWithGoogle, loginWithGithub } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register(formData);
      alert("Registrasi berhasil! Silakan login.");
      navigate('/login');
    } catch (error) {
      alert("Gagal mendaftar. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthLogin = async (providerName, providerFunction) => {
    try {
      await providerFunction();
    } catch (error) {
      alert(`Gagal terhubung dengan ${providerName}. Silakan coba lagi.`);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12 w-full font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-[#141518] border border-gray-200 dark:border-[#26282d] rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden">
        
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#dfb343]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 text-center mb-10">
          <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#26282d] rounded-xl flex items-center justify-center text-[#dfb343] mb-4">
            <Sparkles size={24} />
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">
            Join AstroSearch
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Establish your private academic workspace.
          </p>
        </div>

        <form onSubmit={handleRegister} className="relative z-10 space-y-5">
          <div>
            <label className="block text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
              Full Name
            </label>
            <div className="flex items-center bg-gray-50 dark:bg-[#0d0e10] border border-gray-300 dark:border-[#26282d] rounded-xl px-4 py-3.5 focus-within:border-[#dfb343] transition-colors">
              <User size={18} className="text-gray-400 mr-3 shrink-0" />
              <input 
                type="text" 
                name="fullName"
                required 
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Dr. Alex Mercer"
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
              Username
            </label>
            <div className="flex items-center bg-gray-50 dark:bg-[#0d0e10] border border-gray-300 dark:border-[#26282d] rounded-xl px-4 py-3.5 focus-within:border-[#dfb343] transition-colors">
              <AtSign size={18} className="text-gray-400 mr-3 shrink-0" />
              <input 
                type="text" 
                name="username"
                required 
                value={formData.username}
                onChange={handleChange}
                placeholder="alexmercer"
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <div className="flex items-center bg-gray-50 dark:bg-[#0d0e10] border border-gray-300 dark:border-[#26282d] rounded-xl px-4 py-3.5 focus-within:border-[#dfb343] transition-colors">
              <Mail size={18} className="text-gray-400 mr-3 shrink-0" />
              <input 
                type="email" 
                name="email"
                required 
                value={formData.email}
                onChange={handleChange}
                placeholder="researcher@university.edu"
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="flex items-center bg-gray-50 dark:bg-[#0d0e10] border border-gray-300 dark:border-[#26282d] rounded-xl px-4 py-3.5 focus-within:border-[#dfb343] transition-colors">
              <Lock size={18} className="text-gray-400 mr-3 shrink-0" />
              <input 
                type="password" 
                name="password"
                required 
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full px-8 py-4 bg-[#dfb343] hover:bg-[#c99f30] disabled:bg-[#dfb343]/50 text-black font-bold text-xs tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2.5 uppercase font-mono shadow-md cursor-pointer mt-6"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : (
              <>
                <span>Create Account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* --- Bagian Pemisah (Divider) --- */}
        <div className="relative z-10 flex items-center my-6">
          <div className="flex-grow border-t border-gray-300 dark:border-[#26282d]"></div>
          <span className="flex-shrink-0 mx-4 text-xs font-mono text-gray-400 uppercase">Or sign up with</span>
          <div className="flex-grow border-t border-gray-300 dark:border-[#26282d]"></div>
        </div>

        {/* --- Tombol Provider (Google & GitHub) --- */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          <button 
            type="button" 
            onClick={() => handleOAuthLogin('Google', loginWithGoogle)}
            className="flex items-center justify-center py-3 bg-gray-50 dark:bg-[#0d0e10] hover:bg-gray-100 dark:hover:bg-[#1a1b1f] border border-gray-300 dark:border-[#26282d] rounded-xl transition-colors"
          >
            {/* SVG Ikon Google */}
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Google</span>
          </button>
          
          <button 
            type="button" 
            onClick={() => handleOAuthLogin('GitHub', loginWithGithub)}
            className="flex items-center justify-center py-3 bg-gray-50 dark:bg-[#0d0e10] hover:bg-gray-100 dark:hover:bg-[#1a1b1f] border border-gray-300 dark:border-[#26282d] rounded-xl transition-colors"
          >
             {/* SVG Asli GitHub */}
             <svg className="w-5 h-5 mr-2 text-gray-800 dark:text-gray-200" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
             </svg>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">GitHub</span>
          </button>
        </div>

        <div className="text-center mt-8 relative z-10">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-[#dfb343] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}