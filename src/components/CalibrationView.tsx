'use client';

import React, { useState } from 'react';
import { CalibrationOffsets, DhtSensorData, SensorThresholds } from '@/types';
import { Sliders, RotateCcw, Save, Check, Thermometer, Droplets, Info } from 'lucide-react';

interface CalibrationViewProps {
  currentDht: DhtSensorData;
  thresholds: SensorThresholds;
  setThresholds: (t: SensorThresholds) => void;
  calibrationOffsets: CalibrationOffsets;
  setCalibrationOffsets: (offsets: CalibrationOffsets) => void;
}

export const CalibrationView: React.FC<CalibrationViewProps> = ({
  currentDht,
  thresholds,
  setThresholds,
  calibrationOffsets,
  setCalibrationOffsets,
}) => {
  const [formThresholds, setFormThresholds] = useState(thresholds);
  const [offsets, setOffsets] = useState(calibrationOffsets);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleResetOffsets = () => {
    const zero: CalibrationOffsets = { tempOffset: 0, humOffset: 0 };
    setOffsets(zero);
    setCalibrationOffsets(zero);
    triggerSaved();
  };

  const handleSave = () => {
    setThresholds(formThresholds);
    setCalibrationOffsets(offsets);
    triggerSaved();
  };

  const triggerSaved = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-surface-container gap-2">
        <div>
          <h1 className="font-hanken font-bold text-[22px] text-on-surface tracking-tight">
            Kalibrasi Sensor & Ambang Batas
          </h1>
          <p className="font-mono text-[11px] text-on-surface-variant">
            Penyetelan offset koreksi suhu/kelembapan dan penetapan batas alarm lingkungan
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white font-mono text-[11px] px-4 py-2 rounded shadow-xs transition-colors cursor-pointer"
        >
          {savedMsg ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          <span>{savedMsg ? 'Tersimpan!' : 'Simpan Perubahan'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Offset Kalibrasi DHT22 */}
        <div className="bg-surface-container-lowest rounded-lg p-5 shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                <h2 className="font-hanken font-semibold text-[15px] text-on-surface">
                  Koreksi Offset Sensor DHT22
                </h2>
              </div>
              <span className="font-mono text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold">
                HARDWARE OFFSET
              </span>
            </div>

            <p className="font-hanken text-[12px] text-on-surface-variant mb-4">
              Gunakan pengaturan offset ini untuk mencocokkan pembacaan sensor DHT22 dengan alat ukur kalibrator standar laboratorium.
            </p>

            <div className="bg-surface-container-low p-3 rounded-lg mb-4 flex items-center justify-between font-mono text-[11px]">
              <div>
                <span className="text-outline block text-[10px]">Nilai Sensor Saat Ini (Setelah Offset)</span>
                <span className="font-bold text-on-surface">
                  Suhu: {currentDht.suhu}°C | Kelembapan: {currentDht.kelembapan}% RH
                </span>
              </div>
            </div>

            {/* Offset Inputs */}
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Thermometer className="w-4 h-4 text-tertiary" />
                  <label className="text-[11px] font-mono text-on-surface font-semibold">
                    Offset Koreksi Suhu (°C)
                  </label>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={offsets.tempOffset}
                  onChange={(e) =>
                    setOffsets({ ...offsets, tempOffset: Number(e.target.value) })
                  }
                  className="w-full bg-surface-container-low border border-surface-container-high rounded p-2 text-[12px] font-mono text-on-surface focus:outline-none focus:border-primary"
                  placeholder="0.0"
                />
                <span className="text-[10px] font-mono text-outline mt-1 block">
                  Contoh: isi -1.2 jika pembacaan terlalu tinggi 1.2°C
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Droplets className="w-4 h-4 text-primary" />
                  <label className="text-[11px] font-mono text-on-surface font-semibold">
                    Offset Koreksi Kelembapan (% RH)
                  </label>
                </div>
                <input
                  type="number"
                  step="0.5"
                  value={offsets.humOffset}
                  onChange={(e) =>
                    setOffsets({ ...offsets, humOffset: Number(e.target.value) })
                  }
                  className="w-full bg-surface-container-low border border-surface-container-high rounded p-2 text-[12px] font-mono text-on-surface focus:outline-none focus:border-primary"
                  placeholder="0.0"
                />
                <span className="text-[10px] font-mono text-outline mt-1 block">
                  Contoh: isi +2.0 jika pembacaan terlalu rendah 2%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-surface-container flex justify-end">
            <button
              onClick={handleResetOffsets}
              className="flex items-center gap-1.5 text-outline hover:text-on-surface text-[11px] font-mono transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Offset ke Default (0)</span>
            </button>
          </div>
        </div>

        {/* Card 2: Pengaturan Ambang Batas Toleransi */}
        <div className="bg-surface-container-lowest rounded-lg p-5 shadow-sm border border-surface-container-high flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                <h2 className="font-hanken font-semibold text-[15px] text-on-surface">
                  Ambang Batas Lingkungan (Threshold Alarm)
                </h2>
              </div>
              <span className="font-mono text-[10px] text-secondary font-semibold">
                TRIGGER ALARM
              </span>
            </div>

            <div className="flex flex-col gap-4 font-mono text-[11px]">
              {/* Suhu Range */}
              <div className="p-3 bg-surface-container-low rounded-lg">
                <span className="text-[10px] uppercase text-outline font-semibold block mb-2">
                  Rentang Aman Suhu Ruangan (°C)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-on-surface-variant text-[10px] mb-1">
                      Batas Minimum Suhu (°C)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={formThresholds.tempMin}
                      onChange={(e) =>
                        setFormThresholds({
                          ...formThresholds,
                          tempMin: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white border border-surface-container-high rounded p-2 font-bold text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="block text-on-surface-variant text-[10px] mb-1">
                      Batas Maksimum Suhu (°C)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={formThresholds.tempMax}
                      onChange={(e) =>
                        setFormThresholds({
                          ...formThresholds,
                          tempMax: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white border border-surface-container-high rounded p-2 font-bold text-on-surface"
                    />
                  </div>
                </div>
              </div>

              {/* Kelembapan Range */}
              <div className="p-3 bg-surface-container-low rounded-lg">
                <span className="text-[10px] uppercase text-outline font-semibold block mb-2">
                  Rentang Aman Kelembapan Relatif (% RH)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-on-surface-variant text-[10px] mb-1">
                      Batas Minimum Kelembapan (%)
                    </label>
                    <input
                      type="number"
                      value={formThresholds.humMin}
                      onChange={(e) =>
                        setFormThresholds({
                          ...formThresholds,
                          humMin: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white border border-surface-container-high rounded p-2 font-bold text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="block text-on-surface-variant text-[10px] mb-1">
                      Batas Maksimum Kelembapan (%)
                    </label>
                    <input
                      type="number"
                      value={formThresholds.humMax}
                      onChange={(e) =>
                        setFormThresholds({
                          ...formThresholds,
                          humMax: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white border border-surface-container-high rounded p-2 font-bold text-on-surface"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-surface-container flex items-center gap-2 text-on-surface-variant text-[11px]">
            <Info className="w-3.5 h-3.5 text-primary" />
            <span>Jika nilai sensor berada di luar rentang ini, indikator status otomatis beralih ke Waspada / Abnormal.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
