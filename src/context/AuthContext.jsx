import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Cek sesi saat aplikasi dimuat ulang
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    };

    fetchSession();

    // 2. Pantau perubahan Auth (Berguna saat user dialihkan balik dari Google/Github)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fungsi Pintar: Mengambil Profile ATAU Membuatnya jika login via Google/Github
  const fetchUserProfile = async (authUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      // Jika error PGRST116 muncul (artinya baris data tidak ditemukan di tabel profiles)
      // Ini terjadi jika user login menggunakan Google/Github untuk PERTAMA KALINYA
      if (error && error.code === 'PGRST116') {
        const authProvider = authUser.app_metadata.provider || 'website';
        
        // Buat struktur data profil baru otomatis
        const newProfile = {
          id: authUser.id,
          full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
          username: authUser.user_metadata?.user_name || authUser.user_metadata?.preferred_username || authUser.email.split('@')[0],
          avatar_url: authUser.user_metadata?.avatar_url || '',
          provider: authProvider === 'email' ? 'website' : authProvider, // Menyesuaikan: 'website', 'google', atau 'github'
          is_active: true
        };

        const { data: newProfileData, error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (insertError) throw insertError;
        setUser({ ...authUser, ...newProfileData });
        
      } else if (error) {
        throw error;
      } else {
        // Jika data sudah ada, gabungkan saja
        setUser({ ...authUser, ...data });
      }
    } catch (error) {
      console.error("Gagal mengambil/membuat data profiles:", error);
      setUser(authUser); // Fallback jika gagal
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // FUNGSI AUTENTIKASI (3 PROVIDER)
  // ==========================================

  // 1. Website Login (Email & Password)
  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  // 2. Google Login
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
  };

  // 3. Github Login
  const loginWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
  };

  // 4. Website Register (Mengisi Form)
  const register = async ({ email, password, fullName, username }) => {
    // Daftarkan di sistem Auth internal
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw authError;

    // Jika berhasil, kirim data eksplisit ke tabel 'profiles' dengan provider: 'website'
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: authData.user.id,
            full_name: fullName, 
            username: username,
            provider: 'website', // <--- Memenuhi kekosongan data provider
            is_active: true
          }
        ]);
        
      if (profileError) throw profileError;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, isLoading, 
      login, loginWithGoogle, loginWithGithub, 
      register, logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);