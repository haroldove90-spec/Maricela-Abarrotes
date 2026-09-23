import React, { useState } from 'react';
import { X, Sparkles, Gift, Coffee, Check, Search, Award } from 'lucide-react';
import { playSuccessChime, playScannerBeep } from '../utils/audio';

interface PremiaModalProps {
  currentCardNumber: string | null;
  onSetPremiaCard: (cardNumber: string) => void;
  onRedeemFreeItem: (itemName: string) => void;
  onClose: () => void;
}

export const PremiaModal: React.FC<PremiaModalProps> = ({
  currentCardNumber,
  onSetPremiaCard,
  onRedeemFreeItem,
  onClose,
}) => {
  const [inputCard, setInputCard] = useState<string>(currentCardNumber || '');
  const [activeAccount, setActiveAccount] = useState<{
    cardNumber: string;
    customerName: string;
    points: number;
    stampsAndatti: number;
    stampsVikingo: number;
  } | null>(
    currentCardNumber
      ? {
          cardNumber: currentCardNumber,
          customerName: 'Cliente Frecuente',
          points: 185,
          stampsAndatti: 4,
          stampsVikingo: 2,
        }
      : null
  );

  const handleLookup = () => {
    if (!inputCard.trim()) return;
    playScannerBeep();
    setActiveAccount({
      cardNumber: inputCard.trim(),
      customerName: 'Roberto Gómez G.',
      points: 240,
      stampsAndatti: 4,
      stampsVikingo: 3,
    });
    onSetPremiaCard(inputCard.trim());
  };

  const handleRedeemReward = (rewardName: string, pointsCost: number) => {
    if (!activeAccount || activeAccount.points < pointsCost) return;
    playSuccessChime();
    setActiveAccount({
      ...activeAccount,
      points: activeAccount.points - pointsCost,
    });
    onRedeemFreeItem(rewardName);
  };

  const handleQuickDemoScan = () => {
    const demoCard = '7509823410928';
    setInputCard(demoCard);
    playScannerBeep();
    setActiveAccount({
      cardNumber: demoCard,
      customerName: 'Gabriela Martínez (Nivel Oro)',
      points: 320,
      stampsAndatti: 4,
      stampsVikingo: 4,
    });
    onSetPremiaCard(demoCard);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto select-none">
      <div className="bg-white rounded-xl shadow-2xl border-4 border-[#FFCE00] w-full max-w-xl max-h-[92vh] overflow-hidden flex flex-col animate-scale-in my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-neutral-900 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#E21B23] text-white font-black text-xs px-2 py-0.5 rounded uppercase">
              F6 OXXO PREMIA
            </span>
            <h2 className="text-base font-black font-sans tracking-tight">
              Programa de Lealtad OXXO Premia
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-amber-400 rounded-full transition-colors cursor-pointer text-neutral-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-neutral-50 flex-1 overflow-y-auto space-y-4">
          {/* Lookup Input */}
          <div className="bg-white p-4 rounded-lg border border-neutral-300 shadow-xs space-y-2">
            <label className="text-xs font-bold text-neutral-700 block uppercase tracking-wider">
              Escanear Tarjeta Premia Física o Ingresar Celular:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Sparkles className="w-4 h-4 absolute left-3 top-2.5 text-amber-500" />
                <input
                  type="text"
                  value={inputCard}
                  onChange={(e) => setInputCard(e.target.value)}
                  placeholder="Escanee código o teclee 10 dígitos..."
                  autoFocus
                  className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded text-xs font-mono font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={handleLookup}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-900 font-bold text-xs rounded transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Buscar</span>
              </button>
              <button
                type="button"
                onClick={handleQuickDemoScan}
                className="px-2.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-300 rounded text-xs font-semibold cursor-pointer"
                title="Escanear tarjeta demo"
              >
                Demo
              </button>
            </div>
          </div>

          {/* Account Status Card */}
          {activeAccount && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-4 rounded-xl border border-neutral-700 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] text-[#FFCE00] uppercase font-mono tracking-widest block font-bold">
                      Cliente Registrado
                    </span>
                    <h3 className="text-sm font-bold text-white">
                      {activeAccount.customerName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 block font-mono">Saldo Puntos</span>
                    <span className="text-2xl font-black font-mono text-[#FFCE00]">
                      {activeAccount.points} pts
                    </span>
                  </div>
                </div>

                {/* Digital Stamp Cards */}
                <div className="pt-3 border-t border-neutral-700/80 grid grid-cols-2 gap-3 text-xs">
                  {/* Andatti Stamps */}
                  <div className="bg-neutral-800/80 p-2.5 rounded-lg border border-neutral-700">
                    <div className="flex items-center justify-between text-neutral-300 text-[11px] font-bold mb-1.5">
                      <span className="flex items-center gap-1">
                        <Coffee className="w-3.5 h-3.5 text-amber-400" />
                        Café Andatti
                      </span>
                      <span className="text-[#FFCE00] font-mono">
                        {activeAccount.stampsAndatti}/5 sellos
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 h-2 rounded-full ${
                            i <= activeAccount.stampsAndatti ? 'bg-[#FFCE00]' : 'bg-neutral-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] text-amber-200 mt-1 block">
                      {activeAccount.stampsAndatti === 4
                        ? '¡El próximo café es 100% GRATIS!'
                        : 'Acumula 5 y llévate 1 gratis'}
                    </span>
                  </div>

                  {/* Vikingo Stamps */}
                  <div className="bg-neutral-800/80 p-2.5 rounded-lg border border-neutral-700">
                    <div className="flex items-center justify-between text-neutral-300 text-[11px] font-bold mb-1.5">
                      <span className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-red-400" />
                        Vikingos
                      </span>
                      <span className="text-red-400 font-mono">
                        {activeAccount.stampsVikingo}/5 sellos
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 h-2 rounded-full ${
                            i <= activeAccount.stampsVikingo ? 'bg-red-500' : 'bg-neutral-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] text-neutral-400 mt-1 block">
                      Acumula 5 hot dogs y gana 1 gratis
                    </span>
                  </div>
                </div>
              </div>

              {/* Rewards Redemption List */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block uppercase tracking-wider mb-2">
                  Canjear Puntos por Recompensas en esta Venta:
                </label>
                <div className="space-y-2">
                  <div className="p-3 bg-white border border-neutral-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
                        <Coffee className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">
                          Café Andatti Americano 12oz Gratis
                        </h4>
                        <span className="text-[10px] text-neutral-500">Costo: 80 puntos Premia</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={activeAccount.points < 80}
                      onClick={() => handleRedeemReward('Café Andatti 12oz Gratis (Premia)', 80)}
                      className="px-3 py-1.5 bg-[#E21B23] hover:bg-[#C1121F] disabled:opacity-40 disabled:hover:bg-[#E21B23] text-white rounded text-xs font-bold transition-colors cursor-pointer"
                    >
                      Canjear
                    </button>
                  </div>

                  <div className="p-3 bg-white border border-neutral-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-red-800">
                        <Gift className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">
                          Hot Dog Vikingo Regular Gratis
                        </h4>
                        <span className="text-[10px] text-neutral-500">Costo: 120 puntos Premia</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={activeAccount.points < 120}
                      onClick={() => handleRedeemReward('Hot Dog Vikingo Gratis (Premia)', 120)}
                      className="px-3 py-1.5 bg-[#E21B23] hover:bg-[#C1121F] disabled:opacity-40 disabled:hover:bg-[#E21B23] text-white rounded text-xs font-bold transition-colors cursor-pointer"
                    >
                      Canjear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-neutral-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
          >
            Listo / Regresar a Venta
          </button>
        </div>
      </div>
    </div>
  );
};
