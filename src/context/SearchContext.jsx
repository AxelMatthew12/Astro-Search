import React, { createContext, useState, useContext } from 'react';
import { 
  searchGoogleScholar, 
  searchScopus, 
  searchOpenAlex, 
  searchCrossref, 
  searchArxiv, 
  searchCore 
} from '../utils/api';

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceOption, setSourceOption] = useState('ALL');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const resetSearch = () => {
    setSearchQuery('');
    setSourceOption('ALL');
    setSearchResults([]);
    setHasSearched(false);
    setCollapsedGroups({});
  };

  const handleSearch = async (e, directQuery = null) => {
    if (e) e.preventDefault();
    const queryToUse = directQuery || searchQuery;
    if (!queryToUse.trim()) return;

    if (directQuery) setSearchQuery(directQuery);

    setIsLoading(true);
    setHasSearched(true);
    setSearchResults([]);
    setCollapsedGroups({});

    const savedElsevierKey = localStorage.getItem('elsevier_api_key');
    const savedElsevierToken = localStorage.getItem('elsevier_inst_token');
    const savedCoreKey = localStorage.getItem('core_api_key'); 

    try {
      const searchPromises = [];

      // Pendaftaran antrean eksekusi ke 6 sumber API
      if (sourceOption === 'ALL' || sourceOption === 'SCHOLAR') {
        searchPromises.push(searchGoogleScholar(queryToUse));
      }
      if (sourceOption === 'ALL' || sourceOption === 'SCOPUS') {
        if (savedElsevierKey) {
          searchPromises.push(searchScopus(queryToUse, savedElsevierKey, savedElsevierToken));
        } else if (sourceOption === 'SCOPUS') {
          alert("API Key Scopus belum diatur! Silakan isi di halaman API Settings.");
        }
      }
      if (sourceOption === 'ALL' || sourceOption === 'OPENALEX') {
        searchPromises.push(searchOpenAlex(queryToUse));
      }
      if (sourceOption === 'ALL' || sourceOption === 'CROSSREF') {
        searchPromises.push(searchCrossref(queryToUse));
      }
      if (sourceOption === 'ALL' || sourceOption === 'ARXIV') {
        searchPromises.push(searchArxiv(queryToUse));
      }
      if (sourceOption === 'ALL' || sourceOption === 'CORE') {
         if (savedCoreKey) {
           searchPromises.push(searchCore(queryToUse, savedCoreKey));
         } else if (sourceOption === 'CORE') {
           alert("API Key CORE belum diatur!");
         }
      }

      // Eksekusi paralel yang aman terhadap kegagalan salah satu server (Resilient Engine)
      const results = await Promise.allSettled(searchPromises);
      
      let combinedData = [];
      results.forEach(res => {
        if (res.status === 'fulfilled') {
          combinedData = [...combinedData, ...res.value];
        }
      });

      // --- LOGIKA FILTERING & SORTING (Standar Publish or Perish) ---
      const currentYear = new Date().getFullYear(); // Tahun Realtime (2026)

      // 1. Validasi Tahun & Buang Artikel Masa Depan (Early Access)
      let filteredData = combinedData.filter(item => {
        if (item.year === "N/A" || !item.year) return false;
        const yearNum = parseInt(item.year, 10);
        if (isNaN(yearNum)) return false;
        if (yearNum > currentYear) return false; 
        return true;
      });

      // 2. Perhitungan Metrik Sitasi per Tahun & Penetapan Label High Quality (HQ)
      filteredData = filteredData.map(item => {
        const yearNum = parseInt(item.year, 10);
        const citationCount = item.citations === "N/A" ? 0 : parseInt(item.citations, 10) || 0;
        
        const age = Math.max(1, currentYear - yearNum + 1);
        const citationsPerYear = citationCount / age;
        const isRecent = (currentYear - yearNum) <= 5;
        
        // Kriteria HQ: Rilis 5 tahun terakhir DAN punya >10 sitasi atau kecepatan sitasi >= 2/tahun
        const isHQ = isRecent && (citationCount > 10 || citationsPerYear >= 2);
        
        return { ...item, isHQ, citationCount, yearNum, citationsPerYear, isRecent };
      });

      // 3. Sorting Multi-Prioritas
      filteredData.sort((a, b) => {
        if (a.isRecent && !b.isRecent) return -1;
        if (!a.isRecent && b.isRecent) return 1;

        if (a.isHQ && !b.isHQ) return -1;
        if (!a.isHQ && b.isHQ) return 1;

        if (b.citationsPerYear !== a.citationsPerYear) {
          return b.citationsPerYear - a.citationsPerYear;
        }

        if (b.citationCount !== a.citationCount) {
          return b.citationCount - a.citationCount;
        }

        return b.yearNum - a.yearNum;
      });

      setSearchResults(filteredData);
    } catch (error) {
      console.error("Terjadi kesalahan pada sistem antrean pencarian:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SearchContext.Provider value={{
      searchQuery, setSearchQuery,
      sourceOption, setSourceOption,
      searchResults, setSearchResults,
      isLoading,
      hasSearched,
      collapsedGroups, setCollapsedGroups,
      handleSearch, resetSearch
    }}>
      {children}
    </SearchContext.Provider>
  );
};