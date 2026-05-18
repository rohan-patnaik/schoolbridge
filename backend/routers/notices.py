import time
from fastapi import APIRouter, UploadFile, File, Form
from backend.models.schemas import ProcessNoticeResponse
from backend.services.ocr import extract_text
from backend.services.llm import analyze_notice
from backend.services.tools import retrieve_policy_context, create_checklist, draft_reply
from backend.services.tts import generate_audio

router = APIRouter(prefix="/api", tags=["notices"])


@router.post("/process-notice", response_model=ProcessNoticeResponse)
async def process_notice(
    file: UploadFile = File(...),
    target_language: str = Form("en"),
):
    start = time.perf_counter()
    file_bytes = await file.read()
    content_type = file.content_type or "image/jpeg"

    ocr_text, base64_image = extract_text(file_bytes, content_type)

    analysis = await analyze_notice(
        ocr_text=ocr_text,
        target_language=target_language,
        base64_image=base64_image,
    )

    policy = retrieve_policy_context(analysis.doc_type)
    if policy:
        analysis.summary += f"\n\nSchool policy note: {policy}"

    if not analysis.reply_draft and analysis.reply_needed:
        analysis.reply_draft = draft_reply(analysis, target_language)

    checklist = create_checklist(analysis)

    audio_url = None
    if analysis.summary:
        audio_filename = await generate_audio(analysis.summary, target_language)
        audio_url = f"/api/audio/{audio_filename}"

    elapsed_ms = int((time.perf_counter() - start) * 1000)

    return ProcessNoticeResponse(
        analysis=analysis,
        ocr_text=ocr_text,
        audio_url=audio_url,
        processing_time_ms=elapsed_ms,
    )
