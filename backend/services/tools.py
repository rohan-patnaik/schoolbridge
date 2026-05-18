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


FALLBACK_REPLIES: dict[str, str] = {
    "en": "Dear School,\n\nThank you for the notice regarding {topic}. I have reviewed the information and will complete the required actions{deadline_str}.\n\nPlease let me know if you need anything else.\n\nSincerely,\n[Parent Name]",
    "es": "Estimada Escuela,\n\nGracias por el aviso sobre {topic}. He revisado la información y completaré las acciones requeridas{deadline_str}.\n\nPor favor avísenme si necesitan algo más.\n\nAtentamente,\n[Nombre del padre]",
    "zh": "尊敬的学校：\n\n感谢您关于{topic}的通知。我已阅读相关信息，将按时完成所需的操作{deadline_str}。\n\n如需其他信息，请告知。\n\n此致，\n[家长姓名]",
    "ar": "عزيزي المدرسة،\n\nشكراً لكم على الإشعار بخصوص {topic}. لقد راجعت المعلومات وسأكمل الإجراءات المطلوبة{deadline_str}.\n\nيرجى إعلامي إذا كنتم بحاجة إلى أي شيء آخر.\n\nمع التحية،\n[اسم ولي الأمر]",
    "hi": "प्रिय स्कूल,\n\n{topic} के बारे में सूचना के लिए धन्यवाद। मैंने जानकारी की समीक्षा कर ली है और आवश्यक कार्रवाई पूरी करूँगा/करूँगी{deadline_str}।\n\nकृपया मुझे बताएं अगर आपको और कुछ चाहिए।\n\nसधन्यवाद,\n[अभिभावक का नाम]",
    "fr": "Chers responsables,\n\nMerci pour l'avis concernant {topic}. J'ai pris connaissance des informations et je compléterai les actions requises{deadline_str}.\n\nN'hésitez pas à me contacter si nécessaire.\n\nCordialement,\n[Nom du parent]",
    "vi": "Kính gửi Nhà trường,\n\nCảm ơn thông báo về {topic}. Tôi đã xem xét thông tin và sẽ hoàn thành các yêu cầu{deadline_str}.\n\nXin vui lòng cho tôi biết nếu cần thêm thông tin.\n\nTrân trọng,\n[Tên phụ huynh]",
    "ko": "학교에,\n\n{topic}에 대한 알림 감사합니다. 정보를 확인했으며 필요한 조치를 완료하겠습니다{deadline_str}.\n\n추가로 필요한 것이 있으면 알려주세요.\n\n감사합니다,\n[학부모 이름]",
}


def draft_reply(analysis: NoticeAnalysis, parent_lang: str) -> str | None:
    if not analysis.reply_needed:
        return None
    if analysis.reply_draft:
        return analysis.reply_draft
    topic = analysis.doc_type.replace("_", " ")
    deadline_str = f" by {analysis.deadline}" if analysis.deadline else ""
    template = FALLBACK_REPLIES.get(parent_lang, FALLBACK_REPLIES["en"])
    return template.format(topic=topic, deadline_str=deadline_str)
