import torch
from transformers import AutoTokenizer, T5ForConditionalGeneration

# -------------------------
# Config
# -------------------------
MODEL_PATH = "ml_model/distractor_model/model"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# -------------------------
# Load model
# -------------------------
print("Loading distractor model...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = T5ForConditionalGeneration.from_pretrained(MODEL_PATH).to(DEVICE)
model.eval()
print("Model loaded.\n")

# -------------------------
# Distractor generation (robust)
# -------------------------
def generate_distractors(
    context: str,
    question: str,
    correct_answer: str,
    num_distractors: int = 3,
    max_attempts: int = 5,
    base_temperature: float = 0.7
):
    collected = set()

    for attempt in range(max_attempts):
        temperature = min(base_temperature + 0.1 * attempt, 1.2)

        prompt = (
            "Generate incorrect but plausible answer options.\n"
            f"Context:\n{context}\n\n"
            f"Question:\n{question}\n\n"
            f"Correct Answer:\n{correct_answer}\n"
        )

        inputs = tokenizer(
            prompt,
            return_tensors="pt",
            truncation=True,
            max_length=512
        ).to(DEVICE)

        outputs = model.generate(
            **inputs,
            max_length=64,
            do_sample=True,
            temperature=temperature,
            top_p=0.9,
            num_beams=1
        )

        decoded = tokenizer.decode(outputs[0], skip_special_tokens=True)
        candidates = [c.strip() for c in decoded.split(",")]

        for c in candidates:
            if (
                c.lower() != correct_answer.lower()
                and len(c) > 2
                and c not in collected
            ):
                collected.add(c)

        if len(collected) >= num_distractors:
            break

    # Fallback (rare but safe)
    if len(collected) < num_distractors:
        collected.update(
            [f"Option {i}" for i in range(len(collected) + 1, num_distractors + 1)]
        )

    return list(collected)[:num_distractors]


# -------------------------
# Example usage
# -------------------------
if __name__ == "__main__":
    context = "Photosynthesis is the process by which green plants make food."
    question = "What is the process by which green plants make food?"
    answer = "Photosynthesis"

    distractors = generate_distractors(context, question, answer)
    print(distractors)

    print("Correct Answer:", answer)
    print("Distractors:")
    for i, d in enumerate(distractors, 1):
        print(f"{i}. {d}")
