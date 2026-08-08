import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Shield, FileText, Cookie, Mail, Send, BookOpen,
  ArrowRight, Coins, BadgeCheck, Lock, Sparkles,
  Layers, Cpu, Compass, Globe, CheckCircle2,
  Database, Key, EyeOff, UserCheck, HelpCircle, MapPin,
  Users
} from 'lucide-react';

export default function About() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(null);
  const sectionRefs = useRef({});
  const isClickScrolling = useRef(false);

  useEffect(() => {
    const hash = location.hash?.replace('#', '');
    if (hash && sectionRefs.current[hash]) {
      isClickScrolling.current = true;
      setTimeout(() => {
        sectionRefs.current[hash]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(hash);
        setTimeout(() => { isClickScrolling.current = false; }, 700);
      }, 100);
    }
  }, [location]);

  return (
    <>
      <div className="w-full min-h-screen font-sans text-gray-800 dark:text-gray-200 bg-white dark:bg-[#0d0e10]">

      {/* =========================================================
          1. FULL-WIDTH HERO BANNER
      ========================================================== */}
      <section className="relative w-full min-h-[500px] md:min-h-[700px] flex items-center justify-center text-center px-6 overflow-hidden bg-gradient-to-b from-gray-900 via-[#141518] to-[#0d0e10]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(223,179,67,0.15),transparent_70%)] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#dfb343]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-6 animate-fadeIn">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#dfb343]/20 border border-[#dfb343]/40 text-[#dfb343] font-mono text-xs uppercase tracking-widest font-bold">
            About AstroSearch
          </span>
          
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Quiet Authority. <br />
            <span className="italic font-normal text-[#dfb343]">Preferred Focus.</span>
          </h1>
          
          <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto font-normal">
            AstroSearch is a sanctuary for rigorous intellectual pursuit. We believe that true insight requires an environment free from visual noise, where the craftsmanship of the interface respects the depth of your research.
          </p>

          <div className="pt-4">
            <button
              onClick={() => window.location.href = '/'}
              className="px-8 py-3.5 bg-[#dfb343] hover:bg-[#c99f30] text-black font-bold text-xs md:text-sm tracking-wider rounded-full transition-all shadow-lg hover:shadow-xl inline-flex items-center space-x-2 uppercase cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Explore Research</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. ZIG-ZAG ALTERNATING FEATURE BLOCKS
      ========================================================== */}
      <section className="py-20 md:py-28 max-w-6xl mx-auto px-6 space-y-24 md:space-y-32">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Preparing Researchers to Achieve Success
          </h2>
          <div className="w-24 h-1.5 bg-[#dfb343] mx-auto rounded-full" />
        </div>

        {/* Baris 1: The Vision */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-6 space-y-5 order-2 md:order-1">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-snug">
              The Vision: Stripping Away the Extraneous
            </h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              Inspired by the meticulous design of high-end horology and boutique editorial spaces, AstroSearch strips away modern web clutter. We do not demand your attention; we frame your work.
            </p>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              Our interface uses deep blacks, precise spacing, and subtle metallic accents to create a timeless aesthetic that feels less like software and more like a curated, private library.
            </p>
            <div className="pt-2">
              <button onClick={() => window.location.href = '/'} className="px-6 py-2.5 bg-[#dfb343]/20 hover:bg-[#dfb343] text-[#dfb343] hover:text-black font-bold text-xs uppercase tracking-wider rounded-full border border-[#dfb343] transition-all inline-block cursor-pointer">
                Read More
              </button>
            </div>
          </div>
          <div className="md:col-span-6 order-1 md:order-2 flex justify-center relative">
            <div className="relative w-72 h-72 md:w-80 md:h-80 bg-gradient-to-tr from-[#1c1d22] to-[#26282d] rounded-[30%_70%_70%_30%/30%_30%_70%_70%] border-2 border-[#dfb343]/30 flex items-center justify-center p-8 shadow-2xl">
              <BookOpen size={80} strokeWidth={1} className="text-[#dfb343]" />
              <Sparkles className="absolute -top-4 -right-4 text-[#dfb343] animate-pulse" size={32} />
            </div>
          </div>
        </div>

        {/* Baris 2: Philosophy of Space */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-6 order-1 flex justify-center relative">
            <div className="relative w-72 h-72 md:w-80 md:h-80 bg-gradient-to-bl from-[#dfb343]/20 via-[#1c1d22] to-[#141518] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] border-2 border-[#dfb343]/40 flex items-center justify-center p-8 shadow-2xl">
              <Compass size={80} strokeWidth={1} className="text-[#dfb343]" />
              <div className="absolute -bottom-6 -right-2 font-mono text-[#dfb343] font-bold text-xl tracking-tighter">~~~</div>
            </div>
          </div>
          <div className="md:col-span-6 space-y-5 order-2">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-snug">
              Enjoy Learning with a Unique Philosophy of Space
            </h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              In a digital landscape obsessed with engagement and distraction, we prioritize absolute clarity. Every pixel, margin, and interaction in AstroSearch is deliberately calibrated.
            </p>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              We minimize friction between the researcher and the knowledge they seek, creating an undisturbed workflow for academic professionals and students alike.
            </p>
            <div className="pt-2">
              <button onClick={() => window.location.href = '/'} className="px-6 py-2.5 bg-[#dfb343]/20 hover:bg-[#dfb343] text-[#dfb343] hover:text-black font-bold text-xs uppercase tracking-wider rounded-full border border-[#dfb343] transition-all inline-block cursor-pointer">
                View Philosophy
              </button>
            </div>
          </div>
        </div>

        {/* Baris 3: Uncompromised Sourcing */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-6 space-y-5 order-2 md:order-1">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-snug">
              Uncompromised Sourcing That Makes a Difference
            </h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              We do not rely on a single isolated index. By combining open graph catalogs with established peer-reviewed literature, we bring global academic prestige directly into your private reading environment.
            </p>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              Access over 250M+ research papers, articles, abstracts, and metadata without breaking your focus or leaving your secure workspace.
            </p>
            <div className="pt-2">
              <button onClick={() => window.location.href = '/'} className="px-6 py-2.5 bg-[#dfb343]/20 hover:bg-[#dfb343] text-[#dfb343] hover:text-black font-bold text-xs uppercase tracking-wider rounded-full border border-[#dfb343] transition-all inline-block cursor-pointer">
                Explore Catalogs
              </button>
            </div>
          </div>
          <div className="md:col-span-6 order-1 md:order-2 flex justify-center relative">
            <div className="relative w-72 h-72 md:w-80 md:h-80 bg-gradient-to-br from-[#1c1d22] to-[#141518] rounded-[40%_60%_60%_40%/40%_50%_50%_60%] border-2 border-[#dfb343]/30 flex items-center justify-center p-8 shadow-2xl">
              <Layers size={80} strokeWidth={1} className="text-[#dfb343]" />
              <Sparkles className="absolute -bottom-4 -left-4 text-[#dfb343]" size={28} />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. CORE HIGHLIGHTS
      ========================================================== */}
      <section className="py-20 bg-gray-50 dark:bg-[#141518] border-y border-gray-200 dark:border-[#26282d]">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              Our Core Architecture
            </h2>
            <div className="w-20 h-1.5 bg-[#dfb343] mx-auto rounded-full" />
            <p className="text-sm text-gray-500 dark:text-gray-400 pt-2">
              The foundational technologies and providers driving AstroSearch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            <div className="bg-white dark:bg-[#1c1d22] border border-gray-200 dark:border-[#26282d] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#dfb343]/10 flex items-center justify-center text-[#dfb343] mb-2">
                <Coins size={36} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">OpenAlex Catalog</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                An expansive, fully open research catalog ensuring a vast, unbiased foundation of global scientific inquiries.
              </p>
              <div className="w-full py-2.5 bg-[#dfb343] text-black font-mono font-bold text-xs uppercase rounded-xl mt-4">
                250M+ Works Indexed
              </div>
            </div>

            <div className="bg-white dark:bg-[#1c1d22] border-2 border-[#dfb343] rounded-2xl overflow-hidden shadow-xl flex flex-col items-center text-center p-8 space-y-4 transform md:-translate-y-4">
              <div className="w-24 h-24 rounded-full bg-[#dfb343]/20 flex items-center justify-center text-[#dfb343] mb-2">
                <BadgeCheck size={44} />
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">Elsevier &amp; Scopus</h3>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Access to major providers of scientific, technical, and medical information, bringing established prestige and peer-reviewed literature.
              </p>
              <div className="w-full py-3 bg-[#dfb343] text-black font-mono font-bold text-xs uppercase rounded-xl mt-4 shadow-md">
                Peer Reviewed Data
              </div>
            </div>

            <div className="bg-white dark:bg-[#1c1d22] border border-gray-200 dark:border-[#26282d] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#dfb343]/10 flex items-center justify-center text-[#dfb343] mb-2">
                <Users size={36} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Collaborative Workspaces</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Securely sync your bookmarks, citations, and search history to the cloud. Organize research securely with your peers.
              </p>
              <div className="w-full py-2.5 bg-[#dfb343] text-black font-mono font-bold text-xs uppercase rounded-xl mt-4">
                Cloud Synchronized
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          4. "WHY IT WORKS" 3-COLUMN GRID
      ========================================================== */}
      <section className="py-20 md:py-28 max-w-6xl mx-auto px-6 space-y-16">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Why It Works
          </h2>
          <div className="w-20 h-1.5 bg-[#dfb343] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="space-y-4 p-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#26282d] flex items-center justify-center text-[#dfb343] shadow-sm">
              <Globe size={30} />
            </div>
            <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white">
              Sanctuary of Research
            </h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Deliberately calibrated to minimize friction. No advertisements, no pop-ups, and zero visual noise between you and your research goals.
            </p>
          </div>

          <div className="space-y-4 p-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#26282d] flex items-center justify-center text-[#dfb343] shadow-sm">
              <Cpu size={30} />
            </div>
            <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white">
              Trusted Academic Content
            </h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Direct routing to global research providers like CORE, OpenAlex, and Scopus ensures rigorous, trustworthy citations every time.
            </p>
          </div>

          <div className="space-y-4 p-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 dark:bg-[#1c1d22] border border-gray-200 dark:border-[#26282d] flex items-center justify-center text-[#dfb343] shadow-sm">
              <CheckCircle2 size={30} />
            </div>
            <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white">
              Tools to Empower Focus
            </h3>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Securely store custom API keys, theme preferences, and queries, keeping your workflow private, responsive, and secure across devices.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          5. LEGAL & CONTACT DOCUMENTS
      ========================================================== */}
      <main className="max-w-6xl mx-auto px-6 py-20 space-y-24">

        {/* --- PRIVACY POLICY --- */}
        <section
          id="privacy"
          ref={(el) => (sectionRefs.current.privacy = el)}
          className="scroll-mt-24 space-y-10"
        >
          <div className="border-b border-gray-200 dark:border-[#26282d] pb-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#dfb343] block mb-2">
              Transparent Data Architecture
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">
              Privacy Policy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 dark:bg-[#141518] border border-gray-200 dark:border-[#26282d] p-8 rounded-3xl space-y-4 relative overflow-hidden shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#dfb343]/10 flex items-center justify-center text-[#dfb343]">
                <Shield size={24} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">1. Secure Account Storage</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                To provide a seamless research experience, AstroSearch requires account registration. We securely store your profile data, bookmarks, and search history in our centralized database to ensure your workspaces are synced across all your devices.
              </p>
              <div className="pt-2">
                <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-md font-bold">
                  Authenticated Access
                </span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-[#141518] border border-gray-200 dark:border-[#26282d] p-8 rounded-3xl space-y-4 relative overflow-hidden shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#dfb343]/10 flex items-center justify-center text-[#dfb343]">
                <Key size={24} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">2. API Credentials Management</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                External API keys configured within your settings are encrypted and stored securely in our backend infrastructure. These credentials are used strictly for retrieving academic data and are never shared with third-party advertisers.
              </p>
              <div className="pt-2">
                <span className="text-[10px] font-mono uppercase bg-[#dfb343]/10 text-[#dfb343] px-3 py-1 rounded-md font-bold">
                  AES-256 Cloud Encryption
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* --- TERMS OF SERVICE --- */}
        <section
          id="terms"
          ref={(el) => (sectionRefs.current.terms = el)}
          className="scroll-mt-24 space-y-10"
        >
          <div className="border-b border-gray-200 dark:border-[#26282d] pb-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#dfb343] block mb-2">
              Usage Guidelines &amp; Commitments
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">
              Terms of Service
            </h2>
          </div>

          <div className="bg-gradient-to-br from-gray-900 via-[#141518] to-gray-900 text-white border border-[#26282d] rounded-3xl p-8 md:p-12 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 space-y-4 border-b md:border-b-0 md:border-r border-[#26282d] pb-6 md:pb-0 md:pr-8">
              <div className="w-14 h-14 rounded-2xl bg-[#dfb343]/20 flex items-center justify-center text-[#dfb343]">
                <UserCheck size={28} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">1. Acceptance of Terms</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                By accessing or using AstroSearch, you agree to be bound by these Terms of Service. If you do not agree to these terms, please refrain from using our search portal and APIs.
              </p>
            </div>

            <div className="md:col-span-7 space-y-4 md:pl-4">
              <div className="inline-block px-3 py-1 rounded bg-[#dfb343] text-black font-mono text-[10px] uppercase font-bold tracking-wider">
                Permitted Research Scope
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">2. Permitted Use</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                AstroSearch is intended for personal, academic, educational, and non-commercial research purposes. You agree not to use automated scripts, scrapers, or bots to overwhelm our search infrastructure.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[11px] font-mono text-gray-400 border border-gray-700 px-3 py-1 rounded-full">#AcademicOnly</span>
                <span className="text-[11px] font-mono text-gray-400 border border-gray-700 px-3 py-1 rounded-full">#NoScrapingBots</span>
                <span className="text-[11px] font-mono text-gray-400 border border-gray-700 px-3 py-1 rounded-full">#FairUse</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- CONTACT US --- */}
        <section
          id="contact"
          ref={(el) => (sectionRefs.current.contact = el)}
          className="scroll-mt-24 space-y-10"
        >
          <div className="border-b border-gray-200 dark:border-[#26282d] pb-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#dfb343] block mb-2">
              Engineering &amp; Institutional Support
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">
              Contact Us
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Kiri: Contact Info & Support Badges */}
            <div className="lg:col-span-5 bg-gray-50 dark:bg-[#141518] border border-gray-200 dark:border-[#26282d] p-8 md:p-10 rounded-3xl flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#dfb343]/10 flex items-center justify-center text-[#dfb343]">
                  <HelpCircle size={24} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                  Get in Touch with Astroz Group
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Have questions about API integrations, institutional access support, or reporting a technical indexing issue? Our engineering team is ready to assist.
                </p>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-[#26282d] text-xs font-mono">
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <Mail size={16} className="text-[#dfb343]" />
                  <span>support@astrosearch.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                  <MapPin size={16} className="text-[#dfb343]" />
                  <span>Astroz Group HQ, Jakarta, Indonesia</span>
                </div>
              </div>
            </div>

            {/* Kanan: Polished Contact Form */}
            <div className="lg:col-span-7 bg-white dark:bg-[#141518] border border-gray-200 dark:border-[#26282d] p-8 md:p-10 rounded-3xl shadow-sm">
              <form onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Your Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Dr. Alex Mercer" 
                      className="w-full bg-gray-50 dark:bg-[#1c1d22] border border-gray-300 dark:border-[#26282d] rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#dfb343] focus:ring-1 focus:ring-[#dfb343] transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="mercer@university.edu" 
                      className="w-full bg-gray-50 dark:bg-[#1c1d22] border border-gray-300 dark:border-[#26282d] rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#dfb343] focus:ring-1 focus:ring-[#dfb343] transition-all" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Message</label>
                  <textarea 
                    rows={4} 
                    required 
                    placeholder="Describe your inquiry..." 
                    className="w-full bg-gray-50 dark:bg-[#1c1d22] border border-gray-300 dark:border-[#26282d] rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#dfb343] focus:ring-1 focus:ring-[#dfb343] transition-all resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full md:w-auto px-8 py-4 bg-[#dfb343] hover:bg-[#c99f30] text-black font-bold text-xs tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2.5 uppercase font-mono shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Send size={16} />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </section>

      </main>

      </div>
    </>
  );
}