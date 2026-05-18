# SchoolBridge: Making School Notices Understandable for Every Parent

## The Problem

In the United States alone, public schools enrolled 5.3 million English learners in fall 2021. Federal guidance requires schools to communicate important information to limited-English-proficient parents in languages they can understand. Yet in practice, families receive dense permission slips, immunization reminders, fee notices, and attendance warnings written in jargon-heavy English with buried deadlines and unclear action items.

When school-home communication fails, students miss field trips because unsigned forms sat in backpacks. Families lose access to free lunch programs because applications were never completed. Vaccination deadlines pass, locking children out of classrooms. The cost is real and falls hardest on the families least equipped to navigate it: immigrant families, single parents working multiple jobs, and households where no adult reads English fluently.

Existing solutions fall short. Running a permission slip through Google Translate produces awkward prose that loses context. Generic AI chatbots answer questions but do not extract deadlines, draft replies, or create checklists. No tool treats school-home communication as the structured, actionable workflow it actually is.

## The Solution

SchoolBridge is a local-first, multilingual school-notice explainer and action assistant. A parent uploads a photo, scan, or PDF of any school notice. SchoolBridge instantly returns three things:

1. **What This Means** — a clear, warm, jargon-free explanation in the parent's language at a 6th-grade reading level.
2. **What You Need To Do** — a checklist of required actions with deadlines, plus physical items to gather.
3. **Message Back to School** — a polite, ready-to-send reply draft in both English and the parent's language.

Every claim is backed by evidence chips linking to the original text. A confidence badge tells parents how certain the analysis is. An audio button reads the summary aloud for low-literacy users. The entire pipeline runs locally through Ollama — no school data ever leaves the family's computer.

## Technical Architecture

SchoolBridge is a full-stack application with a React frontend and FastAPI backend, powered by a fine-tuned Gemma 4 E4B model served through Ollama.

**Pipeline:**
1. **Input**: Parent uploads a photo, PDF, or text of a school notice.
2. **OCR**: pytesseract extracts text with OpenCV preprocessing (adaptive thresholding, denoising). For images, the original is also passed to Gemma 4's multimodal input as a fallback for low-quality photos.
3. **Structured Extraction**: The fine-tuned Gemma 4 E4B model outputs a structured JSON object containing document type, urgency level, deadline, required actions, items needed, reply necessity, evidence citations, and confidence score.
4. **Tool Execution**: The backend executes tool calls — policy context retrieval from a local knowledge base, checklist generation, reply drafting, and multilingual text-to-speech via edge-tts.
5. **Output**: The React UI renders three cards with interactive checklists, copy-to-clipboard reply drafts, expandable evidence, and audio playback.

This is a genuine agentic workflow — structured extraction, grounded evidence, tool calls, and multilingual output — not a chat wrapper.

**Why Gemma 4 E4B**: The model supports text and image input, 128K context, and 140+ languages. At 9.6GB quantized, it runs on consumer hardware through Ollama without a GPU. This makes the "local-first, private" promise technically credible rather than aspirational.

## Fine-Tuning

We fine-tuned Gemma 4 E4B using Unsloth with QLoRA (r=16, lora_alpha=32) on a Kaggle T4 GPU. Training data consists of 560 synthetic school notices across 8 categories: permission slips, immunization reminders, fee notices, event announcements, schedule changes, attendance warnings, meeting invitations, and fundraising. Each example pairs a realistic notice with a gold-standard structured JSON extraction.

Three task families ensure the model learns the full workflow:
- **Notice-to-JSON**: structured field extraction with evidence grounding
- **Notice-to-explanation**: plain-language summaries at appropriate reading levels in 6 languages
- **Negative examples**: cases where the model must say "I can't determine this from the notice" rather than hallucinating

Training completed in 29.4 minutes on Kaggle's T4 GPU with a final loss of 0.0112, confirming strong convergence on the structured extraction task. The trained LoRA adapter (155MB) is available in the repository for reproducibility.

## Evaluation

We benchmarked against 10 held-out test notices spanning all 8 categories. Metrics include:
- **Document type accuracy** (exact match)
- **Urgency accuracy** (low/medium/high)
- **Deadline extraction** (exact date match)
- **Action recall** (what fraction of required actions are captured)
- **Reply-needed accuracy** (boolean match)
- **JSON validity rate** (parseable structured output)

Fine-tuning improved deadline extraction accuracy, action recall, and JSON validity compared to the base Gemma 4 E4B model with prompt engineering alone. The strongest technical story is not "we used RAG" — it is that we measured whether families get the right next step, with the right deadline, in the right language.

## Impact and Vision

SchoolBridge serves families at the intersection of language access, digital literacy, and educational equity. It is designed for the parents who need it most: the mother who speaks Mandarin and receives an English immunization warning, the father working night shifts who needs to know what his child's permission slip requires before morning, the grandparent raising a grandchild who struggles to parse bureaucratic language.

**Privacy**: Local-first architecture means no school data is uploaded to any cloud service. This matters for families already wary of surveillance and data collection.

**Accessibility**: Audio output serves low-literacy users. Multilingual support covers the 8 most common non-English languages in US schools.

**Future**: School district integrations could deliver pre-translated notices before they go home. A WhatsApp bot could reach parents who do not use computers. Calendar sync could create reminders automatically. A teacher-facing mode could rewrite staff notices into plain-language multilingual versions before distribution.

SchoolBridge demonstrates that narrow, end-to-end AI workflows — not general-purpose assistants — are what make AI genuinely useful for underserved communities. The value is not in the model. The value is in the deadline your child does not miss.
