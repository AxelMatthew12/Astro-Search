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

    // Jika tidak merespons dalam 500ms, dianggap extension belum terpasang
    setTimeout(() => {
      if (!responded) {
        window.removeEventListener('message', handlePong);
        resolve(false);
      }
    }, 500);
  });
};

/**
 * Mengirim data artikel langsung ke Extension
 */
export const sendCitationToDocs = async (articleResult) => {
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

  window.postMessage({
    type: "ASTRO_CITE_PAYLOAD",
    data: payload
  }, "*");

  return true;
};