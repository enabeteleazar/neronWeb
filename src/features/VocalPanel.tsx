import { Mic } from 'lucide-react';

export function VocalPanel() {
  return (
    <div className="vocal-panel">
      <div className="mic-orb"><Mic size={42} /></div>
      <h3>Écoute active</h3>
      <p>Module vocal prêt à recevoir une commande.</p>
      <button className="danger-button">Arrêter l’écoute</button>
    </div>
  );
}
