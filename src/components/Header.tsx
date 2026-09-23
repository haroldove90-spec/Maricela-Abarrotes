import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ShieldCheck, Clock, Users, ArrowRightLeft, Store } from 'lucide-react';

interface HeaderProps {
  storeName: string;
  storeNumber: string;
  terminalNumber: string;
  cashierName: string;
  cashierId: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSecondRegister: () => void;
  onOpenCorteCaja: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  storeName,
  storeNumber,
  terminalNumber,
  cashierName,
  cashierId,
  soundEnabled,
  onToggleSound,
  onOpenSecondRegister,
  onOpenCorteCaja,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('es-MX', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('es-MX', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }).toUpperCase()
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#E21B23] text-white border-b-4 border-[#FFCE00] select-none no-print">
      {/* Top Banner Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#C1121F] text-xs font-mono border-b border-red-700/50">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold tracking-wider text-[#FFCE00]">
            <Store className="w-3.5 h-3.5" />
            {storeName} ({storeNumber})
          </span>
          <span className="text-red-200">·</span>
          <span className="text-red-100 flex items-center gap-1">
            <Users className="w-3 h-3 text-red-200" />
            Cajero: <strong className="text-white font-semibold">{cashierName}</strong> [#{cashierId}]
          </span>
          <span className="text-red-200">·</span>
          <span className="text-emerald-300 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            SISTEMA EN SERVICIO
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-red-100 font-mono">
            <Clock className="w-3 h-3 text-[#FFCE00]" />
            <span>{currentDate}</span>
            <span className="text-[#FFCE00] font-bold">{currentTime}</span>
          </div>
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Silenciar sonidos del sistema' : 'Activar sonidos del sistema'}
            className="p-1 hover:bg-red-800 rounded text-red-200 hover:text-white transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-red-300" />}
          </button>
        </div>
      </div>

      {/* Main Brand & Workstation Ribbon */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#E21B23] via-[#DC2626] to-[#B91C1C]">
        {/* Authentic OXXO Emblem */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#FFCE00] px-3 py-1 rounded shadow-sm">
            <span className="text-[#E21B23] font-black text-2xl tracking-tighter uppercase font-sans drop-shadow-sm">
              OXXO
            </span>
          </div>
          <div className="border-l border-red-500/60 pl-3">
            <h1 className="text-sm font-black tracking-tight text-white uppercase font-sans flex items-center gap-2">
              Punto de Venta
              <span className="bg-[#FFCE00] text-[#991B1B] text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                {terminalNumber}
              </span>
            </h1>
            <p className="text-[11px] text-red-100 font-mono tracking-wide">
              Terminal POS SyV 7.4 · Servicios & Retail
            </p>
          </div>
        </div>

        {/* Action Badges & Secondary Register Switcher */}
        <div className="flex items-center gap-2">
          {/* Famous Mexican "Segunda Caja" Button */}
          <button
            onClick={onOpenSecondRegister}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white border border-red-400/40 rounded text-xs font-semibold shadow-sm transition-all cursor-pointer"
            title="Estado de la Caja 2"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#FFCE00]" />
            <span>Caja 2: En la otra caja le cobran</span>
          </button>

          {/* Corte de Caja Button */}
          <button
            onClick={onOpenCorteCaja}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold shadow-sm transition-all cursor-pointer border border-neutral-700"
          >
            <span className="text-[#FFCE00] font-mono font-bold">F10</span>
            <span>Corte de Caja</span>
          </button>
        </div>
      </div>
    </header>
  );
};
