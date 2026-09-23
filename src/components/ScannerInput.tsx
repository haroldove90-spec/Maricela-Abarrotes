import React, { useState, useRef, useEffect } from 'react';
import { Barcode, Scan, Camera, Plus, Zap, AlertCircle } from 'lucide-react';
import { Product } from '../types/pos';
import { playScannerBeep, playErrorBuzz } from '../utils/audio';

interface ScannerInputProps {
  products: Product[];
  onScanProduct: (product: Product, quantity: number) => void;
  onOpenQuickCatalog: () => void;
  onOpenAirtime: () => void;
  onOpenServices: () => void;
  onOpenBanking: () => void;
  onOpenPremia: () => void;
  onOpenCameraScanner: () => void;
}

export const ScannerInput: React.FC<ScannerInputProps> = ({
  products,
  onScanProduct,
  onOpenQuickCatalog,
  onOpenAirtime,
  onOpenServices,
  onOpenBanking,
  onOpenPremia,
  onOpenCameraScanner,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [scanMessage, setScanMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically on mount and keep it focused
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleProcessScan = (codeToProcess: string) => {
    const trimmed = codeToProcess.trim();
    if (!trimmed) return;

    let quantity = 1;
    let searchCode = trimmed;

    // Support POS Multiplier syntax like 3*7501055301072 or 4*andatti
    if (trimmed.includes('*')) {
      const parts = trimmed.split('*');
      const parsedQty = parseInt(parts[0], 10);
      if (!isNaN(parsedQty) && parsedQty > 0) {
        quantity = parsedQty;
        searchCode = parts.slice(1).join('*').trim();
      }
    }

    // Lookup by exact barcode, short name, or name
    const foundProduct = products.find(
      (p) =>
        p.barcode.toLowerCase() === searchCode.toLowerCase() ||
        p.id.toLowerCase() === searchCode.toLowerCase() ||
        p.shortName.toLowerCase().includes(searchCode.toLowerCase()) ||
        p.name.toLowerCase().includes(searchCode.toLowerCase())
    );

    if (foundProduct) {
      playScannerBeep();
      onScanProduct(foundProduct, quantity);
      setScanMessage({
        text: `+ ${quantity}x ${foundProduct.shortName} ($${(foundProduct.price * quantity).toFixed(2)})`,
      });
      setInputValue('');
    } else {
      playErrorBuzz();
      setScanMessage({
        text: `Código "${searchCode}" no encontrado en catálogo`,
        isError: true,
      });
    }

    setTimeout(() => {
      setScanMessage(null);
    }, 2500);

    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleProcessScan(inputValue);
  };

  // Quick preset items for high-speed POS testing
  const quickScannerItems = [
    { label: 'Coca 600ml', barcode: '7501055301072', icon: '🥤' },
    { label: 'Andatti 16oz', barcode: '7501000100169', icon: '☕' },
    { label: 'Vikingo Reg', barcode: '7501000200012', icon: '🌭' },
    { label: 'Sabritas 160g', barcode: '7501011115439', icon: '🥔' },
    { label: 'Doritos 146g', barcode: '7501011115651', icon: '🔺' },
    { label: 'Maruchan', barcode: '041789001214', icon: '🍜' },
    { label: 'Electrolit', barcode: '7501125134104', icon: '⚡' },
    { label: 'Pan Bimbo', barcode: '7501000111190', icon: '🍞' },
  ];

  return (
    <div className="bg-white border-b border-neutral-300 p-3 sm:p-3.5 shadow-xs no-print">
      {/* Mobile-Friendly Quick Camera Trigger Banner */}
      <div className="flex sm:hidden items-center justify-between gap-2 mb-2 px-3 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-yellow-400 rounded-xl shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FFCE00] flex items-center justify-center border border-yellow-500 shadow-2xs">
            <Camera className="w-5 h-5 text-neutral-950" />
          </div>
          <div>
            <div className="text-xs font-black text-neutral-950 leading-tight">Lector con Cámara</div>
            <div className="text-[10px] text-neutral-700 font-semibold">Celular, tablet o laptop</div>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenCameraScanner}
          className="px-3 py-1.5 bg-[#E21B23] hover:bg-[#C1121F] text-white rounded-lg text-xs font-black shadow-xs cursor-pointer flex items-center gap-1"
        >
          <Scan className="w-3.5 h-3.5" />
          <span>Activar</span>
        </button>
      </div>

      {/* Scanner Barcode Bar */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Barcode className="w-6 h-6 text-neutral-600" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escanear código de barras o teclear código (Ej. 7501055301072 o 2*Coca)..."
            className="w-full pl-12 pr-28 py-2.5 bg-neutral-50 border-2 border-neutral-300 focus:border-[#E21B23] focus:bg-white rounded-xl text-base sm:text-lg font-mono font-bold tracking-wider text-neutral-900 placeholder-neutral-400 focus:outline-none transition-colors shadow-2xs"
          />
          <div className="absolute inset-y-0 right-1.5 flex items-center gap-1.5 pr-1">
            <span className="text-xs bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded font-mono font-bold hidden sm:inline">
              [Enter]
            </span>
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#E21B23] hover:bg-[#C1121F] text-white rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar</span>
            </button>
          </div>
        </div>

        {/* Camera Scanner optical detector trigger - Highly Visible */}
        <button
          type="button"
          onClick={onOpenCameraScanner}
          className="px-4 py-2.5 bg-[#FFCE00] hover:bg-[#F3C000] text-neutral-950 border-2 border-yellow-400 hover:border-yellow-500 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 shadow-md ring-2 ring-yellow-400/50"
          title="Abrir lector óptico con cámara de celular, tablet o laptop"
        >
          <Camera className="w-5 h-5 text-neutral-950" />
          <span>Escanear con Cámara</span>
        </button>

        {/* F1 Catalog Shortcut */}
        <button
          type="button"
          onClick={onOpenQuickCatalog}
          className="hidden sm:flex px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border-2 border-amber-300 rounded-xl text-xs sm:text-sm font-bold items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Zap className="w-4 h-4 text-amber-600" />
          <span>Catálogo (F1)</span>
        </button>
      </form>

      {/* Immediate Scan Feedback Toast Bar */}
      {scanMessage && (
        <div
          className={`mt-2.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-mono flex items-center gap-2 animate-fade-in ${
            scanMessage.isError
              ? 'bg-red-50 text-red-700 border border-red-200 font-bold'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
          }`}
        >
          {scanMessage.isError ? (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          ) : (
            <Scan className="w-5 h-5 text-emerald-600 shrink-0" />
          )}
          <span className="font-bold">{scanMessage.text}</span>
        </div>
      )}

      {/* Fast Barcode Test Row & Quick Services Bar */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider shrink-0">
            Escaneo Rápido:
          </span>
          {quickScannerItems.map((item) => (
            <button
              key={item.barcode}
              type="button"
              onClick={() => handleProcessScan(item.barcode)}
              className="px-2.5 py-1 bg-neutral-100 hover:bg-red-50 hover:text-red-700 hover:border-red-300 border border-neutral-300 rounded-lg text-xs sm:text-sm font-semibold text-neutral-800 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Specialized Service Shortcut Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={onOpenAirtime}
            className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 rounded-lg text-xs sm:text-sm font-extrabold cursor-pointer transition-colors shadow-2xs"
          >
            F3 Recargas TAE
          </button>
          <button
            type="button"
            onClick={onOpenServices}
            className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs sm:text-sm font-extrabold cursor-pointer transition-colors shadow-2xs"
          >
            F4 Pago CFE/Luz
          </button>
          <button
            type="button"
            onClick={onOpenBanking}
            className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 rounded-lg text-xs sm:text-sm font-extrabold cursor-pointer transition-colors shadow-2xs"
          >
            F5 Depósitos
          </button>
          <button
            type="button"
            onClick={onOpenPremia}
            className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs sm:text-sm font-extrabold cursor-pointer transition-colors shadow-2xs"
          >
            F6 Puntos
          </button>
        </div>
      </div>
    </div>
  );
};
