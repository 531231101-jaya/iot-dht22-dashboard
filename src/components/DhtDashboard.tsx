'use client';

import React, { useState } from 'react';
import { DhtHistoryItem, DhtSensorData, SensorThresholds } from '@/types';
import { Sliders, RefreshCw, Download } from 'lucide-react';

interface DhtDashboardProps {
  dhtData: DhtSensorData;
  historyList: DhtHistoryItem[];
  thresholds: SensorThresholds;
  onRefresh: () => void;
  isRefreshing: boolean;
  onExportCsv: () => void;
}

export const DhtDashboard: React.FC<DhtDashboardProps> = ({
  dhtData,
  historyList,
  thresholds,
  onRefresh,
  isRefreshing,
  onExportCsv,
}) => {
  const [activeRange, setActiveRange] = useState<'1 Jam' | '24 Jam' | '7 Hari'>('1 Jam');

  const isTempNormal =
    dhtData.suhu >= thresholds.tempMin && dhtData.suhu <= thresholds.tempMax;
  const isHumOptimal =
    dhtData.kelembapan >= thresholds.humMin && dhtData.kelembapan <= thresholds.humMax;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Ringkas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-surface-container gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">
              NODE 01
            </span>
            <span className="font-mono text-[11px] text-on-surface-variant">
              Ruang Server Utama
            </span>
          </div>
          <h1 className="font-hanken font-bold text-[22px] text-on-surface tracking-tight">
            Monitoring Suhu & Kelembapan
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-mono text-[11px] text-secondary font-semibold">
              Online & Sinkron
            </span>
          </div>

          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 bg-surface-container-lowest hover:bg-surface-container text-on-surface font-mono text-[11px] px-3 py-1.5 rounded shadow-xs transition-colors cursor-pointer border border-surface-container-high"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-primary ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span>Perbarui</span>
          </button>
        </div>
      </div>

      {/* 1, 2 & 3: Suhu, Kelembapan & Pengaturan Ambang Batas (Clean Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Kartu 1: Suhu Real-time */}
        <div className="bg-surface-container-lowest rounded-lg p-4 shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                <span className="font-hanken font-semibold text-[14px] text-on-surface">
                  Suhu Ruangan
                </span>
              </div>
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold flex items-center gap-1 ${
                  isTempNormal
                    ? 'bg-secondary/10 text-secondary'
                    : 'bg-error-container text-on-error-container'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isTempNormal ? 'bg-secondary' : 'bg-error'
                  }`}
                />
                {isTempNormal ? 'Normal' : 'Abnormal'}
              </span>
            </div>

            <div className="flex items-baseline gap-1 my-2">
              <span className="font-mono text-[36px] text-on-surface font-bold tracking-tight">
                {dhtData.suhu.toFixed(1)}
              </span>
              <span className="font-hanken text-[16px] text-tertiary font-bold">
                °C
              </span>
            </div>

            <p className="font-hanken text-[12px] text-on-surface-variant mb-3">
              Target ambang batas ideal:{' '}
              <strong className="text-on-surface">
                {thresholds.tempMin.toFixed(1)}°C – {thresholds.tempMax.toFixed(1)}°C
              </strong>
            </p>
          </div>

          <div className="bg-surface-container-low px-3 py-2 rounded flex items-center justify-between font-mono text-[11px] text-on-surface-variant">
            <span>Status Ambang:</span>
            <span
              className={`font-semibold ${
                isTempNormal ? 'text-secondary' : 'text-error'
              }`}
            >
              {isTempNormal ? 'Aman Dalam Batas' : 'Melebihi Ambang'}
            </span>
          </div>
        </div>

        {/* Kartu 2: Kelembapan Real-time */}
        <div className="bg-surface-container-lowest rounded-lg p-4 shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="font-hanken font-semibold text-[14px] text-on-surface">
                  Kelembapan Relatif
                </span>
              </div>
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold flex items-center gap-1 ${
                  isHumOptimal
                    ? 'bg-secondary/10 text-secondary'
                    : 'bg-error-container text-on-error-container'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isHumOptimal ? 'bg-secondary' : 'bg-error'
                  }`}
                />
                {isHumOptimal ? 'Optimal' : 'Waspada'}
              </span>
            </div>

            <div className="flex items-baseline gap-1 my-2">
              <span className="font-mono text-[36px] text-on-surface font-bold tracking-tight">
                {dhtData.kelembapan.toFixed(1)}
              </span>
              <span className="font-hanken text-[16px] text-primary font-bold">
                % RH
              </span>
            </div>

            <p className="font-hanken text-[12px] text-on-surface-variant mb-3">
              Target ambang batas ideal:{' '}
              <strong className="text-on-surface">
                {thresholds.humMin.toFixed(0)}% – {thresholds.humMax.toFixed(0)}% RH
              </strong>
            </p>
          </div>

          <div className="bg-surface-container-low px-3 py-2 rounded flex items-center justify-between font-mono text-[11px] text-on-surface-variant">
            <span>Status Ambang:</span>
            <span
              className={`font-semibold ${
                isHumOptimal ? 'text-secondary' : 'text-error'
              }`}
            >
              {isHumOptimal ? 'Aman Dalam Batas' : 'Melebihi Ambang'}
            </span>
          </div>
        </div>

        {/* Kartu 3: Kontrol Ambang Batas (Threshold Limits) */}
        <div className="bg-surface-container-lowest rounded-lg p-4 shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                <span className="font-hanken font-semibold text-[14px] text-on-surface">
                  Ambang Batas Aman
                </span>
              </div>
              <span className="font-mono text-[10px] text-on-surface-variant">
                Standar Server
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="p-2 bg-surface-container-low rounded">
                <div className="flex justify-between items-center mb-1 font-mono text-[11px]">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-tertiary" /> Batas Suhu
                  </span>
                  <span className="font-semibold text-on-surface">
                    {thresholds.tempMin.toFixed(1)}°C – {thresholds.tempMax.toFixed(1)}°C
                  </span>
                </div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden flex">
                  <div className="bg-tertiary/40 w-1/5" />
                  <div className="bg-secondary w-3/5" />
                  <div className="bg-error/50 w-1/5" />
                </div>
              </div>

              <div className="p-2 bg-surface-container-low rounded">
                <div className="flex justify-between items-center mb-1 font-mono text-[11px]">
                  <span className="text-on-surface-variant flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary" /> Batas Kelembapan
                  </span>
                  <span className="font-semibold text-on-surface">
                    {thresholds.humMin.toFixed(0)}% – {thresholds.humMax.toFixed(0)}% RH
                  </span>
                </div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden flex">
                  <div className="bg-primary/30 w-1/4" />
                  <div className="bg-secondary w-2/4" />
                  <div className="bg-error/50 w-1/4" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-on-surface-variant font-mono text-[10px]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> Zona Hijau: Aman
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-error" /> Zona Merah: Waspada
            </span>
          </div>
        </div>
      </div>

      {/* 4: Grafik Tren Simpel Suhu vs Kelembapan */}
      <div className="bg-surface-container-lowest rounded-lg p-4 shadow-sm border border-surface-container-high">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-container mb-3">
          <div>
            <h2 className="font-hanken font-semibold text-[14px] text-on-surface">
              Grafik Tren Suhu & Kelembapan
            </h2>
            <span className="font-mono text-[10px] text-on-surface-variant">
              Pemantauan kontinu 1 jam terakhir
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="flex items-center gap-1 text-on-surface font-medium">
                <span className="w-2.5 h-1 bg-tertiary rounded" /> Suhu (°C)
              </span>
              <span className="flex items-center gap-1 text-on-surface font-medium">
                <span className="w-2.5 h-1 bg-primary rounded" /> Kelembapan (%)
              </span>
            </div>

            <div className="flex items-center bg-surface-container-low p-0.5 rounded border border-surface-container-high">
              {(['1 Jam', '24 Jam', '7 Hari'] as const).map((rng) => (
                <button
                  key={rng}
                  onClick={() => setActiveRange(rng)}
                  className={`font-mono text-[10px] px-2.5 py-0.5 rounded transition-colors cursor-pointer ${
                    activeRange === rng
                      ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {rng}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SVG Curve Plot */}
        <div className="relative w-full h-[220px] p-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 760 200">
            {/* Grid Lines Minimal */}
            <g stroke="#eceef0" strokeDasharray="2,4" strokeWidth="1">
              <line x1="35" x2="750" y1="20" y2="20" />
              <line x1="35" x2="750" y1="65" y2="65" />
              <line x1="35" x2="750" y1="110" y2="110" />
              <line x1="35" x2="750" y1="155" y2="155" />
            </g>

            {/* Y-Axis Labels: Left for Suhu (°C) */}
            <g className="font-mono text-[10px] fill-tertiary" textAnchor="end">
              <text x="30" y="24">30°C</text>
              <text x="30" y="69">27°C</text>
              <text x="30" y="114">24°C</text>
              <text x="30" y="159">21°C</text>
            </g>

            {/* Y-Axis Labels: Right for Kelembapan (%) */}
            <g className="font-mono text-[10px] fill-primary" textAnchor="start">
              <text x="755" y="24">60%</text>
              <text x="755" y="69">50%</text>
              <text x="755" y="114">40%</text>
              <text x="755" y="159">30%</text>
            </g>

            {/* Dynamic Historical Curves or Default Reference */}
            {historyList.length > 1 ? (
              (() => {
                const recent = [...historyList].reverse().slice(-10);
                const count = recent.length;
                const stepX = (750 - 35) / Math.max(1, count - 1);

                const mapTempY = (val: number) => {
                  const clamped = Math.max(20, Math.min(30, val));
                  return 170 - ((clamped - 20) / 10) * 150;
                };

                const mapHumY = (val: number) => {
                  const clamped = Math.max(30, Math.min(60, val));
                  return 170 - ((clamped - 30) / 30) * 150;
                };

                const tempPts = recent.map(
                  (pt, idx) => `${35 + idx * stepX},${mapTempY(pt.suhu)}`
                );
                const humPts = recent.map(
                  (pt, idx) => `${35 + idx * stepX},${mapHumY(pt.kelembapan)}`
                );

                return (
                  <>
                    <polyline
                      fill="none"
                      stroke="#994100"
                      strokeWidth="2.5"
                      points={tempPts.join(' ')}
                    />
                    <polyline
                      fill="none"
                      stroke="#006194"
                      strokeWidth="2.5"
                      points={humPts.join(' ')}
                    />
                    {recent.map((pt, idx) => (
                      <g key={idx}>
                        <circle
                          cx={35 + idx * stepX}
                          cy={mapTempY(pt.suhu)}
                          r="3.5"
                          fill="#ffffff"
                          stroke="#994100"
                          strokeWidth="2"
                        />
                        <circle
                          cx={35 + idx * stepX}
                          cy={mapHumY(pt.kelembapan)}
                          r="3.5"
                          fill="#ffffff"
                          stroke="#006194"
                          strokeWidth="2"
                        />
                      </g>
                    ))}
                  </>
                );
              })()
            ) : (
              <>
                <path
                  d="M 35,80 C 120,78 200,72 300,74 C 400,76 500,68 620,70 C 690,71 720,68 750,66"
                  fill="none"
                  stroke="#994100"
                  strokeWidth="2.5"
                />
                <path
                  d="M 35,105 C 120,102 200,118 300,112 C 400,106 500,110 620,105 C 690,103 720,108 750,106"
                  fill="none"
                  stroke="#006194"
                  strokeWidth="2.5"
                />
              </>
            )}

            {/* X-Axis Timestamps */}
            <g
              className="font-mono text-[10px] fill-on-surface-variant"
              textAnchor="middle"
            >
              <text x="35" y="185">19:00</text>
              <text x="180" y="185">19:15</text>
              <text x="325" y="185">19:30</text>
              <text x="470" y="185">19:45</text>
              <text x="620" y="185">19:55</text>
              <text x="750" y="185">20:00</text>
            </g>
          </svg>
        </div>
      </div>

      {/* 5: Tabel Riwayat Rekaman Data Suhu & Kelembapan */}
      <div className="bg-surface-container-lowest rounded-lg p-4 shadow-sm border border-surface-container-high">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 gap-2 border-b border-surface-container">
          <div>
            <h2 className="font-hanken font-semibold text-[14px] text-on-surface">
              Riwayat Rekaman Data Realtime
            </h2>
            <span className="font-mono text-[10px] text-on-surface-variant">
              Log berkala suhu dan kelembapan dari Firebase RTDB
            </span>
          </div>

          <button
            onClick={onExportCsv}
            className="bg-surface-container-low hover:bg-surface-container text-on-surface font-mono text-[11px] px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 cursor-pointer w-fit border border-surface-container-high"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>Ekspor CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono">
            <thead>
              <tr className="bg-surface-container-low text-outline text-[10px] uppercase tracking-wider">
                <th className="py-2 px-3 rounded-l">Waktu (WIB)</th>
                <th className="py-2 px-3 text-right">Suhu (°C)</th>
                <th className="py-2 px-3 text-right">Kelembapan (%)</th>
                <th className="py-2 px-3 text-center">Batas Suhu</th>
                <th className="py-2 px-3 text-center">Batas Kelembapan</th>
                <th className="py-2 px-3 rounded-r text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-on-surface text-[12px] divide-y divide-surface-container">
              {historyList.slice(0, 5).map((row, idx) => (
                <tr
                  key={row.id}
                  className={`hover:bg-surface-container-low transition-colors ${
                    idx % 2 === 1 ? 'bg-surface-container-low/40' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-semibold text-on-surface">
                    {row.formattedTime}
                  </td>
                  <td className="py-2.5 px-3 text-right text-tertiary font-bold">
                    {row.suhu.toFixed(1)} °C
                  </td>
                  <td className="py-2.5 px-3 text-right text-primary font-bold">
                    {row.kelembapan.toFixed(1)} %
                  </td>
                  <td className="py-2.5 px-3 text-center text-on-surface-variant text-[11px]">
                    {thresholds.tempMin.toFixed(0)} - {thresholds.tempMax.toFixed(0)} °C
                  </td>
                  <td className="py-2.5 px-3 text-center text-on-surface-variant text-[11px]">
                    {thresholds.humMin.toFixed(0)} - {thresholds.humMax.toFixed(0)} %
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        row.overallStatus === 'Normal / Aman'
                          ? 'bg-secondary/10 text-secondary'
                          : 'bg-error-container text-on-error-container'
                      }`}
                    >
                      {row.overallStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
