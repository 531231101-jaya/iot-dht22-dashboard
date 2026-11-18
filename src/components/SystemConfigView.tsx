'use client';

import React, { useState } from 'react';
import { FirebaseConfig } from '@/types';
import { Database, Key, Globe, Check, Copy, Code, RefreshCw } from 'lucide-react';
import { testFirebaseConnection } from '@/lib/firebase';

interface SystemConfigViewProps {
  firebaseConfig: FirebaseConfig;
  setFirebaseConfig: (config: FirebaseConfig) => void;
  rawFirebaseData: any;
  pollingIntervalMs: number;
  setPollingIntervalMs: (ms: number) => void;
}

export const SystemConfigView: React.FC<SystemConfigViewProps> = ({
  firebaseConfig,
  setFirebaseConfig,
  rawFirebaseData,
  pollingIntervalMs,
  setPollingIntervalMs,
}) => {
  const [host, setHost] = useState(firebaseConfig.host);
  const [auth, setAuth] = useState(firebaseConfig.auth);
  const [intervalVal, setIntervalVal] = useState(pollingIntervalMs);
  const [testResult, setTestResult] = useState<{ ok: boolean; latencyMs: number; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleTestPing = async () => {
    setIsTesting(true);
    setTestResult(null);
    const result = await testFirebaseConnection({ host, auth });
    setTestResult(result);
    setIsTesting(false);
  };

  const handleSaveConfig = () => {
    setFirebaseConfig({ host, auth });
    setPollingIntervalMs(intervalVal);
    handleTestPing();
  };

  const arduinoSnippet = `// Contoh Firmware ESP32 / ESP8266 untuk mengirim data DHT22 ke Firebase RTDB
#include <WiFi.h>
#include <FirebaseESP32.h>
#include "DHT.h"

#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

#define FIREBASE_HOST "${host.replace(/^https?:\/\//, '').replace(/\/$/, '')}"
#define FIREBASE_AUTH "${auth}"
#define WIFI_SSID "NAMA_WIFI_ANDA"
#define WIFI_PASSWORD "PASSWORD_WIFI_ANDA"

FirebaseData fbdo;
FirebaseAuth fbAuth;
FirebaseConfig fbConfig;

void setup() {
  Serial.begin(115200);
  dht.begin();

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(400);
    Serial.print(".");
  }
  Serial.println("\nWiFi Terkoneksi!");

  fbConfig.database_url = FIREBASE_HOST;
  fbConfig.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&fbConfig, &fbAuth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  float kelembapan = dht.readHumidity();
  float suhu = dht.readTemperature();

  if (!isnan(kelembapan) && !isnan(suhu)) {
    // 1. Update node realtime dht22
    Firebase.setFloat(fbdo, "/dht22/suhu", suhu);
    Firebase.setFloat(fbdo, "/dht22/kelembapan", kelembapan);

    // 2. Simpan juga ke historyDataDHT22
    FirebaseJson json;
    json.set("suhu", suhu);
    json.set("kelembapan", kelembapan);
    json.set("timestamp", String(millis())); // atau gunakan NTP waktu riil
    Firebase.pushJSON(fbdo, "/historyDataDHT22", json);

    Serial.printf("Suhu: %.1f °C | Kelembapan: %.1f %%\n", suhu, kelembapan);
  }

  delay(5000); // Kirim data setiap 5 detik
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(arduinoSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-surface-container gap-2">
        <div>
          <h1 className="font-hanken font-bold text-[22px] text-on-surface tracking-tight">
            Konfigurasi Firebase & Jaringan Telemetri
          </h1>
          <p className="font-mono text-[11px] text-on-surface-variant">
            Konfigurasi koneksi Realtime Database, otentikasi REST, dan integrasi mikrokontroler DHT22
          </p>
        </div>

        <button
          onClick={handleSaveConfig}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white font-mono text-[11px] px-4 py-2 rounded shadow-xs transition-colors cursor-pointer"
        >
          <Database className="w-3.5 h-3.5" />
          <span>Terapkan Konfigurasi</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Database Credentials & Connection Test */}
        <div className="bg-surface-container-lowest rounded-lg p-5 shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <h2 className="font-hanken font-semibold text-[15px] text-on-surface">
                  Parameter Firebase RTDB
                </h2>
              </div>
              <span className="font-mono text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded font-semibold">
                TERHUBUNG
              </span>
            </div>

            <div className="flex flex-col gap-4 font-mono text-[11px]">
              <div>
                <label className="block text-on-surface-variant text-[10px] mb-1 font-semibold">
                  FIREBASE HOST URL
                </label>
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded p-2 text-on-surface font-mono text-[12px] focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant text-[10px] mb-1 font-semibold">
                  FIREBASE AUTH / DATABASE SECRET
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={auth}
                    onChange={(e) => setAuth(e.target.value)}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded p-2 text-on-surface font-mono text-[12px] focus:outline-none focus:border-primary pr-8"
                  />
                  <Key className="w-3.5 h-3.5 text-outline absolute right-2.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-on-surface-variant text-[10px] mb-1 font-semibold">
                  INTERVAL POLLING / SYNC OTOMATIS (MS)
                </label>
                <select
                  value={intervalVal}
                  onChange={(e) => setIntervalVal(Number(e.target.value))}
                  className="w-full bg-surface-container-low border border-surface-container-high rounded p-2 text-on-surface font-mono text-[12px]"
                >
                  <option value={1000}>1000 ms (1 detik - Sangat Cepat)</option>
                  <option value={2000}>2000 ms (2 detik - Standar)</option>
                  <option value={5000}>5000 ms (5 detik - Hemat Bandwidth)</option>
                  <option value={10000}>10000 ms (10 detik)</option>
                </select>
              </div>

              {/* Ping Test Button & Result */}
              <div className="mt-2 pt-3 border-t border-surface-container flex flex-col gap-2">
                <button
                  onClick={handleTestPing}
                  disabled={isTesting}
                  className="w-full flex items-center justify-center gap-2 bg-surface-container-low hover:bg-surface-container border border-surface-container-high text-on-surface py-2 rounded text-[11px] font-mono transition-colors cursor-pointer"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 text-primary ${isTesting ? 'animate-spin' : ''}`}
                  />
                  <span>{isTesting ? 'Menguji Koneksi...' : 'Uji Ping & Latensi RTDB'}</span>
                </button>

                {testResult && (
                  <div
                    className={`p-2.5 rounded text-[11px] flex items-center justify-between border ${
                      testResult.ok
                        ? 'bg-secondary/10 border-secondary/30 text-secondary'
                        : 'bg-error-container border-error/30 text-on-error-container'
                    }`}
                  >
                    <span>{testResult.message}</span>
                    <span className="font-bold">{testResult.latencyMs} ms</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Live RTDB Payload Inspector */}
        <div className="bg-surface-container-lowest rounded-lg p-5 shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                <h2 className="font-hanken font-semibold text-[15px] text-on-surface">
                  Inspeksi Payload JSON Realtime
                </h2>
              </div>
              <span className="font-mono text-[10px] text-outline">REST ENDPOINT</span>
            </div>

            <div className="bg-slate-900 rounded-lg p-3 overflow-x-auto max-h-[320px] font-mono text-[11px] text-emerald-400 border border-slate-800">
              <pre>{JSON.stringify(rawFirebaseData, null, 2)}</pre>
            </div>
          </div>

          <p className="mt-3 text-[10px] font-mono text-outline">
            Endpoint REST URL: {host}/.json?auth=***
          </p>
        </div>
      </div>

      {/* ESP32 / Arduino Code Generator Box */}
      <div className="bg-surface-container-lowest rounded-lg p-5 shadow-sm border border-surface-container-high">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-primary" />
            <h2 className="font-hanken font-semibold text-[15px] text-on-surface">
              Template Firmware Mikrokontroler DHT22 (ESP32 / Arduino IDE)
            </h2>
          </div>

          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface font-mono text-[10px] px-3 py-1 rounded border border-surface-container-high transition-colors cursor-pointer"
          >
            {copiedCode ? <Check className="w-3 h-3 text-secondary" /> : <Copy className="w-3 h-3" />}
            <span>{copiedCode ? 'Disalin ke Clipboard!' : 'Salin Kode C++'}</span>
          </button>
        </div>

        <p className="font-hanken text-[12px] text-on-surface-variant mb-2">
          Gunakan kode C++ ini di Arduino IDE untuk menghubungkan ESP32 + Sensor DHT22 langsung ke Firebase RTDB Anda:
        </p>

        <div className="bg-slate-950 p-3 rounded-lg overflow-x-auto font-mono text-[11px] text-slate-300 border border-slate-800 max-h-[260px]">
          <pre>{arduinoSnippet}</pre>
        </div>
      </div>
    </div>
  );
};
