import { useEffect, useState } from 'react';
import { DEFAULT_RACK, getMetrics, getServices, UNIT_IDS } from './rackConfig';

export function HomelabPanel() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 2000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="rack-panel">
      {UNIT_IDS.map((unitId) => {
        const slot = DEFAULT_RACK[unitId];
        const metrics = getMetrics(slot);
        const services = getServices(slot);
        return (
          <article key={unitId} className={`rack-slot status-${slot.status}`} style={{ borderLeftColor: slot.accentHex }}>
            <div className="rack-slot-header">
              <span className="rack-unit">{unitId}</span>
              <strong>{slot.label}</strong>
              <span className={`rack-status-dot dot-${slot.status}`} title={slot.status} />
            </div>
            <div className="rack-metrics">
              {metrics.map((metric) => (
                <span key={metric.label}>
                  {metric.label}: <b>{metric.generate()}{metric.unit}</b>
                </span>
              ))}
            </div>
            {services.length > 0 && <div className="rack-services">{services.join(' · ')}</div>}
          </article>
        );
      })}
      <p className="rack-refresh-note" key={tick}>Métriques rafraîchies toutes les 2 s (simulation locale).</p>
    </div>
  );
}
