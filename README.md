# 📖 React + FastAPI Chatbot Demo

A full-stack **chatbot demo** with a React + TypeScript + Vite frontend and a Python FastAPI backend.  
This project demonstrates a simple end-to-end conversation flow: user input → frontend state management → backend API call → simulated RAG/tool responses → frontend incremental display.

---

## ✨ Design Philosophy

1. **Modularity & Simplicity**  
   - Clear separation of concerns:  
     - `components/` → UI (message list, input box)  
     - `state/` → global state management (ChatContext)  
     - `api.ts` → backend API wrapper  
   - Easy to maintain and extend.

2. **Modern React**  
   - Built with **functional components + Hooks** (`useReducer`, `useContext`, `useEffect`, `useMemo`).  
   - Global state is handled via Context, avoiding deep prop drilling.  

3. **Streaming Experience**  
   - The frontend simulates **token-by-token streaming**, so responses appear as if typed in real time.  

4. **Simulated RAG (Retrieval-Augmented Generation)**  
   - The backend contains a mock FAQ and a toy search function.  
   - Instead of a real vector database + LLM, it returns the most relevant FAQ entries to simulate retrieval.  
   - This design can later be swapped for real RAG (vector DB + model).  

5. **Frontend-Backend Decoupling**  
   - The frontend only calls `/api/chat`.  
   - Vite’s dev server proxies `/api` to FastAPI (`http://localhost:8000`), keeping services independent.  

6. **Extensible & Persistent**  
   - TypeScript ensures type safety.  
   - Chat state is persisted in `localStorage` for session continuity.  
   - Designed for future features: multiple chats, authentication, true LLM integration.  



### Backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Run the server:
```bash
uvicorn main:app --reload
```
Backend runs at: `http://127.0.0.1:8000`

---

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://127.0.0.1:5173`

---

## 📂 Project Structure

```
react-chatbot-demo/
├─ backend/
│   └─ main.py         # FastAPI backend, /api/chat endpoint
│
├─ frontend/
│   ├─ src/
│   │   ├─ App.tsx             # Main UI
│   │   ├─ main.tsx            # React entrypoint
│   │   ├─ api.ts              # API wrapper
│   │   ├─ types.ts            # TypeScript interfaces
│   │   ├─ state/
│   │   │   └─ ChatContext.tsx # Global state (useReducer + Context)
│   │   └─ components/         # UI components
│   │       ├─ MessageList.tsx
│   │       ├─ MessageItem.tsx
│   │       └─ ChatInput.tsx
│   ├─ package.json
│   ├─ vite.config.ts
│   └─ tsconfig.json
```

---

## 🛠 Key Technologies
- **Frontend**: React 18, TypeScript, Vite  
- **State Management**: useReducer + Context API  
- **Backend**: FastAPI, Pydantic  
- **CORS**: FastAPI Middleware  
- **Persistence**: localStorage  

---

## 🔮 Next Steps
- Integrate with **real LLM APIs** (OpenAI, Anthropic, Ollama).  
- Replace mock FAQ with a **vector database** (Pinecone, Weaviate, FAISS).  
- Add **multi-session chat & user authentication**.  
- Support **true streaming responses** (SSE or WebSocket).  
