#!/usr/bin/env python3
"""
Corpus Builder: Takes analysis results and writes them as JSON files
that the web app can load for slide generation.
"""

import os
import json


class CorpusBuilder:

    def __init__(self, corpus_dir="corpus"):
        self.corpus_dir = corpus_dir
        os.makedirs(corpus_dir, exist_ok=True)

    def _write_json(self, filename, data):
        path = os.path.join(self.corpus_dir, filename)
        with open(path, "w") as f:
            json.dump(data, f, indent=2)
        size_kb = os.path.getsize(path) / 1024
        print(f"  Wrote {filename} ({size_kb:.1f} KB)")

    def build(self, analysis):
        """
        Write analysis data to corpus JSON files.
        """
        # 1. Vocabulary — the weighted word/phrase lists
        self._write_json("vocabulary.json", analysis["vocabulary"])

        # 2. Acronyms — frequency-sorted with optional expansions
        self._write_json("acronyms.json", analysis["acronyms"])

        # 3. Color palettes — extracted from real slides
        self._write_json("palettes.json", analysis["palettes"])

        # 4. Sample text — real slide text for few-shot prompting
        self._write_json("sample_text.json", analysis["sample_text"])

        # 5. Common slide titles
        self._write_json("common_titles.json", analysis["common_titles"])

        # 6. Stats and metadata
        self._write_json("corpus_meta.json", {
            "type_distribution": analysis["type_distribution"],
            "stats": analysis["stats"],
        })

        # 7. Build a combined "slim" corpus for the frontend
        #    (smaller file that the React app can load directly)
        slim = self._build_slim_corpus(analysis)
        self._write_json("slim_corpus.json", slim)

        print(f"\n  All corpus files written to {self.corpus_dir}/")

    def _build_slim_corpus(self, analysis):
        """
        Build a compact corpus file (~100KB) for direct frontend use.
        Contains just enough data for procedural generation without an API.
        """
        # Top vocabulary terms (overall)
        overall_vocab = analysis["vocabulary"].get("_overall", [])
        top_terms = [v["term"] for v in overall_vocab[:300]]

        # Top vocabulary by slide type
        type_vocab = {}
        for slide_type, terms in analysis["vocabulary"].items():
            if slide_type.startswith("_"):
                continue
            type_vocab[slide_type] = [v["term"] for v in terms[:100]]

        # Top acronyms
        top_acronyms = [
            {"a": a["acronym"], "e": a.get("expansion", "")}
            for a in analysis["acronyms"][:200]
        ]

        # Top titles
        top_titles = [t["title"] for t in analysis["common_titles"][:100]]

        # Palettes (just the color arrays)
        palettes = [p["colors"] for p in analysis["palettes"][:30]]

        # Sample text snippets (just titles and short excerpts)
        samples = {}
        for slide_type, examples in analysis["sample_text"].items():
            samples[slide_type] = [
                {"t": ex["title"][:100], "s": ex["text"][:200]}
                for ex in examples[:5]
            ]

        return {
            "terms": top_terms,
            "type_vocab": type_vocab,
            "acronyms": top_acronyms,
            "titles": top_titles,
            "palettes": palettes,
            "samples": samples,
            "stats": analysis["stats"],
        }


if __name__ == "__main__":
    # Test with a sample analysis
    sample_analysis = {
        "vocabulary": {"_overall": [{"term": "test", "count": 5}], "bullets": [{"term": "test", "count": 3}]},
        "acronyms": [{"acronym": "DOD", "count": 10, "expansion": "Department of Defense"}],
        "palettes": [{"slide_type": "title", "colors": ["#003366", "#c8102e"]}],
        "sample_text": {"bullets": [{"title": "Test", "text": "Test content", "num_blocks": 3}]},
        "common_titles": [{"title": "AGENDA", "count": 15}],
        "type_distribution": {"bullets": {"count": 50, "percentage": 60.0}},
        "stats": {"total_slides": 100, "unique_sources": 10},
    }

    builder = CorpusBuilder(corpus_dir="test_corpus")
    builder.build(sample_analysis)
