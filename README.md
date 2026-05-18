# SchoolBridge

**Making school notices understandable for every parent.**

SchoolBridge is a local-first, multilingual school-notice explainer and action assistant. Upload a photo of a permission slip, immunization reminder, or any school notice — get a clear explanation in your language, a checklist of what to do, and a ready-to-send reply.

Built with **Gemma 4 E4B** (fine-tuned with Unsloth), served locally via **Ollama**. Your data never leaves your computer.

## Features

- **Instant Analysis** — Upload a photo, scan, or PDF of any school notice
- **Three-Card Output** — "What this means" / "What you need to do" / "Message back to school"
- **8 Languages** — English, Spanish, Chinese, Arabic, Hindi, French, Vietnamese, Korean
- **Evidence Grounding** — Every claim links back to the original notice text
- **Audio Playback** — Read-aloud for low-literacy accessibility
- **Interactive Checklists** — Track your action items with deadlines
- **Local-First** — Runs entirely on your machine via Ollama

## Quick Start

### Prerequisites

- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [Ollama](https://ollama.com/)
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)

### 1. Install Ollama and pull Gemma 4

```bash
# Install Ollama from https://ollama.com
ollama pull gemma4:e4b
```

### 2. Start the backend

```bash
cd backend
pip install -r requirements.txt
cd ..
uvicorn backend.main:app --reload --port 8000
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Open http://localhost:5173

Upload a school notice or try one of the built-in samples.

## Fine-Tuned Model (Optional)

For better accuracy, use the fine-tuned SchoolBridge model. See [training/README.md](training/README.md) for instructions.

```bash
# After fine-tuning and exporting GGUF:
ollama create schoolbridge -f Modelfile
OLLAMA_MODEL=schoolbridge uvicorn backend.main:app --reload
```

## Architecture

```
Photo/PDF → OCR (pytesseract) → Gemma 4 E4B → Structured JSON → Tools → Three-Card UI
                                     ↑                              ↓
                              Fine-tuned with              Policy lookup
                              Unsloth QLoRA               Checklist generation
                              Served via Ollama            Reply drafting
                                                           Multilingual TTS
```

## Project Structure

```
schoolbridge/
├── backend/          # FastAPI server (OCR, LLM, tools, TTS)
├── frontend/         # React + Tailwind UI
├── training/         # Synthetic data generation + Kaggle fine-tuning notebook
├── eval/             # Benchmark framework (test cases + metrics)
├── docs/             # Writeup and video script
├── assets/           # Architecture diagrams and screenshots
├── Modelfile         # Ollama model configuration
└── LICENSE           # CC-BY 4.0
```

## Evaluation

```bash
python -m eval.benchmark --model gemma4:e4b --output eval/results/base.json
python -m eval.benchmark --model schoolbridge:latest --output eval/results/tuned.json --compare eval/results/base.json
```

## License

CC-BY 4.0 — see [LICENSE](LICENSE).

## Acknowledgments

- [Gemma 4](https://ai.google.dev/gemma) by Google
- [Unsloth](https://unsloth.ai/) for efficient fine-tuning
- [Ollama](https://ollama.com/) for local model serving
- Built for the [Gemma 4 Good Hackathon](https://www.kaggle.com/competitions/gemma-4-good-hackathon)
