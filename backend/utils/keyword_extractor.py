import torch
from transformers import (
    AutoModelForTokenClassification,
    AutoTokenizer,
    TokenClassificationPipeline
)
from transformers.pipelines.token_classification import AggregationStrategy
from peft import PeftConfig, PeftModel

# -------------------------
# Config
# -------------------------
MODEL_PATH = "ml_model/keyword_model/model"
DEVICE = 0 if torch.cuda.is_available() else -1

# -------------------------
# Load model ONCE
# -------------------------
print("Loading keyword extraction model...")

peft_config = PeftConfig.from_pretrained(MODEL_PATH)

base_model = AutoModelForTokenClassification.from_pretrained(
    peft_config.base_model_name_or_path
)

tokenizer = AutoTokenizer.from_pretrained(
    peft_config.base_model_name_or_path
)
tokenizer.pad_token = tokenizer.eos_token

peft_model = PeftModel.from_pretrained(base_model, MODEL_PATH)
model = peft_model.merge_and_unload()

print("Keyword model loaded.")
print(f"Device set to use {'cuda' if DEVICE == 0 else 'cpu'}\n")

# -------------------------
# Custom Pipeline
# -------------------------
class KeyphraseExtractionPipeline(TokenClassificationPipeline):
    def __init__(self, model, max_keywords=None, *args, **kwargs):
        super().__init__(model=model, tokenizer=tokenizer, *args, **kwargs)
        self.max_keywords = max_keywords

    def postprocess(self, model_outputs):
        results = super().postprocess(
            model_outputs,
            aggregation_strategy=AggregationStrategy.FIRST,
        )

        keyword_scores = {}

        for r in results:
            word = r["word"].strip()
            score = r.get("score", 0.0)

            if word and (word not in keyword_scores or score > keyword_scores[word]):
                keyword_scores[word] = score

        sorted_keywords = sorted(
            keyword_scores.keys(),
            key=lambda x: keyword_scores[x],
            reverse=True
        )

        if self.max_keywords:
            sorted_keywords = sorted_keywords[:self.max_keywords]

        return sorted_keywords


# -------------------------
# Keyword extraction function
# -------------------------
def extract_keywords(
    text: str,
    num_keywords: int = 5
):
    """
    Extract top N keywords from text.
    """
    extractor = KeyphraseExtractionPipeline(
        model=model,
        device=DEVICE,
        max_keywords=num_keywords
    )

    return extractor(text)


# -------------------------
# Example usage
# -------------------------
if __name__ == "__main__":
    text = """
    Nepal is a landlocked country in South Asia.
    Nepal is home to Mount Everest and rich cultural heritage.
    """

    keywords = extract_keywords(text, num_keywords=5)
    print(keywords)
    print("Keywords:")
    for i, kw in enumerate(keywords, 1):
        print(f"{i}. {kw}")
