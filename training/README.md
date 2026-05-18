# SchoolBridge Fine-Tuning

## Generate Training Data

```bash
cd schoolbridge
python training/generate_synthetic_data.py
```

This creates `training/data/train.jsonl` (~500 examples) and `training/data/val.jsonl` (~60 examples).

## Fine-Tune on Kaggle

1. Upload `training/data/train.jsonl` and `training/data/val.jsonl` as a Kaggle Dataset named "schoolbridge-training-data"
2. Upload `training/train_notebook.ipynb` as a new Kaggle Notebook
3. Enable GPU T4 accelerator in notebook settings
4. Run all cells (~2 hours)
5. Download the exported `.gguf` file from the output

## Import into Ollama

```bash
# Copy the GGUF file to the project root
cp schoolbridge-gemma4-e4b-unsloth.Q4_K_M.gguf ./schoolbridge-gemma4-e4b.gguf

# Create the Ollama model
ollama create schoolbridge -f Modelfile

# Test it
ollama run schoolbridge "Analyze this school notice: Your child has 5 absences."
```

## Switch the App to Fine-Tuned Model

```bash
# Set the environment variable
OLLAMA_MODEL=schoolbridge uvicorn backend.main:app --reload
```
