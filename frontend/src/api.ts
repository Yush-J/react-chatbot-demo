import type { Message } from './types'

export async function sendChat(
  messages: Message[],
  onToken: (t: string) => void
): Promise<{ content: string; sources?: { title: string; url?: string }[] }> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  })
  if (!res.ok) throw new Error('Network error')

  // Simulate streaming by chunking final answer client-side
  const data = await res.json()
  const text = data.content as string
  for (const ch of text) {
    await new Promise(r => setTimeout(r, 10))
    onToken(ch)
  }
  return data
}
