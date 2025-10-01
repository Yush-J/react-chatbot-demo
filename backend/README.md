# FastAPI backend (mock LLM / simple RAG)

Run:
```bash
python -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
The frontend proxies `/api` to http://localhost:8000 via `vite.config.ts`.
