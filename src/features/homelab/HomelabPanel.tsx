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
  const pctValue = value ?? 0;
  return (
    <div className="gauge">
      <div className="gauge-header">
        <span>{label}</span>
        <b>{value != null ? `${Math.round(value)}%` : '—'}</b>
      </div>
      <div className="gauge-track">
        <div
          className="gauge-fill"
          style={{ width: `${Math.min(pctValue, 100)}%`, background: gaugeColor(value) }}
        />
      </div>
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
              <span className={`rack-status-dot dot-${slot.status}`} title={slot.status} />
            </div>
            <div className="rack-gauges">
              <Gauge label="CPU" value={resources?.cpu_pct} />
              <Gauge label="RAM" value={resources?.ram_pct} />
              <Gauge label="Disque" value={resources?.disk_pct} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
