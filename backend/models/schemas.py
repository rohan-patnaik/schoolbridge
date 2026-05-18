from pydantic import BaseModel, Field
from typing import Optional


class EvidenceItem(BaseModel):
    claim: str
    source_quote: str


class ActionItem(BaseModel):
    action: str
    deadline: Optional[str] = None


class NoticeAnalysis(BaseModel):
    doc_type: str = Field(description="e.g. field_trip_permission, immunization_reminder, fee_notice")
    urgency: str = Field(description="low, medium, or high")
    deadline: Optional[str] = None
    summary: str = Field(description="Plain-language explanation for parents")
    required_actions: list[ActionItem] = []
    items_needed: list[str] = []
    reply_needed: bool = False
    reply_draft: Optional[str] = None
    evidence: list[EvidenceItem] = []
    confidence: float = Field(default=0.5, ge=0.0, le=1.0)


class ProcessNoticeRequest(BaseModel):
    target_language: str = "en"


class ProcessNoticeResponse(BaseModel):
    analysis: NoticeAnalysis
    ocr_text: str
    audio_url: Optional[str] = None
    processing_time_ms: int
