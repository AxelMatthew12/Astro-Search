import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-[#26282d] bg-white dark:bg-[#0d0e10] mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex flex-col md:flex-row items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <span className="text-[#dfb343] font-bold text-lg">AstroSearch</span>
          <span>© 2026 AstroSearch.</span>
          <span>Part of Astroz Group.</span>
        </div>
        <div className="flex space-x-6 mt-4 md:mt-0 font-medium">
          <Link to="/about#privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">Privacy Policy</Link>
          <Link to="/about#terms" className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">Terms of Service</Link>
          <Link to="/about#cookies" className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">Cookie Policy</Link>
          <Link to="/about#contact" className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">Contact</Link>
        </div>
      </div>
    </footer>
  );
}