// ============================================================================
// File: content_docs.js
// ASTRO SEARCH - Chrome Extension Integrator for Google Docs
// ============================================================================

(function () {
  console.log("ASTRO SEARCH: Extension Google Docs Aktif!");

  let activeArticles = [];

  // ==========================================================================
  // 1. INJEKSI MENU BAR (Sejajar dengan Zotero & Bantuan)
  // ==========================================================================
  function injectMenubarButton() {
    const menubar =
      document.querySelector('.docs-menubarbar') ||
      document.querySelector('#docs-menubar');

    if (!menubar || document.getElementById('astro-search-menubar-item')) return;

    const menuItem = document.createElement('div');
    menuItem.id = 'astro-search-menubar-item';
    
    // Menggunakan class bawaan mutlak Google Docs agar posisi & tinggi presisi
    menuItem.className = 'menu-button goog-control goog-inline-block';
    menuItem.setAttribute('role', 'menuitem');
    
    menuItem.innerHTML = `
      <div class="goog-control-content">
        <span class="astro-menu-icon"></span>Astro-Search
      </div>
    `;

    // Toggle Buka/Tutup Sidebar saat menu diklik
    menuItem.addEventListener('click', (e) => {
      e.preventDefault();
      toggleSidebar();
    });

    menubar.appendChild(menuItem);
  }

  // ==========================================================================
  // 2. FORMATTER SITASI (APA 7th, IEEE, BibTeX)
  // ==========================================================================
  function formatCitation(article, style) {
    const title = article.title || "Untitled Paper";
    const journal = article.journal || article.source || "Academic Journal";
    const year = article.year || "n.d.";
    const doiStr = article.doi ? ` https://doi.org/${article.doi}` : '';

    let authors = "Anonymous";
    if (Array.isArray(article.authors)) {
      authors = article.authors.join(", ");
    } else if (typeof article.authors === 'string') {
      authors = article.authors;
    }

    switch ((style || 'APA').toUpperCase()) {
      case 'IEEE':
        return `${authors}, "${title}," ${journal}, ${year}.${doiStr}`;
      case 'BIBTEX': {
        const firstAuthor = authors.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
        const citeKey = `${firstAuthor || 'article'}${year}`;
        return `@article{${citeKey},\n  title={${title}},\n  author={${authors}},\n  journal={${journal}},\n  year={${year}}\n}`;
      }
      case 'APA':
      default:
        return `${authors} (${year}). ${title}. ${journal}.${doiStr}`;
    }
  }

  // ==========================================================================
  // 3. RENDER DAFTAR ARTIKEL DI SIDEBAR
  // ==========================================================================
  function renderArticleList() {
    const container = document.getElementById('astro-article-list');
    if (!container) return;

    if (!activeArticles || activeArticles.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 24px 16px; color:#5f6368; font-size:12px; line-height:1.6;">
          Belum ada artikel yang dikirim dari website <b>Astro-Search</b>.<br>
          Klik tombol <b style="color:#dfb343;">"Cite to Docs"</b> di kartu jurnal website untuk menambahkan.
        </div>
      `;
      return;
    }

    const currentStyle = document.getElementById('astro-style-select')?.value || 'APA';

    container.innerHTML = activeArticles.map((art, idx) => {
      const authorsFormatted = Array.isArray(art.authors) ? art.authors.join(', ') : art.authors;
      return `
        <div class="astro-card">
          <div class="astro-card-title">${art.title}</div>
          <div class="astro-card-meta">${authorsFormatted} • ${art.year} • ${art.journal}</div>
          <button class="astro-btn-insert" data-index="${idx}">
            + Insert Citation (${currentStyle})
          </button>
        </div>
      `;
    }).join('');
  }

  // ==========================================================================
  // 4. BUAT KONTENER SIDEBAR PANEL
  // ==========================================================================
  function createSidebar() {
    if (document.getElementById('astro-sidebar-root')) return;

    const sidebar = document.createElement('div');
    sidebar.id = 'astro-sidebar-root';
    sidebar.className = 'hidden';

    sidebar.innerHTML = `
      <div class="astro-sidebar-header">
        <div class="astro-sidebar-title">
          <span style="color:#dfb343;">🚀</span>
          <span>Astro-Search Workspace</span>
        </div>
        <div class="astro-sidebar-close" id="astro-close-btn" title="Tutup Sidebar">✕</div>
      </div>

      <div class="astro-sidebar-body">
        <div class="astro-input-group">
          <label class="astro-label">Format Sitasi</label>
          <select id="astro-style-select" class="astro-select">
            <option value="APA">APA 7th Edition</option>
            <option value="IEEE">IEEE</option>
            <option value="BIBTEX">BibTeX</option>
          </select>
        </div>

        <div class="astro-input-group">
          <label class="astro-label">Daftar Artikel Tersinkron</label>
        </div>

        <div id="astro-article-list"></div>
      </div>
    `;

    document.body.appendChild(sidebar);

    // Event Listener Tutup Sidebar
    document.getElementById('astro-close-btn').addEventListener('click', () => {
      sidebar.classList.add('hidden');
    });

    // Event Listener Ubah Format Sitasi
    document.getElementById('astro-style-select').addEventListener('change', () => {
      renderArticleList();
    });

    // Event Listener Klik Tombol Insert Citation
    sidebar.addEventListener('click', (e) => {
      if (e.target.classList.contains('astro-btn-insert')) {
        const index = e.target.getAttribute('data-index');
        const article = activeArticles[index];
        const selectedStyle = document.getElementById('astro-style-select').value;
        const formattedText = formatCitation(article, selectedStyle);

        insertCitationToDocs(formattedText);
      }
    });

    loadArticlesFromStorage();
  }

  function loadArticlesFromStorage() {
    if (chrome?.storage?.local) {
      chrome.storage.local.get({ pending_articles: [] }, (res) => {
        activeArticles = res.pending_articles || [];
        renderArticleList();
      });
    }
  }

  function toggleSidebar() {
    createSidebar();
    const sidebar = document.getElementById('astro-sidebar-root');
    sidebar.classList.toggle('hidden');
    if (!sidebar.classList.contains('hidden')) {
      loadArticlesFromStorage();
    }
  }

  // ==========================================================================
  // 5. PENYISIPAN SITASI (COPY TO CLIPBOARD + AUTO FOCUS + INSTRUKSI PASTE)
  // ==========================================================================
  function insertCitationToDocs(text) {
    const textToInsert = text + " ";

    // 1. Salin teks sitasi ke Clipboard
    navigator.clipboard.writeText(textToInsert).then(() => {

      // 2. Kembalikan fokus keyboard ke lembar kerja Google Docs
      const docsIframe = document.querySelector('.docs-texteventtarget-iframe');
      if (docsIframe) {
        docsIframe.focus();
      } else {
        const editor = document.querySelector('.kix-appview-editor');
        if (editor) editor.focus();
      }

      // 3. Tampilkan UI petunjuk Ctrl + V
      showPasteInstruction();

    }).catch(err => {
      console.error("Gagal menyalin ke clipboard:", err);
      alert("Gagal menyalin sitasi. Pastikan Anda memberi izin clipboard pada ekstensi.");
    });
  }

  // UI Toast Instruksi Paste Modern
  function showPasteInstruction() {
    const existing = document.getElementById('astro-paste-toast');
    if (existing) existing.remove();

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const shortcut = isMac ? '⌘ + V' : 'Ctrl + V';

    const toast = document.createElement('div');
    toast.id = 'astro-paste-toast';
    toast.innerHTML = `
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 4px; color: #dfb343;">
        Sitasi Siap Disisipkan! 🚀
      </div>
      <div style="font-size: 13px; color: #e5e7eb;">
        Tekan <span style="background: #dfb343; color: #000; padding: 2px 7px; border-radius: 4px; font-weight: bold; margin: 0 4px;">${shortcut}</span> di kursor dokumen Anda sekarang.
      </div>
    `;

    toast.style.cssText = `
      position: fixed;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #141518;
      border: 2px solid #dfb343;
      padding: 14px 22px;
      border-radius: 12px;
      z-index: 2147483647;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      font-family: 'Google Sans', Roboto, Arial, sans-serif;
      text-align: center;
      animation: astroPopUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    `;

    // Styling Animasi Toast
    if (!document.getElementById('astro-toast-style')) {
      const style = document.createElement('style');
      style.id = 'astro-toast-style';
      style.innerHTML = `
        @keyframes astroPopUp {
          0% { opacity: 0; transform: translate(-50%, 20px) scale(0.9); }
          100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        @keyframes astroFadeOut {
          0% { opacity: 1; transform: translate(-50%, 0) scale(1); }
          100% { opacity: 0; transform: translate(-50%, 10px) scale(0.95); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Otomatis menghilang dalam 4 detik
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'astroFadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  }

  // Toast Notifikasi Biasa
  function showToast(msg) {
    const toast = document.createElement('div');
    toast.innerText = msg;
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #202124;
      color: #ffffff;
      font-size: 13px;
      font-weight: 500;
      padding: 10px 20px;
      border-radius: 8px;
      z-index: 1000000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-family: 'Google Sans', Roboto, sans-serif;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // ==========================================================================
  // 6. LISTENER PESAN REAL-TIME DARI BACKGROUND SERVICE WORKER
  // ==========================================================================
  if (chrome?.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.action === "NEW_CITATION_RECEIVED") {
        loadArticlesFromStorage();
        showToast("Artikel baru dari Astro-Search ditambahkan ke Sidebar!");

        // Otomatis buka sidebar jika masih tersembunyi
        const sidebar = document.getElementById('astro-sidebar-root');
        if (sidebar && sidebar.classList.contains('hidden')) {
          sidebar.classList.remove('hidden');
        }
      }
    });
  }

  // ==========================================================================
  // 7. OBSERVER DOM (Penyuntikan Otomatis Saat Google Docs Selesai Memuat)
  // ==========================================================================
  const observer = new MutationObserver(() => {
    injectMenubarButton();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(injectMenubarButton, 1000);

})();