// content_astro.js
console.log("ASTRO SEARCH Extension: Bridge Web Aktif!");

window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  // Ping dari web untuk mengecek ketersediaan ekstensi
  if (event.data && event.data.type === "ASTRO_PING_EXTENSION") {
    window.postMessage({ type: "ASTRO_PONG_EXTENSION", installed: true, version: "1.1.0" }, "*");
  }

  // Menerima data payload sitasi
  if (event.data && event.data.type === "ASTRO_CITE_PAYLOAD") {
    console.log("ASTRO Extension: Menerima data artikel dari website:", event.data.data);
    
    try {
      chrome.runtime.sendMessage({
        action: "SAVE_AND_FORWARD_CITATION",
        payload: event.data.data
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn("ASTRO Peringatan:", chrome.runtime.lastError.message);
        }
        
        window.postMessage({
          type: "ASTRO_CITE_RESPONSE",
          success: true,
          docsTabFound: response ? response.docsTabFound : false
        }, "*");
      });
    } catch (error) {
      if (error.message.includes("Extension context invalidated")) {
        console.error("❌ ASTRO Extension baru saja diperbarui. Harap REFRESH halaman website ini.");
        alert("Sistem ASTRO SEARCH baru saja diperbarui di browser Anda. Harap Refresh (F5) halaman ini terlebih dahulu.");
      } else {
        console.error("❌ Gagal mengirim sitasi ke extension:", error);
      }
    }
  }

  // FITUR BARU: Mengecek apakah koneksi Google Docs terbuka (Dari website)
  if (event.data && event.data.type === "ASTRO_CHECK_CONNECTION") {
    try {
      chrome.runtime.sendMessage({ action: "CHECK_DOCS_STATUS" }, (response) => {
        if (chrome.runtime.lastError) {
          console.warn("ASTRO Peringatan:", chrome.runtime.lastError.message);
          return;
        }
        
        window.postMessage({
          type: "ASTRO_CONNECTION_RESULT",
          isDocsOpen: response ? response.isDocsOpen : false
        }, "*");
      });
    } catch (error) {
      console.error("Gagal mengecek status koneksi Docs:", error);
    }
  }
}, false);