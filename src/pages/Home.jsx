import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, isLoading, handleSearch } = useSearch();
  
  // Mengambil data user dari context
  const { user } = useAuth();

  const onSubmitSearch = (e, directQuery = null) => {
    if (e) e.preventDefault();
    handleSearch(e, directQuery);
    navigate('/results');
  };

  // Mengecek apakah data profil utama masih kosong (pertanda pengguna baru OAuth/Register)
  const isProfileIncomplete = user && (!user.education || !user.job || !user.bio);

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center w-full font-sans text-gray-800 dark:text-gray-200 px-6 transition-colors duration-300">
      <div className="w-full max-w-4xl mx-auto py-20 flex flex-col items-center">
        
        {/* BANNER PERINGATAN LENGKAPI PROFIL */}
        {isProfileIncomplete && (
          <div className="animate-fadeIn w-full mb-10 bg-[#dfb343]/10 border border-[#dfb343]/40 p-5 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm">
            <AlertCircle className="text-[#dfb343] shrink-0 mt-1 sm:mt-0" size={28} />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Welcome to AstroSearch!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 leading-relaxed">
                It looks like your profile is incomplete. Please take a moment to fill in your Education, Occupation, and Bio so we can provide a more personalized academic experience.
              </p>
            </div>
            <Link 
              to="/profile" 
              className="shrink-0 mt-4 sm:mt-0 w-full sm:w-auto text-center px-6 py-2.5 bg-[#dfb343] hover:bg-[#c99f30] text-black text-sm font-bold rounded-md shadow-sm transition-colors whitespace-nowrap"
            >
              Complete Profile
            </Link>
          </div>
        )}

        <div className="text-center mb-10 animate-fadeIn">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white tracking-tight font-sans">
            SEARCH ACADEMIC PUBLICATIONS, ARTICLES <span className="text-[#dfb343]">WITHOUT LIMITS</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Access scientific publications and articles via a high-performance, integrated interface. Open. Search. Discover.
          </p>
        </div>

        <form 
          onSubmit={onSubmitSearch} 
          className="w-full flex items-center bg-transparent border-b border-gray-300 dark:border-gray-600 pb-2 mb-6"
        >
          <Search size={22} className="text-gray-400 dark:text-gray-500 mr-3 shrink-0" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, author, keyword..."
            className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-lg md:text-xl font-medium appearance-none"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="px-6 py-2.5 bg-[#dfb343] hover:bg-[#c99f30] text-black font-bold text-sm tracking-wider rounded transition-colors flex items-center space-x-2 shrink-0 disabled:opacity-50 shadow-sm font-sans cursor-pointer"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <span>Search</span>}
          </button>
        </form>

        <div className="w-full flex flex-col items-center space-y-6 mt-4">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs pt-2">
            <span className="text-gray-500 dark:text-gray-400 uppercase mr-2 tracking-widest font-mono font-semibold text-[11px]">
              TRENDING:
            </span>
            {['Artificial Intelligence', 'Machine Learning', 'Cyber Security', 'Quantum Computing'].map(tag => (
              <button 
                key={tag} 
                type="button"
                onClick={(e) => onSubmitSearch(e, tag)} 
                className="border border-gray-300 dark:border-[#26282d] bg-white dark:bg-[#141518] px-3.5 py-1.5 rounded hover:border-[#dfb343] hover:text-[#dfb343] text-gray-700 dark:text-gray-300 transition-colors font-sans text-xs shadow-sm cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}