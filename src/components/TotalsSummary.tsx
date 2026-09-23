import React from 'react';
import { Heart, Sparkles, CreditCard, RotateCcw } from 'lucide-react';
import { CartItem } from '../types/pos';

interface TotalsSummaryProps {
  items: CartItem[];
  subtotal: number;
  iva: number;
  ieps: number;
  totalDiscount: number;
  redondeo: number;
  total: number;
  redondeoEnabled: boolean;
  onToggleRedondeo: () => void;
  premiaCardNumber: string | null;
  premiaPointsEarned: number;
  onOpenPaymentModal: () => void;
  onClearCart: () => void;
  onOpenPremiaModal: () => void;
}

export const TotalsSummary: React.FC<TotalsSummaryProps> = ({
  items,
  subtotal,
  iva,
  ieps,
  totalDiscount,
  redondeo,
  total,
  redondeoEnabled,
  onToggleRedondeo,
  premiaCardNumber,
  premiaPointsEarned,
  onOpenPaymentModal,
  onClearCart,
  onOpenPremiaModal,
}) => {
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="bg-neutral-900 text-white p-3 sm:p-4 border-t-2 border-neutral-700 shadow-xl no-print select-none shrink-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-center">
        {/* Left Side: Breakdown details & Redondeo */}
        <div className="lg:col-span-6 space-y-2 text-xs sm:text-sm font-mono">
          <div className="flex items-center justify-between text-neutral-200">
            <span className="font-semibold">Artículos Totales:</span>
            <span className="font-black text-white text-base bg-neutral-800 px-2.5 py-0.5 rounded border border-neutral-700">
              {itemCount} pzas
            </span>
          </div>

          <div className="flex items-center justify-between text-neutral-300">
            <span>Subtotal:</span>
            <span className="tabular-nums font-bold text-neutral-100 text-sm sm:text-base">
              ${subtotal.toFixed(2)} MXN
            </span>
          </div>

          <div className="flex items-center justify-between text-neutral-400">
            <span>Impuestos (IVA 16% + IEPS 8%):</span>
            <span className="tabular-nums font-semibold text-neutral-200 text-xs sm:text-sm">
              ${(iva + ieps).toFixed(2)} MXN
            </span>
          </div>

          {totalDiscount > 0 && (
            <div className="flex items-center justify-between text-emerald-400 font-bold text-xs sm:text-sm">
              <span>Promociones / Descuentos:</span>
              <span className="tabular-nums text-sm sm:text-base">-${totalDiscount.toFixed(2)} MXN</span>
            </div>
          )}

          {/* Redondeo Feature */}
          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-neutral-200 hover:text-white">
              <input
                type="checkbox"
                checked={redondeoEnabled}
                onChange={onToggleRedondeo}
                className="w-4 h-4 rounded text-[#E21B23] focus:ring-red-500 cursor-pointer"
              />
              <span className="flex items-center gap-1.5 font-medium">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                Redondeo Pro-Niñez:
              </span>
            </label>
            <span
              className={`tabular-nums font-extrabold text-sm sm:text-base ${
                redondeoEnabled && redondeo > 0 ? 'text-[#FFCE00]' : 'text-neutral-500'
              }`}
            >
              +${redondeo.toFixed(2)} MXN
            </span>
          </div>

          {/* Premia Bar */}
          <div className="flex items-center justify-between text-xs sm:text-sm bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FFCE00]" />
              {premiaCardNumber ? (
                <span className="text-amber-300 font-sans font-bold text-xs sm:text-sm">
                  Puntos Maricela #{premiaCardNumber.slice(-4)}
                </span>
              ) : (
                <span className="text-neutral-300 font-sans text-xs">Sin Tarjeta Puntos</span>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[#FFCE00] font-black font-sans text-xs sm:text-sm">
                +{premiaPointsEarned} pts
              </span>
              <button
                type="button"
                onClick={onOpenPremiaModal}
                className="text-xs text-amber-400 font-bold underline hover:text-amber-300 font-sans cursor-pointer"
              >
                {premiaCardNumber ? 'Cambiar' : 'Asociar (F6)'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Jumbo Total Screen & Big Action Buttons */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-2.5">
          {/* Big Digital Total Display */}
          <div className="bg-black p-3.5 sm:p-4 rounded-xl border-2 border-neutral-600 flex items-center justify-between shadow-inner">
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-mono tracking-widest text-[#FFCE00] uppercase font-black">
                TOTAL A PAGAR
              </span>
              <span className="text-xs text-neutral-400 font-mono font-medium">Moneda Nacional (MXN)</span>
            </div>
            <div className="text-right">
              <div className="text-3xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight text-[#FFCE00] tabular-nums drop-shadow-sm">
                ${total.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Action Button Row */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              disabled={items.length === 0}
              onClick={onClearCart}
              className="px-3.5 py-3 sm:py-3.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:hover:bg-neutral-800 text-neutral-200 hover:text-white rounded-xl font-mono text-xs sm:text-sm font-bold flex items-center gap-1.5 border border-neutral-700 transition-colors cursor-pointer"
              title="Cancelar venta (Esc)"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Cancelar</span>
            </button>

            <button
              type="button"
              disabled={items.length === 0}
              onClick={onOpenPaymentModal}
              className="flex-1 py-3 sm:py-3.5 px-5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:opacity-40 disabled:pointer-events-none text-white font-sans font-black text-base sm:text-lg uppercase tracking-wider rounded-xl shadow-lg hover:shadow-emerald-900/50 flex items-center justify-center gap-2.5 transition-all cursor-pointer border-2 border-emerald-400/50"
            >
              <CreditCard className="w-6 h-6 text-emerald-100" />
              <span>COBRAR [F12]</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
