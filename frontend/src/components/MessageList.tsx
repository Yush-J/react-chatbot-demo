import React, { useEffect, useRef } from 'react'
import { useChatContext } from '../state/ChatContext'
import { MessageItem } from './MessageItem'

export const MessageList: React.FC = () => {
  const { state } = useChatContext()
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    ref.current?.scrollTo(0, ref.current.scrollHeight)
  }, [state.messages.length])

  return (
    <div className="messages" ref={ref}>
      {state.messages.map(m => (
        <MessageItem key={m.id} msg={m} />
      ))}
    </div>
  )
}
