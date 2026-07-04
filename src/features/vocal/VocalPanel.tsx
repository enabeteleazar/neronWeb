import { Mic, Square } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type AgentInfo, getStatus, sendAudio } from '../../lib/neronApi';

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

const STATUS_LABEL: Record<VoiceState, string> = {
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
  const [state, setState] = useState<VoiceState>('idle');
  const [lastResponse, setLastResponse] = useState<string>('');
  const [agents, setAgents] = useState<Record<string, AgentInfo> | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

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

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = handleStop;
      mediaRecorderRef.current = recorder;
      recorder.start();
      setState('listening');
    } catch (err) {
      console.error('Micro inaccessible :', err);
      setState('error');
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }

  async function handleStop() {
    setState('processing');
    try {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const result = await sendAudio(blob);
      setLastResponse(result.response ?? result.error ?? 'Pas de réponse.');
      setState('speaking');
      window.setTimeout(() => setState('idle'), 2500);
    } catch (err) {
      console.error('Erreur audio :', err);
      setLastResponse(err instanceof Error ? err.message : 'Erreur inconnue');
      setState('error');
      window.setTimeout(() => setState('idle'), 2500);
    }
  }

  function toggle() {
    if (state === 'listening') stopRecording();
    else if (state === 'idle' || state === 'error') startRecording();
  }

  return (
    <div className="vocal-panel">
      <button
        className={`mic-orb mic-orb-${state}`}
        onClick={toggle}
        aria-label={state === 'listening' ? 'Arrêter' : 'Parler'}
      >
        {state === 'listening' ? <Square size={32} /> : <Mic size={42} />}
      </button>
      <h3>{STATUS_LABEL[state]}</h3>
      {lastResponse && <p className="vocal-response">{lastResponse}</p>}

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
