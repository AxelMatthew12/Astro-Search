// src/components/ResultCard.jsx
import React, { useState } from 'react';
import { Download, Lock, Quote, Check, AlertCircle, Loader2 } from 'lucide-react';
import { sendCitationToDocs, checkExtensionInstalled } from '../utils/citationBridge';

export default function ResultCard({ result }) {
  // State indikator koneksi otomatis ke Docs
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'checking' | 'success' | 'no-extension'
  const [toastMessage, setToastMessage] = useState('');

  const title = result?.title || "Untitled Research Paper";
  const journal = result?.journal || result?.source || "Academic Journal";
  const year = result?.year || "N/A";
  const snippet = result?.snippet || "No abstract or summary available for this paper.";
  const citations = result?.citations === "N/A" || !result?.citations ? "0" : Number(result.citations).toLocaleString();
  const link = result?.link || result?.url || "#";
  
  let authors = "Unknown Authors";
  if (Array.isArray(result?.authors)) {
    authors = result.authors.slice(0, 3).join(", ") + (result.authors.length > 3 ? " et al." : "");
  } else if (typeof result?.authors === 'string') {
    authors = result.authors;
  }

  const isOpenAccess = result?.isOpenAccess !== undefined ? result.isOpenAccess : (result?.source === 'ARXIV' || result?.source === 'OPENALEX' || result?.source === 'CORE');

  // --- FUNGSI UTAMA: KONEKSI DIRECT KE GOOGLE DOCS ---
  const handleDirectCiteToDocs = async () => {
    setSyncStatus('checking');

    // 1. Cek apakah Extension terpasang & aktif
    const isInstalled = await checkExtensionInstalled();

    if (!isInstalled) {
      setSyncStatus('no-extension');
      setToastMessage('Extension Astro-Search belum terpasang!');
      setTimeout(() => setSyncStatus('idle'), 4000);
      return;
    }

    // 2. Kirim data artikel langsung ke Extension & Google Docs
    const isSent = await sendCitationToDocs(result);

    if (isSent) {
      setSyncStatus('success');
      setToastMessage('Tersambung! Artikel terkirim ke Google Docs');
      setTimeout(() => setSyncStatus('idle'), 3500);
    } else {
      setSyncStatus('idle');
    }
  };

  return (
    <div className="bg-white dark:bg-[#141518] border border-gray-200 dark:border-[#26282d] hover:border-[#dfb343]/50 dark:hover:border-[#dfb343]/50 rounded-xl p-6 transition-all duration-300 shadow-sm relative group mb-4">
      
      {/* --- NOTIFIKASI TOAST DARI CARD --- */}
      {syncStatus === 'success' && (
        <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 animate-fadeIn z-10">
          <Check size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

      {syncStatus === 'no-extension' && (
        <div className="absolute top-3 right-3 bg-amber-500 text-black text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 animate-fadeIn z-10">
          <AlertCircle size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Card: Title & Badges */}
      <div className="flex justify-between items-start gap-4 mb-2">
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 hover:text-[#dfb343] transition-colors leading-snug">
          <a href={link} target="_blank" rel="noopener noreferrer">{title}</a>
        </h3>

        <div className="flex items-center gap-2 shrink-0">
          {isOpenAccess ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 rounded">
              <Download size={10} /> Open Access
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded">
              <Lock size={10} /> Restricted
            </span>
          )}
        </div>
      </div>

      {/* Authors & Source Meta */}
      <div className="text-xs text-gray-600 dark:text-gray-400 mb-3 flex flex-wrap items-center gap-2 font-sans">
        <span className="font-semibold text-gray-800 dark:text-gray-200">{authors}</span>
        <span>•</span>
        <span className="italic">{journal}</span>
        <span>•</span>
        <span className="font-mono text-[#dfb343] font-bold">{year}</span>
      </div>

      {/* Snippet / Abstract */}
      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
        {snippet}
      </p>

      {/* Card Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-[#26282d]">
        <div className="text-[11px] text-gray-500 font-mono">
          Citations: <strong className="text-gray-800 dark:text-gray-200">{citations}</strong>
        </div>

        <div className="flex items-center gap-2">
          {/* --- TOMBOL CITE TO DOCS OTOMATIS --- */}
          <button
            onClick={handleDirectCiteToDocs}
            disabled={syncStatus === 'checking'}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              syncStatus === 'success'
                ? 'bg-emerald-600 text-white'
                : syncStatus === 'no-extension'
                ? 'bg-amber-500 text-black'
                : 'bg-[#dfb343] hover:bg-[#c99f30] text-black font-bold'
            }`}
          >
            {syncStatus === 'checking' ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Connecting...</span>
              </>
            ) : syncStatus === 'success' ? (
              <>
                <Check size={13} />
                <span>Sent to Docs</span>
              </>
            ) : (
              <>
                <Quote size={13} />
                <span>Cite to Docs</span>
              </>
            )}
          </button>

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-[#1e2025] dark:hover:bg-[#282a30] text-gray-800 dark:text-gray-200 font-semibold text-xs rounded-lg transition-colors"
          >
            Details
          </a>
        </div>
      </div>
    </div>
  );
}