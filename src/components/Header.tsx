import React, { useState, useEffect } from 'react';
import { 
  Volume2, VolumeX, ShieldCheck, Clock, Users, ArrowRightLeft, 
  Store, ShoppingCart, Package, Truck, BarChart3, Menu, X, BookOpen
} from 'lucide-react';

export type NavTab = 'pos' | 'catalog' | 'inventory' | 'suppliers' | 'metrics';

interface HeaderProps {
  storeName: string;
  storeNumber: string;
  terminalNumber: string;
  cashierName: string;
  cashierId: string;
  soundEnabled: boolean;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onToggleSound: () => void;
  onOpenSecondRegister: () => void;
  onOpenCorteCaja: () => void;
  cartCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  storeName,
  storeNumber,
  terminalNumber,
  cashierName,
  cashierId,
  soundEnabled,
  activeTab,
  onSelectTab,
  onToggleSound,
  onOpenSecondRegister,
  onOpenCorteCaja,
  cartCount,
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
        }).toUpperCase()
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'pos', label: 'Caja Cobro', icon: ShoppingCart, badge: cartCount > 0 ? cartCount : undefined },
    { id: 'catalog', label: 'Catálogo', icon: BookOpen },
    { id: 'inventory', label: 'Inventario', icon: Package },
    { id: 'suppliers', label: 'Proveedores', icon: Truck },
    { id: 'metrics', label: 'Métricas', icon: BarChart3 },
  ];

  return (
    <header className="bg-[#E21B23] text-white border-b-2 sm:border-b-4 border-[#FFCE00] select-none no-print shrink-0 shadow-md">
      {/* Top Micro Information Bar (Responsive single line with ellipsis if needed) */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-1 bg-[#C1121F] text-[10px] sm:text-xs font-mono border-b border-red-700/60 overflow-hidden">
        <div className="flex items-center gap-1.5 sm:gap-2.5 truncate">
          <span className="flex items-center gap-1 font-bold text-[#FFCE00] truncate">
            <Store className="w-3 h-3 shrink-0" />
            <span className="truncate">{storeName}</span>
          </span>
          <span className="text-red-300 hidden sm:inline">·</span>
          <span className="text-red-100 hidden sm:flex items-center gap-1 shrink-0">
            <Users className="w-3 h-3 text-red-200" />
            <span>Cajero:</span>
            <strong className="text-white">{cashierName}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-1 text-red-100 font-mono text-[10px] sm:text-xs">
            <Clock className="w-3 h-3 text-[#FFCE00] shrink-0" />
            <span className="hidden md:inline">{currentDate}</span>
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

      {/* Main Branding & Navigation Row */}
      <div className="px-2 sm:px-4 py-1.5 sm:py-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 bg-gradient-to-r from-[#E21B23] via-[#DC2626] to-[#B91C1C]">
        {/* Left Side: Brand Logo Emblem & Terminal indicator */}
        <div className="flex items-center justify-between md:justify-start gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            {/* Authentic Red & Yellow Retail Emblem */}
            <div className="flex items-center bg-[#FFCE00] px-2.5 py-0.5 sm:py-1 rounded shadow-xs">
              <span className="text-[#E21B23] font-black text-lg sm:text-xl tracking-tight uppercase font-sans drop-shadow-xs">
                MARICELA
              </span>
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">
                  Punto de Venta
                </span>
                <span className="bg-[#FFCE00] text-[#991B1B] text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded uppercase">
                  {terminalNumber}
                </span>
              </div>
              <span className="text-[10px] text-red-100 hidden sm:block font-mono">
                Abarrotes & Retail SyV 7.4
              </span>
            </div>
          </div>

          {/* Quick Action Buttons for small screens right in brand row */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={onOpenSecondRegister}
              className="p-1.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded text-[11px] font-semibold border border-red-400/40"
              title="Caja 2"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#FFCE00]" />
            </button>
            <button
              onClick={onOpenCorteCaja}
              className="px-2 py-1 bg-neutral-900 text-white rounded text-[11px] font-bold border border-neutral-700 font-mono"
            >
              <span className="text-[#FFCE00]">F10</span>
            </button>
          </div>
        </div>

        {/* Center / Right: Responsive Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-[#E21B23] shadow-sm ring-2 ring-yellow-400/50'
                    : 'bg-red-800/60 hover:bg-red-800 text-white/90 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E21B23]' : 'text-[#FFCE00]'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-[#E21B23] text-white' : 'bg-[#FFCE00] text-neutral-900 font-black'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Desktop Only Extra Action Buttons */}
          <div className="hidden lg:flex items-center gap-1.5 ml-2 pl-2 border-l border-red-500/60">
            <button
              onClick={onOpenSecondRegister}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#B91C1C] hover:bg-[#991B1B] text-white border border-red-400/40 rounded text-xs font-semibold transition-colors cursor-pointer"
              title="Estado de la Caja 2"
            >
              <ArrowRightLeft className="w-3 h-3 text-[#FFCE00]" />
              <span className="text-[11px]">Caja 2</span>
            </button>

            <button
              onClick={onOpenCorteCaja}
              className="flex items-center gap-1 px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-semibold transition-colors cursor-pointer border border-neutral-700"
              title="Corte de Caja (F10)"
            >
              <span className="text-[#FFCE00] font-mono font-bold text-[11px]">F10</span>
              <span className="text-[11px]">Corte</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
