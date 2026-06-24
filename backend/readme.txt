python3 -m venv venv

# Activate it
source venv/bin/activate

### to start server
uvicorn app:app --reload

visit -   http://127.0.0.1:8000