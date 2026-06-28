export function HomelabPanel() {
  return (
    <div className="list-panel">
      <h3>Infrastructure</h3>
      {[
        ['Néron Core', '192.168.1.10', 'Actif'],
        ['Néron Memory', '192.168.1.20', 'Actif'],
        ['Provider LLM', '192.168.1.30', 'Veille'],
        ['NAS', '192.168.1.40', 'Actif'],
      ].map(([name, ip, status]) => (
        <article key={name}>
          <div><strong>{name}</strong><small>{ip}</small></div>
          <span>{status}</span>
        </article>
      ))}
    </div>
  );
}
