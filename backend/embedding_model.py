# embedding_model.py

from sentence_transformers import SentenceTransformer

embed_model = SentenceTransformer(
    "BAAI/bge-small-en-v1.5"
)