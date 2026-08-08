// api.js
const fetchWithTimeout = async (url, options = {}, timeoutMs = Number(import.meta.env.VITE_API_TIMEOUT) || 12000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      console.warn(`[Timeout Warning]: Request ke ${url} melebihi batas waktu ${timeoutMs / 1000} detik.`);
      throw new Error(`Koneksi terputus (Timeout > ${timeoutMs / 1000}s). Server sumber sedang lambat.`);
    }
    throw error;
  }
};

const SCHOLAR_BASE_URL = import.meta.env.VITE_SCHOLAR_API_URL || 'http://localhost:3001';

/**
 * 1. GOOGLE SCHOLAR API
 */
export const searchGoogleScholar = async (query, page = 1, limit = 10) => {
  try {
    // Backend harus menangani page dan limit
    const response = await fetchWithTimeout(`${SCHOLAR_BASE_URL}/api/scholar?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error(`Google Scholar HTTP Error: ${response.status}`);
    
    const data = await response.json();
    return (data || []).map((item, index) => ({
      id: item.id || `scholar-${index}`,
      title: item.title || "No Title",
      authors: item.authors || "Unknown Authors",
      source: "Google Scholar",
      snippet: item.snippet || "Abstrak tidak tersedia.",
      link: item.link || "#",
      citations: parseInt(String(item.citations).replace(/\D/g, ''), 10) || 0,
      year: item.year || "N/A" // Diambil langsung dari backend, bukan regex dari snippet
    }));
  } catch (error) {
    console.error("[Google Scholar Error]:", error.message);
    return [];
  }
};

/**
 * 2. SCOPUS API (Rate Limit Safe & Pagination Ready)
 */
export const searchScopus = async (query, userApiKey, instToken, page = 1, limit = 25) => {
  if (!userApiKey) return [];

  try {
    const headers = { "X-ELS-APIKey": userApiKey, "Accept": "application/json" };
    if (instToken) headers["X-ELS-Insttoken"] = instToken;

    let formattedQuery = query.trim();
    if (!formattedQuery.includes("TITLE-ABS-KEY") && !formattedQuery.includes("ALL(")) {
      formattedQuery = `TITLE-ABS-KEY("${formattedQuery}")`; // Disederhanakan untuk menghindari bug regex boolean
    }

    const startOffset = (page - 1) * limit;
    // Sequential fetch (satu per satu per halaman) untuk mencegah HTTP 429 Too Many Requests
    const url = `https://api.elsevier.com/content/search/scopus?query=${encodeURIComponent(formattedQuery)}&start=${startOffset}&count=${limit}&sort=-citedby-count`;

    const response = await fetchWithTimeout(url, { method: "GET", headers });

    if (!response.ok) {
      throw new Error(`Scopus HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    const results = data["search-results"]?.entry || [];

    return results.map((item) => {
      const date = item["prism:coverDate"];
      const doi = item["prism:doi"];
      const scopusLink = item.link ? item.link.find(l => l["@ref"] === "scopus")?.["@href"] : "#";

      return {
        id: item["dc:identifier"] || `scopus-${Math.random()}`,
        title: item["dc:title"],
        authors: item["dc:creator"] || "Unknown Author",
        source: "Scopus",
        snippet: item["authkeywords"] || `Published in ${item["prism:publicationName"]}`,
        link: doi ? `https://doi.org/${doi}` : (scopusLink || "#"),
        citations: item["citedby-count"] ? parseInt(item["citedby-count"], 10) : 0,
        year: date ? date.substring(0, 4) : "N/A"
      };
    });
  } catch (error) {
    console.error("[Scopus Error]:", error.message);
    return [];
  }
};

/**
 * 3. OPENALEX API (Pagination Added)
 */
export const searchOpenAlex = async (query, page = 1, limit = 10) => {
  try {
    const response = await fetchWithTimeout(`https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=${limit}&page=${page}`);
    if (!response.ok) throw new Error(`OpenAlex HTTP Error: ${response.status}`);
    const data = await response.json();
    
    return (data.results || []).map((item, index) => {
      let abstractText = "Tidak ada abstrak yang disediakan.";
      if (item.abstract_inverted_index) {
        const wordsArray = [];
        Object.entries(item.abstract_inverted_index).forEach(([word, positions]) => {
          positions.forEach(pos => { wordsArray[pos] = word; });
        });
        abstractText = wordsArray.join(' ').substring(0, 250) + "...";
      }

      return {
        id: item.id || `openalex-${index}`,
        title: item.title,
        authors: item.authorships?.map(a => a.author.display_name).join(', ') || "Unknown Authors",
        source: "OpenAlex",
        snippet: abstractText,
        link: item.doi || item.id,
        citations: item.cited_by_count || 0,
        year: item.publication_year || "N/A"
      };
    });
  } catch (error) {
    console.error("[OpenAlex Error]:", error.message);
    return [];
  }
};

/**
 * 4. CROSSREF API (Pagination Added)
 */
export const searchCrossref = async (query, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    const response = await fetchWithTimeout(`https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error(`Crossref HTTP Error: ${response.status}`);
    
    const data = await response.json();
    return (data.message.items || []).map((item, index) => {
      const pubDate = item['published-print'] || item['published-online'];
      const year = pubDate?.['date-parts']?.[0]?.[0] || "N/A";

      return {
        id: item.DOI || `crossref-${index}`,
        title: item.title?.[0] || "No Title",
        authors: item.author?.map(a => `${a.given || ''} ${a.family || ''}`.trim()).join(', ') || "Unknown Authors",
        source: "Crossref",
        snippet: item.abstract ? item.abstract.replace(/(<([^>]+)>)/gi, "").substring(0, 250) + "..." : "Abstrak tidak tersedia.",
        link: item.URL || "#",
        citations: item['is-referenced-by-count'] || 0,
        year: year
      };
    });
  } catch (error) {
    console.error("[Crossref Error]:", error.message);
    return [];
  }
};

/**
 * 5. ARXIV API (Secure Backend Proxy & Pagination Added)
 */
export const searchArxiv = async (query, page = 1, limit = 10) => {
  try {
    const startOffset = (page - 1) * limit;
    // Menggunakan backend proxy sendiri untuk menghindari sniffing dari layanan corsproxy publik
    const response = await fetchWithTimeout(`${SCHOLAR_BASE_URL}/api/arxiv?q=${encodeURIComponent(query)}&start=${startOffset}&max_results=${limit}`);
    if (!response.ok) throw new Error(`arXiv HTTP Error: ${response.status}`);
    
    const textData = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(textData, "text/xml");
    const entries = Array.from(xmlDoc.querySelectorAll("entry"));

    return entries.map((entry, index) => {
      const title = entry.querySelector("title")?.textContent || "No Title";
      const summary = entry.querySelector("summary")?.textContent || "Abstrak tidak tersedia.";
      const link = entry.querySelector("id")?.textContent || "#";
      const authors = Array.from(entry.querySelectorAll("author name")).map(n => n.textContent).join(', ');
      
      const published = entry.querySelector("published")?.textContent;
      const year = published ? published.substring(0, 4) : "N/A";

      return {
        id: `arxiv-${index}`,
        title: title.trim().replace(/\n/g, ' '),
        authors: authors || "Unknown Authors",
        source: "arXiv",
        snippet: summary.trim().replace(/\n/g, ' ').substring(0, 250) + "...",
        link: link.trim(),
        citations: "N/A",
        year: year
      };
    });
  } catch (error) {
    console.error("[arXiv Error]:", error.message);
    return [];
  }
};

/**
 * 6. CORE API v3 (Pagination Added)
 */
export const searchCore = async (query, apiKey, page = 1, limit = 10) => {
  if (!apiKey) return [];
  try {
    const offset = (page - 1) * limit;
    const response = await fetchWithTimeout(`https://api.core.ac.uk/v3/search/works?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`, {
      headers: { "Authorization": `Bearer ${apiKey}` }
    });
    
    if (!response.ok) throw new Error(`CORE HTTP Error: ${response.status}`);
    
    const data = await response.json();
    return (data.results || []).map((item, index) => ({
      id: item.id || `core-${index}`,
      title: item.title || "No Title",
      authors: item.authors?.map(a => a.name).join(', ') || "Unknown Authors",
      source: "CORE",
      snippet: item.abstract ? item.abstract.substring(0, 250) + "..." : "Abstrak tidak tersedia.",
      link: item.downloadUrl || item.links?.[0]?.url || "#",
      citations: item.citationCount || 0,
      year: item.year || (item.publishedDate ? item.publishedDate.substring(0, 4) : "N/A")
    }));
  } catch (error) {
    console.error("[CORE Error]:", error.message);
    return [];
  }
};