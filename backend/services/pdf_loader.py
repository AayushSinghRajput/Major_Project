from typing import Dict, Any
import tempfile
import os

from langchain_community.document_loaders import PyPDFLoader
from core.llm import get_llm
from models.Pdf import TableOfContents

llm = get_llm(temperature=0.5)
structured_llm = llm.with_structured_output(TableOfContents)


def extract_toc(file_bytes: bytes) -> Dict[str, Any]:
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    try:
        loader = PyPDFLoader(tmp_path)
        docs = loader.load()

        toc_text = " ".join(
            doc.page_content for doc in docs[: max(1, len(docs) // 12)]
        )

        prompt = f"""
You are extracting a Table of Contents from a textbook.

Rules:
- Respond ONLY in valid JSON
- Match the EXACT schema
- Do NOT add explanations

Schema:
{TableOfContents.model_json_schema()}

Document:
{toc_text}
"""

        toc_result: TableOfContents = structured_llm.invoke(prompt)
        return toc_result.model_dump()

    except Exception as e:
        # graceful fallback
        return {
            "toc": [
                {
                    "title": "Unstructured Content",
                    "sections": [
                        {"title": "Manual Review Required", "page": None}
                    ],
                }
            ]
        }

    finally:
        os.remove(tmp_path)
