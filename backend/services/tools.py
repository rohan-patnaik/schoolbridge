import json
import os
from backend.models.schemas import NoticeAnalysis

POLICY_DB_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)), "data", "school_policies.json"
)


def _load_policies() -> dict:
    if os.path.exists(POLICY_DB_PATH):
        with open(POLICY_DB_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def retrieve_policy_context(doc_type: str) -> str | None:
    policies = _load_policies()
    return policies.get(doc_type)


def create_checklist(analysis: NoticeAnalysis) -> list[dict]:
    items = []
    for i, action in enumerate(analysis.required_actions):
        items.append(
            {
                "id": i + 1,
                "task": action.action,
                "deadline": action.deadline,
                "completed": False,
            }
        )
    for item in analysis.items_needed:
        items.append(
            {
                "id": len(items) + 1,
                "task": f"Gather: {item}",
                "deadline": analysis.deadline,
                "completed": False,
            }
        )
    return items


def draft_reply(analysis: NoticeAnalysis, parent_lang: str) -> str | None:
    if not analysis.reply_needed:
        return None
    if analysis.reply_draft:
        return analysis.reply_draft
    return (
        f"Dear School,\n\n"
        f"Thank you for the notice regarding {analysis.doc_type.replace('_', ' ')}. "
        f"I have reviewed the information and will complete the required actions"
        f"{' by ' + analysis.deadline if analysis.deadline else ''}.\n\n"
        f"Please let me know if you need anything else.\n\n"
        f"Sincerely,\n[Parent Name]"
    )
