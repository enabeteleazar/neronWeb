import { useEffect, useState } from 'react';
import { type AgentInfo, getHealth, getStatus, type NeronHealth } from '../../lib/neronApi';

const metrics = [
  ['CPU', '16%', 'normal'],
  ['RAM', '32%', 'stable'],
  ['Disque', '28%', 'OK'],
  ['Réseau', '23%', 'actif'],
] as const;

export function DashboardPanel() {
  const [health, setHealth] = useState<NeronHealth | null>(null);
  const [healthError, setHealthError] = useState(false);
  const [agents, setAgents] = useState<Record<string, AgentInfo> | null>(null);

  useEffect(() => {
    let cancelled = false;

    function poll() {
      getHealth()
        .then((data) => { if (!cancelled) { setHealth(data); setHealthError(false); } })
        .catch(() => { if (!cancelled) setHealthError(true); });

      getStatus()
        .then((data) => { if (!cancelled) setAgents(data.agents ?? {}); })
        .catch(() => { if (!cancelled) setAgents(null); });
    }

    poll();
    const id = window.setInterval(poll, 8000);
    return () => { cancelled = true; window.clearInterval(id); };
  }, []);

  return (
    <div className="panel-grid">
      <div className="core-health">
        <span className={`health-dot ${healthError ? 'health-down' : 'health-up'}`} />
        <div>
          <strong>{healthError ? 'Néron Core injoignable' : health?.status ?? 'Connexion…'}</strong>
          {health?.version && <small>Version {health.version}</small>}
        </div>
      </div>

      {metrics.map(([label, value, status]) => (
        <div className="metric-card" key={label}>
          <span>{label}</span><strong>{value}</strong><small>{status}</small>
        </div>
      ))}

      <div className="service-list">
        <h3>Services</h3>
        {agents && Object.keys(agents).length > 0
          ? Object.entries(agents).map(([name, info]) => (
              <p key={name}><span>{name}</span><b>{info.status}</b></p>
            ))
          : ['neron-core', 'ollama', 'docker', 'home-assistant', 'watchdog'].map((service) => (
              <p key={service}><span>{service}</span><b>{healthError ? 'Inconnu' : 'En ligne'}</b></p>
            ))}
      </div>
    </div>
  );
}
