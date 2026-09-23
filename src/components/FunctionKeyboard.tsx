import React, { useEffect } from 'react';
import { Camera } from 'lucide-react';

interface FunctionKeyboardProps {
  onF1: () => void; // Catálogo
  onF2: () => void; // Cantidad
  onF3: () => void; // Tiempo Aire
  onF4: () => void; // Servicios
  onF5: () => void; // Depósitos
  onF6: () => void; // OXXO Premia
  onF7: () => void; // Promociones
  onF8: () => void; // Eliminar partida
  onF9: () => void; // Retiro de efectivo
  onF10: () => void; // Corte de Caja
  onF11: () => void; // Segunda Caja
  onF12: () => void; // Cobrar
  onCameraScanner?: () => void;
}

export const FunctionKeyboard: React.FC<FunctionKeyboardProps> = ({
  onF1,
  onF2,
  onF3,
  onF4,
  onF5,
  onF6,
  onF7,
  onF8,
  onF9,
  onF10,
  onF11,
  onF12,
  onCameraScanner,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser default function key actions (like F1 Help, F3 Find, F12 DevTools if permitted)
      if (['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'F1':
          onF1();
          break;
        case 'F2':
          onF2();
          break;
        case 'F3':
          onF3();
          break;
        case 'F4':
          onF4();
          break;
        case 'F5':
          onF5();
          break;
        case 'F6':
          onF6();
          break;
        case 'F7':
          onF7();
          break;
        case 'F8':
          onF8();
          break;
        case 'F9':
          onF9();
          break;
        case 'F10':
          onF10();
          break;
        case 'F11':
          onF11();
          break;
        case 'F12':
          onF12();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onF1, onF2, onF3, onF4, onF5, onF6, onF7, onF8, onF9, onF10, onF11, onF12]);

  const keys = [
    { key: 'F1', label: 'Catálogo', action: onF1, color: 'hover:bg-amber-100 hover:text-amber-900 border-amber-300' },
    { key: 'F2', label: 'Multiplicador', action: onF2, color: 'hover:bg-neutral-200 border-neutral-300' },
    { key: 'F3', label: 'Tiempo Aire', action: onF3, color: 'hover:bg-blue-100 hover:text-blue-900 border-blue-300' },
    { key: 'F4', label: 'Servicios', action: onF4, color: 'hover:bg-emerald-100 hover:text-emerald-900 border-emerald-300' },
    { key: 'F5', label: 'Depósitos Spin', action: onF5, color: 'hover:bg-purple-100 hover:text-purple-900 border-purple-300' },
    { key: 'F6', label: 'Premia', action: onF6, color: 'hover:bg-yellow-100 hover:text-yellow-900 border-yellow-300' },
    { key: 'F7', label: 'Combos OXXO', action: onF7, color: 'hover:bg-red-100 hover:text-red-900 border-red-300' },
    { key: 'F8', label: 'Borrar Fila', action: onF8, color: 'hover:bg-red-100 hover:text-red-900 border-red-300' },
    { key: 'F9', label: 'Tómbola Caja', action: onF9, color: 'hover:bg-orange-100 hover:text-orange-900 border-orange-300' },
    { key: 'F10', label: 'Corte Turno', action: onF10, color: 'hover:bg-neutral-800 hover:text-white border-neutral-600 bg-neutral-900 text-white' },
    { key: 'F11', label: 'Caja 2', action: onF11, color: 'hover:bg-red-200 border-red-300' },
    { key: 'F12', label: 'Cobrar Ticket', action: onF12, color: 'bg-emerald-700 text-white hover:bg-emerald-600 border-emerald-600 font-bold' },
  ];

  return (
    <footer className="bg-neutral-200 border-t border-neutral-300 px-2 sm:px-3 py-2 flex items-center justify-between gap-1.5 overflow-x-auto select-none no-print">
      {onCameraScanner && (
        <button
          type="button"
          onClick={onCameraScanner}
          className="min-w-[85px] sm:min-w-[105px] px-2.5 py-1.5 rounded-lg text-center border-2 border-yellow-400 shadow-xs transition-all cursor-pointer flex flex-col items-center justify-center bg-[#FFCE00] hover:bg-[#F3C000] text-neutral-950 font-black shrink-0"
          title="Activar escáner con cámara de celular, tablet o PC"
        >
          <span className="flex items-center gap-1 text-xs font-mono font-black tracking-tight">
            <Camera className="w-3.5 h-3.5" />
            <span>[CÁMARA]</span>
          </span>
          <span className="text-xs sm:text-sm font-sans font-black truncate w-full">
            Escanear
          </span>
        </button>
      )}

      {keys.map((k) => (
        <button
          key={k.key}
          type="button"
          onClick={k.action}
          className={`flex-1 min-w-[78px] sm:min-w-[90px] max-w-[130px] px-2 py-1.5 rounded-lg text-center border-2 shadow-2xs transition-all cursor-pointer flex flex-col items-center justify-center ${k.color} bg-white text-neutral-900`}
        >
          <span className="text-xs font-mono font-black tracking-tight opacity-80">
            [{k.key}]
          </span>
          <span className="text-xs sm:text-sm font-sans font-bold truncate w-full">
            {k.label}
          </span>
        </button>
      ))}
    </footer>
  );
};
