from langchain_text_splitters import RecursiveCharacterTextSplitter

def split_text(text: str):
    """Split large textbook into manageable chunks."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    return splitter.split_text(text)
