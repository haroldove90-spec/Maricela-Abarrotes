import React, { useState } from 'react';
import { X, Zap, Droplets, Phone, Flame, Tv, CreditCard, Building, Check, Scan } from 'lucide-react';
import { ServiceBillProvider, CartItem } from '../types/pos';
import { SERVICE_PROVIDERS } from '../data/products';
import { playScannerBeep, playSuccessChime, playErrorBuzz } from '../utils/audio';

interface ServicesModalProps {
  onClose: () => void;
  onAddServiceToCart: (item: CartItem) => void;
}

export const ServicesModal: React.FC<ServicesModalProps> = ({
  onClose,
  onAddServiceToCart,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<ServiceBillProvider>(SERVICE_PROVIDERS[0]);
  const [barcodeInput, setBarcodeInput] = useState<string>('');
  const [amountInput, setAmountInput] = useState<string>('');

  const getProviderIcon = (category: string) => {
    switch (category) {
      case 'luz':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'agua':
        return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'telefonia':
        return <Phone className="w-5 h-5 text-indigo-500" />;
      case 'gas':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'tv':
        return <Tv className="w-5 h-5 text-purple-500" />;
      case 'tag':
        return <CreditCard className="w-5 h-5 text-emerald-500" />;
      default:
        return <Building className="w-5 h-5 text-neutral-500" />;
    }
  };

  const handleSimulateScanBill = () => {
    playScannerBeep();
    setBarcodeInput(selectedProvider.sampleBarcode);
    // Simulate typical utility bill amount
    const simulatedAmounts: Record<string, string> = {
      cfe: '485.00',
      'agua-drenaje': '240.00',
      telmex: '389.00',
      'gas-naturgy': '320.00',
      izzi: '520.00',
      'tag-pase': '200.00',
      predial: '850.00',
    };
    setAmountInput(simulatedAmounts[selectedProvider.id] || '350.00');
  };

  const handleConfirmService = () => {
    const amount = parseFloat(amountInput);
    if (!amount || amount <= 0 || !barcodeInput.trim()) {
      playErrorBuzz();
      return;
    }

    playSuccessChime();

    const authCode = Math.floor(10000000 + Math.random() * 90000000).toString();
    const serviceFee = selectedProvider.fee;
    const totalServiceCost = amount + serviceFee;

    const cartItem: CartItem = {
      id: `SRV-${Date.now()}`,
      product: {
        id: `srv-${selectedProvider.id}`,
        barcode: barcodeInput.slice(0, 14),
        name: `Pago de ${selectedProvider.name}`,
        shortName: `PAGO ${selectedProvider.name.slice(0, 16)}`,
        brand: selectedProvider.name,
        category: 'servicios',
        price: totalServiceCost,
        cost: amount,
        stock: 999,
        ivaRate: 0,
        iepsRate: 0,
      },
      quantity: 1,
      unitPrice: totalServiceCost,
      discount: 0,
      total: totalServiceCost,
      isService: true,
      serviceType: 'bill',
      serviceMetadata: {
        serviceName: selectedProvider.name,
        serviceAccount: barcodeInput.slice(0, 16),
        authCode,
        commissionFee: serviceFee,
      },
    };

    onAddServiceToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto select-none">
      <div className="bg-white rounded-xl shadow-2xl border-4 border-[#0D9488] w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col animate-scale-in my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFCE00] text-[#0F766E] font-black text-xs px-2 py-0.5 rounded uppercase">
              F4 SERVICIOS
            </span>
            <h2 className="text-base font-bold font-sans">
              Pago de Servicios en Línea OXXO
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-teal-800 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-neutral-50 flex-1 overflow-y-auto space-y-4">
          {/* Provider Selection Row */}
          <div>
            <label className="text-xs font-bold text-neutral-700 block uppercase tracking-wider mb-2">
              Seleccione el Servicio a Cobrar:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SERVICE_PROVIDERS.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => {
                    setSelectedProvider(provider);
                    setBarcodeInput('');
                    setAmountInput('');
                  }}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedProvider.id === provider.id
                      ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-500/30'
                      : 'bg-white border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    {getProviderIcon(provider.category)}
                    <span className="text-[10px] font-mono text-neutral-400">
                      +${provider.fee} com.
                    </span>
                  </div>
                  <span className="text-xs font-bold text-neutral-900 leading-tight">
                    {provider.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bill Barcode & Amount Section */}
          <div className="bg-white p-4 rounded-lg border border-neutral-300 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800 uppercase flex items-center gap-1.5">
                {getProviderIcon(selectedProvider.category)}
                Datos de: <strong className="text-teal-700">{selectedProvider.name}</strong>
              </span>
              <button
                type="button"
                onClick={handleSimulateScanBill}
                className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Scan className="w-3.5 h-3.5 text-teal-600" />
                <span>Simular Escaneo de Recibo</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                  Código de Barras del Recibo / Referencia ({selectedProvider.referenceDigits} dígitos)
                </label>
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Escanee con la pistola o teclee el código de barras..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-xs font-mono tracking-wider focus:border-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                  Importe del Recibo a Pagar ($ MXN)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-neutral-500">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.50"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-3 py-2 border border-neutral-300 rounded text-sm font-mono font-bold focus:border-teal-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Fee summary banner */}
            {amountInput && parseFloat(amountInput) > 0 && (
              <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-lg text-xs space-y-1 font-mono">
                <div className="flex justify-between text-neutral-600">
                  <span>Importe recibo:</span>
                  <span>${parseFloat(amountInput).toFixed(2)} MXN</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Comisión servicio OXXO:</span>
                  <span>+${selectedProvider.fee.toFixed(2)} MXN</span>
                </div>
                <div className="flex justify-between font-black text-teal-900 pt-1 border-t border-teal-200 text-sm">
                  <span>Total al ticket:</span>
                  <span>
                    ${(parseFloat(amountInput) + selectedProvider.fee).toFixed(2)} MXN
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
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
            disabled={!barcodeInput || !amountInput || parseFloat(amountInput) <= 0}
            onClick={handleConfirmService}
            className="px-5 py-2 bg-teal-700 hover:bg-teal-600 disabled:opacity-40 disabled:pointer-events-none text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>Agregar Servicio al Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
