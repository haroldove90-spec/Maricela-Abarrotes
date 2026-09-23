import React from 'react';
import { X, ArrowRightLeft, Store, AlertCircle, CheckCircle } from 'lucide-react';

interface SecondRegisterModalProps {
  currentTerminal: string;
  onSwitchTerminal: (terminalId: string) => void;
  onClose: () => void;
}

export const SecondRegisterModal: React.FC<SecondRegisterModalProps> = ({
  currentTerminal,
  onSwitchTerminal,
  onClose,
}) => {
  const isCaja1 = currentTerminal.includes('01') || currentTerminal === 'Caja 1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto select-none">
      <div className="bg-white rounded-xl shadow-2xl border-4 border-[#FFCE00] w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col animate-scale-in my-auto">
        {/* Header */}
        <div className="bg-[#E21B23] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFCE00] text-[#991B1B] font-black text-xs px-2 py-0.5 rounded">
              CAJA 2
            </span>
            <h2 className="text-base font-bold font-sans">
              Control de Cajas · Tienda OXXO
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-800 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-neutral-50 space-y-4">
          {/* Iconic Yellow Retail Counter Sign */}
          <div className="bg-[#FFCE00] border-2 border-amber-600 rounded-xl p-5 text-neutral-900 shadow-md text-center space-y-2">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-[#E21B23] shadow-xs">
              <Store className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black font-sans tracking-tight uppercase">
              "En la otra caja le cobran"
            </h3>
            <p className="text-xs font-medium text-neutral-800 max-w-xs mx-auto leading-relaxed">
              {isCaja1
                ? 'La Caja 2 actualmente se encuentra cerrada por inventario o recepción de proveedores Cervecería/Sabritas.'
                : 'Usted se encuentra operando en la Caja 2.'}
            </p>
          </div>

          {/* Register Status Selector */}
          <div className="bg-white p-4 rounded-lg border border-neutral-300 shadow-xs space-y-3">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              Seleccionar Terminal de Trabajo Activa:
            </span>

            <div className="grid grid-cols-2 gap-3">
              {/* Option Caja 1 */}
              <button
                type="button"
                onClick={() => {
                  onSwitchTerminal('CAJA 01');
                  onClose();
                }}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isCaja1
                    ? 'bg-red-50 border-[#E21B23] ring-2 ring-red-500/20'
                    : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-sm text-neutral-900">CAJA 1</span>
                  {isCaja1 && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </div>
                <span className="text-xs text-neutral-500 block">
                  Caja Principal (Cobro de Retail y Servicios)
                </span>
                <span className="text-[10px] font-bold text-emerald-600 mt-2 block">
                  ● En Servicio Activo
                </span>
              </button>

              {/* Option Caja 2 */}
              <button
                type="button"
                onClick={() => {
                  onSwitchTerminal('CAJA 02');
                  onClose();
                }}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  !isCaja1
                    ? 'bg-red-50 border-[#E21B23] ring-2 ring-red-500/20'
                    : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-sm text-neutral-900">CAJA 2</span>
                  {!isCaja1 && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </div>
                <span className="text-xs text-neutral-500 block">
                  Caja Secundaria (Horas Pico / Solo Efectivo)
                </span>
                <span className="text-[10px] font-bold text-amber-600 mt-2 block">
                  ● Abrir Para Cobrar Fila
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-neutral-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
