import { Activity, Bot, Cpu, Database, Home, Mic, Server, Settings, Target } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CommandBar } from './components/CommandBar';
import { FloatingWindow } from './components/FloatingWindow';
import { NeronOrb, type OrbState } from './components/NeronOrb';
import { DashboardPanel } from './features/DashboardPanel';
import { GoalsPanel } from './features/GoalsPanel';
import { HomelabPanel } from './features/HomelabPanel';
import { MemoryPanel } from './features/MemoryPanel';
import { VocalPanel } from './features/VocalPanel';

type WindowId = 'conversation' | 'dashboard' | 'homelab' | 'vocal' | 'goals' | 'memory';

type WindowConfig = {
  id: WindowId;
  title: string;
  x: number;
  y: number;
  width: number;
};

const windowConfigs: Record<WindowId, WindowConfig> = {
  conversation: { id: 'conversation', title: 'Conversation', x: 270, y: 110, width: 430 },
  dashboard: { id: 'dashboard', title: 'Système', x: 980, y: 110, width: 470 },
  homelab: { id: 'homelab', title: 'Homelab', x: 260, y: 585, width: 410 },
  vocal: { id: 'vocal', title: 'Vocal', x: 1010, y: 610, width: 390 },
  goals: { id: 'goals', title: 'Goals', x: 760, y: 560, width: 370 },
  memory: { id: 'memory', title: 'Mémoire', x: 760, y: 120, width: 370 },
};

const nav = [
  { id: 'conversation' as const, label: 'Conversation', icon: Bot },
  { id: 'dashboard' as const, label: 'Système', icon: Cpu },
  { id: 'homelab' as const, label: 'Homelab', icon: Server },
  { id: 'vocal' as const, label: 'Vocal', icon: Mic },
  { id: 'goals' as const, label: 'Goals', icon: Target },
  { id: 'memory' as const, label: 'Mémoire', icon: Database },
];

function renderPanel(id: WindowId) {
  switch (id) {
    case 'dashboard': return <DashboardPanel />;
    case 'homelab': return <HomelabPanel />;
    case 'vocal': return <VocalPanel />;
    case 'goals': return <GoalsPanel />;
    case 'memory': return <MemoryPanel />;
    default:
      return (
        <div className="conversation-panel">
          <div className="message user">Néron, ouvre l’état système.</div>
          <div className="message neron">Fenêtre Système ouverte. Tous les services essentiels sont visibles.</div>
        </div>
      );
  }
}

export function NeronConsole() {
  const [openWindows, setOpenWindows] = useState<WindowId[]>(['conversation', 'dashboard', 'homelab', 'vocal']);
  const [orbState, setOrbState] = useState<OrbState>('idle');

  const visibleWindows = useMemo(() => openWindows.map((id) => windowConfigs[id]), [openWindows]);

  function openWindow(id: WindowId) {
    setOpenWindows((current) => current.includes(id) ? current : [...current, id]);
    setOrbState('working');
    window.setTimeout(() => setOrbState('idle'), 1400);
  }

  function closeWindow(id: WindowId) {
    setOpenWindows((current) => current.filter((windowId) => windowId !== id));
  }

  function handleCommand(command: string) {
    const text = command.toLowerCase();
    if (text.includes('système') || text.includes('status') || text.includes('dashboard')) return openWindow('dashboard');
    if (text.includes('homelab') || text.includes('serveur')) return openWindow('homelab');
    if (text.includes('vocal') || text.includes('micro')) return openWindow('vocal');
    if (text.includes('goal') || text.includes('objectif')) return openWindow('goals');
    if (text.includes('mémoire') || text.includes('memory')) return openWindow('memory');
    openWindow('conversation');
    setOrbState('thinking');
    window.setTimeout(() => setOrbState('idle'), 1600);
  }

  return (
    <main className="console-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-orb" /><div><strong>NéronOS</strong><small>Console</small></div></div>
        <button className="nav-home"><Home size={18} /> Accueil</button>
        <nav>
          {nav.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} onClick={() => openWindow(item.id)}><Icon size={18} /> {item.label}</button>;
          })}
        </nav>
        <div className="sidebar-status">
          <Activity size={18} />
          <div><strong>Néron</strong><small>En ligne</small></div>
        </div>
      </aside>

      <header className="topbar">
        <div className="wordmark">NÉRON</div>
        <div className="top-actions"><span>Online</span><Settings size={18} /></div>
      </header>

      <section className="orb-zone">
        <NeronOrb state={orbState} />
      </section>

      {visibleWindows.map((window) => (
        <FloatingWindow key={window.id} {...window} onClose={() => closeWindow(window.id)}>
          {renderPanel(window.id)}
        </FloatingWindow>
      ))}

      <CommandBar onCommand={handleCommand} />
      <footer className="connection-state">Connecté à Néron Core</footer>
    </main>
  );
}
