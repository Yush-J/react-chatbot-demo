from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import datetime

app = FastAPI(title="Chatbot Demo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Msg(BaseModel):
    id: str
    role: str
    content: str
    timestamp: int

class ChatReq(BaseModel):
    messages: List[Msg]

FAQ = [
    {
        "title": "What is RAG?",
        "body": "RAG (Retrieval-Augmented Generation) combines information retrieval with generation. The system retrieves relevant documents and feeds them into the LLM to ground responses.",
        "url": "https://en.wikipedia.org/wiki/Augmented_language_models"
    },
    {
        "title": "FastAPI basics",
        "body": "FastAPI is a modern, fast web framework for building APIs with Python 3.7+ based on standard Python type hints.",
        "url": "https://fastapi.tiangolo.com/"
    },
    {
        "title": "React Hooks",
        "body": "Hooks like useState and useEffect let you use state and lifecycle in function components.",
        "url": "https://react.dev/learn"
    },
]

def simple_search(query: str):
    q = query.lower()
    scored = []
    for doc in FAQ:
        score = sum(q.count(w) for w in doc["body"].lower().split())
        score += doc["title"].lower().count(q)
        if any(k in q for k in ["rag", "retrieval"]):
            if "rag" in doc["title"].lower():
                score += 5
        if any(k in q for k in ["fastapi"]):
            if "fastapi" in doc["title"].lower():
                score += 5
        if any(k in q for k in ["react", "hooks"]):
            if "react hooks" in doc["title"].lower():
                score += 5
        if score > 0:
            scored.append((score, doc))
    scored.sort(key=lambda x: -x[0])
    return [d for _, d in scored][:3]

@app.post("/api/chat")
def chat(req: ChatReq):
    user_msg = next((m for m in reversed(req.messages) if m.role == "user"), None)
    if not user_msg:
        return {"content": "Tell me something!", "sources": []}

    text = user_msg.content.strip()

    # toy tools
    if text.lower().startswith("time"):
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return {"content": f"The current local time is {now}.", "sources": []}

    if text.lower().startswith("weather"):
        city = text.split(" ", 1)[1] if " " in text else "your city"
        return {"content": f"(Mock) The weather in {city} is sunny with a high of 25°C.", "sources": []}

    # mock RAG
    hits = simple_search(text)
    if hits:
        body_parts = [f"- {h['title']}: {h['body']}" for h in hits]
        sources = [{"title": h["title"], "url": h["url"]} for h in hits]
        content = "Here's what I found via (mock) retrieval:\n" + "\n".join(body_parts)
        return {"content": content, "sources": sources}

    return {"content": "I didn't find anything specific. Try asking about RAG, FastAPI, React Hooks, `time`, or `weather Boston`.", "sources": []}
