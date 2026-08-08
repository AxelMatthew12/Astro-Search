import React from 'react';

export default function Documentation() {
  return (
    <div className="max-w-7xl mx-auto px-6 w-full py-12 flex flex-col md:flex-row gap-12 transition-colors duration-300">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-56 flex-shrink-0">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Topics</h3>
        <ul className="space-y-5 text-sm font-medium">
          <li className="text-[#dfb343] font-semibold border-l-2 border-[#dfb343] pl-4 cursor-pointer">Getting Started</li>
          <li className="text-gray-600 dark:text-gray-400 pl-4 hover:text-black dark:hover:text-white cursor-pointer transition-colors border-l-2 border-transparent">API Integration</li>
          <li className="text-gray-600 dark:text-gray-400 pl-4 hover:text-black dark:hover:text-white cursor-pointer transition-colors border-l-2 border-transparent">Search Syntax</li>
          <li className="text-gray-600 dark:text-gray-400 pl-4 hover:text-black dark:hover:text-white cursor-pointer transition-colors border-l-2 border-transparent">Advanced Filters</li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight">Getting Started</h1>
        
        {/* Visualization Placeholder */}
        <div className="w-full aspect-[21/9] bg-white dark:bg-[#141518] border border-gray-200 dark:border-[#26282d] rounded-xl mb-12 flex flex-col items-center justify-center relative overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
           <div className="absolute inset-0 opacity-40 dark:opacity-20" style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, #dfb343 1px, transparent 1px)',
              backgroundSize: '40px 40px'
           }}></div>
           <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold z-10">[ Knowledge Graph Visualization Area ]</p>
           <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 z-10">Academic Ecosystem Analysis</p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Authentication</h2>
        
        {/* Code Block */}
        <div className="bg-gray-900 dark:bg-[#0f0f0f] border border-gray-800 dark:border-[#26282d] rounded-xl p-6 font-mono text-sm overflow-x-auto shadow-md">
          <pre className="text-gray-200 leading-relaxed">
            <code>
              <span className="text-[#dfb343] font-bold">curl</span> -X GET "https://api.astrosearch.com/v1/ping" \
              <br />
              <span className="text-blue-400">-H</span> "Authorization: Bearer YOUR_API_KEY"
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}