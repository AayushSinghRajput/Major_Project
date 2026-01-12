from langchain_google_genai import ChatGoogleGenerativeAI
from core.config import settings
# from langchain_groq import ChatGroq

# 🔁 Change model/provider ONLY HERE
def get_llm(
    temperature: float = 0.3,
    structured: bool = False,
    output_schema=None,
):
    """
    Central LLM factory.
    Switch provider/model here without touching services.
    """

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=settings.GOOGLE_API_KEY,
        temperature=temperature,
    )

    # llm = ChatGroq(
    #     model_name="llama-3.3-70b-versatile",
    #     temperature=temperature,
    #     groq_api_key=settings.GROQ_API_KEY,
    # )

    if structured and output_schema:
        return llm.with_structured_output(output_schema)

    return llm
