import React, { useState, useEffect } from 'react';
import { Key, Database, Shield, CheckCircle2, Circle, X, Network, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function ApiSettings({ onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [instToken, setInstToken] = useState('');
  const [coreKey, setCoreKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showApiKey, setShowApiKey] = useState(false);
  const [showInstToken, setShowInstToken] = useState(false);
  const [showCoreKey, setShowCoreKey] = useState(false);

  useEffect(() => {
    const fetchCredentials = async () => {
      // Mock API call (Akan diganti dengan axios/fetch sesungguhnya ke backend)
      // GET /api/v1/connected-services
      /*
      const response = await api.get('/connected-services');
      if (response.data.elsevier) {
        setApiKey(response.data.elsevier.access_token);
        setIsConnected(true);
      }
      */
    };
    fetchCredentials();
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      alert("Elsevier API Key tidak boleh kosong!");
      return;
    }
    
    setIsLoading(true);
    try {
      // Mock API call untuk menyimpan ke tabel 'connected_services' di PostgreSQL
      // POST /api/v1/connected-services
      /*
      await api.post('/connected-services', {
        provider: 'elsevier',
        access_token: apiKey,
        // ... (data lain sesuai ERD)
      });
      */
      
      // Simulasi delay jaringan
      await new Promise(res => setTimeout(res, 1000));
      
      setIsConnected(true);
      alert("Kredensial API berhasil dienkripsi dan disimpan di Cloud Workspace Anda.");
      if (onClose) onClose();
    } catch (error) {
      alert("Gagal menyimpan konfigurasi. Silakan periksa koneksi Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 w-full">
      <div className="w-full max-w-lg bg-white dark:bg-[#141518] border border-gray-200 dark:border-[#26282d] rounded-2xl p-6 md:p-8 shadow-xl text-gray-800 dark:text-gray-200 relative font-sans transition-colors duration-300">
        
        <div className="flex items-start justify-between pb-4 mb-6 border-b border-gray-200 dark:border-[#26282d]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 dark:bg-[#1e2024] rounded-lg text-[#dfb343]">
              <Database size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">API Configuration</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Configure your external data provider credentials. Keys are stored securely.
              </p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-white transition-colors p-1 cursor-pointer">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Database size={16} className="text-gray-500 dark:text-gray-400" />
              <span className="text-xs font-bold tracking-wider text-gray-700 dark:text-gray-300 uppercase font-mono">Elsevier Scopus</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-medium">
              {isConnected ? (
                <>
                  <CheckCircle2 size={14} className="text-[#dfb343]" />
                  <span className="text-[#dfb343]">Connected</span>
                </>
              ) : (
                <>
                  <Circle size={14} className="text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400">Not Configured</span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono text-gray-600 dark:text-gray-400 mb-1.5">API Key</label>
              <div className="flex items-center bg-gray-50 dark:bg-[#0d0e10] border border-gray-300 dark:border-[#26282d] rounded-lg px-3 py-2.5 focus-within:border-[#dfb343] transition-colors">
                <Key size={14} className="text-gray-400 mr-2.5 shrink-0" />
                  <input 
                    type={showApiKey ? "text" : "password"} 
                    value={apiKey} 
                    onChange={(e) => setApiKey(e.target.value.trim())}
                    placeholder="••••••••••••••••••••••••••••••••"
                    className="flex-1 min-w-0 bg-transparent border-none outline-none text-left text-gray-900 dark:text-white placeholder-gray-400 text-xs font-mono appearance-none" 
                  />
                <button 
                  type="button" 
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="ml-2 text-gray-400 hover:text-[#dfb343] focus:outline-none transition-colors cursor-pointer"
                >
                  {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-mono text-gray-600 dark:text-gray-400 mb-1.5">Institutional Token (Optional)</label>
              <div className="flex items-center bg-gray-50 dark:bg-[#0d0e10] border border-gray-300 dark:border-[#26282d] rounded-lg px-3 py-2.5 focus-within:border-[#dfb343] transition-colors">
                <span className="text-gray-400 mr-2.5 text-xs font-mono">#</span>
                  <input 
                    type={showInstToken ? "text" : "password"} 
                    value={instToken} 
                    onChange={(e) => setInstToken(e.target.value.trim())}
                    placeholder="Enter token"
                    className="flex-1 min-w-0 bg-transparent border-none outline-none text-left text-gray-900 dark:text-white placeholder-gray-400 text-xs font-mono appearance-none" 
                  />
                <button 
                  type="button" 
                  onClick={() => setShowInstToken(!showInstToken)}
                  className="ml-2 text-gray-400 hover:text-[#dfb343] focus:outline-none transition-colors cursor-pointer"
                >
                  {showInstToken ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 pt-4 border-t border-gray-200 dark:border-[#26282d]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Network size={16} className="text-gray-500 dark:text-gray-400" />
              <span className="text-xs font-bold tracking-wider text-gray-700 dark:text-gray-300 uppercase font-mono">CORE.AC.UK</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-medium text-gray-500">
              <Circle size={14} />
              <span>Not Configured</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-gray-600 dark:text-gray-400 mb-1.5">API Key</label>
            <div className="flex items-center bg-gray-50 dark:bg-[#0d0e10] border border-gray-300 dark:border-[#26282d] rounded-lg px-3 py-2.5 focus-within:border-[#dfb343] transition-colors">
              <Key size={14} className="text-gray-400 mr-2.5 shrink-0" />
                <input 
                  type={showCoreKey ? "text" : "password"} 
                  value={coreKey} 
                  onChange={(e) => setCoreKey(e.target.value.trim())}
                  placeholder="Enter CORE API Key"
                  className="flex-1 min-w-0 bg-transparent border-none outline-none text-left text-gray-900 dark:text-white placeholder-gray-400 text-xs font-mono appearance-none" 
                />
              <button 
                type="button" 
                onClick={() => setShowCoreKey(!showCoreKey)}
                className="ml-2 text-gray-400 hover:text-[#dfb343] focus:outline-none transition-colors cursor-pointer"
              >
                {showCoreKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 mb-6 mt-8">
          <button 
            onClick={onClose || (() => {})} 
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-[#33363d] hover:bg-gray-100 dark:hover:bg-[#1f2126] text-xs font-bold tracking-wider text-gray-700 dark:text-gray-300 transition-colors uppercase font-mono cursor-pointer"
          >
            CANCEL
          </button>
          <button 
            onClick={handleSave} 
            disabled={isLoading}
            className="px-5 py-2.5 rounded-lg bg-[#dfb343] hover:bg-[#c99f30] text-black text-xs font-bold tracking-wider transition-colors uppercase font-mono shadow-sm flex items-center space-x-2 cursor-pointer"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <span>SAVE SETTINGS</span>}
          </button>
        </div>

        <div className="flex items-center justify-center space-x-2 text-[11px] text-gray-500 pt-4 border-t border-gray-200 dark:border-[#26282d] font-mono">
          <Shield size={14} className="text-[#dfb343]" />
          <span>Encrypted & Synced to your Workspace Database</span>
        </div>

      </div>
    </div>
  );
}