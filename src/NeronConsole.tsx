import { Activity, Bot, Cpu, Database, Home, Mic, Server, Settings, Target } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CommandBar } from './components/CommandBar';
import { FloatingWindow } from './components/FloatingWindow';
import { NeronOrb, type OrbState } from './components/NeronOrb';
import { ConversationPanel } from './features/conversation';
import { HomelabPanel } from './features/homelab';
import { MemoryPanel } from './features/memory';
import { SelfModelPanel } from './features/selfmodel';
import { SystemPanel } from './features/system';
import { VocalPanel } from './features/vocal';

type WindowId = 'conversation' | 'dashboard' | 'homelab' | 'vocal' | 'goals' | 'memory';

type WindowRuntimeState = {
  x: number;
  y: number;
  width: number;
  minimized: boolean;
  pinned: boolean;
  z: number;
};

const initialLayout: Record<WindowId, Omit<WindowRuntimeState, 'z' | 'minimized' | 'pinned'>> = {
  conversation: { x: 270, y: 110, width: 430 },
  dashboard: { x: 980, y: 110, width: 470 },
  homelab: { x: 260, y: 585, width: 430 },
  vocal: { x: 1010, y: 610, width: 390 },
  goals: { x: 760, y: 560, width: 370 },
  memory: { x: 760, y: 120, width: 370 },
};

const titles: Record<WindowId, string> = {
  conversation: 'Conversation',
  dashboard: 'Système',
  homelab: 'Homelab',
  vocal: 'Vocal',
  goals: 'Goals',
  memory: 'Mémoire',
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
    case 'dashboard': return <SystemPanel />;
    case 'homelab': return <HomelabPanel />;
    case 'vocal': return <VocalPanel />;
    case 'goals': return <SelfModelPanel />;
    case 'memory': return <MemoryPanel />;
    default: return <ConversationPanel />;
  }
}

function buildInitialWindows(): Record<WindowId, WindowRuntimeState> {
  const entries = Object.entries(initialLayout) as [WindowId, typeof initialLayout[WindowId]][];
  return Object.fromEntries(
    entries.map(([id, layout], index) => [
      id,
      { ...layout, minimized: false, pinned: false, z: 10 + index },
    ]),
  ) as Record<WindowId, WindowRuntimeState>;
}

export function NeronConsole() {
  const [openWindows, setOpenWindows] = useState<WindowId[]>(['conversation', 'dashboard', 'homelab', 'vocal']);
  const [windows, setWindows] = useState<Record<WindowId, WindowRuntimeState>>(buildInitialWindows);
  const [topZ, setTopZ] = useState(20);
  const [orbState, setOrbState] = useState<OrbState>('idle');

  const visibleWindows = useMemo(
    () => openWindows.map((id) => ({ id, ...windows[id] })),
    [openWindows, windows],
  );

  function openWindow(id: WindowId) {
    setOpenWindows((current) => (current.includes(id) ? current : [...current, id]));
    setWindows((current) => ({ ...current, [id]: { ...current[id], minimized: false } }));
    bringToFront(id);
    setOrbState('working');
    window.setTimeout(() => setOrbState('idle'), 1400);
  }

  function closeWindow(id: WindowId) {
    setOpenWindows((current) => current.filter((windowId) => windowId !== id));
  }

  function bringToFront(id: WindowId) {
    setTopZ((z) => {
      const nextZ = z + 1;
      setWindows((current) => ({ ...current, [id]: { ...current[id], z: nextZ } }));
      return nextZ;
    });
  }

  function moveWindow(id: WindowId, x: number, y: number) {
    setWindows((current) => ({ ...current, [id]: { ...current[id], x, y } }));
  }

  function toggleMinimize(id: WindowId) {
    setWindows((current) => ({ ...current, [id]: { ...current[id], minimized: !current[id].minimized } }));
  }

  function togglePin(id: WindowId) {
    setWindows((current) => ({ ...current, [id]: { ...current[id], pinned: !current[id].pinned } }));
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
        <div className="brand"><div className="brand-orb" /><div><strong>NéronWeb</strong><small>Console</small></div></div>
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

      {visibleWindows.map((win) => (
        <FloatingWindow
          key={win.id}
          title={titles[win.id]}
          x={win.x}
          y={win.y}
          width={win.width}
          zIndex={win.z}
          minimized={win.minimized}
          pinned={win.pinned}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => toggleMinimize(win.id)}
          onTogglePin={() => togglePin(win.id)}
          onFocus={() => bringToFront(win.id)}
          onMove={(x, y) => moveWindow(win.id, x, y)}
        >
          {renderPanel(win.id)}
        </FloatingWindow>
      ))}

      <CommandBar onCommand={handleCommand} />
      <footer className="connection-state">Connecté à Néron Core</footer>
    </main>
  );
}
