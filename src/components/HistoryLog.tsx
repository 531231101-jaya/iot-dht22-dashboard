'use client';

import React, { useState } from 'react';
import { DhtHistoryItem, SensorThresholds } from '@/types';
import { Download, Search, Filter, RefreshCw } from 'lucide-react';

interface HistoryLogProps {
  historyList: DhtHistoryItem[];
  thresholds: SensorThresholds;
  onRefresh: () => void;
  isRefreshing: boolean;
  onExportCsv: () => void;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({
  historyList,
  thresholds,
  onRefresh,
  isRefreshing,
  onExportCsv,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'normal' | 'warning'>('all');

  const filteredDht = historyList.filter((item) => {
    const matchesSearch =
      item.formattedTime?.includes(searchQuery) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'normal') return item.overallStatus === 'Normal / Aman';
    if (statusFilter === 'warning') return item.overallStatus !== 'Normal / Aman';
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-surface-container gap-2">
        <div>
          <h1 className="font-hanken font-bold text-[22px] text-on-surface tracking-tight">
            Riwayat Rekaman Data & Log
          </h1>
          <p className="font-mono text-[11px] text-on-surface-variant">
            Penyimpanan log berkala suhu dan kelembapan dari Firebase RTDB (`historyDataDHT22`)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 bg-surface-container-lowest hover:bg-surface-container text-on-surface font-mono text-[11px] px-3 py-1.5 rounded shadow-xs transition-colors cursor-pointer border border-surface-container-high"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-primary ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span>Sinkron Ulang</span>
          </button>

          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white font-mono text-[11px] px-3 py-1.5 rounded shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="bg-surface-container-lowest p-4 rounded-lg border border-surface-container-high shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-on-surface-variant">
            Total Rekaman di Firebase: <strong className="text-on-surface">{historyList.length}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-outline" />
            <input
              type="text"
              placeholder="Cari waktu atau ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-surface-container-low border border-surface-container-high rounded text-[11px] font-mono focus:outline-none focus:border-primary text-on-surface"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-surface-container-low px-2 py-1 rounded border border-surface-container-high text-[11px] font-mono text-on-surface-variant">
            <Filter className="w-3 h-3 text-outline" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent focus:outline-none cursor-pointer text-on-surface"
            >
              <option value="all">Semua Status</option>
              <option value="normal">Normal / Aman</option>
              <option value="warning">Waspada Ambang Batas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-surface-container-lowest rounded-lg p-4 shadow-sm border border-surface-container-high overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono">
            <thead>
              <tr className="bg-surface-container-low text-outline text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-3 rounded-l">Firebase Record ID</th>
                <th className="py-2.5 px-3">Waktu (WIB)</th>
                <th className="py-2.5 px-3 text-right">Suhu (°C)</th>
                <th className="py-2.5 px-3 text-right">Kelembapan (%)</th>
                <th className="py-2.5 px-3 text-center">Batas Acuan</th>
                <th className="py-2.5 px-3 rounded-r text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-on-surface text-[12px] divide-y divide-surface-container">
              {filteredDht.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-outline">
                    Tidak ada rekaman data yang cocok.
                  </td>
                </tr>
              ) : (
                filteredDht.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-surface-container-low transition-colors ${
                      idx % 2 === 1 ? 'bg-surface-container-low/40' : ''
                    }`}
                  >
                    <td className="py-2 px-3 text-[10px] text-outline font-semibold">
                      {row.id}
                    </td>
                    <td className="py-2 px-3 font-semibold text-on-surface">
                      {row.formattedTime}
                    </td>
                    <td className="py-2 px-3 text-right text-tertiary font-bold">
                      {row.suhu.toFixed(1)} °C
                    </td>
                    <td className="py-2 px-3 text-right text-primary font-bold">
                      {row.kelembapan.toFixed(1)} %
                    </td>
                    <td className="py-2 px-3 text-center text-on-surface-variant text-[10px]">
                      {thresholds.tempMin.toFixed(0)} - {thresholds.tempMax.toFixed(0)}°C | {thresholds.humMin.toFixed(0)} - {thresholds.humMax.toFixed(0)}%
                    </td>
                    <td className="py-2 px-3 text-center">
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
