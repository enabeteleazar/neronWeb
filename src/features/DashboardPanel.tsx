export function DashboardPanel() {
  return (
    <div className="panel-grid">
      <div className="metric-card"><span>CPU</span><strong>16%</strong><small>normal</small></div>
      <div className="metric-card"><span>RAM</span><strong>32%</strong><small>stable</small></div>
      <div className="metric-card"><span>Disque</span><strong>28%</strong><small>OK</small></div>
      <div className="metric-card"><span>Réseau</span><strong>23%</strong><small>actif</small></div>
      <div className="service-list">
        <h3>Services</h3>
        {['neron-core', 'ollama', 'docker', 'home-assistant', 'watchdog'].map((service) => (
          <p key={service}><span>{service}</span><b>En ligne</b></p>
        ))}
      </div>
    </div>
  );
}
