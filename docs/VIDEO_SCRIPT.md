# SchoolBridge Video Script (3 minutes)

## [0:00-0:15] HOOK

> "Every week, millions of parents receive school notices they can't fully understand. Language barriers, dense jargon, buried deadlines. SchoolBridge changes that in seconds."

*Visual: Quick montage of 3-4 school notice photos stacking up*

## [0:15-0:45] THE PROBLEM

> "In the US alone, 5.3 million students are English learners. Federal law says schools must communicate in languages parents understand, but in practice, parents get notices like this..."

*Visual: Show a real-looking permission slip full of jargon*

> "...and they miss deadlines, miss field trips, miss meetings, because they couldn't parse three pages of legalese."

## [0:45-1:30] THE DEMO

> "SchoolBridge fixes this. Upload a photo of any school notice..."

*Screen recording: drag a permission slip photo into SchoolBridge*

> "...and instantly get three things:"

*Show the three cards appearing:*

> "First: What This Means. A clear, warm explanation in your language."

*Click language picker to Spanish, show translation*

> "Second: What You Need To Do. A checklist with deadlines you can actually act on."

*Show the action checklist with checkboxes*

> "Third: A ready-to-send reply back to the school."

*Show the reply card, click Copy*

> "Every claim links back to the original notice. And if you'd rather listen..."

*Click Read Aloud button, brief audio plays*

## [1:30-2:00] TECHNICAL ARCHITECTURE

> "Under the hood: we fine-tuned Gemma 4 E4B with Unsloth using QLoRA on 560 synthetic school notices across 8 categories."

*Show architecture diagram: OCR -> Gemma 4 -> JSON -> Tools -> UI*

> "The model runs locally through Ollama. Your child's school data never leaves your computer."

> "It's not just chat — it's a real agentic pipeline: structured extraction, tool calls for policy lookup, checklist generation, reply drafting, and multilingual text-to-speech."

## [2:00-2:30] RESULTS

> "We benchmarked against 10 test notices across all categories."

*Show comparison table: base model vs fine-tuned*

> "Fine-tuning improved deadline extraction by X%, action recall by Y%, and reduced JSON parse failures to zero."

## [2:30-2:50] IMPACT

> "SchoolBridge serves the families who need it most: ESL parents, single parents juggling two jobs, families new to the school system. It's local-first, private, and runs on a laptop."

## [2:50-3:00] CLOSING

> "SchoolBridge. Because every parent deserves to understand what their child's school is telling them."

*Show: GitHub URL, Kaggle link, "Built with Gemma 4 — Open Source"*
