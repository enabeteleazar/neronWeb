import { FormEvent, useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { useNeron } from '../../hooks/useNeron';

const STATUS_LABEL: Record<string, string> = {
  connecting: 'Connexion…',
  connected: 'Connecté',
  disconnected: 'Déconnecté — reconnexion…',
  error: 'Erreur de connexion',
};

export function ConversationPanel() {
  const { messages, status, isStreaming, send, clear } = useNeron();
  const [value, setValue] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const text = value.trim();
    if (!text) return;
    send(text);
    setValue('');
  }

  return (
    <div className="conversation-shell">
      <div className={`conversation-status status-${status}`}>{STATUS_LABEL[status] ?? status}</div>

      <div className="conversation-panel">
        {messages.length === 0 && (
          <p className="conversation-empty">Néron en attente. Écris un message ou une commande.</p>
        )}
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role === 'user' ? 'user' : 'neron'}${message.error ? ' error' : ''}`}>
            {message.content}
            {message.streaming && <span className="cursor-blink">▍</span>}
          </div>
        ))}
        {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="message neron typing"><span /><span /><span /></div>
        )}
        <div ref={bottomRef} />
      </div>

      <form className="conversation-input" onSubmit={submit}>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Écrire à Néron…"
          disabled={status !== 'connected'}
        />
        <button type="submit" aria-label="Envoyer" disabled={status !== 'connected'}>
          <Send size={16} />
        </button>
      </form>
      {messages.length > 0 && (
        <button className="conversation-clear" onClick={clear} type="button">Effacer la conversation</button>
      )}
    </div>
  );
}
