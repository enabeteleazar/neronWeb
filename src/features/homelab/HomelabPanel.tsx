import type { ServiceRegistration, SystemResources } from '../../lib/neronApi';
import { DEFAULT_RACK, UNIT_IDS } from './rackConfig';

type HomelabPanelProps = {
  services: ServiceRegistration[] | null;
  resources: SystemResources | null;
};

function pct(value: number | null | undefined): string {
  return value != null ? `${Math.round(value)}%` : '—';
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
            <div className="rack-metrics">
              <span>CPU: <b>{pct(resources?.cpu_pct)}</b></span>
              <span>RAM: <b>{pct(resources?.ram_pct)}</b></span>
              <span>Disque: <b>{pct(resources?.disk_pct)}</b></span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
