export type OrbState = 'idle' | 'thinking' | 'working' | 'alert';

export function NeronOrb({ state }: { state: OrbState }) {
  return (
    <div className={`orb-stage orb-${state}`}>
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="orbit orbit-three" />
      <div className="orb-core">
        <div className="orb-glow" />
        <div className="orb-particles" />
      </div>
      <div className="orb-ring-base" />
      <p className="orb-caption">Néron {state === 'working' ? 'travaille' : state === 'thinking' ? 'analyse' : state === 'alert' ? 'alerte' : 'veille'}</p>
    </div>
  );
}
