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
    <div className="bg-neutral-900 text-white p-3.5 border-t border-neutral-700 shadow-lg no-print select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
        {/* Left Side: Breakdown details & Redondeo */}
        <div className="lg:col-span-6 space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between text-neutral-300">
            <span>Artículos Totales:</span>
            <span className="font-bold text-white text-sm">{itemCount} pzas</span>
          </div>

          <div className="flex items-center justify-between text-neutral-400">
            <span>Subtotal:</span>
            <span className="tabular-nums text-neutral-200">${subtotal.toFixed(2)} MXN</span>
          </div>

          <div className="flex items-center justify-between text-neutral-400">
            <span>Impuestos (IVA 16% + IEPS 8%):</span>
            <span className="tabular-nums text-neutral-200">
              ${(iva + ieps).toFixed(2)} MXN
            </span>
          </div>

          {totalDiscount > 0 && (
            <div className="flex items-center justify-between text-emerald-400 font-semibold">
              <span>Promociones / Ahorro OXXO:</span>
              <span className="tabular-nums">-${totalDiscount.toFixed(2)} MXN</span>
            </div>
          )}

          {/* Authentic Mexican Redondeo OXXO Feature */}
          <div className="pt-1.5 border-t border-neutral-800 flex items-center justify-between">
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-neutral-300 hover:text-white">
              <input
                type="checkbox"
                checked={redondeoEnabled}
                onChange={onToggleRedondeo}
                className="w-3.5 h-3.5 rounded text-[#E21B23] focus:ring-red-500 cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                Redondeo Pro-Niñez Mexicana:
              </span>
            </label>
            <span
              className={`tabular-nums font-bold ${
                redondeoEnabled && redondeo > 0 ? 'text-[#FFCE00]' : 'text-neutral-500'
              }`}
            >
              +${redondeo.toFixed(2)} MXN
            </span>
          </div>

          {/* OXXO Premia Bar */}
          <div className="flex items-center justify-between text-[11px] bg-neutral-800/80 px-2 py-1 rounded border border-neutral-700/60">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FFCE00]" />
              {premiaCardNumber ? (
                <span className="text-amber-300 font-sans font-bold">
                  Premia #{premiaCardNumber.slice(-4)}
                </span>
              ) : (
                <span className="text-neutral-400 font-sans">Sin Tarjeta Premia</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#FFCE00] font-bold font-sans">
                +{premiaPointsEarned} pts
              </span>
              <button
                type="button"
                onClick={onOpenPremiaModal}
                className="text-[10px] text-amber-400 underline hover:text-amber-300 font-sans cursor-pointer"
              >
                {premiaCardNumber ? 'Cambiar' : 'Asociar (F6)'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Jumbo Total Screen & Big Action Buttons */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-2">
          {/* Big Digital Total Display */}
          <div className="bg-black/90 p-3 rounded-lg border-2 border-neutral-700 flex items-center justify-between shadow-inner">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono tracking-widest text-[#FFCE00] uppercase font-bold">
                Total a Pagar
              </span>
              <span className="text-xs text-neutral-400 font-mono">Moneda Nacional (MXN)</span>
            </div>
            <div className="text-right">
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white tabular-nums">
                ${total.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Action Button Row */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={items.length === 0}
              onClick={onClearCart}
              className="px-3 py-3 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 border border-neutral-700 transition-colors cursor-pointer"
              title="Cancelar venta (Esc)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cancelar</span>
            </button>

            <button
              type="button"
              disabled={items.length === 0}
              onClick={onOpenPaymentModal}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:opacity-40 disabled:pointer-events-none text-white font-sans font-black text-sm uppercase tracking-wider rounded-lg shadow-lg hover:shadow-emerald-900/50 flex items-center justify-center gap-2 transition-all cursor-pointer border-2 border-emerald-400/40"
            >
              <CreditCard className="w-5 h-5 text-emerald-100" />
              <span>COBRAR [F12]</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
