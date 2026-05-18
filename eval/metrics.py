"""Evaluation metrics for SchoolBridge notice analysis."""

import json
from pathlib import Path


def score_doc_type(predicted: str, expected: str) -> float:
    return 1.0 if predicted.lower() == expected.lower() else 0.0


def score_urgency(predicted: str, expected: str) -> float:
    return 1.0 if predicted.lower() == expected.lower() else 0.0


def score_deadline(predicted: str | None, expected: str | None) -> float:
    if predicted is None and expected is None:
        return 1.0
    if predicted is None or expected is None:
        return 0.0
    return 1.0 if predicted == expected else 0.0


def score_action_recall(predicted_actions: list[dict], key_actions: list[str]) -> float:
    if not key_actions:
        return 1.0 if not predicted_actions else 0.8
    pred_text = " ".join(a.get("action", "").lower() for a in predicted_actions)
    hits = sum(1 for ka in key_actions if ka.lower() in pred_text)
    return hits / len(key_actions)


def score_action_count(predicted_count: int, expected_count: int) -> float:
    if expected_count == 0:
        return 1.0 if predicted_count == 0 else 0.5
    diff = abs(predicted_count - expected_count)
    if diff == 0:
        return 1.0
    elif diff == 1:
        return 0.7
    else:
        return max(0.0, 1.0 - diff * 0.3)


def score_reply_needed(predicted: bool, expected: bool) -> float:
    return 1.0 if predicted == expected else 0.0


def score_json_valid(raw_output: str) -> float:
    try:
        json.loads(raw_output)
        return 1.0
    except (json.JSONDecodeError, TypeError):
        return 0.0


def evaluate_single(predicted: dict, expected: dict, raw_output: str = "") -> dict:
    scores = {
        "json_valid": score_json_valid(raw_output) if raw_output else 1.0,
        "doc_type": score_doc_type(predicted.get("doc_type", ""), expected["doc_type"]),
        "urgency": score_urgency(predicted.get("urgency", ""), expected["urgency"]),
        "deadline": score_deadline(predicted.get("deadline"), expected["deadline"]),
        "action_recall": score_action_recall(
            predicted.get("required_actions", []),
            expected.get("key_actions", []),
        ),
        "action_count": score_action_count(
            len(predicted.get("required_actions", [])),
            expected.get("required_actions_count", 0),
        ),
        "reply_needed": score_reply_needed(
            predicted.get("reply_needed", False),
            expected["reply_needed"],
        ),
    }

    weights = {
        "json_valid": 0.10,
        "doc_type": 0.10,
        "urgency": 0.15,
        "deadline": 0.15,
        "action_recall": 0.20,
        "action_count": 0.10,
        "reply_needed": 0.20,
    }

    scores["weighted_total"] = sum(scores[k] * weights[k] for k in weights)
    return scores


def evaluate_all(results: list[dict]) -> dict:
    all_scores = [r["scores"] for r in results]
    metrics = {}
    for key in all_scores[0]:
        values = [s[key] for s in all_scores]
        metrics[key] = {
            "mean": sum(values) / len(values),
            "min": min(values),
            "max": max(values),
        }
    return metrics


def print_comparison(base_metrics: dict, tuned_metrics: dict | None = None):
    print(f"\n{'Metric':<20} {'Base Model':>12}", end="")
    if tuned_metrics:
        print(f" {'Fine-tuned':>12} {'Delta':>8}", end="")
    print()
    print("-" * (52 if tuned_metrics else 34))

    for key in base_metrics:
        base_val = base_metrics[key]["mean"]
        print(f"{key:<20} {base_val:>11.1%}", end="")
        if tuned_metrics and key in tuned_metrics:
            tuned_val = tuned_metrics[key]["mean"]
            delta = tuned_val - base_val
            sign = "+" if delta >= 0 else ""
            print(f" {tuned_val:>11.1%} {sign}{delta:>6.1%}", end="")
        print()
