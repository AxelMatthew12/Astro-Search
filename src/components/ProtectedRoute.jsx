import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-white dark:bg-[#0d0e10]">
        <Loader2 size={32} className="text-[#dfb343] animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Arahkan ke login, tapi simpan lokasi asal agar bisa dikembalikan setelah login sukses
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}