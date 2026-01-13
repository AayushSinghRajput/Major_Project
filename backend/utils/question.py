import torch
from transformers import AutoTokenizer, T5ForConditionalGeneration

# -------------------------
# Config
# -------------------------
MODEL_PATH = "ml_model/question_model/model"   # change if needed

pipeline_max_length = 256
pipeline_min_length = 20
pipeline_temperature = 0.5
# DEVICE = 0 if torch.cuda.is_available() else -1
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"


# -------------------------
# Load model ONCE
# -------------------------
print("Loading fine-tuned QG model...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = T5ForConditionalGeneration.from_pretrained(MODEL_PATH).to(DEVICE)
model.eval()

# -------------------------
# Question generation function
# -------------------------
def generate_question(
    context: str,
    answer: str,
    max_length: int = pipeline_max_length,
    temperature: float = 0.5
) -> str:
    prompt = (
        "Generate a clear, natural exam-style question.\n"
        f"Context: {context}\n"
        f"Answer: {answer}"
    )

    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        truncation=True,
        max_length=512
    ).to(DEVICE)

    outputs = model.generate(
        **inputs,
        max_length=max_length,
        do_sample=True,
        temperature=temperature,
        top_p=0.9,
        num_beams=1
    )

    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# -------------------------
# Example usage
# -------------------------
if __name__ == "__main__":
    context = "Ram hits Shyam."
    answer = "Ram"

    question = generate_question(context, answer)
    print("Generated Question:")
    print(question)
   
