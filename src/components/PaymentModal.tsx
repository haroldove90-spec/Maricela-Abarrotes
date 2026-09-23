import React, { useState } from 'react';
import { X, Banknote, CreditCard, Gift, Smartphone, CheckCircle, ArrowRight, CornerDownLeft } from 'lucide-react';
import { PaymentMethod, SaleTransaction, CartItem } from '../types/pos';
import { playCashDrawerSound, playSuccessChime, playErrorBuzz } from '../utils/audio';

interface PaymentModalProps {
  total: number;
  subtotal: number;
  iva: number;
  ieps: number;
  discountTotal: number;
  redondeo: number;
  items: CartItem[];
  cashierName: string;
  cashierId: string;
  storeName: string;
  storeNumber: string;
  terminalNumber: string;
  premiaCardNumber: string | null;
  premiaPointsEarned: number;
  onClose: () => void;
  onPaymentComplete: (transaction: SaleTransaction) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  total,
  subtotal,
  iva,
  ieps,
  discountTotal,
  redondeo,
  items,
  cashierName,
  cashierId,
  storeName,
  storeNumber,
  terminalNumber,
  premiaCardNumber,
  premiaPointsEarned,
  onClose,
  onPaymentComplete,
}) => {
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [cashGiven, setCashGiven] = useState<string>('');
  const [isProcessingCard, setIsProcessingCard] = useState<boolean>(false);
  const [cardPin, setCardPin] = useState<string>('');
  const [cardStep, setCardStep] = useState<'insert' | 'pin' | 'approved'>('insert');

  // Mexican Bill Denominations
  const billOptions = [20, 50, 100, 200, 500, 1000];

  const parsedCash = parseFloat(cashGiven) || 0;
  const change = Math.max(0, parsedCash - total);
  const isCashSufficient = parsedCash >= total;

  const handleCashOptionClick = (amount: number) => {
    setCashGiven(amount.toString());
  };

  const handleExactCash = () => {
    setCashGiven(total.toFixed(2));
  };

  const handleConfirmCash = () => {
    if (!isCashSufficient) {
      playErrorBuzz();
      return;
    }

    playCashDrawerSound();
    playSuccessChime();

    const transaction: SaleTransaction = {
      id: `TX-${Date.now()}`,
      folio: `${storeNumber.slice(0, 5)}-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleString('es-MX'),
      timestamp: Date.now(),
      cashierName,
      cashierId,
      storeName,
      storeNumber,
      terminalNumber,
      items,
      subtotal,
      iva,
      ieps,
      discountTotal,
      redondeo,
      total,
      paymentMethod: 'cash',
      amountPaid: parsedCash,
      change,
      premiaCardNumber: premiaCardNumber || undefined,
      premiaPointsEarned,
      authCode: undefined,
    };

    onPaymentComplete(transaction);
  };

  const handleStartCardFlow = () => {
    setCardStep('insert');
    setIsProcessingCard(true);
    setTimeout(() => {
      setCardStep('pin');
    }, 1200);
  };

  const handleConfirmCardPin = () => {
    setCardStep('approved');
    playSuccessChime();
    setTimeout(() => {
      const authCode = Math.floor(100000 + Math.random() * 900000).toString();
      const transaction: SaleTransaction = {
        id: `TX-${Date.now()}`,
        folio: `${storeNumber.slice(0, 5)}-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleString('es-MX'),
        timestamp: Date.now(),
        cashierName,
        cashierId,
        storeName,
        storeNumber,
        terminalNumber,
        items,
        subtotal,
        iva,
        ieps,
        discountTotal,
        redondeo,
        total,
        paymentMethod: 'card',
        amountPaid: total,
        change: 0,
        premiaCardNumber: premiaCardNumber || undefined,
        premiaPointsEarned,
        authCode,
      };
      onPaymentComplete(transaction);
    }, 1000);
  };

  const handleConfirmValesOrSpin = (selectedMethod: PaymentMethod) => {
    playSuccessChime();
    const transaction: SaleTransaction = {
      id: `TX-${Date.now()}`,
      folio: `${storeNumber.slice(0, 5)}-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleString('es-MX'),
      timestamp: Date.now(),
      cashierName,
      cashierId,
      storeName,
      storeNumber,
      terminalNumber,
      items,
      subtotal,
      iva,
      ieps,
      discountTotal,
      redondeo,
      total,
      paymentMethod: selectedMethod,
      amountPaid: total,
      change: 0,
      premiaCardNumber: premiaCardNumber || undefined,
      premiaPointsEarned,
      authCode: Math.floor(100000 + Math.random() * 900000).toString(),
    };
    onPaymentComplete(transaction);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-xl shadow-2xl border-4 border-[#E21B23] w-full max-w-2xl overflow-hidden flex flex-col animate-scale-in">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#E21B23] to-[#B91C1C] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFCE00] text-[#991B1B] font-black text-xs px-2 py-0.5 rounded">
              COBRO
            </span>
            <h2 className="text-base font-bold font-sans">
              Terminal de Pago · Ventas OXXO
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-800 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total to pay banner */}
        <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between border-b border-neutral-700">
          <div>
            <span className="text-xs font-mono text-[#FFCE00] uppercase tracking-wider block">
              Total a Liquidar:
            </span>
            <span className="text-xs text-neutral-400">
              {items.length} artículos · {redondeo > 0 ? 'Con redondeo incluido' : 'Sin redondeo'}
            </span>
          </div>
          <div className="text-3xl font-black font-mono text-white">
            ${total.toFixed(2)} <span className="text-sm font-sans text-neutral-400">MXN</span>
          </div>
        </div>

        {/* Payment Method Selector Tabs */}
        <div className="flex border-b border-neutral-200 bg-neutral-100">
          <button
            onClick={() => setMethod('cash')}
            className={`flex-1 py-3 px-2 text-xs font-bold font-sans flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              method === 'cash'
                ? 'bg-white text-[#E21B23] border-b-2 border-[#E21B23] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Banknote className="w-4 h-4" />
            <span>Efectivo</span>
          </button>

          <button
            onClick={() => setMethod('card')}
            className={`flex-1 py-3 px-2 text-xs font-bold font-sans flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              method === 'card'
                ? 'bg-white text-[#E21B23] border-b-2 border-[#E21B23] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Tarjeta Débito/Crédito</span>
          </button>

          <button
            onClick={() => setMethod('spin')}
            className={`flex-1 py-3 px-2 text-xs font-bold font-sans flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              method === 'spin'
                ? 'bg-white text-purple-700 border-b-2 border-purple-700 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-purple-600" />
            <span>Spin by OXXO</span>
          </button>

          <button
            onClick={() => setMethod('vales')}
            className={`flex-1 py-3 px-2 text-xs font-bold font-sans flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              method === 'vales'
                ? 'bg-white text-[#E21B23] border-b-2 border-[#E21B23] shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Vales Despensa</span>
          </button>
        </div>

        {/* Payment Body Content */}
        <div className="p-6 flex-1 bg-neutral-50 overflow-y-auto">
          {/* TAB 1: EFECTIVO */}
          {method === 'cash' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Input cash received */}
                <div className="bg-white p-4 rounded-lg border border-neutral-300 shadow-xs space-y-3">
                  <label className="text-xs font-bold text-neutral-700 block uppercase tracking-wider">
                    Efectivo Recibido ($ MXN)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-lg font-bold text-neutral-500">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.50"
                      min="0"
                      value={cashGiven}
                      onChange={(e) => setCashGiven(e.target.value)}
                      placeholder="0.00"
                      autoFocus
                      className="w-full pl-8 pr-3 py-2 text-2xl font-mono font-bold border-2 border-neutral-300 focus:border-[#E21B23] rounded focus:outline-none"
                    />
                  </div>

                  {/* Fast Denomination Buttons */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-neutral-500">
                      Billetes Rápidos:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {billOptions.map((bill) => (
                        <button
                          key={bill}
                          type="button"
                          onClick={() => handleCashOptionClick(bill)}
                          className="py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded font-mono text-xs font-bold border border-neutral-300 transition-colors cursor-pointer"
                        >
                          ${bill}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleExactCash}
                      className="w-full py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-bold text-xs transition-colors cursor-pointer"
                    >
                      Pagar Importe Exacto (${total.toFixed(2)})
                    </button>
                  </div>
                </div>

                {/* Change calculation screen */}
                <div className="bg-neutral-900 text-white p-4 rounded-lg flex flex-col justify-between shadow-inner">
                  <div>
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block mb-1">
                      Cálculo de Cambio
                    </span>
                    <div className="space-y-2 text-xs font-mono pt-2">
                      <div className="flex justify-between text-neutral-300">
                        <span>Total venta:</span>
                        <span className="tabular-nums">${total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span>Entregado:</span>
                        <span className="tabular-nums">${parsedCash.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-700">
                    <span className="text-xs font-mono text-emerald-400 block uppercase font-bold">
                      Cambio a Entregar:
                    </span>
                    <div className="text-3xl font-black font-mono text-emerald-400 tabular-nums">
                      ${change.toFixed(2)}
                    </div>
                    {!isCashSufficient && parsedCash > 0 && (
                      <span className="text-[11px] text-red-400 font-mono mt-1 block">
                        Faltan: ${(total - parsedCash).toFixed(2)} MXN
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Confirm Cash Payment Button */}
              <button
                type="button"
                disabled={!isCashSufficient}
                onClick={handleConfirmCash}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white font-bold text-sm uppercase rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <CornerDownLeft className="w-4 h-4" />
                <span>Confirmar Pago y Abrir Cajón [Enter]</span>
              </button>
            </div>
          )}

          {/* TAB 2: TARJETA PINPAD */}
          {method === 'card' && (
            <div className="bg-white p-6 rounded-lg border border-neutral-300 text-center space-y-4">
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                  <CreditCard className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900 uppercase">
                  Terminal Bancaria OXXO
                </h3>
                <p className="text-xs text-neutral-500 mb-4">
                  Acepta Visa, Mastercard, Carnet y American Express (Chip o Contactless).
                </p>

                {!isProcessingCard && (
                  <button
                    type="button"
                    onClick={handleStartCardFlow}
                    className="w-full py-3 bg-[#E21B23] hover:bg-[#C1121F] text-white font-bold text-xs uppercase rounded shadow cursor-pointer transition-colors"
                  >
                    Insertar o Acercar Tarjeta (${total.toFixed(2)} MXN)
                  </button>
                )}

                {isProcessingCard && cardStep === 'insert' && (
                  <div className="py-4 text-xs font-mono text-neutral-600 animate-pulse">
                    Leyendo chip de tarjeta... Por favor espere.
                  </div>
                )}

                {isProcessingCard && cardStep === 'pin' && (
                  <div className="space-y-3 bg-neutral-50 p-4 rounded border border-neutral-200">
                    <span className="text-xs font-bold text-neutral-700 block">
                      Ingrese NIP de 4 dígitos en el teclado cliente:
                    </span>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardPin}
                      onChange={(e) => setCardPin(e.target.value)}
                      placeholder="****"
                      className="text-center font-mono text-xl tracking-widest py-2 border rounded w-32 mx-auto block"
                    />
                    <button
                      type="button"
                      onClick={handleConfirmCardPin}
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded cursor-pointer"
                    >
                      Aceptar NIP
                    </button>
                  </div>
                )}

                {isProcessingCard && cardStep === 'approved' && (
                  <div className="py-3 text-emerald-600 font-bold flex items-center justify-center gap-1.5 text-sm">
                    <CheckCircle className="w-5 h-5" />
                    <span>Pago Aprobado con Éxito</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SPIN BY OXXO */}
          {method === 'spin' && (
            <div className="bg-white p-6 rounded-lg border border-purple-200 text-center space-y-4">
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-2">
                  <Smartphone className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-purple-900 uppercase">
                  Cobro con Spin by OXXO
                </h3>
                <p className="text-xs text-neutral-600 mb-4">
                  El cliente puede pagar acercando su tarjeta física Spin by OXXO o escaneando su código QR desde la App Spin.
                </p>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4 text-xs text-purple-900">
                  <span className="font-bold block mb-1">Monto a cobrar:</span>
                  <span className="text-2xl font-mono font-black">${total.toFixed(2)} MXN</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleConfirmValesOrSpin('spin')}
                  className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs uppercase rounded shadow cursor-pointer transition-colors"
                >
                  Confirmar Cobro Spin by OXXO
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: VALES DE DESPENSA */}
          {method === 'vales' && (
            <div className="bg-white p-6 rounded-lg border border-neutral-300 text-center space-y-4">
              <div className="max-w-sm mx-auto">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2">
                  <Gift className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 uppercase">
                  Vales de Despensa Electrónicos
                </h3>
                <p className="text-xs text-neutral-500 mb-4">
                  Acepta tarjetas de vales Sodexo, Edenred, SiVale, Toka y Up Sí Vale para productos de despensa permitidos.
                </p>

                <button
                  type="button"
                  onClick={() => handleConfirmValesOrSpin('vales')}
                  className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase rounded shadow cursor-pointer transition-colors"
                >
                  Cobrar ${total.toFixed(2)} con Tarjeta de Vales
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
