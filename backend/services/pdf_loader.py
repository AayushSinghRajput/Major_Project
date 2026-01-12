import json
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.prompts import ChatPromptTemplate
from core.llm import get_llm
from models.Pdf import TableOfContents

load_dotenv()

# ---------------------------
# Initialize Gemini LLM
# ---------------------------
llm = get_llm(temperature=0.5)


structured_llm = llm.with_structured_output(TableOfContents)

# ---------------------------
#  Create Enhanced Prompt
# ---------------------------
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """You are an expert at extracting structured table of contents from documents.

IMPORTANT RULES:
1. Extract ALL content including front matter (preface, list of figures, acknowledgments, etc.)
2. For front matter (non-numbered sections), set "unit" to null
3. For numbered units/chapters, use the actual unit number
4. Include all sections with their correct page numbers
5. Be thorough - don't skip any sections
6. Maintain the document's original order

Example structure:
- Front matter: unit=null, title="Preface", sections=[...]
- Chapter 1: unit=1, title="Introduction", sections=[...]
- Chapter 2: unit=2, title="Biology Basics", sections=[...]
""",
        ),
        (
            "user",
            """Extract the complete table of contents from this document:

{document_content}""",
        ),
    ]
)

chain = prompt | structured_llm


# ---------------------------
# Main Function
# ---------------------------


def extract_toc(file_path: str, output_path: str) -> str:
    """
    Extracts TOC from PDF and saves as JSON.
    output_path MUST be provided (hash-based).
    Returns: path to saved JSON file.
    """

    loader = PyPDFLoader(file_path)
    docs = loader.load()

    # Use only first part to extract TOC
    toc_text = " ".join(doc.page_content for doc in docs[: len(docs) // 12])

    try:
        result: TableOfContents = chain.invoke({"document_content": toc_text})
        toc_dict = result.model_dump()

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(toc_dict, f, indent=4, ensure_ascii=False)

        return output_path

    except Exception as e:
        with open("error_log.txt", "w", encoding="utf-8") as f:
            import traceback

            f.write(traceback.format_exc())

        raise RuntimeError("TOC extraction failed. See error_log.txt") from e
