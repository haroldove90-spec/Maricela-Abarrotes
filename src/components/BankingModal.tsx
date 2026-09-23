import React, { useState } from 'react';
import { X, Landmark, ArrowDownCircle, ArrowUpCircle, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { BankProvider, CartItem } from '../types/pos';
import { BANK_PROVIDERS } from '../data/products';
import { playSuccessChime, playErrorBuzz } from '../utils/audio';

interface BankingModalProps {
  onClose: () => void;
  onAddBankingToCart: (item: CartItem) => void;
}

export const BankingModal: React.FC<BankingModalProps> = ({
  onClose,
  onAddBankingToCart,
}) => {
  const [selectedBank, setSelectedBank] = useState<BankProvider>(BANK_PROVIDERS[0]);
  const [operationType, setOperationType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [amount, setAmount] = useState<string>('500');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const quickAmounts = [200, 500, 1000, 1500, 2000, 3000, 5000];

  const handleCardNumberChange = (val: string) => {
    // Only numbers, up to 16
    const numeric = val.replace(/\D/g, '').slice(0, 16);
    setCardNumber(numeric);
  };

  const handleConfirm = () => {
    setErrorMessage(null);
    const parsedAmount = parseFloat(amount);

    if (cardNumber.length !== 16 && cardNumber.length !== 10) {
      playErrorBuzz();
      setErrorMessage('Ingrese los 16 dígitos de la tarjeta o 10 del celular asociado.');
      return;
    }

    if (!parsedAmount || parsedAmount < 50 || parsedAmount > selectedBank.maxDeposit) {
      playErrorBuzz();
      setErrorMessage(`El monto debe estar entre $50 y $${selectedBank.maxDeposit.toLocaleString()} MXN.`);
      return;
    }

    playSuccessChime();

    const authCode = Math.floor(10000000 + Math.random() * 90000000).toString();
    const maskedCard =
      cardNumber.length === 16
        ? `**** **** **** ${cardNumber.slice(-4)}`
        : `Cel: ${cardNumber}`;

    const totalToPay =
      operationType === 'deposit'
        ? parsedAmount + selectedBank.fee
        : parsedAmount; // For withdrawal, customer receives cash, pays fee

    const cartItem: CartItem = {
      id: `BNK-${Date.now()}`,
      product: {
        id: `bnk-${selectedBank.id}`,
        barcode: `BNK${cardNumber.slice(-6)}`,
        name: `${operationType === 'deposit' ? 'Depósito' : 'Retiro'} ${selectedBank.name}`,
        shortName: `${operationType === 'deposit' ? 'DEP' : 'RET'} ${selectedBank.shortName}`,
        brand: selectedBank.name,
        category: 'servicios',
        price: totalToPay,
        cost: parsedAmount,
        stock: 999,
        ivaRate: 0,
        iepsRate: 0,
      },
      quantity: 1,
      unitPrice: totalToPay,
      discount: 0,
      total: totalToPay,
      isService: true,
      serviceType: operationType === 'deposit' ? 'deposit' : 'withdrawal',
      serviceMetadata: {
        bankName: selectedBank.name,
        cardNumber: maskedCard,
        authCode,
        commissionFee: selectedBank.fee,
      },
    };

    onAddBankingToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-xl shadow-2xl border-4 border-purple-700 w-full max-w-2xl overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFCE00] text-purple-950 font-black text-xs px-2 py-0.5 rounded uppercase">
              F5 SERVICIOS FINANCIEROS
            </span>
            <h2 className="text-base font-bold font-sans">
              Depósitos, Retiros & Spin by OXXO
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-purple-700 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-neutral-50 flex-1 overflow-y-auto space-y-4">
          {/* Operation Type: Depósito vs Retiro */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOperationType('deposit')}
              className={`flex-1 py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                operationType === 'deposit'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              <ArrowDownCircle className="w-4 h-4" />
              <span>Depósito a Tarjeta / Cuenta</span>
            </button>

            <button
              type="button"
              onClick={() => setOperationType('withdrawal')}
              className={`flex-1 py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                operationType === 'withdrawal'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span>Retiro de Efectivo en Caja</span>
            </button>
          </div>

          {/* Bank Providers Grid */}
          <div>
            <label className="text-xs font-bold text-neutral-700 block uppercase tracking-wider mb-2">
              Institución Bancaria / FinTech:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BANK_PROVIDERS.map((bank) => (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => setSelectedBank(bank)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedBank.id === bank.id
                      ? 'bg-purple-50 border-purple-600 ring-2 ring-purple-500/30'
                      : 'bg-white border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Landmark className="w-4 h-4 text-purple-700" />
                    <span className="text-[10px] font-mono font-bold text-neutral-500">
                      +${bank.fee}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-neutral-900 leading-tight">
                    {bank.name}
                  </span>
                  <span className="text-[10px] text-neutral-400 mt-1">
                    Máx: ${bank.maxDeposit.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Card / Account Number & Amount input */}
          <div className="bg-white p-4 rounded-lg border border-neutral-300 shadow-xs space-y-3">
            <div>
              <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                Número de Tarjeta (16 dígitos) o Teléfono Spin:
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="4152 3134 0000 0000"
                autoFocus
                className="w-full px-3 py-2 border border-neutral-300 rounded font-mono text-sm tracking-widest font-bold focus:border-purple-600 focus:outline-none"
              />
              <span className="text-[10px] text-neutral-400 mt-1 block">
                {cardNumber.length}/16 dígitos capturados
              </span>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                Monto del {operationType === 'deposit' ? 'Depósito' : 'Retiro'} ($ MXN):
              </label>
              <div className="relative mb-2">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-neutral-500">
                  $
                </span>
                <input
                  type="number"
                  step="50"
                  min="50"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="500.00"
                  className="w-full pl-8 pr-3 py-2 border border-neutral-300 rounded text-base font-mono font-bold focus:border-purple-600 focus:outline-none"
                />
              </div>

              {/* Quick Amount presets */}
              <div className="flex flex-wrap gap-1.5">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q.toString())}
                    className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded font-mono text-xs font-bold border border-neutral-200 cursor-pointer"
                  >
                    ${q}
                  </button>
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="p-2 bg-red-50 text-red-700 rounded text-xs font-semibold flex items-center gap-1.5 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Total calculation */}
            {amount && parseFloat(amount) > 0 && (
              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-lg text-xs space-y-1 font-mono">
                <div className="flex justify-between text-neutral-600">
                  <span>Monto operación:</span>
                  <span>${parseFloat(amount).toFixed(2)} MXN</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Comisión bancaria OXXO:</span>
                  <span>+${selectedBank.fee.toFixed(2)} MXN</span>
                </div>
                <div className="flex justify-between font-black text-purple-900 pt-1 border-t border-purple-200 text-sm">
                  <span>Total a cobrar al cliente:</span>
                  <span>${(parseFloat(amount) + selectedBank.fee).toFixed(2)} MXN</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Red Bancaria Enlazada SPEI / Red 24</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={cardNumber.length < 10 || !amount || parseFloat(amount) <= 0}
              onClick={handleConfirm}
              className="px-5 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-40 disabled:pointer-events-none text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Autorizar Operación</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
