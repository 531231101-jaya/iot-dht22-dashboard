'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { DhtDashboard } from '@/components/DhtDashboard';
import { HistoryLog } from '@/components/HistoryLog';
import { CalibrationView } from '@/components/CalibrationView';
import { SystemConfigView } from '@/components/SystemConfigView';
import {
  ActiveTab,
  CalibrationOffsets,
  DhtHistoryItem,
  DhtSensorData,
  FirebaseConfig,
  SensorThresholds,
} from '@/types';
import {
  DEFAULT_FIREBASE_CONFIG,
  DEFAULT_OFFSETS,
  DEFAULT_THRESHOLDS,
  fetchDhtData,
  fetchDhtHistory,
} from '@/lib/firebase';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedNode, setSelectedNode] = useState('node-01');
  const [autoSync, setAutoSync] = useState(true);
  const [pollingIntervalMs, setPollingIntervalMs] = useState(2000);
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>(
    DEFAULT_FIREBASE_CONFIG
  );
  const [thresholds, setThresholds] = useState<SensorThresholds>(DEFAULT_THRESHOLDS);
  const [calibrationOffsets, setCalibrationOffsets] = useState<CalibrationOffsets>(DEFAULT_OFFSETS);

  const [isConnected, setIsConnected] = useState(true);
  const [latencyMs, setLatencyMs] = useState(45);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Real-time DHT22 state
  const [dhtData, setDhtData] = useState<DhtSensorData>({
    suhu: 24.0,
    kelembapan: 40.0,
    timestamp: Date.now(),
  });

  const [historyList, setHistoryList] = useState<DhtHistoryItem[]>([]);

  const [rawFirebaseData, setRawFirebaseData] = useState<any>({
    dht22: { kelembapan: 40, suhu: 24 },
    historyDataDHT22: {},
  });

  // Fetch data directly from Firebase Realtime Database
  const syncWithFirebase = useCallback(async () => {
    const startTime = performance.now();
    try {
      // 1. Fetch live DHT22 node (/dht22.json)
      const currentDht = await fetchDhtData(firebaseConfig, calibrationOffsets);
      setDhtData(currentDht);

      // 2. Fetch history records (/historyDataDHT22.json)
      const hist = await fetchDhtHistory(firebaseConfig, thresholds);
      setHistoryList(hist);

      // Connection latency calculation
      const elapsed = Math.round(performance.now() - startTime);
      setLatencyMs(elapsed);
      setIsConnected(true);

      // Raw payload snapshot
      setRawFirebaseData({
        dht22: {
          suhu: currentDht.suhu,
          kelembapan: currentDht.kelembapan,
        },
        historyDataDHT22_total_records: hist.length,
        historySample: hist.slice(0, 3),
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Sync gagal:', err);
      setIsConnected(false);
    }
  }, [firebaseConfig, thresholds, calibrationOffsets]);

  // Initial fetch
  useEffect(() => {
    syncWithFirebase();
  }, [syncWithFirebase]);

  // Auto-sync polling loop
  useEffect(() => {
    if (!autoSync) return;
    const interval = setInterval(() => {
      syncWithFirebase();
    }, pollingIntervalMs);

    return () => clearInterval(interval);
  }, [autoSync, pollingIntervalMs, syncWithFirebase]);

  // Manual refresh trigger
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await syncWithFirebase();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // CSV Exporter for DHT22 History
  const handleExportCsv = () => {
    const headers = [
      'ID Rekaman',
      'Waktu (WIB)',
      'Suhu (°C)',
      'Kelembapan (% RH)',
      'Batas Acuan Suhu',
      'Batas Acuan Kelembapan',
      'Status Operasional',
    ];

    const rows = historyList.map((item) => [
      `"${item.id}"`,
      `"${item.formattedTime}"`,
      item.suhu,
      item.kelembapan,
      `"${thresholds.tempMin} - ${thresholds.tempMax} °C"`,
      `"${thresholds.humMin} - ${thresholds.humMax} %"`,
      `"${item.overallStatus}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `DHT22_Monitoring_Data_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-background min-h-screen text-on-surface">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        rtdbConnected={isConnected}
      />

      {/* Main Layout Area */}
      <div className="pl-64">
        {/* Top Header Bar */}
        <Header
          autoSync={autoSync}
          setAutoSync={setAutoSync}
          isConnected={isConnected}
          latencyMs={latencyMs}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          onRefresh={handleManualRefresh}
          isRefreshing={isRefreshing}
        />

        {/* Dynamic View Container */}
        <main className="w-full pt-20 px-8 pb-12 max-w-[1600px] mx-auto">
          {activeTab === 'dashboard' && (
            <DhtDashboard
              dhtData={dhtData}
              historyList={historyList}
              thresholds={thresholds}
              onRefresh={handleManualRefresh}
              isRefreshing={isRefreshing}
              onExportCsv={handleExportCsv}
            />
          )}

          {activeTab === 'history' && (
            <HistoryLog
              historyList={historyList}
              thresholds={thresholds}
              onRefresh={handleManualRefresh}
              isRefreshing={isRefreshing}
              onExportCsv={handleExportCsv}
            />
          )}

          {activeTab === 'calibration' && (
            <CalibrationView
              currentDht={dhtData}
              thresholds={thresholds}
              setThresholds={setThresholds}
              calibrationOffsets={calibrationOffsets}
              setCalibrationOffsets={setCalibrationOffsets}
            />
          )}

          {(activeTab === 'network' || activeTab === 'settings') && (
            <SystemConfigView
              firebaseConfig={firebaseConfig}
              setFirebaseConfig={setFirebaseConfig}
              rawFirebaseData={rawFirebaseData}
              pollingIntervalMs={pollingIntervalMs}
              setPollingIntervalMs={setPollingIntervalMs}
            />
          )}
        </main>
      </div>
    </div>
  );
}
