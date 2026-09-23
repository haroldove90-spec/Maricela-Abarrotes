import React, { useState, useEffect } from 'react';
import { 
  Volume2, VolumeX, ShieldCheck, Clock, Users, ArrowRightLeft, 
  Store, ShoppingCart, Package, Truck, BarChart3, Menu, X, BookOpen, Camera
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
  onOpenCameraScanner?: () => void;
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
  onOpenCameraScanner,
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
      {/* Top Micro Information Bar */}
      <div className="flex items-center justify-between px-2.5 sm:px-4 py-1.5 bg-[#C1121F] text-xs sm:text-sm font-mono border-b border-red-700/60 overflow-hidden">
        <div className="flex items-center gap-2 sm:gap-3 truncate">
          <span className="flex items-center gap-1.5 font-black text-[#FFCE00] truncate text-xs sm:text-sm">
            <Store className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{storeName}</span>
          </span>
          <span className="text-red-300 hidden sm:inline">·</span>
          <span className="text-red-100 hidden sm:flex items-center gap-1.5 shrink-0 text-xs sm:text-sm">
            <Users className="w-3.5 h-3.5 text-red-200" />
            <span>Cajero:</span>
            <strong className="text-white font-bold">{cashierName}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <div className="flex items-center gap-1.5 text-red-100 font-mono text-xs sm:text-sm">
            <Clock className="w-3.5 h-3.5 text-[#FFCE00] shrink-0" />
            <span className="hidden md:inline">{currentDate}</span>
            <span className="text-[#FFCE00] font-black">{currentTime}</span>
          </div>
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Silenciar sonidos del sistema' : 'Activar sonidos del sistema'}
            className="p-1 hover:bg-red-800 rounded text-red-200 hover:text-white transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-300" />}
          </button>
        </div>
      </div>

      {/* Main Branding & Navigation Row */}
      <div className="px-2.5 sm:px-4 py-2 sm:py-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 bg-gradient-to-r from-[#E21B23] via-[#DC2626] to-[#B91C1C]">
        {/* Left Side: Brand Logo Emblem & Terminal indicator */}
        <div className="flex items-center justify-between md:justify-start gap-2.5 sm:gap-3.5">
          <div className="flex items-center gap-2.5">
            {/* Authentic Red & Yellow Retail Emblem */}
            <div className="flex items-center bg-[#FFCE00] px-3 py-1 sm:py-1.5 rounded-lg shadow-sm">
              <span className="text-[#E21B23] font-black text-xl sm:text-2xl tracking-tight uppercase font-sans drop-shadow-xs">
                MARICELA
              </span>
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                  Punto de Venta
                </span>
                <span className="bg-[#FFCE00] text-[#991B1B] text-xs font-black px-2 py-0.5 rounded-md uppercase">
                  {terminalNumber}
                </span>
              </div>
              <span className="text-xs text-red-100 hidden sm:block font-mono font-medium">
                Abarrotes & Retail SyV 7.4
              </span>
            </div>
          </div>

          {/* Quick Action Buttons for small screens right in brand row */}
          <div className="flex md:hidden items-center gap-1.5">
            {onOpenCameraScanner && (
              <button
                type="button"
                onClick={onOpenCameraScanner}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#FFCE00] hover:bg-[#F3C000] text-neutral-950 rounded-lg text-xs font-black border-2 border-yellow-300 shadow-sm cursor-pointer"
                title="Activar Cámara"
              >
                <Camera className="w-4 h-4 text-neutral-950" />
                <span>Cámara</span>
              </button>
            )}
            <button
              onClick={onOpenSecondRegister}
              className="p-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-lg text-xs font-bold border border-red-400/40"
              title="Caja 2"
            >
              <ArrowRightLeft className="w-4 h-4 text-[#FFCE00]" />
            </button>
            <button
              onClick={onOpenCorteCaja}
              className="px-2.5 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-black border border-neutral-700 font-mono"
            >
              <span className="text-[#FFCE00]">F10</span>
            </button>
          </div>
        </div>

        {/* Center / Right: Responsive Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 md:pb-0 scrollbar-none">
          {onOpenCameraScanner && (
            <button
              type="button"
              onClick={onOpenCameraScanner}
              className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#FFCE00] hover:bg-yellow-300 text-neutral-950 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap shadow-md border-2 border-yellow-200 ring-2 ring-yellow-400 shrink-0"
              title="Activar Cámara del celular, tablet o laptop para leer códigos de barra"
            >
              <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-950" />
              <span>Activar Cámara</span>
            </button>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                  isActive
                    ? 'bg-white text-[#E21B23] shadow-md ring-2 ring-yellow-400/60'
                    : 'bg-red-800/70 hover:bg-red-800 text-white hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#E21B23]' : 'text-[#FFCE00]'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`text-xs px-2 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-[#E21B23] text-white font-black' : 'bg-[#FFCE00] text-neutral-900 font-black'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Desktop Only Extra Action Buttons */}
          <div className="hidden lg:flex items-center gap-2 ml-2 pl-2 border-l border-red-500/60">
            <button
              onClick={onOpenSecondRegister}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white border border-red-400/40 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              title="Estado de la Caja 2"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#FFCE00]" />
              <span>Caja 2</span>
            </button>

            <button
              onClick={onOpenCorteCaja}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer border border-neutral-700"
              title="Corte de Caja (F10)"
            >
              <span className="text-[#FFCE00] font-mono font-black text-xs sm:text-sm">F10</span>
              <span>Corte</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
