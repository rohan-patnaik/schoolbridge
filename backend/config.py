import os
from dotenv import load_dotenv

load_dotenv()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma4:e4b")
AUDIO_CACHE_DIR = os.path.join(os.path.dirname(__file__), "audio_cache")
SUPPORTED_LANGUAGES = {
    "en": "English",
    "es": "Spanish",
    "zh": "Chinese (Simplified)",
    "ar": "Arabic",
    "hi": "Hindi",
    "fr": "French",
    "vi": "Vietnamese",
    "ko": "Korean",
}
DEFAULT_LANGUAGE = "en"
MAX_RETRIES = 2
