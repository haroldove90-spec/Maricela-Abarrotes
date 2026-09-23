import React, { useState } from 'react';
import { X, Smartphone, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import { AirtimePackage, CartItem } from '../types/pos';
import { AIRTIME_PACKAGES } from '../data/products';
import { playSuccessChime, playErrorBuzz } from '../utils/audio';

interface AirtimeModalProps {
  onClose: () => void;
  onAddAirtimeToCart: (item: CartItem) => void;
}

export const AirtimeModal: React.FC<AirtimeModalProps> = ({
  onClose,
  onAddAirtimeToCart,
}) => {
  const [selectedCarrier, setSelectedCarrier] = useState<'telcel' | 'movistar' | 'att' | 'bait'>('telcel');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [confirmPhoneNumber, setConfirmPhoneNumber] = useState<string>('');
  const [selectedPkg, setSelectedPkg] = useState<AirtimePackage>(
    AIRTIME_PACKAGES.find((p) => p.carrier === 'telcel' && p.amount === 100) || AIRTIME_PACKAGES[0]
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const carrierTabs: { id: 'telcel' | 'movistar' | 'att' | 'bait'; name: string; color: string }[] = [
    { id: 'telcel', name: 'Telcel', color: 'bg-blue-600' },
    { id: 'movistar', name: 'Movistar', color: 'bg-emerald-600' },
    { id: 'att', name: 'AT&T', color: 'bg-sky-600' },
    { id: 'bait', name: 'Bait', color: 'bg-amber-600' },
  ];

  const filteredPackages = AIRTIME_PACKAGES.filter((p) => p.carrier === selectedCarrier);

  const handleCarrierChange = (carrier: 'telcel' | 'movistar' | 'att' | 'bait') => {
    setSelectedCarrier(carrier);
    const firstPkg = AIRTIME_PACKAGES.find((p) => p.carrier === carrier) || AIRTIME_PACKAGES[0];
    setSelectedPkg(firstPkg);
  };

  const handleConfirmAirtime = () => {
    setErrorMessage(null);
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    const cleanedConfirm = confirmPhoneNumber.replace(/\D/g, '');

    if (cleanedPhone.length !== 10) {
      playErrorBuzz();
      setErrorMessage('El número celular debe tener exactamente 10 dígitos.');
      return;
    }

    if (cleanedPhone !== cleanedConfirm) {
      playErrorBuzz();
      setErrorMessage('Los números celulares no coinciden. Verifíquelos con el cliente.');
      return;
    }

    playSuccessChime();

    const authCode = Math.floor(100000 + Math.random() * 900000).toString();

    const cartItem: CartItem = {
      id: `TAE-${Date.now()}`,
      product: {
        id: `tae-${selectedPkg.id}`,
        barcode: `TAE${cleanedPhone}`,
        name: `Recarga ${selectedPkg.name}`,
        shortName: `TAE ${selectedPkg.name.slice(0, 14)}`,
        brand: selectedPkg.carrier.toUpperCase(),
        category: 'servicios',
        price: selectedPkg.amount,
        cost: selectedPkg.amount * 0.94,
        stock: 999,
        ivaRate: 0.16,
        iepsRate: 0,
      },
      quantity: 1,
      unitPrice: selectedPkg.amount,
      discount: 0,
      total: selectedPkg.amount,
      isService: true,
      serviceType: 'tae',
      serviceMetadata: {
        carrier: selectedPkg.carrier.toUpperCase(),
        phoneNumber: cleanedPhone,
        authCode,
      },
    };

    onAddAirtimeToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-xl shadow-2xl border-4 border-[#2563EB] w-full max-w-xl overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFCE00] text-blue-950 font-black text-xs px-2 py-0.5 rounded uppercase">
              F3 TAE
            </span>
            <h2 className="text-base font-bold font-sans">
              Tiempo Aire Electrónico & Paquetes
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-800 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-neutral-50 flex-1 overflow-y-auto space-y-4">
          {/* Carrier Selector */}
          <div>
            <label className="text-xs font-bold text-neutral-700 block uppercase tracking-wider mb-2">
              Compañía Telefónica:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {carrierTabs.map((carrier) => (
                <button
                  key={carrier.id}
                  type="button"
                  onClick={() => handleCarrierChange(carrier.id)}
                  className={`py-2 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer text-center ${
                    selectedCarrier === carrier.id
                      ? `${carrier.color} text-white shadow-sm ring-2 ring-blue-400/40`
                      : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  {carrier.name}
                </button>
              ))}
            </div>
          </div>

          {/* Phone Number Inputs with Mexican 10-digit validation */}
          <div className="bg-white p-4 rounded-lg border border-neutral-300 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                  Número Celular (10 Dígitos):
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="8112345678"
                    autoFocus
                    className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded text-sm font-mono tracking-widest font-bold focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                  Confirmar Número Celular:
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    type="tel"
                    maxLength={10}
                    value={confirmPhoneNumber}
                    onChange={(e) => setConfirmPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="8112345678"
                    className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded text-sm font-mono tracking-widest font-bold focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="p-2 bg-red-50 text-red-700 rounded text-xs font-semibold flex items-center gap-1.5 border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Package Selection */}
          <div>
            <label className="text-xs font-bold text-neutral-700 block uppercase tracking-wider mb-2">
              Seleccionar Paquete o Monto:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredPackages.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPkg(pkg)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedPkg.id === pkg.id
                      ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/30'
                      : 'bg-white border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-neutral-500">
                      {pkg.type}
                    </span>
                    <span className="text-sm font-black font-mono text-blue-700">
                      ${pkg.amount}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-neutral-900 leading-tight">
                    {pkg.name}
                  </span>
                  <span className="text-[10px] text-neutral-500 mt-1 line-clamp-1">
                    {pkg.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Transacción directa por pasarela carrier oficial</span>
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
              disabled={phoneNumber.length !== 10 || confirmPhoneNumber.length !== 10}
              onClick={handleConfirmAirtime}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:pointer-events-none text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Cargar Recarga (${selectedPkg.amount}.00)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
