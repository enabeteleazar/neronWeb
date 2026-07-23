import type { ServiceRegistration, SystemResources } from '../../lib/neronApi';
import { DEFAULT_RACK, UNIT_IDS } from './rackConfig';

type HomelabPanelProps = {
  services: ServiceRegistration[] | null;
  resources: SystemResources | null;
};

function gaugeColor(value: number | null | undefined): string {
  if (value == null) return '#4b5563';
  if (value >= 90) return '#f87171';
  if (value >= 80) return '#fb923c';
  if (value >= 70) return '#facc15';
  return '#4ade80';
}

function Gauge({ label, value }: { label: string; value: number | null | undefined }) {
  const radius = 42;
  const circumference = Math.PI * radius;
  const pctValue = Math.min(value ?? 0, 100);
  const dashOffset = circumference - (pctValue / 100) * circumference;

  return (
    <div className="gauge">
      <svg viewBox="0 0 100 56" className="gauge-svg">
        <path
          d="M8,50 A42,42 0 0,1 92,50"
          fill="none"
          stroke="rgba(255,255,255,.08)"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M8,50 A42,42 0 0,1 92,50"
          fill="none"
          stroke={gaugeColor(value)}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset .5s ease, stroke .5s ease' }}
        />
      </svg>
      <div className="gauge-value">{value != null ? `${Math.round(value)}%` : '—'}</div>
      <div className="gauge-label">{label}</div>
    </div>
  );
}

export function HomelabPanel({ resources }: HomelabPanelProps) {
  return (
    <div className="rack-panel">
      {UNIT_IDS.map((unitId) => {
        const slot = DEFAULT_RACK[unitId];

        if (!slot.isReal) {
          return (
            <article key={unitId} className="rack-slot status-offline rack-slot-empty">
              <div className="rack-slot-header">
                <span className="rack-unit">{unitId}</span>
                <strong>Emplacement libre</strong>
                <span className="rack-status-dot dot-offline" title="non configuré" />
              </div>
            </article>
          );
        }

        return (
          <article key={unitId} className={`rack-slot status-${slot.status}`} style={{ borderLeftColor: slot.accentHex }}>
            <div className="rack-slot-header">
              <span className="rack-unit">{unitId}</span>
              <strong>{slot.label}</strong>
              <div className="rack-gauges-row">
                <Gauge label="CPU" value={resources?.cpu_pct} />
                <Gauge label="RAM" value={resources?.ram_pct} />
                <Gauge label="Disque" value={resources?.disk_pct} />
              </div>
              <span className={`rack-status-dot dot-${slot.status}`} title={slot.status} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
