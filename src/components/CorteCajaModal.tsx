import React, { useState } from 'react';
import { X, Calculator, Printer, CheckCircle, AlertTriangle, ShieldCheck, DollarSign } from 'lucide-react';
import { ShiftSummary } from '../types/pos';
import { playPrinterSound, playSuccessChime } from '../utils/audio';

interface CorteCajaModalProps {
  shift: ShiftSummary;
  onClose: () => void;
  onPrintTicket: () => void;
  onConfirmCorteZ: () => void;
}

export const CorteCajaModal: React.FC<CorteCajaModalProps> = ({
  shift,
  onClose,
  onPrintTicket,
  onConfirmCorteZ,
}) => {
  const [corteType, setCorteType] = useState<'corteX' | 'corteZ'>('corteX');

  // Denominations count state
  const [counts, setCounts] = useState<Record<string, number>>({
    '1000': 0,
    '500': 0,
    '200': 0,
    '100': 0,
    '50': 0,
    '20': 0,
    '10': 0,
    '5': 0,
    '2': 0,
    '1': 0,
    '0.5': 0,
  });

  const denominations = [
    { key: '1000', label: '$1,000', value: 1000, isBill: true },
    { key: '500', label: '$500', value: 500, isBill: true },
    { key: '200', label: '$200', value: 200, isBill: true },
    { key: '100', label: '$100', value: 100, isBill: true },
    { key: '50', label: '$50', value: 50, isBill: true },
    { key: '20', label: '$20', value: 20, isBill: true },
    { key: '10', label: '$10', value: 10, isBill: false },
    { key: '5', label: '$5', value: 5, isBill: false },
    { key: '2', label: '$2', value: 2, isBill: false },
    { key: '1', label: '$1', value: 1, isBill: false },
    { key: '0.5', label: '50¢', value: 0.5, isBill: false },
  ];

  const handleCountChange = (key: string, value: string) => {
    const parsed = parseInt(value, 10);
    setCounts((prev) => ({
      ...prev,
      [key]: isNaN(parsed) || parsed < 0 ? 0 : parsed,
    }));
  };

  const countedCash = denominations.reduce((acc, d) => {
    return acc + (counts[d.key] || 0) * d.value;
  }, 0);

  // Expected cash = initialCash + cashSales + servicesCollected + airtimeSales + depositsCollected - safeDrops
  const expectedCash = shift.expectedCashInDrawer;
  const difference = countedCash - expectedCash;

  const handlePrint = () => {
    playPrinterSound();
    onPrintTicket();
  };

  const handleCompleteCorteZ = () => {
    playSuccessChime();
    onConfirmCorteZ();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto select-none">
      <div className="bg-white rounded-xl shadow-2xl border-4 border-neutral-800 w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col animate-scale-in my-auto">
        {/* Header */}
        <div className="bg-neutral-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-neutral-700">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFCE00] text-[#991B1B] font-black text-xs px-2 py-0.5 rounded">
              F10 ARQUEO
            </span>
            <h2 className="text-base font-bold font-sans">
              Corte y Arqueo de Caja · Tiendas OXXO
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-800 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subheader: Mode selector */}
        <div className="bg-neutral-100 border-b border-neutral-300 px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCorteType('corteX')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                corteType === 'corteX'
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Corte Parcial "X" (Informativo)
            </button>
            <button
              type="button"
              onClick={() => setCorteType('corteZ')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                corteType === 'corteZ'
                  ? 'bg-[#E21B23] text-white shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Corte Final "Z" (Cierre de Turno)
            </button>
          </div>

          <div className="text-xs text-neutral-500 font-mono">
            <span>Terminal: {shift.terminalId}</span> · <span>Cajero: {shift.cashierName}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 bg-neutral-50 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Financial Breakdown */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-4 rounded-lg border border-neutral-300 shadow-xs space-y-3 font-mono text-xs">
              <h3 className="font-bold text-neutral-900 font-sans text-xs uppercase tracking-wider border-b border-neutral-200 pb-2">
                Resumen Financiero del Turno
              </h3>

              <div className="space-y-1.5">
                <div className="flex justify-between text-neutral-600">
                  <span>Fondo Inicial de Caja:</span>
                  <span className="font-bold text-neutral-900">
                    ${shift.initialCash.toFixed(2)} MXN
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Ventas en Efectivo (+):</span>
                  <span className="text-emerald-700 font-bold">
                    +${shift.cashSales.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Ventas Tarjeta Bancaria:</span>
                  <span>${shift.cardSales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Ventas Spin by OXXO:</span>
                  <span>${shift.spinSales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Vales de Despensa:</span>
                  <span>${shift.valesSales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Cobro de Servicios (CFE, agua, etc.):</span>
                  <span>+${shift.servicesCollected.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Tiempo Aire Electrónico (TAE):</span>
                  <span>+${shift.airtimeSales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Depósitos Bancarios Recibidos:</span>
                  <span>+${shift.depositsCollected.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Retiros Parciales a Tómbola (-):</span>
                  <span className="text-red-600 font-bold">
                    -${shift.safeDrops.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Donaciones Redondeo Pro-Niñez:</span>
                  <span className="text-amber-700">
                    ${shift.redondeoTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-300 flex justify-between font-black text-sm text-neutral-900">
                <span>Efectivo Teórico en Cajón:</span>
                <span className="text-neutral-900">${expectedCash.toFixed(2)} MXN</span>
              </div>
            </div>

            {/* Difference / Result Box */}
            <div
              className={`p-4 rounded-lg border text-xs font-mono flex items-center justify-between ${
                Math.abs(difference) < 1
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : difference > 0
                  ? 'bg-blue-50 border-blue-300 text-blue-900'
                  : 'bg-red-50 border-red-300 text-red-900'
              }`}
            >
              <div className="flex items-center gap-2 font-sans">
                {Math.abs(difference) < 1 ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <div>
                  <span className="font-bold uppercase block text-xs">
                    {Math.abs(difference) < 1
                      ? 'Arqueo Cuadrado Exacto'
                      : difference > 0
                      ? 'Sobrante en Caja'
                      : 'Faltante en Caja'}
                  </span>
                  <span className="text-[11px] opacity-80">
                    Contado: ${countedCash.toFixed(2)} vs Esperado: ${expectedCash.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="text-lg font-black font-mono">
                {difference >= 0 ? `+$${difference.toFixed(2)}` : `-$${Math.abs(difference).toFixed(2)}`}
              </div>
            </div>
          </div>

          {/* Right Column: Denominations Counter */}
          <div className="lg:col-span-6 bg-white p-4 rounded-lg border border-neutral-300 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2 mb-3">
                <h3 className="font-bold text-neutral-900 font-sans text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-neutral-700" />
                  Conteo de Monedas y Billetes
                </h3>
                <span className="text-xs font-mono font-bold text-neutral-700">
                  Total Contado: ${countedCash.toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {denominations.map((d) => (
                  <div
                    key={d.key}
                    className="flex items-center justify-between p-1.5 bg-neutral-50 rounded border border-neutral-200"
                  >
                    <span className="font-bold text-neutral-700 w-12">{d.label}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-neutral-400 text-[10px]">x</span>
                      <input
                        type="number"
                        min="0"
                        value={counts[d.key] || ''}
                        onChange={(e) => handleCountChange(d.key, e.target.value)}
                        placeholder="0"
                        className="w-14 text-center py-0.5 border border-neutral-300 rounded font-bold text-neutral-900 focus:outline-none focus:border-neutral-700"
                      />
                    </div>
                    <span className="text-[10px] text-neutral-500 w-14 text-right">
                      ${((counts[d.key] || 0) * d.value).toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick helper to set counted cash matching expected */}
            <div className="pt-3 border-t border-neutral-200 mt-4 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  // Fill denominations matching expected cash roughly
                  const newCounts: Record<string, number> = {
                    '1000': 1,
                    '500': 0,
                    '200': 0,
                    '100': 0,
                    '50': 0,
                    '20': 0,
                    '10': 0,
                    '5': 0,
                    '2': 0,
                    '1': 0,
                    '0.5': 0,
                  };
                  let rem = expectedCash;
                  denominations.forEach((d) => {
                    const c = Math.floor(rem / d.value);
                    newCounts[d.key] = c;
                    rem = Number((rem - c * d.value).toFixed(2));
                  });
                  setCounts(newCounts);
                }}
                className="text-neutral-500 hover:text-neutral-800 underline text-[11px] cursor-pointer"
              >
                Auto-completar conteo exacto
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
            <ShieldCheck className="w-4 h-4 text-neutral-600" />
            <span>Folio Auditoría: ARQ-{Date.now().toString().slice(-6)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-neutral-300"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Ticket de Corte</span>
            </button>

            {corteType === 'corteZ' ? (
              <button
                type="button"
                onClick={handleCompleteCorteZ}
                className="px-5 py-2 bg-[#E21B23] hover:bg-[#C1121F] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Cerrar Turno (Corte Z)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Cerrar Ventana
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
