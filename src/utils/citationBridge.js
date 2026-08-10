// src/utils/citationBridge.js

/**
 * Memeriksa apakah Chrome Extension ASTRO SEARCH terpasang & aktif
 */
export const checkExtensionInstalled = () => {
  return new Promise((resolve) => {
    let responded = false;

    const handlePong = (event) => {
      if (event.data && event.data.type === 'ASTRO_PONG_EXTENSION') {
        responded = true;
        window.removeEventListener('message', handlePong);
        resolve(true);
      }
    };

    window.addEventListener('message', handlePong);
    window.postMessage({ type: 'ASTRO_PING_EXTENSION' }, '*');

    // PERBAIKAN 1: Perpanjang waktu tunggu menjadi 1500ms untuk memastikan ekstensi punya waktu merespons
    setTimeout(() => {
      if (!responded) {
        window.removeEventListener('message', handlePong);
        resolve(false);
      }
    }, 1500);
  });
};

/**
 * Mengirim data artikel langsung ke Extension
 */
export const sendCitationToDocs = (articleResult) => {
  return new Promise((resolve) => {
    const payload = {
      id: articleResult?.id || articleResult?.doi || Date.now(),
      title: articleResult?.title || "Untitled Research Paper",
      authors: articleResult?.authors || "Unknown Authors",
      year: articleResult?.year || "N/A",
      journal: articleResult?.journal || articleResult?.source || "Academic Journal",
      doi: articleResult?.doi || "",
      link: articleResult?.link || articleResult?.url || "#",
      timestamp: new Date().toISOString()
    };

    // PERBAIKAN 2: Tunggu balasan "ASTRO_CITE_RESPONSE" dari ekstensi sebelum me-return true
    const handleResponse = (event) => {
      if (event.data && event.data.type === "ASTRO_CITE_RESPONSE") {
        window.removeEventListener("message", handleResponse);
        clearTimeout(timeout);
        resolve(event.data.success);
      }
    };

    window.addEventListener("message", handleResponse);

    window.postMessage({
      type: "ASTRO_CITE_PAYLOAD",
      data: payload
    }, "*");

    // Jika ekstensi gagal memproses/mengirim balik dalam 3 detik, gagalkan
    const timeout = setTimeout(() => {
      window.removeEventListener("message", handleResponse);
      resolve(false);
    }, 3000);
  });
};