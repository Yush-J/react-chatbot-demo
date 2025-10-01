export type Role = 'user' | 'assistant' | 'system' | 'tool'

export interface Message {
  id: string
  role: Role
  content: string
  timestamp: number
  sources?: { title: string; url?: string }[]
  error?: boolean
}
