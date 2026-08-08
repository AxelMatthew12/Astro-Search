import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';
import { User, CheckCircle, Shield, Lock, AlertCircle, GraduationCap, FileText, X } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('Profile Details');
  const [isEditing, setIsEditing] = useState(false);

  // State untuk Pop-up Notifikasi
  const [notification, setNotification] = useState(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [education, setEducation] = useState('');
  const [job, setJob] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  
  const [linkedProviders, setLinkedProviders] = useState([]);

  // Daftar Pilihan Pekerjaan / Peran
  const jobOptions = [
    "", // Opsi kosong (default)
    "Student (Undergraduate)",
    "Student (Postgraduate / Master)",
    "PhD Candidate",
    "Researcher / Scientist",
    "Lecturer / Professor",
    "Librarian",
    "Software Engineer / Developer",
    "Data Scientist / Analyst",
    "Industry Professional",
    "Other"
  ];

  // Mendapatkan data original (bawaan) dari user untuk perbandingan
  const originalFirstName = user?.first_name || user?.full_name?.split(' ')[0] || '';
  const originalLastName = user?.last_name || user?.full_name?.split(' ').slice(1).join(' ') || '';
  const originalEducation = user?.education || '';
  const originalJob = user?.job || '';
  const originalBio = user?.bio || '';

  // Mengecek apakah ada perubahan data
  const hasChanges = 
    firstName !== originalFirstName ||
    lastName !== originalLastName ||
    education !== originalEducation ||
    job !== originalJob ||
    bio !== originalBio;

  useEffect(() => {
    if (user) {
      setFirstName(originalFirstName);
      setLastName(originalLastName);
      setEducation(originalEducation);
      setJob(originalJob);
      setBio(originalBio);
      
      const providers = user.identities?.map(identity => identity.provider) || [];
      setLinkedProviders(providers);
    }
  }, [user]);

  // Fungsi Cerdas untuk Menampilkan Pop-up
  const showPopup = (type, message, shouldReload = false) => {
    setNotification({ type, message });
    
    // Hilangkan pop-up secara automatik selepas 2.5 saat
    setTimeout(() => {
      setNotification(null);
      if (shouldReload) window.location.reload();
    }, 2500);
  };

  // Fungsi untuk membatalkan editan dan mengembalikan ke data awal
  const resetForm = () => {
    setFirstName(originalFirstName);
    setLastName(originalLastName);
    setEducation(originalEducation);
    setJob(originalJob);
    setBio(originalBio);
    setIsEditing(false);
  };

  if (!user) return null;

  const handleSaveChanges = async () => {
    if (!hasChanges) return; 

    setIsLoading(true);
    const fullName = `${firstName} ${lastName}`.trim();
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        first_name: firstName, 
        last_name: lastName, 
        full_name: fullName,
        education: education,
        job: job,
        bio: bio
      })
      .eq('id', user.id);

    setIsLoading(false);
    if (error) {
      showPopup('error', "Failed to update profile: " + error.message);
    } else {
      setIsEditing(false); 
      showPopup('success', "Profile updated successfully!", true);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) return showPopup('error', "Password must be at least 6 characters!");
    
    setIsPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsPasswordLoading(false);

    if (error) {
      showPopup('error', "Failed to update password: " + error.message);
    } else {
      showPopup('success', "Password updated successfully!");
      setNewPassword('');
    }
  };

  const handleLinkProvider = async (provider) => {
    const { error } = await supabase.auth.linkIdentity({ provider });
    if (error) {
      showPopup('error', `Failed to link ${provider}: ` + error.message);
    } else {
      showPopup('success', `${provider} account linked successfully!`, true);
    }
  };

  const handleUnlinkProvider = async (provider) => {
    if (linkedProviders.length <= 1) {
      return showPopup('error', "You cannot unlink this provider because it is your only login method.");
    }

    const identityToUnlink = user.identities?.find(id => id.provider === provider);
    if (!identityToUnlink) return;

    const { error } = await supabase.auth.unlinkIdentity(identityToUnlink.identity_id);
    if (error) {
      showPopup('error', "Failed to unlink account: " + error.message);
    } else {
      showPopup('success', `${provider} access unlinked successfully.`, true);
    }
  };

  const hasEmailLogin = linkedProviders.includes('email');

  const sidebarMenu = [
    { name: 'Profile Details', section: 'main' },
    { divider: true },
    { name: 'Your Account', section: 'settings' },
    { name: 'Settings', section: 'settings' },
  ];

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-[#0d0e10] py-10 px-4 md:px-8 font-sans transition-colors duration-300">
      
      {/* POP-UP NOTIFICATION COMPONENT */}
      {notification && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] animate-fadeIn">
          <div className={`flex items-center gap-3 px-6 py-3.5 rounded-full shadow-2xl backdrop-blur-md border ${
            notification.type === 'success' 
              ? 'bg-green-50/90 dark:bg-green-900/40 border-green-200 dark:border-green-500/30 text-green-800 dark:text-green-400' 
              : 'bg-red-50/90 dark:bg-red-900/40 border-red-200 dark:border-red-500/30 text-red-800 dark:text-red-400'
          }`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-bold tracking-wide">{notification.message}</p>
            <button onClick={() => setNotification(null)} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-6 tracking-tight">
          Account Settings
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          
          {/* SIDEBAR MENU */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white dark:bg-[#141518] border border-gray-200 dark:border-[#26282d] rounded-lg overflow-hidden shadow-sm sticky top-24">
              <ul className="flex flex-col py-2">
                {sidebarMenu.map((item, index) => {
                  if (item.divider) {
                    return <div key={index} className="h-px bg-gray-200 dark:bg-[#26282d] my-2 mx-4" />;
                  }
                  
                  const isActive = activeTab === item.name;
                  
                  return (
                    <li key={item.name}>
                      <button
                        onClick={() => setActiveTab(item.name)}
                        className={`w-full text-left px-5 py-3 text-sm font-medium transition-colors ${
                          isActive 
                            ? 'border-l-4 border-[#dfb343] bg-[#dfb343]/10 text-[#dfb343]' 
                            : 'border-l-4 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1c1d22] hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {item.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-[#141518] border border-gray-200 dark:border-[#26282d] rounded-lg p-6 md:p-8 shadow-sm">
              
              {/* TAB 1: PROFILE DETAILS */}
              {activeTab === 'Profile Details' && (
                <div className="animate-fadeIn space-y-10">
                  
                  <section>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Basic Information</h2>

                    {/* METADATA & AVATAR BOX */}
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Profile & Account Metadata
                      </label>
                      
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-2xl bg-gray-100 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#33363d] flex items-center justify-center text-[#dfb343] text-3xl font-bold overflow-hidden shadow-sm shrink-0">
                          {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <User size={40} className="opacity-50" />
                          )}
                        </div>

                        {/* Metadata Board */}
                        <div className="flex-1 min-w-0 bg-gray-50 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#33363d] rounded-xl p-5 shadow-sm">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-5 gap-x-6 text-sm">
                            
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Role / Status</p>
                              <div className="flex items-center gap-2">
                                <span className="capitalize font-medium text-gray-900 dark:text-gray-200 text-xs">
                                  {user.role || 'user'}
                                </span>
                                <span className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                  user.is_active !== false 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' 
                                    : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                                }`}>
                                  {user.is_active !== false ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>

                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Joined Since</p>
                              <p className="text-xs text-gray-900 dark:text-gray-200 font-medium">
                                {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                              </p>
                            </div>

                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Login Method</p>
                              <div className="flex flex-wrap items-center gap-1.5">
                                {linkedProviders.length > 0 ? (
                                  linkedProviders.map(p => (
                                    <span key={p} className="shrink-0 px-2 py-0.5 bg-gray-200 dark:bg-[#26282d] border border-gray-300 dark:border-[#33363d] text-gray-700 dark:text-gray-300 text-[10px] font-bold uppercase rounded-md">
                                      {p}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-gray-400">-</span>
                                )}
                              </div>
                            </div>

                          </div>
                        </div>

                      </div>
                    </div>

                    {/* FIRST & LAST NAME FORM */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={`w-full border border-gray-300 dark:border-[#33363d] text-sm rounded-md px-4 py-2.5 outline-none transition-all ${
                            !isEditing 
                              ? 'bg-gray-100 dark:bg-[#1a1b1f] text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                              : 'bg-white dark:bg-[#0d0e10] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#dfb343]/50 focus:border-[#dfb343]'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={`w-full border border-gray-300 dark:border-[#33363d] text-sm rounded-md px-4 py-2.5 outline-none transition-all ${
                            !isEditing 
                              ? 'bg-gray-100 dark:bg-[#1a1b1f] text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                              : 'bg-white dark:bg-[#0d0e10] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#dfb343]/50 focus:border-[#dfb343]'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="email" 
                        value={user?.email || ''}
                        disabled
                        className="w-full bg-gray-100 dark:bg-[#1a1b1f] border border-gray-200 dark:border-[#26282d] text-gray-600 dark:text-gray-400 text-sm rounded-md px-4 py-2.5 cursor-not-allowed"
                      />
                      <div className="flex items-center gap-1.5 mt-2 text-green-600 dark:text-green-500 text-sm font-medium">
                        <CheckCircle size={16} /> Verified Email
                      </div>
                    </div>
                  </section>

                  {/* SECTION 2: EDUCATION & OCCUPATION */}
                  <section className="pt-8 border-t border-gray-200 dark:border-[#26282d]">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <GraduationCap size={20} className="text-[#dfb343]" /> Education & Occupation
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Institution / University
                        </label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={education}
                          onChange={(e) => setEducation(e.target.value)}
                          placeholder={isEditing ? "E.g., Stanford University" : ""}
                          className={`w-full border border-gray-300 dark:border-[#33363d] text-sm rounded-md px-4 py-2.5 outline-none transition-all ${
                            !isEditing 
                              ? 'bg-gray-100 dark:bg-[#1a1b1f] text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                              : 'bg-white dark:bg-[#0d0e10] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#dfb343]/50 focus:border-[#dfb343]'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Role / Occupation
                        </label>
                        <select
                          disabled={!isEditing}
                          value={job}
                          onChange={(e) => setJob(e.target.value)}
                          className={`w-full border border-gray-300 dark:border-[#33363d] text-sm rounded-md px-4 py-2.5 outline-none transition-all appearance-none cursor-pointer ${
                            !isEditing 
                              ? 'bg-gray-100 dark:bg-[#1a1b1f] text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                              : (job ? 'bg-white dark:bg-[#0d0e10] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#dfb343]/50 focus:border-[#dfb343]' : 'bg-white dark:bg-[#0d0e10] text-gray-500 focus:ring-2 focus:ring-[#dfb343]/50 focus:border-[#dfb343]')
                          }`}
                          style={isEditing ? {
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%23dfb343' className='w-4 h-4'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 1rem center',
                            backgroundSize: '1em'
                          } : {}}
                        >
                          <option value="" disabled hidden>{isEditing ? "Select your role..." : "-"}</option>
                          {jobOptions.slice(1).map((option) => (
                            <option key={option} value={option} className="text-gray-900 dark:text-white bg-white dark:bg-[#141518]">
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </section>

                  {/* SECTION 3: OTHER INFORMATION & ACTION BUTTONS */}
                  <section className="pt-2">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <FileText size={18} className="text-[#dfb343]" /> Other Information
                    </h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Bio / Research Focus
                      </label>
                      <textarea 
                        disabled={!isEditing}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder={isEditing ? "Write a brief description of your academic focus or research interests..." : ""}
                        rows={4}
                        className={`w-full border border-gray-300 dark:border-[#33363d] text-sm rounded-md px-4 py-3 outline-none transition-all resize-none ${
                          !isEditing 
                            ? 'bg-gray-100 dark:bg-[#1a1b1f] text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                            : 'bg-white dark:bg-[#0d0e10] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#dfb343]/50 focus:border-[#dfb343]'
                        }`}
                      />
                    </div>

                    {/* DYNAMIC ACTION BUTTONS */}
                    <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-[#26282d]">
                      {!isEditing ? (
                        <button 
                          onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
                          className="px-6 py-2.5 bg-[#dfb343] hover:bg-[#c99f30] text-black text-sm font-bold rounded-md shadow-sm transition-colors"
                        >
                          Edit Profile
                        </button>
                      ) : (
                        <>
                          <button 
                            onClick={(e) => { 
                              e.preventDefault(); 
                              if (hasChanges) {
                                resetForm(); 
                              } else {
                                setIsEditing(false); 
                              }
                            }}
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-gray-200 dark:bg-[#26282d] hover:bg-gray-300 dark:hover:bg-[#33363d] text-gray-800 dark:text-gray-200 text-sm font-bold rounded-md shadow-sm transition-colors disabled:opacity-50"
                          >
                            {hasChanges ? 'Reset to Default' : 'Cancel'}
                          </button>
                          
                          <button 
                            onClick={handleSaveChanges}
                            disabled={isLoading || !hasChanges}
                            className={`px-6 py-2.5 text-sm font-bold rounded-md shadow-sm transition-colors ${
                              !hasChanges 
                                ? 'bg-gray-200 dark:bg-[#26282d] text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                                : 'bg-[#dfb343] hover:bg-[#c99f30] text-black'
                            }`}
                          >
                            {isLoading ? 'Saving...' : 'Save Profile'}
                          </button>
                        </>
                      )}
                    </div>
                  </section>

                  {/* SECTION 4: PASSWORD */}
                  <section className="pt-8 border-t border-gray-200 dark:border-[#26282d]">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Lock size={18} className="text-[#dfb343]" /> Security & Password
                    </h2>
                    
                    {hasEmailLogin ? (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                          Ensure your account uses a long, random password to stay secure.
                        </p>
                        <div className="max-w-md space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                              New Password
                            </label>
                            <input 
                              type="password" 
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Minimum 6 characters"
                              className="w-full bg-white dark:bg-[#0d0e10] border border-gray-300 dark:border-[#33363d] text-gray-900 dark:text-white text-sm rounded-md px-4 py-2.5 focus:ring-2 focus:ring-[#dfb343]/50 focus:border-[#dfb343] outline-none transition-all"
                            />
                          </div>
                          
                          <div>
                            <button 
                              onClick={handleUpdatePassword} 
                              disabled={isPasswordLoading || newPassword.length < 6}
                              className="px-5 py-2.5 bg-gray-800 dark:bg-gray-200 hover:bg-gray-900 dark:hover:bg-white text-white dark:text-black text-sm font-bold rounded-md shadow-sm transition-colors disabled:opacity-50"
                            >
                              {isPasswordLoading ? 'Updating...' : 'Update Password'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-4 p-5 mt-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg">
                        <AlertCircle className="text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" size={20} />
                        <div>
                          <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">Password Settings Unavailable</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-400/80 mt-1">
                            You are logged in using a social provider (Google/GitHub). Your password settings are entirely managed by the respective platform.
                          </p>
                        </div>
                      </div>
                    )}
                  </section>

                </div>
              )}

              {/* TAB 2: YOUR ACCOUNT */}
              {activeTab === 'Your Account' && (
                <div className="animate-fadeIn">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Account Management</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                    Link or unlink third-party accounts (Google / GitHub) to simplify your login process.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-[#1c1d22] rounded-lg border border-gray-200 dark:border-[#33363d]">
                      <div className="flex items-center gap-4">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-200">Google</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Use Google account to login</p>
                        </div>
                      </div>
                      {linkedProviders.includes('google') ? (
                        <button onClick={() => handleUnlinkProvider('google')} className="px-4 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded border border-red-200 dark:border-red-500/30 transition-colors">Unlink</button>
                      ) : (
                        <button onClick={() => handleLinkProvider('google')} className="px-4 py-1.5 text-xs font-bold text-[#dfb343] hover:bg-[#dfb343]/10 rounded border border-[#dfb343]/50 transition-colors">Link</button>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-5 bg-gray-50 dark:bg-[#1c1d22] rounded-lg border border-gray-200 dark:border-[#33363d]">
                      <div className="flex items-center gap-4">
                        <svg className="w-6 h-6 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-200">GitHub</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Use GitHub profile to login</p>
                        </div>
                      </div>
                      {linkedProviders.includes('github') ? (
                        <button onClick={() => handleUnlinkProvider('github')} className="px-4 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded border border-red-200 dark:border-red-500/30 transition-colors">Unlink</button>
                      ) : (
                        <button onClick={() => handleLinkProvider('github')} className="px-4 py-1.5 text-xs font-bold text-[#dfb343] hover:bg-[#dfb343]/10 rounded border border-[#dfb343]/50 transition-colors">Link</button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SETTINGS */}
              {activeTab === 'Settings' && (
                <div className="flex flex-col items-center justify-center h-64 text-center animate-fadeIn">
                  <Shield size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Settings Page</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                    Notification settings and theme preferences will be available here soon.
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}