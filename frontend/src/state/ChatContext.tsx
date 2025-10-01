import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import type { Message } from '../types'
import { sendChat } from '../api'

type State = {
  messages: Message[]
  isLoading: boolean
}

type Action =
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'UPDATE_MESSAGE'; id: string; patch: Partial<Message> }
  | { type: 'SET_LOADING'; value: boolean }
  | { type: 'RESET' }

const ChatCtx = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
  send: (content: string) => Promise<void>
  isLoading: boolean
} | null>(null)

const initialState: State = {
  messages: [
    {
      id: 'sys-hello',
      role: 'assistant',
      content:
        'Hi! I am a demo chatbot. Ask me about time, weather (mock), or an FAQ like "what is RAG?"',
      timestamp: Date.now()
    }
  ],
  isLoading: false
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.message] }
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(m => (m.id === action.id ? { ...m, ...action.patch } : m))
      }
    case 'SET_LOADING':
      return { ...state, isLoading: action.value }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

function persist(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}
function restore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, init => restore('chat-state', init))

  useEffect(() => {
    persist('chat-state', state)
  }, [state])

  const send = async (content: string) => {
    const user: Message = { id: crypto.randomUUID(), role: 'user', content, timestamp: Date.now() }
    dispatch({ type: 'ADD_MESSAGE', message: user })

    const placeholder: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '…',
      timestamp: Date.now()
    }
    dispatch({ type: 'ADD_MESSAGE', message: placeholder })
    dispatch({ type: 'SET_LOADING', value: true })

    try {
      // streaming-like optimistic UI
      let acc = ''
      const onToken = (token: string) => {
        acc += token
        dispatch({ type: 'UPDATE_MESSAGE', id: placeholder.id, patch: { content: acc } })
      }
      const res = await sendChat([...state.messages, user], onToken)
      dispatch({
        type: 'UPDATE_MESSAGE',
        id: placeholder.id,
        patch: { content: res.content, sources: res.sources }
      })
    } catch (e: any) {
      dispatch({
        type: 'UPDATE_MESSAGE',
        id: placeholder.id,
        patch: { content: 'Sorry, something went wrong.', error: true }
      })
    } finally {
      dispatch({ type: 'SET_LOADING', value: false })
    }
  }

  const value = useMemo(
    () => ({ state, dispatch, send, isLoading: state.isLoading }),
    [state]
  )

  return <ChatCtx.Provider value={value}>{children}</ChatCtx.Provider>
}

export function useChatContext() {
  const ctx = useContext(ChatCtx)
  if (!ctx) throw new Error('useChatContext must be used inside ChatProvider')
  return ctx
}
