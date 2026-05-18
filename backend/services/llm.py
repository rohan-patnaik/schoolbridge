import json
import os
import httpx
from backend.config import OLLAMA_BASE_URL, OLLAMA_MODEL, MAX_RETRIES, SUPPORTED_LANGUAGES
from backend.services.structured_output import parse_analysis
from backend.models.schemas import NoticeAnalysis

PROMPTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "prompts")


def _load_prompt(name: str) -> str:
    with open(os.path.join(PROMPTS_DIR, name), "r", encoding="utf-8") as f:
        return f.read()


def _is_finetuned_model() -> bool:
    return "schoolbridge" in OLLAMA_MODEL.lower()


def _build_messages(
    ocr_text: str, target_language: str, base64_image: str | None
) -> list[dict]:
    lang_name = SUPPORTED_LANGUAGES.get(target_language, "English")

    if _is_finetuned_model():
        system = (
            "You are SchoolBridge, a school notice analyzer. "
            "Extract structured information and respond in valid JSON only."
        )
        user_content = f"Analyze this school notice:\n\n{ocr_text}\n\nTarget language: {lang_name}"
    else:
        system = _load_prompt("system_prompt.txt")
        extraction = _load_prompt("extraction_prompt.txt")
        user_content = extraction.replace("{{NOTICE_TEXT}}", ocr_text).replace(
            "{{TARGET_LANGUAGE}}", lang_name
        )

    messages = [{"role": "system", "content": system}]

    if base64_image:
        messages.append(
            {
                "role": "user",
                "content": user_content,
                "images": [base64_image],
            }
        )
    else:
        messages.append({"role": "user", "content": user_content})

    return messages


async def analyze_notice(
    ocr_text: str,
    target_language: str = "en",
    base64_image: str | None = None,
) -> NoticeAnalysis:
    messages = _build_messages(ocr_text, target_language, base64_image)

    for attempt in range(MAX_RETRIES + 1):
        async with httpx.AsyncClient(timeout=300.0) as client:
            resp = await client.post(
                f"{OLLAMA_BASE_URL}/api/chat",
                json={
                    "model": OLLAMA_MODEL,
                    "messages": messages,
                    "stream": False,
                    "options": {"temperature": 0.1, "num_predict": 2048},
                },
            )
            resp.raise_for_status()
            raw = resp.json()["message"]["content"]

        try:
            return parse_analysis(raw)
        except Exception:
            if attempt < MAX_RETRIES:
                messages.append({"role": "assistant", "content": raw})
                messages.append(
                    {
                        "role": "user",
                        "content": (
                            "Your previous response was not valid JSON. "
                            "Please respond with ONLY a valid JSON object matching the schema."
                        ),
                    }
                )
            else:
                raise

    raise RuntimeError("Failed to get valid structured output from LLM")
