#!/usr/bin/env python3
"""
Extractor: Reads PDF files and extracts per-slide data including:
  - All text content (with font sizes and positions)
  - Dominant colors (sampled from rendered page images)
  - Basic layout detection (title region, body region, table presence)

Uses PyMuPDF (fitz) for both text extraction and page rendering.
"""

import os
import json
import re
from collections import Counter

import fitz  # PyMuPDF
from PIL import Image
import io
import numpy as np
from tqdm import tqdm


class PDFExtractor:

    # Typical PowerPoint slide dimensions (landscape)
    # We use this to normalize positions
    SLIDE_WIDTH = 10.0  # inches
    SLIDE_HEIGHT = 7.5

    def __init__(self):
        pass

    def extract_page_text(self, page):
        """
        Extract text blocks with position, font size, and font name.
        Returns list of text block dicts.
        """
        blocks = []
        text_dict = page.get_text("dict", flags=fitz.TEXT_PRESERVE_WHITESPACE)

        for block in text_dict.get("blocks", []):
            if block.get("type") != 0:  # 0 = text block
                continue

            block_text = []
            font_sizes = []
            font_names = []
            is_bold = False

            for line in block.get("lines", []):
                line_text = ""
                for span in line.get("spans", []):
                    text = span.get("text", "").strip()
                    if text:
                        line_text += text + " "
                        font_sizes.append(span.get("size", 12))
                        font_names.append(span.get("font", ""))
                        if "bold" in span.get("font", "").lower():
                            is_bold = True

                line_text = line_text.strip()
                if line_text:
                    block_text.append(line_text)

            full_text = "\n".join(block_text).strip()
            if not full_text:
                continue

            bbox = block.get("bbox", [0, 0, 0, 0])
            avg_font_size = sum(font_sizes) / len(font_sizes) if font_sizes else 12

            blocks.append({
                "text": full_text,
                "bbox": {
                    "x": bbox[0],
                    "y": bbox[1],
                    "width": bbox[2] - bbox[0],
                    "height": bbox[3] - bbox[1],
                },
                "avg_font_size": round(avg_font_size, 1),
                "is_bold": is_bold,
                "font": font_names[0] if font_names else "",
            })

        return blocks

    def extract_page_colors(self, page, sample_size=1000):
        """
        Render page to image and sample dominant colors.
        Returns list of hex color strings sorted by frequency.
        """
        try:
            # Render at low res for speed
            pix = page.get_pixmap(matrix=fitz.Matrix(0.5, 0.5))
            img = Image.open(io.BytesIO(pix.tobytes("png")))
            img_array = np.array(img)

            # Sample random pixels
            h, w = img_array.shape[:2]
            if h * w < sample_size:
                sample_size = h * w

            indices = np.random.choice(h * w, size=sample_size, replace=False)
            rows, cols = np.unravel_index(indices, (h, w))
            pixels = img_array[rows, cols, :3]  # RGB only

            # Quantize to reduce color space (round to nearest 16)
            quantized = (pixels // 16) * 16
            color_strings = [
                f"#{r:02x}{g:02x}{b:02x}"
                for r, g, b in quantized
            ]

            # Count and return top colors (excluding near-white and near-black)
            counter = Counter(color_strings)
            colors = []
            for color, count in counter.most_common(20):
                # Skip near-white (#e0e0e0+) and near-black (#202020-)
                r, g, b = int(color[1:3], 16), int(color[3:5], 16), int(color[5:7], 16)
                brightness = (r + g + b) / 3
                if 30 < brightness < 230:
                    colors.append({
                        "hex": color,
                        "frequency": round(count / sample_size, 3),
                    })

            return colors[:10]

        except Exception as e:
            return []

    def classify_slide_type(self, text_blocks):
        """
        Heuristic classification of slide type based on text patterns.
        """
        full_text = " ".join(b["text"] for b in text_blocks).lower()
        num_blocks = len(text_blocks)

        # Title slide: few blocks, large font
        if num_blocks <= 4:
            avg_size = sum(b["avg_font_size"] for b in text_blocks) / max(num_blocks, 1)
            if avg_size > 18:
                return "title"

        # Agenda
        if any(w in full_text for w in ["agenda", "outline", "overview", "table of contents"]):
            return "agenda"

        # Questions slide
        if re.search(r"question|discussion|\?{2,}", full_text) and num_blocks <= 3:
            return "questions"

        # Backup slides marker
        if "backup" in full_text and num_blocks <= 3:
            return "backup"

        # Budget/financial table
        if any(w in full_text for w in ["fy2", "fy1", "fydp", "budget", "funding", "$ in", "rdt&e", "procurement"]):
            if any(w in full_text for w in ["total", "mil", "000", "$"]):
                return "budget"

        # Timeline
        if any(w in full_text for w in ["timeline", "schedule", "milestone", "roadmap", "phased"]):
            return "timeline"

        # Org chart
        if any(w in full_text for w in ["organization", "command", "governance", "reporting"]):
            return "orgchart"

        # Matrix / stoplight chart
        if any(w in full_text for w in ["risk", "matrix", "assessment", "status", "stoplight", "red", "yellow", "green"]):
            return "matrix"

        # Default: bullet slide
        return "bullets"

    def extract_acronyms(self, text):
        """
        Find acronyms (2-6 uppercase letters, optionally with numbers and slashes).
        """
        # Match patterns like: DARPA, JADC2, USD(R&E), C4ISR, NC3
        pattern = r'\b([A-Z][A-Z0-9/&]{1,8}(?:\([A-Z&/]+\))?)\b'
        matches = re.findall(pattern, text)
        return [m for m in matches if len(m) >= 2 and not m.isdigit()]

    def process_pdf(self, pdf_path):
        """
        Process a single PDF file. Returns list of slide data dicts.
        """
        slides = []

        try:
            doc = fitz.open(pdf_path)
            filename = os.path.basename(pdf_path)

            for page_num in range(len(doc)):
                page = doc[page_num]

                # Extract text blocks
                text_blocks = self.extract_page_text(page)
                if not text_blocks:
                    continue  # Skip blank slides

                # Extract colors
                colors = self.extract_page_colors(page)

                # Full text for analysis
                full_text = " ".join(b["text"] for b in text_blocks)

                # Classify slide type
                slide_type = self.classify_slide_type(text_blocks)

                # Extract acronyms
                acronyms = self.extract_acronyms(full_text)

                # Identify title block (largest font, near top)
                title_block = None
                for block in sorted(text_blocks, key=lambda b: b["avg_font_size"], reverse=True):
                    if block["bbox"]["y"] < page.rect.height * 0.3:
                        title_block = block["text"]
                        break

                slides.append({
                    "source_file": filename,
                    "page_num": page_num,
                    "slide_type": slide_type,
                    "title": title_block or "",
                    "full_text": full_text[:2000],  # Cap length
                    "text_blocks": [{
                        "text": b["text"][:500],
                        "font_size": b["avg_font_size"],
                        "is_bold": b["is_bold"],
                        "position": {
                            "x_pct": round(b["bbox"]["x"] / max(page.rect.width, 1) * 100, 1),
                            "y_pct": round(b["bbox"]["y"] / max(page.rect.height, 1) * 100, 1),
                        }
                    } for b in text_blocks[:20]],  # Cap block count
                    "colors": colors,
                    "acronyms": list(set(acronyms)),
                    "num_text_blocks": len(text_blocks),
                    "page_width": round(page.rect.width, 1),
                    "page_height": round(page.rect.height, 1),
                })

            doc.close()

        except Exception as e:
            print(f"  Error processing {pdf_path}: {e}")

        return slides

    def process_all(self, pdf_paths):
        """
        Process multiple PDFs. Returns flat list of all slide data.
        """
        all_slides = []

        for path in tqdm(pdf_paths, desc="Extracting slides"):
            slides = self.process_pdf(path)
            all_slides.extend(slides)

        return all_slides


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python extractor.py <pdf_path>")
        sys.exit(1)

    extractor = PDFExtractor()
    slides = extractor.process_pdf(sys.argv[1])
    print(json.dumps(slides[:3], indent=2))
    print(f"\nExtracted {len(slides)} slides")
