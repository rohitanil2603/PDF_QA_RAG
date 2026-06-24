import os
import fitz
import chromadb

from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from langchain_text_splitters import RecursiveCharacterTextSplitter
from embedding_model import embed_model

load_dotenv()

PDF_PATH = "data/current.pdf"

if not os.path.exists(PDF_PATH):
    raise FileNotFoundError(
        f"PDF not found: {PDF_PATH}"
    )


print("Reading PDF...")

pdf = fitz.open(PDF_PATH)

text = ""

for page in pdf:
    text += page.get_text()

pdf.close()

print("Splitting text into chunks...")

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
)

chunks = splitter.split_text(text)

print(f"Total Chunks: {len(chunks)}")

print("Creating embeddings...")

db = chromadb.PersistentClient(
    path="./chroma_db"
)

try:
    db.delete_collection("book")
    print("Old collection deleted")
except:
    pass

collection = db.create_collection(
    name="book"
)

for i, chunk in enumerate(chunks):

    embedding = embed_model.encode(
        chunk
    ).tolist()

    collection.add(
        ids=[str(i)],
        documents=[chunk],
        embeddings=[embedding]
    )

    print(
        f"Stored {i + 1}/{len(chunks)}"
    )

print("\nEmbedding complete")
print("ChromaDB updated successfully")