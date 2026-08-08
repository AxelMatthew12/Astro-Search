import React, { useState } from 'react';
import { Share2, Loader2, CheckCircle2 } from 'lucide-react';

export default function SyncToDocs({ savedJournals = [  ] }) {
  const [syncCode, setSyncCode] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // URL Firebase Realtime Database Anda
  const FIREBASE_URL = 'https://astro-search-e6578-default-rtdb.asia-southeast1.firebasedatabase.app';

  const handleSync = async () => {
    setIsSyncing(true);
    
    // 1. Generate PIN 6 karakter acak (Kombinasi huruf & angka)
    const pin = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // 2. Siapkan payload data (Jurnal yang akan disinkronkan)
    const payload = {
      createdAt: new Date().toISOString(),
      journals: savedJournals // Data jurnal yang dipilih user
    };

    try {
      // 3. Kirim ke Firebase menggunakan REST API (metode PUT)
      // Wajib ada .json di akhir URL untuk Firebase REST API
      const response = await fetch(`${FIREBASE_URL}/syncs/${pin}.json`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim data ke database');
      }

      // Jika sukses, tampilkan PIN ke user
      setSyncCode(pin);
    } catch (error) {
      console.error("Gagal sinkronisasi:", error);
      alert("Gagal menghubungi server sinkronisasi. Periksa koneksi internet Anda.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-[#1c1d22] border border-[#26282d] p-6 rounded-xl shadow-md transition-colors duration-300">
      <h3 className="text-white font-bold text-lg mb-2">Sync to Google Docs</h3>
      <p className="text-gray-400 text-xs mb-5">
        Dapatkan Pairing Code untuk menyinkronkan sitasi Anda ke ekstensi Google Docs.
      </p>
      
      {!syncCode ? (
        <button 
          onClick={handleSync}
          disabled={isSyncing || savedJournals.length === 0}
          className="bg-[#dfb343] hover:bg-[#c99f30] text-black px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 w-full sm:w-auto transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSyncing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Share2 size={16} />
              <span>Generate Code</span>
            </>
          )}
        </button>
      ) : (
        <div className="bg-[#141518] border border-[#dfb343]/40 p-5 rounded-lg flex items-center justify-between shadow-inner">
          <div>
            <p className="text-[10px] text-[#dfb343] font-mono uppercase tracking-widest mb-1">
              Your Pairing Code
            </p>
            <p className="text-3xl text-white font-black tracking-[0.25em]">
              {syncCode}
            </p>
          </div>
          <CheckCircle2 size={36} className="text-[#dfb343]" />
        </div>
      )}

      {/* Peringatan jika belum ada jurnal yang dipilih */}
      {!syncCode && savedJournals.length === 0 && (
        <p className="text-red-400 text-[10px] mt-3 font-mono">
          * Anda belum memilih/menyimpan jurnal apapun untuk disinkronkan.
        </p>
      )}
    </div>
  );
}