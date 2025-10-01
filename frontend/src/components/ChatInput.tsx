import React, { useState } from 'react'
import { useChatContext } from '../state/ChatContext'

export const ChatInput: React.FC = () => {
  const [text, setText] = useState('')
  const { send, state } = useChatContext()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || state.isLoading) return
    const t = text
    setText('')
    await send(t)
  }

  return (
    <form className="inputBar" onSubmit={onSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask me something… (try: what is RAG? / time / weather Boston)"
      />
      <button type="submit" disabled={!text.trim() || state.isLoading}>Send</button>
    </form>
  )
}
