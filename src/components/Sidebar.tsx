'use client';

import React from 'react';
import {
  LayoutDashboard,
  Sliders,
  History,
  Settings,
  Database,
  Radio,
} from 'lucide-react';
import { ActiveTab } from '@/types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  rtdbConnected: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  rtdbConnected,
}) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-container-low flex flex-col justify-between z-40 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-surface-container select-none">
      <div className="flex flex-col">
        {/* Brand / Logo Header */}
        <div className="h-14 px-space-lg flex items-center gap-space-sm bg-surface-container border-b border-surface-container-high">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-hanken font-bold text-[14px] text-on-surface leading-none tracking-tight">
              EDGE.NODE IoT
            </span>
            <span className="font-mono text-[10px] text-on-surface-variant leading-tight mt-0.5">
              Telemetry Gateway
            </span>
          </div>
        </div>

        {/* Navigation Group 1: Operasional Node */}
        <div className="px-space-md py-space-sm">
          <div className="px-space-sm py-space-xs mb-space-xs">
            <span className="font-mono text-[10px] text-outline uppercase tracking-wider font-semibold">
              Operasional Node
            </span>
          </div>
          <nav className="flex flex-col gap-space-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-space-md px-space-md py-space-sm transition-colors rounded-lg text-left cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="font-hanken text-[13px] font-medium">
                Dashboard
              </span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-space-md px-space-md py-space-sm transition-colors rounded-lg text-left cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="font-hanken text-[13px] font-medium">
                Riwayat Data & Log
              </span>
            </button>

            <button
              onClick={() => setActiveTab('calibration')}
              className={`w-full flex items-center gap-space-md px-space-md py-space-sm transition-colors rounded-lg text-left cursor-pointer ${
                activeTab === 'calibration'
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span className="font-hanken text-[13px] font-medium">
                Kalibrasi Sensor
              </span>
            </button>
          </nav>
        </div>

        {/* Navigation Group 2: Sistem & Jaringan */}
        <div className="px-space-md py-space-xs">
          <div className="px-space-sm py-space-xs mb-space-xs">
            <span className="font-mono text-[10px] text-outline uppercase tracking-wider font-semibold">
              Sistem & Jaringan
            </span>
          </div>
          <nav className="flex flex-col gap-space-xs">
            <button
              onClick={() => setActiveTab('network')}
              className={`w-full flex items-center gap-space-md px-space-md py-space-sm transition-colors rounded-lg text-left cursor-pointer ${
                activeTab === 'network'
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <Database className="w-4 h-4" />
              <span className="font-hanken text-[13px] font-medium">
                Konfigurasi Node & Firebase
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-space-md px-space-md py-space-sm transition-colors rounded-lg text-left cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="font-hanken text-[13px] font-medium">
                Pengaturan Sistem
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom Diagnostics Summary */}
      <div className="p-3 border-t border-surface-container bg-surface-container-lowest/60">
        <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant mb-1">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                rtdbConnected ? 'bg-secondary' : 'bg-error'
              }`}
            />
            Firebase RTDB
          </span>
          <span className="text-[9px] text-secondary font-semibold">ONLINE</span>
        </div>
        <p className="text-[9px] font-mono text-outline truncate" title="jaya-amin-project-default-rtdb">
          jaya-amin-project-default...
        </p>
      </div>
    </aside>
  );
};
