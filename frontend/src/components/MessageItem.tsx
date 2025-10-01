import React from 'react'
import type { Message } from '../types'

export const MessageItem: React.FC<{ msg: Message }> = ({ msg }) => {
  const klass = 'msg ' + (msg.role === 'user' ? 'user' : 'assistant')
  return (
    <div className={klass}>
      <div>{msg.content}</div>
      {!!msg.sources?.length && (
        <div className="sources">
          Sources:{' '}
          {msg.sources.map((s, i) => (
            <span key={i}>
              {s.url ? (
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.title}
                </a>
              ) : (
                s.title
              )}
              {i < msg.sources!.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
