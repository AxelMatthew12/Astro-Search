import React from 'react';
import { useSearch } from '../context/SearchContext';

export default function TableView() {
  const { searchResults, isLoading } = useSearch();

  if (isLoading) {
    return <div className="text-center py-10 font-mono text-xs text-gray-500 dark:text-gray-400">Loading table data...</div>;
  }

  if (!searchResults || searchResults.length === 0) {
    return <div className="text-center py-10 font-mono text-xs text-gray-500">No data available to display in table view.</div>;
  }

  return (
    <div className="w-full bg-white dark:bg-[#141518] border border-gray-200 dark:border-[#26282d] rounded-xl overflow-hidden font-mono text-xs shadow-md dark:shadow-lg transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-[#26282d] text-[10px] tracking-wider text-gray-500 dark:text-gray-400 uppercase bg-gray-100 dark:bg-[#1a1b1f]">
              <th className="p-4 w-12 text-center"><input type="checkbox" className="accent-[#dfb343] rounded cursor-pointer" /></th>
              <th className="py-4 px-3 font-semibold">SOURCE</th>
              <th className="py-4 px-3 font-semibold">CITATIONS</th>
              <th className="py-4 px-4 font-semibold font-sans">AUTHORS</th>
              <th className="py-4 px-4 font-semibold font-sans">TITLE</th>
              <th className="py-4 px-3 font-semibold text-right">YEAR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-[#22242a] text-gray-700 dark:text-gray-300">
            {searchResults.map((row, i) => {
              const authors = Array.isArray(row.authors) ? row.authors[0] + " et al." : (row.authors || "Unknown");
              return (
                <tr key={row.id || i} className="hover:bg-gray-50 dark:hover:bg-[#1a1c20] transition-colors">
                  <td className="p-4 text-center"><input type="checkbox" className="accent-[#dfb343] rounded cursor-pointer" /></td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded border border-[#dfb343]/40 bg-[#dfb343]/10 text-[#dfb343] font-bold text-[10px]">
                      {row.source || 'OTHER'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-600 dark:text-gray-400 font-bold">{row.citations || '0'}</td>
                  <td className="py-3 px-4 font-sans font-medium text-gray-900 dark:text-white truncate max-w-[180px]">{authors}</td>
                  <td className="py-3 px-4 font-sans text-gray-800 dark:text-gray-300 truncate max-w-[300px]">
                    <a href={row.link || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-[#dfb343] transition-colors">
                      {row.title}
                    </a>
                  </td>
                  <td className="py-3 px-3 text-right text-gray-600 dark:text-gray-400 font-bold">{row.year || 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}