#!/usr/bin/env python3
"""
Crawler: Downloads PDFs from the Archive.org Military Industrial Powerpoint Complex.

The collection is organized as individual "items", each containing PDFs from a
specific .mil domain. Items have identifiers like "mipc-dtic_mil" or "mipc-aro_army_mil".

We use:
  - Archive.org Search API to discover items in the collection
  - Archive.org Metadata API to list files within each item
  - Direct download URLs: https://archive.org/download/{identifier}/{filename}
"""

import os
import json
import time
import random
import requests
from tqdm import tqdm


class ArchiveCrawler:
    SEARCH_URL = "https://archive.org/advancedsearch.php"
    METADATA_URL = "https://archive.org/metadata/{identifier}/files"
    DOWNLOAD_URL = "https://archive.org/download/{identifier}/{filename}"

    # Be a good citizen: identify ourselves and rate-limit
    HEADERS = {
        "User-Agent": "PentagonBriefingGenerator/1.0 (educational research project)"
    }
    REQUEST_DELAY = 1.0  # seconds between API calls

    def __init__(self, download_dir="downloads"):
        self.download_dir = download_dir
        os.makedirs(download_dir, exist_ok=True)
        self.session = requests.Session()
        self.session.headers.update(self.HEADERS)

    def discover_items(self, domain_filter=None, max_items=500):
        """
        Search Archive.org for items in the MilitaryIndustrialPowerpointComplex collection.
        Returns a list of item identifiers.
        """
        query = "collection:MilitaryIndustrialPowerpointComplex"
        if domain_filter:
            query += f" AND title:{domain_filter}"

        items = []
        page = 1
        rows = 100

        print(f"Searching Archive.org for items (query: {query})...")

        while len(items) < max_items:
            params = {
                "q": query,
                "fl[]": "identifier,title,item_size",
                "sort[]": "downloads desc",  # Most popular first
                "rows": rows,
                "page": page,
                "output": "json",
            }

            try:
                resp = self.session.get(self.SEARCH_URL, params=params, timeout=30)
                resp.raise_for_status()
                data = resp.json()

                docs = data.get("response", {}).get("docs", [])
                if not docs:
                    break

                for doc in docs:
                    items.append({
                        "identifier": doc["identifier"],
                        "title": doc.get("title", ""),
                        "size": doc.get("item_size", 0),
                    })

                print(f"  Found {len(items)} items so far (page {page})...")
                page += 1
                time.sleep(self.REQUEST_DELAY)

            except Exception as e:
                print(f"  Error searching: {e}")
                break

        print(f"Discovered {len(items)} items total")
        return items[:max_items]

    def list_pdfs_in_item(self, identifier):
        """
        Use the Metadata API to list all PDF files in an item.
        Returns list of {name, size} dicts.
        """
        url = self.METADATA_URL.format(identifier=identifier)

        try:
            resp = self.session.get(url, timeout=30)
            resp.raise_for_status()
            data = resp.json()

            files = data if isinstance(data, list) else data.get("result", [])
            pdfs = []
            for f in files:
                name = f.get("name", "")
                if name.lower().endswith(".pdf"):
                    pdfs.append({
                        "name": name,
                        "size": int(f.get("size", 0)),
                    })

            return pdfs

        except Exception as e:
            print(f"  Error listing files for {identifier}: {e}")
            return []

    def download_pdf(self, identifier, filename):
        """
        Download a single PDF from Archive.org.
        Returns the local file path, or None on failure.
        """
        # Create a safe local filename
        safe_name = f"{identifier}__{filename}".replace("/", "_")
        local_path = os.path.join(self.download_dir, safe_name)

        # Skip if already downloaded
        if os.path.exists(local_path):
            return local_path

        url = self.DOWNLOAD_URL.format(identifier=identifier, filename=filename)

        try:
            resp = self.session.get(url, timeout=60, stream=True)
            resp.raise_for_status()

            with open(local_path, "wb") as f:
                for chunk in resp.iter_content(chunk_size=8192):
                    f.write(chunk)

            return local_path

        except Exception as e:
            print(f"  Error downloading {filename}: {e}")
            if os.path.exists(local_path):
                os.remove(local_path)
            return None

    def download_collection(self, count=50, domain_filter=None):
        """
        Main entry point: discover items, list their PDFs, download up to `count` PDFs.
        Returns list of local file paths.
        """
        # Step 1: Discover items
        items = self.discover_items(
            domain_filter=domain_filter,
            max_items=min(count * 2, 1000)  # Get more items than needed for variety
        )

        if not items:
            print("No items found!")
            return []

        # Shuffle for variety (but keep some popular ones)
        random.shuffle(items)

        # Step 2: Iterate through items, listing and downloading PDFs
        downloaded = []
        pbar = tqdm(total=count, desc="Downloading PDFs")

        for item in items:
            if len(downloaded) >= count:
                break

            identifier = item["identifier"]
            time.sleep(self.REQUEST_DELAY)

            pdfs = self.list_pdfs_in_item(identifier)
            if not pdfs:
                continue

            # Download a random subset of PDFs from this item
            # (some items have hundreds — we don't need them all)
            sample_size = min(len(pdfs), max(1, (count - len(downloaded)) // 3))
            sampled_pdfs = random.sample(pdfs, sample_size)

            for pdf_info in sampled_pdfs:
                if len(downloaded) >= count:
                    break

                # Skip very large files (>50MB) and very small ones (<10KB)
                size = pdf_info["size"]
                if size > 50_000_000 or size < 10_000:
                    continue

                time.sleep(self.REQUEST_DELAY * 0.5)
                local_path = self.download_pdf(identifier, pdf_info["name"])

                if local_path:
                    downloaded.append(local_path)
                    pbar.update(1)

        pbar.close()
        return downloaded


if __name__ == "__main__":
    crawler = ArchiveCrawler()
    files = crawler.download_collection(count=10)
    print(f"\nDownloaded {len(files)} files:")
    for f in files:
        print(f"  {f}")
