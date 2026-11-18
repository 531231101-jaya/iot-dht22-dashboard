import { CalibrationOffsets, DhtHistoryItem, DhtSensorData, FirebaseConfig, SensorThresholds } from '@/types';

export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  host: 'https://jaya-amin-project-default-rtdb.asia-southeast1.firebasedatabase.app',
  auth: 'LhjR7HBEmldVS6A2UKVpMhmkc0quw1UkJXCVQtZC',
};

export const DEFAULT_THRESHOLDS: SensorThresholds = {
  tempMin: 20.0,
  tempMax: 30.0,
  humMin: 40.0,
  humMax: 60.0,
};

export const DEFAULT_OFFSETS: CalibrationOffsets = {
  tempOffset: 0.0,
  humOffset: 0.0,
};

function cleanHost(host: string): string {
  let cleaned = host.trim();
  if (cleaned.endsWith('/')) {
    cleaned = cleaned.slice(0, -1);
  }
  return cleaned;
}

// Fetch DHT22 Real-time Data
export async function fetchDhtData(
  config: FirebaseConfig = DEFAULT_FIREBASE_CONFIG,
  offsets: CalibrationOffsets = DEFAULT_OFFSETS
): Promise<DhtSensorData> {
  const host = cleanHost(config.host);
  const url = `${host}/dht22.json?auth=${encodeURIComponent(config.auth)}`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Gagal mengambil data DHT22: HTTP ${res.status}`);
  }
  const data = await res.json();
  if (!data) {
    throw new Error('Data DHT22 di Firebase kosong.');
  }

  const rawSuhu = Number(data.suhu ?? 24);
  const rawHum = Number(data.kelembapan ?? 40);

  return {
    suhu: Number((rawSuhu + (offsets.tempOffset || 0)).toFixed(1)),
    kelembapan: Number((rawHum + (offsets.humOffset || 0)).toFixed(1)),
    timestamp: Date.now(),
  };
}

// Fetch History Data from Firebase RTDB
export async function fetchDhtHistory(
  config: FirebaseConfig = DEFAULT_FIREBASE_CONFIG,
  thresholds: SensorThresholds = DEFAULT_THRESHOLDS
): Promise<DhtHistoryItem[]> {
  const host = cleanHost(config.host);
  const url = `${host}/historyDataDHT22.json?auth=${encodeURIComponent(config.auth)}`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Gagal mengambil riwayat DHT22: HTTP ${res.status}`);
  }
  const raw = await res.json();
  if (!raw || typeof raw !== 'object') {
    return [];
  }

  const items: DhtHistoryItem[] = Object.keys(raw).map((key) => {
    const item = raw[key];
    const suhu = Number(item.suhu ?? 0);
    const kelembapan = Number(item.kelembapan ?? 0);
    const ts = item.timestamp ? Number(item.timestamp) : Date.now();
    const date = new Date(ts);

    const formattedTime = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const statusSuhu =
      suhu < thresholds.tempMin || suhu > thresholds.tempMax
        ? 'Peringatan'
        : 'Aman';
    const statusKelembapan =
      kelembapan < thresholds.humMin || kelembapan > thresholds.humMax
        ? 'Peringatan'
        : 'Aman';

    const overallStatus =
      statusSuhu === 'Aman' && statusKelembapan === 'Aman'
        ? 'Normal / Aman'
        : 'Waspada Ambang Batas';

    return {
      id: key,
      suhu,
      kelembapan,
      timestamp: ts,
      formattedTime,
      statusSuhu,
      statusKelembapan,
      overallStatus,
    };
  });

  // Sort newest first
  return items.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
}

// Ping / Connection Test
export async function testFirebaseConnection(
  config: FirebaseConfig = DEFAULT_FIREBASE_CONFIG
): Promise<{ ok: boolean; latencyMs: number; message: string }> {
  const host = cleanHost(config.host);
  const start = performance.now();
  const url = `${host}/dht22.json?auth=${encodeURIComponent(config.auth)}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    const end = performance.now();
    const latencyMs = Math.round(end - start);

    if (res.ok) {
      return { ok: true, latencyMs, message: `Terkoneksi dengan baik (${latencyMs} ms)` };
    } else {
      return { ok: false, latencyMs, message: `HTTP Error: ${res.status} ${res.statusText}` };
    }
  } catch (err: unknown) {
    const end = performance.now();
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { ok: false, latencyMs: Math.round(end - start), message: `Koneksi gagal: ${errorMsg}` };
  }
}
