import React, { useState, useEffect } from 'react';
import { BookMarked, Trash2 } from 'lucide-react';
import SyncToDocs from '../components/SyncToDocs';

export default function Library() {
  const [savedJournals, setSavedJournals] = useState([]);

  // Load jurnal tersimpan dari LocalStorage saat halaman dimuat
  useEffect(() => {
    const localData = localStorage.getItem('astro_library');
    if (localData) {
      try {
        setSavedJournals(JSON.parse(localData));
      } catch (e) {
        console.error("Gagal memuat library dari local storage", e);
      }
    }
  }, []);

  // Fungsi untuk menghapus jurnal dari daftar
  const removeJournal = (id) => {
    const updated = savedJournals.filter(j => j.id !== id);
    setSavedJournals(updated);
    localStorage.setItem('astro_library', JSON.stringify(updated));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 w-full py-12 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      
      {/* Header Halaman */}
      <div className="border-b border-gray-200 dark:border-[#26282d] pb-6 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <BookMarked className="text-[#dfb343]" size={32} />
            My Research Library
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Koleksi jurnal dan artikel ilmiah tersimpan secara lokal di perangkat Anda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Kolom Kiri: Daftar Jurnal Tersimpan */}
        <div className="lg:col-span-8 space-y-4">
          {savedJournals.length > 0 ? (
            savedJournals.map((journal, index) => (
              <div 
                key={journal.id || index}
                className="bg-white dark:bg-[#141518] border border-gray-200 dark:border-[#26282d] p-5 rounded-xl flex items-start justify-between gap-4 shadow-sm"
              >
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">
                    {journal.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {journal.authors} • <span className="text-[#dfb343] font-semibold">{journal.journal}</span> ({journal.year})
                  </p>
                  <p className="text-[11px] font-mono text-gray-400">DOI: {journal.doi || 'N/A'}</p>
                </div>

                <button 
                  onClick={() => removeJournal(journal.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2 cursor-pointer"
                  title="Hapus dari library"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-16 border border-dashed border-gray-300 dark:border-[#26282d] rounded-xl">
              <p className="text-sm font-semibold text-gray-500">Belum ada jurnal yang disimpan di library lokal Anda.</p>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Widget Sync to Docs */}
        <div className="lg:col-span-4 space-y-6">
          <SyncToDocs savedJournals={savedJournals} />
        </div>

      </div>
    </div>
  );
}