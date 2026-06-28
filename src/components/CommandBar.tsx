import { Mic, Send } from 'lucide-react';
import { FormEvent, useState } from 'react';

export function CommandBar({ onCommand }: { onCommand: (command: string) => void }) {
  const [value, setValue] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    const command = value.trim();
    if (!command) return;
    onCommand(command);
    setValue('');
  }

  return (
    <form className="command-bar" onSubmit={submit}>
      <Mic size={20} />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Demande à Néron d’ouvrir une fenêtre ou d’exécuter un objectif..."
      />
      <button type="submit" aria-label="Envoyer">
        <Send size={18} />
      </button>
    </form>
  );
}
