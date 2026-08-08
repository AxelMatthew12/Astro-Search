import React, { useEffect } from 'react';
import { FileText, ExternalLink, BookmarkPlus, FolderPlus } from 'lucide-react';
import SyncToDocs from '../components/SyncToDocs';

export default function Article() {
  
  useEffect(() => {
    // Fungsi simulasi mencatat artikel ke tabel viewed_articles saat diakses
    const recordViewHistory = async () => {
      // POST /api/v1/articles/{article_id}/view
    };
    recordViewHistory();
  }, []);

  const handleBookmark = () => {
    // Logika POST ke tabel `bookmarks`
    alert("Artikel berhasil ditambahkan ke Bookmark Anda.");
  };

  const handleSaveToWorkspace = () => {
    // Logika modal untuk memilih workspace dan POST ke `workspace_articles`
    alert("Buka modal pilih Workspace...");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 w-full py-12 transition-colors duration-300">
      <div className="flex flex-wrap gap-2 text-xs font-mono text-gray-600 dark:text-gray-400 mb-6 uppercase tracking-wider">
        <span className="border border-gray-300 dark:border-[#26282d] bg-white dark:bg-[#141518] px-2.5 py-1 rounded shadow-sm">Peer Reviewed</span>
        <span className="border border-gray-300 dark:border-[#26282d] bg-white dark:bg-[#141518] px-2.5 py-1 rounded shadow-sm">Q1 Journal</span>
        <span className="py-1 font-semibold text-gray-800 dark:text-gray-300">Nature Communications - 2023</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
            Quantum Entanglement in Macroscopic Biological Systems
          </h1>
          
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-10 space-y-1">
            <p>1 Institute for Advanced Quantum Studies, Geneva, Switzerland</p>
            <p>2 Department of Theoretical Physics, MIT, USA</p>
          </div>

          <div className="flex space-x-8 mb-12 border-b border-gray-200 dark:border-[#26282d] pb-6">
            <div>
              <p className="text-[#dfb343] text-3xl font-black">342</p>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">Citations</p>
            </div>
            <div>
              <p className="text-gray-900 dark:text-white text-3xl font-black">1.2M</p>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">Reads</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#141518] rounded-xl p-8 mb-10 border border-gray-200 dark:border-[#26282d] shadow-sm transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Abstract</h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              The phenomenon of quantum entanglement has traditionally been confined to microscopic systems operating at near absolute zero temperatures. However, recent observations suggest potential macroscopic quantum effects in warm, noisy biological environments. In this paper, we present compelling evidence of sustained quantum coherence within the photosynthetic complexes of green sulfur bacteria. By utilizing advanced two-dimensional electronic spectroscopy, we observed quantum beats lasting for several hundred femtoseconds at room temperature. We propose a theoretical model detailing how the highly structured protein scaffold actively protects these fragile quantum states from environmental decoherence, suggesting an evolutionary optimization for energy transfer efficiency through quantum mechanical principles.
            </p>
          </div>

          <div className="mb-10">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Keywords</h3>
            <div className="flex flex-wrap gap-2 text-xs font-mono font-semibold">
              {['QUANTUM BIOLOGY', 'PHOTOSYNTHESIS', 'COHERENCE', 'SPECTROSCOPY', 'DECOHERENCE'].map(kw => (
                <span key={kw} className="border border-gray-300 dark:border-[#26282d] bg-gray-100 dark:bg-[#1e2024] px-3 py-1.5 rounded text-gray-700 dark:text-gray-300 shadow-sm">{kw}</span>
              ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#141518] rounded-xl p-8 mb-10 border border-gray-200 dark:border-[#26282d] shadow-sm transition-colors duration-300">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Coherence Times (fs)</h2>
            <div className="h-48 border-b border-l border-gray-300 dark:border-[#26282d] flex items-end justify-around pb-0 pt-4 px-4 gap-4">
               <div className="w-full bg-gray-200 dark:bg-[#1e2024] h-1/4 rounded-t-sm"></div>
               <div className="w-full bg-gray-300 dark:bg-[#26282d] h-2/4 rounded-t-sm"></div>
               <div className="w-full bg-[#dfb343] h-full rounded-t-sm shadow-sm"></div>
               <div className="w-full bg-gray-300 dark:bg-[#26282d] h-3/5 rounded-t-sm"></div>
               <div className="w-full bg-gray-200 dark:bg-[#1e2024] h-1/3 rounded-t-sm"></div>
            </div>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4 font-mono">Figure 1: Observed quantum beat durations across different sample temperatures.</p>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleSaveToWorkspace}
              className="w-full bg-gray-900 dark:bg-white text-white dark:text-black py-3 rounded-lg text-sm font-bold tracking-wide flex items-center justify-center space-x-2 transition-colors shadow-sm cursor-pointer"
            >
              <FolderPlus size={18} />
              <span>Save to Workspace</span>
            </button>
            <button 
              onClick={handleBookmark}
              className="w-full bg-[#dfb343] hover:bg-[#c99f30] text-black py-3 rounded-lg text-sm font-bold tracking-wide flex items-center justify-center space-x-2 transition-colors shadow-sm cursor-pointer"
            >
              <BookmarkPlus size={18} />
              <span>Add to Bookmarks</span>
            </button>
            
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button className="bg-white dark:bg-[#141518] border border-gray-300 dark:border-[#26282d] text-gray-900 dark:text-white py-2.5 rounded-lg text-xs font-bold tracking-wide flex items-center justify-center space-x-2 transition-colors shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1e2024]">
                <FileText size={16} />
                <span>PDF</span>
              </button>
              <button className="bg-white dark:bg-[#141518] border border-gray-300 dark:border-[#26282d] text-gray-900 dark:text-white py-2.5 rounded-lg text-xs font-bold tracking-wide flex items-center justify-center space-x-2 transition-colors shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1e2024]">
                <ExternalLink size={16} />
                <span>Publisher</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Export Citation</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold mb-6">
              {['APA', 'IEEE', 'BibTeX', 'RIS'].map(format => (
                <button key={format} className="bg-white dark:bg-[#141518] border border-gray-200 dark:border-[#26282d] py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1e2024] transition text-gray-700 dark:text-gray-300 shadow-sm cursor-pointer">{format}</button>
              ))}
            </div>

            <SyncToDocs 
              savedJournals={[
                {
                  title: "Quantum Entanglement in Macroscopic Biological Systems",
                  authors: "Institute for Advanced Quantum Studies",
                  year: "2023",
                  journal: "Nature Communications",
                  doi: "10.1038/s41467-023-x"
                }
              ]} 
            />
            <div className="mb-8"></div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">Publication Details</h4>
            <div className="bg-white dark:bg-[#141518] border border-gray-200 dark:border-[#26282d] rounded-xl p-5 text-xs shadow-sm transition-colors duration-300">
              <div className="flex justify-between py-2.5 border-b border-gray-100 dark:border-[#26282d]/50">
                <span className="font-semibold text-gray-500 dark:text-gray-400">DOI</span>
                <span className="font-mono text-gray-900 dark:text-gray-200">10.1038/s41467-023-x</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-gray-100 dark:border-[#26282d]/50">
                <span className="font-semibold text-gray-500 dark:text-gray-400">ISSN</span>
                <span className="font-mono text-gray-900 dark:text-gray-200">2041-1723</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-gray-100 dark:border-[#26282d]/50">
                <span className="font-semibold text-gray-500 dark:text-gray-400">Publisher</span>
                <span className="text-gray-900 dark:text-gray-200 font-medium">Springer Nature</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="font-semibold text-gray-500 dark:text-gray-400">License</span>
                <span className="text-gray-900 dark:text-gray-200 font-medium">CC BY 4.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}