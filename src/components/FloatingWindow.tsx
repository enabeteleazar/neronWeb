import { Minus, Pin, X } from 'lucide-react';
import type { ReactNode } from 'react';

export type FloatingWindowProps = {
  title: string;
  children: ReactNode;
  x: number;
  y: number;
  width?: number;
  onClose: () => void;
};

export function FloatingWindow({ title, children, x, y, width = 420, onClose }: FloatingWindowProps) {
  return (
    <section className="floating-window" style={{ left: x, top: y, width }}>
      <header className="window-header">
        <div className="traffic-lights" aria-hidden="true">
          <span className="red" />
          <span className="yellow" />
          <span className="green" />
        </div>
        <strong>{title}</strong>
        <div className="window-actions">
          <Pin size={14} />
          <Minus size={14} />
          <button onClick={onClose} aria-label={`Fermer ${title}`}>
            <X size={15} />
          </button>
        </div>
      </header>
      <div className="window-body">{children}</div>
    </section>
  );
}
