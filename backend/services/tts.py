import os
import hashlib
import edge_tts
from backend.config import AUDIO_CACHE_DIR

VOICE_MAP = {
    "en": "en-US-AriaNeural",
    "es": "es-MX-DaliaNeural",
    "zh": "zh-CN-XiaoxiaoNeural",
    "ar": "ar-SA-ZariyahNeural",
    "hi": "hi-IN-SwaraNeural",
    "fr": "fr-FR-DeniseNeural",
    "vi": "vi-VN-HoaiMyNeural",
    "ko": "ko-KR-SunHiNeural",
}


async def generate_audio(text: str, language: str) -> str:
    os.makedirs(AUDIO_CACHE_DIR, exist_ok=True)
    text_hash = hashlib.md5(f"{language}:{text}".encode()).hexdigest()
    filename = f"{text_hash}.mp3"
    filepath = os.path.join(AUDIO_CACHE_DIR, filename)

    if os.path.exists(filepath):
        return filename

    voice = VOICE_MAP.get(language, VOICE_MAP["en"])
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(filepath)
    return filename
