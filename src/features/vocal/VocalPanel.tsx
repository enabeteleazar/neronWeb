import { Mic, Square } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { type AgentInfo, getStatus } from '../../lib/neronApi';
import { useNeronVoice } from '../../hooks/useNeronVoice';

const STATUS_LABEL: Record<string, string> = {
  idle: 'Appuyer pour parler',
  listening: 'Enregistrement en cours…',
  processing: 'Néron réfléchit…',
  speaking: 'Néron a répondu',
  error: 'Erreur — réessaie',
};

const AGENT_LABELS: Record<string, string> = {
  llm: 'LLM',
  memory: 'Mémoire',
  ha: 'HomeAssist',
  telegram: 'Telegram',
  watchdog: 'Watchdog',
  stt: 'STT',
  tts: 'TTS',
};

function statusColor(status: string) {
  if (status === 'running' || status === 'online') return '#69f5a1';
  if (status === 'stopped' || status === 'offline') return '#8f9ab9';
  if (status === 'error') return '#ff8080';
  return '#a99dff';
}

export function VocalPanel() {
  const { state, transcript, responseText, error, toggle } = useNeronVoice();
  const [agents, setAgents] = useState<Record<string, AgentInfo> | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null);

  const pollAgents = useCallback(() => {
    getStatus()
      .then((data) => {
        setConnected(true);
        setAgents(data.agents ?? {});
      })
      .catch(() => {
        setConnected(false);
        setAgents(null);
      });
  }, []);

  useEffect(() => {
    pollAgents();
    const id = window.setInterval(pollAgents, 10000);
    return () => window.clearInterval(id);
  }, [pollAgents]);

  return (
    <div className="vocal-panel">
      <button
        className={`mic-orb mic-orb-${state}`}
        onClick={toggle}
        aria-label={state === 'listening' ? 'Arrêter' : 'Parler'}
      >
        {state === 'listening' ? <Square size={32} /> : <Mic size={42} />}
      </button>
      <h3>{STATUS_LABEL[state] ?? state}</h3>
      {transcript && (state === 'processing' || state === 'speaking') && (
        <p className="vocal-transcript">« {transcript} »</p>
      )}
      {(error || responseText) && (
        <p className="vocal-response">{error ?? responseText}</p>
      )}

      <div className="agent-panel">
        <div className="agent-panel-row">
          <span className="agent-dot" style={{ background: connected ? '#69f5a1' : connected === false ? '#ff8080' : '#8f9ab9' }} />
          <span className="agent-name">Core</span>
          <span className="agent-status">{connected === null ? '…' : connected ? 'connecté' : 'hors ligne'}</span>
        </div>
        {agents && Object.entries(agents).map(([key, info]) => (
          <div key={key} className="agent-panel-row">
            <span className="agent-dot" style={{ background: statusColor(info.status) }} />
            <span className="agent-name">{AGENT_LABELS[key] ?? key}</span>
            <span className="agent-status">{info.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
