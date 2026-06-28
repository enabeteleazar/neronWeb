export function GoalsPanel() {
  return (
    <div className="list-panel">
      <h3>Objectifs</h3>
      {[
        ['Unifier les UI', 'En cours'],
        ['Créer neron-console', 'En cours'],
        ['Connecter /goal', 'À faire'],
      ].map(([name, status]) => (
        <article key={name}>
          <div><strong>{name}</strong><small>Goal Engine</small></div>
          <span>{status}</span>
        </article>
      ))}
    </div>
  );
}
