export interface DhtSensorData {
  suhu: number;
  kelembapan: number;
  timestamp?: number | string;
}

export interface DhtHistoryItem {
  id: string;
  suhu: number;
  kelembapan: number;
  timestamp: number | string;
  formattedTime?: string;
  statusSuhu?: 'Aman' | 'Peringatan' | 'Bahaya';
  statusKelembapan?: 'Aman' | 'Peringatan' | 'Bahaya';
  overallStatus?: string;
}

export interface SensorThresholds {
  tempMin: number;
  tempMax: number;
  humMin: number;
  humMax: number;
}

export interface CalibrationOffsets {
  tempOffset: number;
  humOffset: number;
}

export interface FirebaseConfig {
  host: string;
  auth: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'history'
  | 'calibration'
  | 'network'
  | 'settings';
