import React, { useState } from 'react';
import { X, ShieldAlert, ArrowDownToLine, Check, DollarSign } from 'lucide-react';
import { playCashDrawerSound } from '../utils/audio';

interface CashMovementModalProps {
  currentCashInDrawer: number;
  cashierName: string;
  onConfirmSafeDrop: (amount: number, reason: string) => void;
  onClose: () => void;
}

export const CashMovementModal: React.FC<CashMovementModalProps> = ({
  currentCashInDrawer,
  cashierName,
  onConfirmSafeDrop,
  onClose,
}) => {
  const [amount, setAmount] = useState<string>('1000');
  const [reason, setReason] = useState<string>('Retiro a tómbola por exceso de efectivo');

  const presetAmounts = [500, 1000, 1500, 2000, 3000];

  const handleConfirm = () => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return;

    playCashDrawerSound();
    onConfirmSafeDrop(parsedAmount, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto select-none">
      <div className="bg-white rounded-xl shadow-2xl border-4 border-amber-600 w-full max-w-md max-h-[92vh] overflow-hidden flex flex-col animate-scale-in my-auto">
        {/* Header */}
        <div className="bg-amber-600 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-neutral-900 text-amber-400 font-black text-xs px-2 py-0.5 rounded">
              F9 TÓMBOLA
            </span>
            <h2 className="text-base font-bold font-sans">
              Retiro a Tómbola Blindada
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-amber-700 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-neutral-50 overflow-y-auto space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              Por protocolo de seguridad OXXO, mantenga un máximo de $1,500 en cajón.
            </span>
          </div>

          <div className="bg-white p-4 rounded-lg border border-neutral-300 shadow-xs space-y-3">
            <div>
              <label className="text-xs font-bold text-neutral-700 block uppercase mb-1">
                Monto a Depositar en Tómbola ($ MXN):
              </label>
              <div className="relative mb-2">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-neutral-500">
                  $
                </span>
                <input
                  type="number"
                  step="100"
                  min="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1000.00"
                  autoFocus
                  className="w-full pl-8 pr-3 py-2 text-xl font-mono font-bold border-2 border-neutral-300 focus:border-amber-600 rounded focus:outline-none"
                />
              </div>

              {/* Preset buttons */}
              <div className="grid grid-cols-5 gap-1">
                {presetAmounts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAmount(p.toString())}
                    className="py-1 px-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded font-mono text-xs font-bold border border-neutral-300 transition-colors cursor-pointer"
                  >
                    ${p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block uppercase mb-1">
                Concepto / Motivo del Retiro:
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded text-xs bg-white focus:outline-none focus:border-amber-600"
              >
                <option value="Retiro a tómbola por exceso de efectivo">
                  Retiro a tómbola por exceso de efectivo
                </option>
                <option value="Corte de efectivo intermedio de turno">
                  Corte de efectivo intermedio de turno
                </option>
                <option value="Pago autorizado a proveedor">
                  Pago autorizado a proveedor
                </option>
                <option value="Resguardo por cambio de turno">
                  Resguardo por cambio de turno
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-neutral-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!amount || parseFloat(amount) <= 0}
            onClick={handleConfirm}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Confirmar Depósito a Tómbola</span>
          </button>
        </div>
      </div>
    </div>
  );
};
