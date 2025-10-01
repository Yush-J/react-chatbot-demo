import React from 'react'
import { ChatProvider, useChatContext } from './state/ChatContext'
import { MessageList } from './components/MessageList'
import { ChatInput } from './components/ChatInput'

function ChatApp() {
  const { isLoading } = useChatContext()
  return (
    <div className="container">
      <div className="card">
        <header>
          <h1>GenAI Chatbot Demo</h1>
          <span className="badge">{isLoading ? 'Thinking…' : 'Ready'}</span>
        </header>
        <MessageList />
        <ChatInput />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ChatProvider>
      <ChatApp />
    </ChatProvider>
  )
}
