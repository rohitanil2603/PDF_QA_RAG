import os
import chromadb

from dotenv import load_dotenv
from openai import OpenAI
from embedding_model import embed_model

load_dotenv()

# OpenRouter client
client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)


# ChromaDB
db = chromadb.PersistentClient(
    path="./chroma_db"
)


def ask_question(question):

    try:
        collection = db.get_collection("book")
    except Exception:
        return "No document has been uploaded yet."

    query_embedding = embed_model.encode(
        question
    ).tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=5
    )

    documents = results.get("documents", [[]])

    if not documents or len(documents[0]) == 0:
        return "I could not find relevant information in the document."
    

    context = "\n\n".join(
        documents[0]
    )
    print("\nRetrieved Chunks:\n")
    print(context[:1000])

    prompt = f"""
You are a document analysis assistant.

Answer ONLY using the provided context.

If the answer is not present in the context, reply exactly:

I could not find that information in the document.

Formatting:
- Use Markdown.
- For short factual questions, answer directly.
- For summaries, use headings and bullet points.
- Do not invent information.
- Keep responses concise.

Context:
{context}

Question:
{question}
"""

    MODELS = [
        "qwen/qwen3-4b:free",
        "openai/gpt-oss-120b:free"
    ]

    for model in MODELS:

        try:

            print(f"Trying model: {model}")

            response = client.chat.completions.create(
                model=model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            print(f"Success with {model}")

            return response.choices[0].message.content

        except Exception as e:

            print(f"{model} failed: {e}")

    return "All available models are currently busy. Please try again."