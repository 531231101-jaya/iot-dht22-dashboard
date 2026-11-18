'use client';

import React from 'react';
import { Wifi, BatteryMedium, User, RefreshCw, Server } from 'lucide-react';

interface HeaderProps {
  autoSync: boolean;
  setAutoSync: (val: boolean) => void;
  isConnected: boolean;
  latencyMs: number;
  selectedNode: string;
  setSelectedNode: (node: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  autoSync,
  setAutoSync,
  isConnected,
  latencyMs,
  selectedNode,
  setSelectedNode,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="fixed top-0 left-64 right-0 h-14 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-30 flex items-center justify-between px-space-margin-desktop-wide border-b border-surface-container">
      {/* Left items: Node selector & Hardware Status */}
      <div className="flex items-center gap-space-lg">
        {/* Node Dropdown */}
        <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-1.5 rounded-lg border border-surface-container-high">
          <Server className="w-4 h-4 text-primary" />
          <select
            value={selectedNode}
            onChange={(e) => setSelectedNode(e.target.value)}
            className="bg-transparent font-hanken font-semibold text-[13px] text-on-surface focus:outline-none cursor-pointer pr-space-xs"
          >
            <option value="node-01">Node 01 - Ruang Server</option>
            <option value="node-02">Node 02 - Green House Utama</option>
            <option value="node-03">Node 03 - Laboratorium Uji</option>
            <option value="node-04">Node 04 - Gardu Trafo Luar</option>
          </select>
        </div>

        <div className="h-6 w-px bg-surface-container-high" />

        {/* Real-time Connection status */}
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-1.5 bg-surface-container-low px-space-sm py-1 rounded border border-surface-container-high">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-secondary animate-pulse' : 'bg-error'
              }`}
            />
            <span className="font-mono text-[10px] text-secondary font-medium">
              {isConnected ? `Firebase RTDB Connected (${latencyMs}ms)` : 'Disconnected'}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-surface-container-low px-space-sm py-1 rounded text-on-surface-variant">
            <Wifi className="w-3.5 h-3.5 text-primary" />
            <span className="font-mono text-[10px] text-on-surface font-medium">-52 dBm</span>
          </div>

          <div className="flex items-center gap-1 bg-surface-container-low px-space-sm py-1 rounded text-on-surface-variant">
            <BatteryMedium className="w-3.5 h-3.5 text-secondary" />
            <span className="font-mono text-[10px] text-on-surface font-medium">94%</span>
          </div>
        </div>
      </div>

      {/* Right items: Sync Otomatis switch & Operator Profile */}
      <div className="flex items-center gap-space-lg">
        {/* Sync Otomatis switch */}
        <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-1 rounded-lg border border-surface-container-high">
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider font-medium">
            Sync Otomatis
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>

        {/* Manual Refresh Button */}
        <button
          onClick={onRefresh}
          title="Perbarui data sekarang"
          className="p-1.5 rounded hover:bg-surface-container text-on-surface transition-colors border border-surface-container-high cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-primary ${isRefreshing ? 'animate-spin' : ''}`}
          />
        </button>

        <div className="h-6 w-px bg-surface-container-high" />

        {/* Operator Profile */}
        <div className="flex items-center gap-space-md">
          <div className="flex flex-col text-right leading-tight">
            <span className="font-hanken font-semibold text-[13px] text-on-surface">
              Admin Operator
            </span>
            <span className="font-mono text-[10px] text-on-surface-variant">
              Level 1 • SRE Lead
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
