#!/usr/bin/env python3
"""
Pentagon Briefing Generator — Corpus Ingestion Pipeline

Downloads PDFs from the Archive.org Military Industrial Powerpoint Complex
collection, extracts text/colors/layouts, analyzes patterns, and builds
a JSON corpus for the web app's slide generator.

Usage:
    python pipeline/ingest.py --count 50              # Download 50 random PDFs
    python pipeline/ingest.py --count 100 --domain dtic.mil
    python pipeline/ingest.py --count 500 --skip-download  # Re-process already downloaded
"""

import argparse
import os
import sys

from crawler import ArchiveCrawler
from extractor import PDFExtractor
from analyzer import SlideAnalyzer
from build_corpus import CorpusBuilder


def main():
    parser = argparse.ArgumentParser(description="Ingest DoD PDFs from Archive.org")
    parser.add_argument("--count", type=int, default=50,
                        help="Number of PDFs to download (default: 50)")
    parser.add_argument("--domain", type=str, default=None,
                        help="Filter to a specific .mil domain (e.g., 'dtic.mil')")
    parser.add_argument("--skip-download", action="store_true",
                        help="Skip download, process already-downloaded PDFs")
    parser.add_argument("--output-dir", type=str, default=None,
                        help="Output directory for corpus (default: ../corpus)")
    parser.add_argument("--download-dir", type=str, default=None,
                        help="Directory for downloaded PDFs (default: ../downloads)")
    args = parser.parse_args()

    # Resolve directories relative to project root
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    download_dir = args.download_dir or os.path.join(project_root, "downloads")
    corpus_dir = args.output_dir or os.path.join(project_root, "corpus")

    os.makedirs(download_dir, exist_ok=True)
    os.makedirs(corpus_dir, exist_ok=True)

    # Stage 1: Download PDFs from Archive.org
    if not args.skip_download:
        print("=" * 60)
        print("STAGE 1: Downloading PDFs from Archive.org")
        print("=" * 60)
        crawler = ArchiveCrawler(download_dir=download_dir)
        downloaded = crawler.download_collection(
            count=args.count,
            domain_filter=args.domain
        )
        print(f"\nDownloaded {len(downloaded)} PDFs to {download_dir}")
    else:
        print("Skipping download (--skip-download)")
        downloaded = [
            os.path.join(download_dir, f)
            for f in os.listdir(download_dir)
            if f.endswith(".pdf")
        ]
        print(f"Found {len(downloaded)} existing PDFs")

    if not downloaded:
        print("No PDFs to process. Exiting.")
        sys.exit(1)

    # Stage 2: Extract text, colors, and layouts from PDFs
    print("\n" + "=" * 60)
    print("STAGE 2: Extracting text, colors, and layouts")
    print("=" * 60)
    extractor = PDFExtractor()
    extracted_data = extractor.process_all(downloaded)
    print(f"Extracted data from {len(extracted_data)} slides")

    # Stage 3: Analyze patterns
    print("\n" + "=" * 60)
    print("STAGE 3: Analyzing slide patterns")
    print("=" * 60)
    analyzer = SlideAnalyzer()
    analysis = analyzer.analyze(extracted_data)
    print(f"Analysis complete: {len(analysis['vocabulary'])} vocabulary terms, "
          f"{len(analysis['acronyms'])} acronyms, "
          f"{len(analysis['palettes'])} color palettes")

    # Stage 4: Build corpus JSON files
    print("\n" + "=" * 60)
    print("STAGE 4: Building corpus files")
    print("=" * 60)
    builder = CorpusBuilder(corpus_dir=corpus_dir)
    builder.build(analysis)
    print(f"\nCorpus files written to {corpus_dir}/")
    print("Done! The web app will automatically use the corpus data.")


if __name__ == "__main__":
    main()
