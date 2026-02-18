#!/usr/bin/env python3
"""
Analyzer: Takes extracted slide data and produces aggregated analysis:
  - Vocabulary frequency lists (by slide type)
  - Acronym frequency and groupings
  - Color palette clustering
  - Slide type distribution
  - Sample text for few-shot prompting
"""

import re
import json
from collections import Counter, defaultdict

import numpy as np


class SlideAnalyzer:

    # Common English stop words to exclude from vocabulary
    STOP_WORDS = set("""
        the a an is are was were be been being have has had do does did
        will would shall should may might can could of in to for with on
        at by from as into through during before after above below between
        out off over under again further then once here there when where
        why how all each every both few more most other some such no not
        only own same so than too very just because but and or if while
        this that these those it its he she they them their his her we
        our you your i me my which what who whom whose about also any
        another back even still already much many since however although
        well also more most just only than so very really quite rather
    """.split())

    def __init__(self):
        pass

    def build_vocabulary(self, slides):
        """
        Build frequency-weighted vocabulary lists, segmented by slide type.
        """
        vocab_by_type = defaultdict(Counter)
        overall_vocab = Counter()

        for slide in slides:
            text = slide.get("full_text", "")
            slide_type = slide.get("slide_type", "bullets")

            # Extract meaningful words/phrases
            words = re.findall(r'\b[a-zA-Z]{3,}\b', text)
            words = [w.lower() for w in words if w.lower() not in self.STOP_WORDS]

            vocab_by_type[slide_type].update(words)
            overall_vocab.update(words)

            # Also extract multi-word phrases (bigrams/trigrams)
            word_list = text.split()
            for n in [2, 3]:
                for i in range(len(word_list) - n + 1):
                    phrase = " ".join(word_list[i:i+n]).strip()
                    # Only keep phrases that look meaningful
                    if len(phrase) > 6 and not phrase[0].isdigit():
                        cleaned = re.sub(r'[^\w\s/&()-]', '', phrase)
                        if cleaned:
                            vocab_by_type[slide_type][cleaned.lower()] += 1
                            overall_vocab[cleaned.lower()] += 1

        # Convert to sorted lists with counts
        result = {}
        for slide_type, counter in vocab_by_type.items():
            result[slide_type] = [
                {"term": term, "count": count}
                for term, count in counter.most_common(500)
                if count >= 2  # Only keep terms appearing 2+ times
            ]

        result["_overall"] = [
            {"term": term, "count": count}
            for term, count in overall_vocab.most_common(1000)
            if count >= 3
        ]

        return result

    def build_acronym_db(self, slides):
        """
        Build a frequency-sorted acronym database.
        Attempts to find expansions by looking for capitalized phrases
        that match the acronym pattern.
        """
        acronym_counter = Counter()
        potential_expansions = defaultdict(Counter)

        for slide in slides:
            acronyms = slide.get("acronyms", [])
            text = slide.get("full_text", "")
            acronym_counter.update(acronyms)

            # Try to find expansions: look for "Full Name (ACRONYM)" patterns
            expansion_pattern = r'((?:[A-Z][a-z]+[\s,&-]*){2,8})\s*\(([A-Z][A-Z0-9/&]{1,8})\)'
            matches = re.findall(expansion_pattern, text)
            for expansion, acronym in matches:
                potential_expansions[acronym][expansion.strip()] += 1

        # Build final list
        result = []
        for acronym, count in acronym_counter.most_common(500):
            entry = {"acronym": acronym, "count": count}

            # Add most common expansion if found
            if acronym in potential_expansions:
                best_expansion = potential_expansions[acronym].most_common(1)[0][0]
                entry["expansion"] = best_expansion

            result.append(entry)

        return result

    def analyze_color_palettes(self, slides):
        """
        Cluster extracted colors into common palettes.
        Returns list of palette objects.
        """
        all_palettes = []

        for slide in slides:
            colors = slide.get("colors", [])
            if len(colors) >= 2:
                palette = [c["hex"] for c in colors[:5]]
                all_palettes.append({
                    "colors": palette,
                    "slide_type": slide.get("slide_type", "unknown"),
                })

        # Find most common color combinations by counting individual colors
        color_counter = Counter()
        for p in all_palettes:
            for c in p["colors"]:
                color_counter[c] += 1

        # Group palettes by slide type
        palettes_by_type = defaultdict(list)
        for p in all_palettes:
            palettes_by_type[p["slide_type"]].append(p["colors"])

        # Pick representative palettes
        result = []
        for slide_type, palettes in palettes_by_type.items():
            # Take up to 5 random palettes per type
            import random
            sample = random.sample(palettes, min(5, len(palettes)))
            for palette in sample:
                result.append({
                    "slide_type": slide_type,
                    "colors": palette,
                })

        # Add the overall top colors
        result.append({
            "slide_type": "_overall",
            "colors": [c for c, _ in color_counter.most_common(10)],
        })

        return result

    def collect_sample_text(self, slides, samples_per_type=10):
        """
        Collect representative sample text for few-shot prompting.
        Picks diverse, medium-length examples for each slide type.
        """
        by_type = defaultdict(list)

        for slide in slides:
            slide_type = slide.get("slide_type", "bullets")
            text = slide.get("full_text", "").strip()
            title = slide.get("title", "").strip()

            # Skip very short or very long slides
            if len(text) < 50 or len(text) > 1500:
                continue

            by_type[slide_type].append({
                "title": title[:200],
                "text": text[:1000],
                "num_blocks": slide.get("num_text_blocks", 0),
            })

        # Sample from each type
        import random
        result = {}
        for slide_type, examples in by_type.items():
            random.shuffle(examples)
            result[slide_type] = examples[:samples_per_type]

        return result

    def compute_slide_type_distribution(self, slides):
        """
        Count how often each slide type appears.
        """
        counter = Counter(s.get("slide_type", "unknown") for s in slides)
        total = sum(counter.values())
        return {
            slide_type: {
                "count": count,
                "percentage": round(count / total * 100, 1),
            }
            for slide_type, count in counter.most_common()
        }

    def extract_common_titles(self, slides, top_n=200):
        """
        Find the most common slide titles.
        """
        title_counter = Counter()
        for slide in slides:
            title = slide.get("title", "").strip()
            if title and len(title) > 3:
                # Normalize: uppercase, strip trailing punctuation
                normalized = re.sub(r'[\s]+', ' ', title.upper().strip())
                normalized = re.sub(r'[:\-–—]+$', '', normalized).strip()
                if normalized:
                    title_counter[normalized] += 1

        return [
            {"title": title, "count": count}
            for title, count in title_counter.most_common(top_n)
            if count >= 2
        ]

    def analyze(self, slides):
        """
        Main analysis entry point. Returns comprehensive analysis dict.
        """
        print(f"  Analyzing {len(slides)} slides...")

        print("  Building vocabulary...")
        vocabulary = self.build_vocabulary(slides)

        print("  Building acronym database...")
        acronyms = self.build_acronym_db(slides)

        print("  Analyzing color palettes...")
        palettes = self.analyze_color_palettes(slides)

        print("  Collecting sample text...")
        sample_text = self.collect_sample_text(slides)

        print("  Computing distributions...")
        type_distribution = self.compute_slide_type_distribution(slides)
        common_titles = self.extract_common_titles(slides)

        return {
            "vocabulary": vocabulary,
            "acronyms": acronyms,
            "palettes": palettes,
            "sample_text": sample_text,
            "type_distribution": type_distribution,
            "common_titles": common_titles,
            "stats": {
                "total_slides": len(slides),
                "unique_sources": len(set(s.get("source_file", "") for s in slides)),
            },
        }


if __name__ == "__main__":
    import sys
    # Test with a JSON file of extracted slides
    if len(sys.argv) < 2:
        print("Usage: python analyzer.py <extracted_slides.json>")
        sys.exit(1)

    with open(sys.argv[1]) as f:
        slides = json.load(f)

    analyzer = SlideAnalyzer()
    analysis = analyzer.analyze(slides)
    print(json.dumps({k: v[:5] if isinstance(v, list) else v for k, v in analysis.items()}, indent=2))
