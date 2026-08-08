// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SAVE_AND_FORWARD_CITATION") {
    const articleData = request.payload;

    // 1. Simpan data artikel ke storage lokal extension
    chrome.storage.local.get({ pending_articles: [] }, (result) => {
      const articles = result.pending_articles;
      
      // Hapus jika sudah ada ID/DOI yang sama agar tidak duplikat
      const filtered = articles.filter(a => (a.id || a.doi) !== (articleData.id || articleData.doi));
      filtered.unshift(articleData); // Taruh artikel terbaru di paling atas

      chrome.storage.local.set({ pending_articles: filtered }, () => {
        console.log("Data artikel berhasil disimpan ke chrome.storage.local");

        // 2. Cari apakah ada tab Google Docs yang sedang terbuka
        chrome.tabs.query({ url: "https://docs.google.com/document/*" }, (tabs) => {
          const docsFound = tabs.length > 0;

          if (docsFound) {
            // Beri tahu tab Google Docs bahwa ada artikel baru masuk
            tabs.forEach(tab => {
              chrome.tabs.sendMessage(tab.id, {
                action: "NEW_CITATION_RECEIVED",
                payload: articleData
              });
            });
          }

          sendResponse({ success: true, docsTabFound: docsFound });
        });
      });
    });

    return true; // Keep message channel open for async response
  }
});