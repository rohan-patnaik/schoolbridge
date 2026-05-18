"""Run SchoolBridge benchmark against Ollama model.

Usage:
    python -m eval.benchmark --model gemma4:e4b --output eval/results/base.json
    python -m eval.benchmark --model schoolbridge:latest --output eval/results/tuned.json
"""

import argparse
import json
import time
import httpx
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from eval.metrics import evaluate_single, evaluate_all, print_comparison

OLLAMA_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

SYSTEM_PROMPT = (
    "You are SchoolBridge, a school notice analyzer. "
    "Extract structured information from school notices and respond in valid JSON only."
)


def call_ollama(model: str, notice_text: str) -> tuple[str, float]:
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": f"Analyze this school notice:\n\n{notice_text}\n\nTarget language: English",
        },
    ]

    start = time.perf_counter()
    resp = httpx.post(
        f"{OLLAMA_URL}/api/chat",
        json={
            "model": model,
            "messages": messages,
            "stream": False,
            "options": {"temperature": 0.1, "num_predict": 2048},
        },
        timeout=120.0,
    )
    elapsed = time.perf_counter() - start
    resp.raise_for_status()
    return resp.json()["message"]["content"], elapsed


def parse_response(raw: str) -> dict | None:
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        import re
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass
    return None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default="gemma4:e4b")
    parser.add_argument("--test-file", default="eval/test_cases.json")
    parser.add_argument("--output", default=None)
    parser.add_argument("--compare", default=None, help="Path to baseline results for comparison")
    args = parser.parse_args()

    with open(args.test_file, "r") as f:
        test_cases = json.load(f)

    print(f"Running benchmark with model: {args.model}")
    print(f"Test cases: {len(test_cases)}\n")

    results = []
    for tc in test_cases:
        print(f"  [{tc['id']}] {tc['category']}...", end=" ", flush=True)
        try:
            raw, latency = call_ollama(args.model, tc["notice_text"])
            parsed = parse_response(raw)
            if parsed:
                scores = evaluate_single(parsed, tc["expected"], raw)
                results.append({
                    "id": tc["id"],
                    "category": tc["category"],
                    "scores": scores,
                    "latency_s": round(latency, 2),
                    "raw_output": raw,
                })
                print(f"OK ({scores['weighted_total']:.0%}, {latency:.1f}s)")
            else:
                results.append({
                    "id": tc["id"],
                    "category": tc["category"],
                    "scores": {"json_valid": 0, "weighted_total": 0},
                    "latency_s": round(latency, 2),
                    "raw_output": raw,
                    "error": "Failed to parse JSON",
                })
                print(f"PARSE FAIL ({latency:.1f}s)")
        except Exception as e:
            results.append({
                "id": tc["id"],
                "category": tc["category"],
                "scores": {"weighted_total": 0},
                "error": str(e),
            })
            print(f"ERROR: {e}")

    metrics = evaluate_all([r for r in results if "json_valid" in r["scores"]])

    if args.compare:
        with open(args.compare, "r") as f:
            base_data = json.load(f)
        base_metrics = evaluate_all([r for r in base_data["results"] if "json_valid" in r["scores"]])
        print_comparison(base_metrics, metrics)
    else:
        print_comparison(metrics)

    if args.output:
        os.makedirs(os.path.dirname(args.output) or ".", exist_ok=True)
        with open(args.output, "w") as f:
            json.dump({"model": args.model, "results": results, "metrics": metrics}, f, indent=2)
        print(f"\nResults saved to {args.output}")


if __name__ == "__main__":
    main()
