import json
import re
from backend.models.schemas import NoticeAnalysis, ActionItem, EvidenceItem


def parse_analysis(raw: str) -> NoticeAnalysis:
    """Try multiple strategies to extract structured JSON from LLM output."""
    # Strategy 1: direct parse
    try:
        data = json.loads(raw)
        return _validate(data)
    except (json.JSONDecodeError, Exception):
        pass

    # Strategy 2: extract JSON block from markdown fences
    match = re.search(r"```(?:json)?\s*\n?(.*?)\n?```", raw, re.DOTALL)
    if match:
        try:
            data = json.loads(match.group(1))
            return _validate(data)
        except (json.JSONDecodeError, Exception):
            pass

    # Strategy 3: find first { ... } block
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if match:
        try:
            data = json.loads(match.group(0))
            return _validate(data)
        except (json.JSONDecodeError, Exception):
            pass

    # Strategy 4: field-by-field regex extraction
    return _extract_fields(raw)


def _validate(data: dict) -> NoticeAnalysis:
    if "required_actions" in data:
        actions = []
        for a in data["required_actions"]:
            if isinstance(a, str):
                actions.append(ActionItem(action=a))
            elif isinstance(a, dict):
                actions.append(ActionItem(**a))
        data["required_actions"] = actions

    if "evidence" in data:
        evidence = []
        for e in data["evidence"]:
            if isinstance(e, dict):
                evidence.append(EvidenceItem(**e))
        data["evidence"] = evidence

    return NoticeAnalysis(**data)


def _extract_fields(raw: str) -> NoticeAnalysis:
    """Last-resort regex extraction for when JSON parsing completely fails."""

    def find(pattern: str, default: str = "") -> str:
        m = re.search(pattern, raw, re.IGNORECASE)
        return m.group(1).strip() if m else default

    doc_type = find(r'"doc_type"\s*:\s*"([^"]+)"', "unknown")
    urgency = find(r'"urgency"\s*:\s*"([^"]+)"', "medium")
    deadline = find(r'"deadline"\s*:\s*"([^"]+)"') or None
    summary = find(r'"summary"\s*:\s*"([^"]+)"', raw[:500])

    return NoticeAnalysis(
        doc_type=doc_type,
        urgency=urgency,
        deadline=deadline,
        summary=summary,
        confidence=0.3,
    )
