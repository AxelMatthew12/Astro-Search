import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Loader2, RotateCcw, ArrowRight } from 'lucide-react';
import ResultCard from '../components/ResultCard';
import { useSearch } from '../context/SearchContext';

const ITEMS_PER_PAGE = 5;

const FilterSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div>
      <div className="h-6 bg-gray-200 dark:bg-[#26282d] rounded w-24 mb-6"></div>
      <div className="mb-6 space-y-3">
        <div className="h-3 bg-gray-200 dark:bg-[#26282d] rounded w-32 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <div className="w-4 h-4 rounded bg-gray-200 dark:bg-[#26282d]"></div>
                <div className="h-3 bg-gray-300 dark:bg-[#1e2024] rounded w-16"></div>
              </div>
              <div className="h-3 bg-gray-300 dark:bg-[#1e2024] rounded w-6"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 dark:bg-[#26282d] rounded w-28 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <div className="w-4 h-4 rounded bg-gray-200 dark:bg-[#26282d]"></div>
                <div className="h-3 bg-gray-300 dark:bg-[#1e2024] rounded w-20"></div>
              </div>
              <div className="h-3 bg-gray-300 dark:bg-[#1e2024] rounded w-6"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ResultSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="flex justify-between items-center mb-6 pb-2">
      <div className="h-4 bg-gray-200 dark:bg-[#26282d] rounded w-48"></div>
      <div className="h-7 bg-gray-200 dark:bg-[#26282d] rounded w-32"></div>
    </div>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="p-6 rounded-xl bg-white/60 dark:bg-[#141518]/60 border border-gray-200 dark:border-[#26282d] space-y-4 shadow-sm">
        <div className="flex gap-2">
          <div className="h-5 bg-gray-200 dark:bg-[#26282d] rounded w-24"></div>
          <div className="h-5 bg-gray-200 dark:bg-[#26282d] rounded w-20"></div>
        </div>
        <div className="h-6 bg-gray-200 dark:bg-[#26282d] rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 dark:bg-[#1e2024] rounded w-1/2"></div>
        <div className="space-y-2 pt-1">
          <div className="h-3 bg-gray-300 dark:bg-[#1e2024] rounded w-full"></div>
          <div className="h-3 bg-gray-300 dark:bg-[#1e2024] rounded w-5/6"></div>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-[#26282d]/50">
          <div className="flex space-x-4">
            <div className="h-4 bg-gray-200 dark:bg-[#26282d] rounded w-20"></div>
            <div className="h-4 bg-gray-200 dark:bg-[#26282d] rounded w-24"></div>
          </div>
          <div className="h-8 bg-gray-200 dark:bg-[#26282d] rounded w-24"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function Results() {
  const navigate = useNavigate();
  const {
    searchQuery, setSearchQuery,
    searchResults, isLoading, hasSearched,
    handleSearch, resetSearch
  } = useSearch();

  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);

  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [appliedYearRange, setAppliedYearRange] = useState({ start: null, end: null });

  useEffect(() => {
    if (!hasSearched && !isLoading && !searchQuery) {
      navigate('/');
    }
  }, [hasSearched, isLoading, searchQuery, navigate]);

  const availableYears = useMemo(() => {
    const yearCounts = {};
    searchResults.forEach(r => {
      const y = parseInt(r.year);
      if (y && !isNaN(y)) {
        yearCounts[y] = (yearCounts[y] || 0) + 1;
      }
    });

    const sortedYears = Object.keys(yearCounts)
      .map(Number)
      .sort((a, b) => {
        const countDiff = yearCounts[b] - yearCounts[a];
        return countDiff !== 0 ? countDiff : b - a;
      });

    return sortedYears.slice(0, 5);
  }, [searchResults]);

  const availableSources = useMemo(() => {
    const sources = searchResults.map(r => (r.source || 'OTHER').toUpperCase());
    return [...new Set(sources)];
  }, [searchResults]);

  // HANYA ADA SATU processedResults DI SINI
  const processedResults = useMemo(() => {
    let filtered = [...searchResults];

    if (selectedYears.length > 0) {
      filtered = filtered.filter(item => selectedYears.includes(String(item.year)));
    }

    if (appliedYearRange.start !== null || appliedYearRange.end !== null) {
      filtered = filtered.filter(item => {
        const itemYear = parseInt(item.year);
        if (isNaN(itemYear)) return false;
        
        const minYear = appliedYearRange.start ? parseInt(appliedYearRange.start) : -Infinity;
        const maxYear = appliedYearRange.end ? parseInt(appliedYearRange.end) : Infinity;
        
        return itemYear >= minYear && itemYear <= maxYear;
      });
    }

    if (selectedSources.length > 0) {
      filtered = filtered.filter(item => selectedSources.includes((item.source || 'OTHER').toUpperCase()));
    }

    if (sortBy === 'newest') {
      filtered.sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
    } else if (sortBy === 'citations') {
      filtered.sort((a, b) => {
        // PERBAIKAN: Menghapus koma/titik sebelum melakukan konversi ke Integer
        const cleanCitA = String(a.citations).replace(/\D/g, '');
        const cleanCitB = String(b.citations).replace(/\D/g, '');
        
        const citA = cleanCitA === "" || a.citations === "N/A" ? 0 : parseInt(cleanCitA, 10);
        const citB = cleanCitB === "" || b.citations === "N/A" ? 0 : parseInt(cleanCitB, 10);
        
        return citB - citA;
      });
    }

    return filtered;
  }, [searchResults, selectedYears, appliedYearRange, selectedSources, sortBy]);

  const totalPages = Math.ceil(processedResults.length / ITEMS_PER_PAGE) || 1;
  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedResults.slice(start, start + ITEMS_PER_PAGE);
  }, [processedResults, currentPage]);

  const toggleCheckbox = (item, list, setList) => {
    setCurrentPage(1);
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleYearInputChange = (value, setYearState) => {
    const onlyDigits = value.replace(/\D/g, '');
    setYearState(onlyDigits);
  };

  const handleApplyYearRange = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSelectedYears([]);
    setAppliedYearRange({
      start: startYear ? startYear : null,
      end: endYear ? endYear : null,
    });
  };

  const handleResetYearRange = () => {
    setStartYear('');
    setEndYear('');
    setAppliedYearRange({ start: null, end: null });
    setCurrentPage(1);
  };

  const onSubmitSearch = (e) => {
    if (e) e.preventDefault();
    setCurrentPage(1);
    setSelectedYears([]);
    setSelectedSources([]);
    handleResetYearRange();
    handleSearch(e);
  };

  const clearAllFilters = () => {
    setSelectedYears([]);
    setSelectedSources([]);
    handleResetYearRange();
  };

  const goHome = () => {
    setCurrentPage(1);
    clearAllFilters();
    setSortBy('relevance');
    resetSearch();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasAnyFilterActive = selectedYears.length > 0 || selectedSources.length > 0 || appliedYearRange.start !== null || appliedYearRange.end !== null;

  return (
    <div className="min-h-[85vh] flex flex-col justify-between w-full font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-1 flex flex-col md:flex-row gap-12 animate-fadeIn">
        
        {/* Left Sidebar Filters */}
        <aside className="w-full md:w-60 shrink-0 space-y-8">
          {isLoading ? (
            <FilterSkeleton />
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Filters</h2>
                {hasAnyFilterActive && (
                  <button onClick={clearAllFilters} className="text-xs text-[#dfb343] hover:underline font-mono cursor-pointer">
                    Clear All
                  </button>
                )}
              </div>

              {/* PUBLICATION YEAR FILTER */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[11px] font-mono tracking-wider text-gray-500 dark:text-gray-400 uppercase font-semibold">
                    TOP YEARS
                  </h3>
                </div>
                
                {availableYears.length > 0 && (
                  <div className="space-y-2.5 font-mono text-xs mb-4">
                    {availableYears.map((year) => {
                      const count = searchResults.filter(r => String(r.year) === String(year)).length;
                      return (
                        <label key={year} className="flex items-center justify-between cursor-pointer group">
                          <div className="flex items-center space-x-2.5">
                            <input 
                              type="checkbox" 
                              checked={selectedYears.includes(String(year))}
                              onChange={() => {
                                if (appliedYearRange.start || appliedYearRange.end) {
                                  handleResetYearRange();
                                }
                                toggleCheckbox(String(year), selectedYears, setSelectedYears);
                              }}
                              className="w-4 h-4 rounded bg-transparent border border-gray-400 dark:border-gray-600 checked:bg-[#dfb343] checked:border-[#dfb343] accent-[#dfb343] cursor-pointer"
                            />
                            <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{year}</span>
                          </div>
                          <span className="text-gray-500 dark:text-gray-500 text-[11px]">{count}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Custom Year Range Input - Fixed for Safari Display consistency */}
                <form onSubmit={handleApplyYearRange} className="pt-3 border-t border-gray-200 dark:border-[#26282d]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">Custom Range</span>
                    {(appliedYearRange.start !== null || appliedYearRange.end !== null) && (
                      <button type="button" onClick={handleResetYearRange} className="text-[10px] font-mono text-gray-400 hover:text-[#dfb343] transition-colors cursor-pointer">
                        Reset Range
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      placeholder="From"
                      value={startYear}
                      onChange={(e) => handleYearInputChange(e.target.value, setStartYear)}
                      className="w-full bg-white dark:bg-[#141518] border border-gray-300 dark:border-[#26282d] focus:border-[#dfb343] rounded px-2.5 py-1.5 text-xs text-gray-900 dark:text-white font-mono placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-colors text-center shadow-sm appearance-none"
                    />
                    <span className="text-gray-500 dark:text-gray-600 font-mono">-</span>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      placeholder="To"
                      value={endYear}
                      onChange={(e) => handleYearInputChange(e.target.value, setEndYear)}
                      className="w-full bg-white dark:bg-[#141518] border border-gray-300 dark:border-[#26282d] focus:border-[#dfb343] rounded px-2.5 py-1.5 text-xs text-gray-900 dark:text-white font-mono placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-colors text-center shadow-sm appearance-none"
                    />
                    <button
                      type="submit"
                      disabled={!startYear && !endYear}
                      className="p-1.5 bg-[#dfb343] hover:bg-[#c99f30] disabled:opacity-30 disabled:cursor-not-allowed text-black rounded transition-colors shrink-0 font-bold cursor-pointer"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </form>
              </div>

              {/* DATA SOURCE FILTER */}
              {availableSources.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-[11px] font-mono tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-3 font-semibold">
                    DATA SOURCES
                  </h3>
                  <div className="space-y-2.5 font-sans text-xs">
                    {availableSources.map((source) => {
                      const count = searchResults.filter(r => (r.source || 'OTHER').toUpperCase() === source).length;
                      return (
                        <label key={source} className="flex items-center justify-between cursor-pointer group">
                          <div className="flex items-center space-x-2.5">
                            <input 
                              type="checkbox" 
                              checked={selectedSources.includes(source)}
                              onChange={() => toggleCheckbox(source, selectedSources, setSelectedSources)}
                              className="w-4 h-4 rounded bg-transparent border border-gray-400 dark:border-gray-600 checked:bg-[#dfb343] checked:border-[#dfb343] accent-[#dfb343] cursor-pointer"
                            />
                            <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{source}</span>
                          </div>
                          <span className="text-gray-500 dark:text-gray-500 text-[11px] font-mono">{count}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 min-w-0">
          <form onSubmit={onSubmitSearch} className="w-full flex items-center bg-transparent pb-6 mb-6 border-b border-gray-200 dark:border-[#26282d]">
            <Search size={24} className="text-gray-400 dark:text-gray-500 mr-3.5 shrink-0" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, author, keyword..."
              className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-xl md:text-2xl font-bold tracking-tight appearance-none"
            />
            {isLoading && <Loader2 size={22} className="text-[#dfb343] animate-spin ml-2 shrink-0" />}
          </form>

          {isLoading ? (
            <ResultSkeleton />
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-2 text-xs font-mono">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-500 dark:text-gray-400">
                    Showing <strong className="text-gray-900 dark:text-white font-normal">
                      {processedResults.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, processedResults.length)}
                    </strong> of <strong className="text-gray-900 dark:text-white font-normal">{processedResults.length} results</strong>
                  </span>
                  {searchResults.length > 0 && (
                    <button onClick={goHome} className="flex items-center space-x-1 text-gray-500 hover:text-[#dfb343] transition-colors cursor-pointer">
                      <RotateCcw size={12} />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 uppercase tracking-wider text-[10px]">SORT:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                    className="bg-white dark:bg-[#141518] border border-gray-300 dark:border-[#26282d] text-gray-700 dark:text-gray-300 rounded px-2.5 py-1 text-xs outline-none focus:border-[#dfb343] cursor-pointer shadow-sm appearance-none"
                  >
                    <option value="relevance">RELEVANCE</option>
                    <option value="newest">NEWEST</option>
                    <option value="citations">CITATIONS</option>
                  </select>
                </div>
              </div>

              {processedResults.length > 0 ? (
                <div className="space-y-4 mb-10">
                  {paginatedResults.map((res, index) => (
                    <ResultCard key={res.id || index} result={res} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-gray-300 dark:border-[#26282d] border-dashed rounded-xl bg-gray-50 dark:bg-[#141518]/30">
                  <p className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">No articles matched your criteria</p>
                  <p className="text-xs text-gray-500">Try removing some filters or changing your search keywords.</p>
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 font-mono text-xs mt-8">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="p-2.5 rounded bg-white dark:bg-[#141518] border border-gray-300 dark:border-[#26282d] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                    .map((page, idx, array) => (
                      <React.Fragment key={page}>
                        {idx > 0 && array[idx - 1] !== page - 1 && <span className="px-1 text-gray-500 font-bold">...</span>}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 rounded flex items-center justify-center border font-bold transition-colors cursor-pointer ${
                            currentPage === page 
                              ? 'border-[#dfb343] text-[#dfb343] bg-[#dfb343]/10 shadow-sm' 
                              : 'bg-white dark:bg-[#141518] border-gray-300 dark:border-[#26282d] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white shadow-sm'
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}

                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="p-2.5 rounded bg-white dark:bg-[#141518] border border-gray-300 dark:border-[#26282d] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}