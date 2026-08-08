from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import re
import time
import random

app = Flask(__name__)
CORS(app)

session = requests.Session()
session.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
    'Referer': 'https://scholar.google.com/',
})

@app.route('/api/scholar', methods=['GET'])
def search_scholar():
    query = request.args.get('q')
    if not query:
        return jsonify({"error": "Query parameter 'q' is required"}), 400

    url = f"https://scholar.google.com/scholar?q={query}"

    try:
        time.sleep(random.uniform(1.0, 2.5))
        response = session.get(url, timeout=10)
        response.raise_for_status() 
        
        soup = BeautifulSoup(response.text, 'html.parser')
        results = []

        if "sorry/index" in response.url or "captcha" in response.text.lower():
            return jsonify({"error": "Terdeteksi CAPTCHA oleh Google."}), 429

        for i, el in enumerate(soup.select('.gs_ri')):
            title_tag = el.select_one('.gs_rt a')
            if not title_tag:
                continue
            
            title = title_tag.get_text()
            link = title_tag['href']
            
            snippet_tag = el.select_one('.gs_rs')
            snippet = snippet_tag.get_text() if snippet_tag else ""
            
            authors_tag = el.select_one('.gs_a')
            authors = authors_tag.get_text().replace('\xa0', ' ') if authors_tag else "Unknown Authors"
            
            # --- EKSTRAKSI TAHUN AKURAT DARI BARIS PENULIS ---
            year = "N/A"
            year_match = re.search(r'\b(19\d\d|20\d\d)\b', authors)
            if year_match:
                year = year_match.group(0)
            
            citations = 0
            cited_by_tag = el.find('a', string=re.compile(r'Cited by|Dirujuk oleh', re.IGNORECASE))
            if cited_by_tag:
                cited_text = cited_by_tag.get_text()
                numbers = re.findall(r'\d+', cited_text)
                if numbers:
                    citations = int(numbers[0])

            results.append({
                "id": f"scholar-py-{i}",
                "title": title,
                "link": link,
                "snippet": snippet,
                "authors": authors,
                "source": "Google Scholar",
                "citations": citations,
                "year": year # <- Tahun kini resmi dikirim ke React!
            })

        # Sanity check di terminal jika Google mengirim halaman kosong
        if len(results) == 0:
            print("WARNING: 0 hasil diekstrak. Kemungkinan halaman persetujuan cookie Google.")

        return jsonify(results)

    except Exception as e:
        print(f"Scraping Error: {e}")
        return jsonify({"error": "Gagal mengekstrak data"}), 500

if __name__ == '__main__':
    app.run(port=3001, debug=True)