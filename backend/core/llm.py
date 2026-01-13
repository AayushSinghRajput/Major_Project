from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq

from langchain_openai import AzureChatOpenAI

from core.config import settings


# 🔁 Change model/provider ONLY HERE
def get_llm(
    provider: str = "azure",   # 👈 switch here: gemini | groq | azure
    temperature: float = 0.3,
    structured: bool = False,
    output_schema=None,
):
    """
    Central LLM factory.
    Switch provider/model here without touching services.
    """

    # -------------------------------
    # Google Gemini (default)
    # -------------------------------
    if provider == "gemini":
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=temperature,
        )

    # -------------------------------
    # Groq (comment preserved)
    # -------------------------------
    elif provider == "groq":
        llm = ChatGroq(
            model_name="llama-3.3-70b-versatile",
            temperature=temperature,
            groq_api_key=settings.GROQ_API_KEY,
        )

    # -------------------------------
    # Azure OpenAI (NEW)
    # -------------------------------
    elif provider == "azure":
        llm = AzureChatOpenAI(
            azure_deployment=settings.AZURE_OPENAI_DEPLOYMENT,  # e.g. "gpt-5"
            azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
            api_key=settings.AZURE_OPENAI_API_KEY,
            api_version=settings.AZURE_OPENAI_API_VERSION,
            # temperature=temperature,
        )

    else:
        raise ValueError(f"Unsupported LLM provider: {provider}")

    # -------------------------------
    # Structured output (if supported)
    # -------------------------------
    if structured and output_schema:
        return llm.with_structured_output(output_schema)

    return llm
