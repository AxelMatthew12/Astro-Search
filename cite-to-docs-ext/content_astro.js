// content_astro.js
console.log("ASTRO SEARCH Extension: Bridge Web Aktif!");

window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (event.data && event.data.type === "ASTRO_PING_EXTENSION") {
    window.postMessage({ type: "ASTRO_PONG_EXTENSION", installed: true, version: "1.1.0" }, "*");
  }

  if (event.data && event.data.type === "ASTRO_CITE_PAYLOAD") {
    console.log("ASTRO Extension: Menerima data artikel dari website:", event.data.data);
    
    // --- TAMBAHKAN BLOK TRY-CATCH DI SINI ---
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
      // Jika terjadi error "Extension context invalidated"
      if (error.message.includes("Extension context invalidated")) {
        console.error("❌ ASTRO Extension baru saja diperbarui. Harap REFRESH halaman website ini.");
        alert("Sistem ASTRO SEARCH baru saja diperbarui di browser Anda. Harap Refresh (F5) halaman ini terlebih dahulu.");
      } else {
        console.error("❌ Gagal mengirim sitasi ke extension:", error);
      }
    }
    // ----------------------------------------
  }
}, false);