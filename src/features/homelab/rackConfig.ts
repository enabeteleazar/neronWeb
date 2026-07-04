export type DeviceType = 'switch' | 'firewall' | 'server' | 'gpu_server' | 'nas' | 'ups' | 'home_assistant';

export type UnitId = 'U1' | 'U2' | 'U3' | 'U4' | 'U5' | 'U6' | 'U7' | 'U8' | 'U9' | 'U10';

export type MetricSpec = { label: string; unit: string; generate: () => number | string };

type Base = { label: string; accentHex: string; status: 'online' | 'alert' | 'offline' };

export type SwitchConfig = Base & { type: 'switch'; portCount: 8 | 16 | 24 | 48; speed: string };
export type FirewallConfig = Base & { type: 'firewall'; software: string };
export type ServerConfig = Base & { type: 'server'; cpuCores: number; ramGB: number; services: string[] };
export type GPUServerConfig = Base & { type: 'gpu_server'; gpuModel: string; vramGB: number; services: string[] };
export type NASConfig = Base & { type: 'nas'; driveCount: number; raidType: string; filesystem: string };
export type UPSConfig = Base & { type: 'ups'; brand: string; capacityVA: number };
export type HomeAssistantConfig = Base & { type: 'home_assistant'; deviceCount: number };

export type SlotConfig =
  | SwitchConfig
  | FirewallConfig
  | ServerConfig
  | GPUServerConfig
  | NASConfig
  | UPSConfig
  | HomeAssistantConfig;

export type RackState = Record<UnitId, SlotConfig>;

export function getMetrics(config: SlotConfig): MetricSpec[] {
  switch (config.type) {
    case 'switch':
      return [
        { label: 'Ports actifs', unit: '', generate: () => `${config.portCount}/${config.portCount}` },
        { label: 'Débit', unit: ' Gbps', generate: () => (Math.random() * 2 + 7).toFixed(1) },
        { label: 'Latence', unit: ' ms', generate: () => (Math.random() * 0.5 + 0.1).toFixed(2) },
      ];
    case 'firewall':
      return [
        { label: 'Bloqués', unit: '/min', generate: () => Math.floor(Math.random() * 50 + 10) },
        { label: 'Tunnels VPN', unit: '', generate: () => Math.floor(Math.random() * 2 + 2) },
        { label: 'CPU', unit: '%', generate: () => Math.floor(Math.random() * 15 + 5) },
      ];
    case 'server':
      return [
        { label: 'CPU', unit: '%', generate: () => Math.floor(Math.random() * 40 + 20) },
        { label: 'RAM', unit: '%', generate: () => Math.floor(Math.random() * 20 + 60) },
        { label: 'Processus', unit: '', generate: () => Math.floor(Math.random() * 50 + 100) },
      ];
    case 'gpu_server':
      return [
        { label: 'GPU', unit: '%', generate: () => Math.floor(Math.random() * 50 + 30) },
        { label: 'VRAM', unit: 'GB', generate: () => (Math.random() * 2 + config.vramGB * 0.6).toFixed(1) },
        { label: 'Temp', unit: '°C', generate: () => Math.floor(Math.random() * 10 + 65) },
      ];
    case 'nas': {
      const totalTB = config.driveCount * 4;
      return [
        { label: 'Usage', unit: 'TB', generate: () => `${(totalTB * 0.44).toFixed(1)} / ${totalTB}` },
        { label: 'Lecture', unit: 'MB/s', generate: () => Math.floor(Math.random() * 50 + 10) },
        { label: 'Écriture', unit: 'MB/s', generate: () => Math.floor(Math.random() * 80 + 5) },
      ];
    }
    case 'ups':
      return [
        { label: 'Batterie', unit: '%', generate: () => '100' },
        { label: 'Charge', unit: '%', generate: () => Math.floor(Math.random() * 5 + 35) },
        { label: 'Autonomie', unit: 'min', generate: () => Math.floor(Math.random() * 5 + 45) },
      ];
    case 'home_assistant':
      return [
        { label: 'Appareils', unit: '', generate: () => config.deviceCount },
        { label: 'Automations', unit: '', generate: () => 124 },
        { label: 'Évènements', unit: '/h', generate: () => Math.floor(Math.random() * 100 + 400) },
      ];
  }
}

export function getServices(config: SlotConfig): string[] {
  if (config.type === 'server') return config.services;
  if (config.type === 'gpu_server') return config.services;
  if (config.type === 'firewall') return [config.software, 'WireGuard', 'Suricata'];
  if (config.type === 'switch') return [`${config.portCount}p ${config.speed}`, 'VLAN', 'QoS'];
  if (config.type === 'nas') return [config.filesystem, config.raidType, 'SMB/NFS'];
  if (config.type === 'ups') return [config.brand, `${config.capacityVA}VA`];
  if (config.type === 'home_assistant') return ['HASS Core', 'Mosquitto', 'Zigbee2MQTT'];
  return [];
}

export const DEFAULT_RACK: RackState = {
  U1: { type: 'switch', label: 'Switch 10 GbE', accentHex: '#22d3ee', status: 'online', portCount: 24, speed: '10G' },
  U2: { type: 'firewall', label: 'Firewall / Routeur', accentHex: '#f97316', status: 'online', software: 'OPNsense' },
  U3: {
    type: 'server', label: 'Néron Core', accentHex: '#a855f7', status: 'online',
    cpuCores: 16, ramGB: 64, services: ['NéronOS', 'API Gateway', 'Orchestrateur'],
  },
  U4: {
    type: 'server', label: 'Néron Memory', accentHex: '#3b82f6', status: 'online',
    cpuCores: 8, ramGB: 32, services: ['Oblivia', 'SQLite', 'Redis'],
  },
  U5: {
    type: 'gpu_server', label: 'Provider LLM', accentHex: '#22c55e', status: 'online',
    gpuModel: 'RTX 3090', vramGB: 24, services: ['Ollama', 'vLLM'],
  },
  U6: {
    type: 'home_assistant', label: 'Home Assistant', accentHex: '#f59e0b', status: 'online', deviceCount: 89,
  },
  U7: {
    type: 'nas', label: 'Stockage / NAS / Sauvegardes', accentHex: '#facc15', status: 'online',
    driveCount: 8, raidType: 'ZFS RAIDZ2', filesystem: 'ZFS',
  },
  U8: {
    type: 'server', label: 'Watchdog + Doctor', accentHex: '#ef4444', status: 'alert',
    cpuCores: 4, ramGB: 16, services: ['Prometheus', 'Grafana', 'Alertmanager'],
  },
  U9: { type: 'ups', label: 'UPS APC', accentHex: '#38bdf8', status: 'online', brand: 'APC Smart-UPS', capacityVA: 1500 },
  U10: { type: 'switch', label: 'Switch de secours', accentHex: '#94a3b8', status: 'offline', portCount: 8, speed: '1G' },
};

export const UNIT_IDS: UnitId[] = ['U1', 'U2', 'U3', 'U4', 'U5', 'U6', 'U7', 'U8', 'U9', 'U10'];
