import React from 'react';
import { X, Tag, Sparkles, Plus, Check } from 'lucide-react';
import { Product, CartItem } from '../types/pos';
import { playScannerBeep, playSuccessChime } from '../utils/audio';

interface CombosModalProps {
  products: Product[];
  onAddComboItems: (items: CartItem[]) => void;
  onClose: () => void;
}

export const CombosModal: React.FC<CombosModalProps> = ({
  products,
  onAddComboItems,
  onClose,
}) => {
  const combos = [
    {
      id: 'combo-vikingo-coca',
      title: 'Combo Vikingo Clásico',
      description: '1 Hot Dog Vikingo Regular + 1 Coca-Cola Original 600ml',
      originalPrice: 54.0,
      comboPrice: 45.0,
      savings: 9.0,
      badge: 'El Favorito OXXO',
      items: [
        { barcode: '7501000200012', qty: 1 }, // Vikingo
        { barcode: '7501055301072', qty: 1 }, // Coca 600ml
      ],
    },
    {
      id: 'combo-desayuno-andatti',
      title: 'Combo Desayuno Andatti',
      description: '1 Café Andatti Americano 16oz + 1 Galleta de Chispas Andatti',
      originalPrice: 52.0,
      comboPrice: 42.0,
      savings: 10.0,
      badge: 'Mañanero',
      items: [
        { barcode: '7501000100169', qty: 1 }, // Andatti 16oz
        { barcode: '7501000100312', qty: 1 }, // Galleta
      ],
    },
    {
      id: 'combo-botana-doble',
      title: 'Dúo Botanero Sabritas',
      description: '2 Papas Sabritas Sal Original 160g',
      originalPrice: 96.0,
      comboPrice: 85.0,
      savings: 11.0,
      badge: '2 por $85',
      items: [{ barcode: '7501011115439', qty: 2 }],
    },
    {
      id: 'combo-hidratacion',
      title: 'Doble Hidratación Electrolit',
      description: '2 Electrolit Suero 625ml',
      originalPrice: 72.0,
      comboPrice: 65.0,
      savings: 7.0,
      badge: '2 por $65',
      items: [{ barcode: '7501125134104', qty: 2 }],
    },
    {
      id: 'combo-estudiante',
      title: 'Combo Antojo Estudiante',
      description: '1 Sopa Maruchan Pollo + 1 Peñafiel Limonada 600ml',
      originalPrice: 38.0,
      comboPrice: 32.0,
      savings: 6.0,
      badge: 'Económico',
      items: [
        { barcode: '041789001214', qty: 1 }, // Maruchan
        { barcode: '7501071112454', qty: 1 }, // Peñafiel
      ],
    },
  ];

  const handleApplyCombo = (combo: (typeof combos)[0]) => {
    playSuccessChime();
    const newCartItems: CartItem[] = [];

    // Distribute savings across items in combo
    const totalSavings = combo.savings;
    const itemsCount = combo.items.reduce((acc, it) => acc + it.qty, 0);
    const savingsPerUnit = totalSavings / itemsCount;

    combo.items.forEach((cItem) => {
      const product = products.find((p) => p.barcode === cItem.barcode);
      if (product) {
        const itemDiscount = savingsPerUnit * cItem.qty;
        newCartItems.push({
          id: `ITEM-${Date.now()}-${Math.random()}`,
          product,
          quantity: cItem.qty,
          unitPrice: product.price,
          discount: itemDiscount,
          total: product.price * cItem.qty - itemDiscount,
        });
      }
    });

    onAddComboItems(newCartItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-xl shadow-2xl border-4 border-[#E21B23] w-full max-w-xl overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="bg-[#E21B23] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFCE00] text-[#991B1B] font-black text-xs px-2 py-0.5 rounded uppercase">
              F7 COMBOS
            </span>
            <h2 className="text-base font-bold font-sans">
              Promociones y Combos Oficiales OXXO
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-800 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-neutral-50 flex-1 overflow-y-auto space-y-3">
          <p className="text-xs text-neutral-500 font-medium">
            Seleccione el combo para aplicar el descuento y agregar automáticamente los artículos al ticket:
          </p>

          <div className="space-y-2.5">
            {combos.map((combo) => (
              <div
                key={combo.id}
                className="bg-white p-3.5 rounded-lg border border-neutral-300 hover:border-[#E21B23] shadow-xs flex items-center justify-between gap-4 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-red-50 text-[#E21B23] text-[10px] font-black px-1.5 py-0.5 rounded border border-red-200">
                      {combo.badge}
                    </span>
                    <h4 className="text-xs font-bold text-neutral-900 font-sans">
                      {combo.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-neutral-600 mb-1">
                    {combo.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="line-through text-neutral-400">
                      ${combo.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-sm font-black text-[#E21B23]">
                      ${combo.comboPrice.toFixed(2)} MXN
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                      Ahorra ${combo.savings.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleApplyCombo(combo)}
                  className="px-4 py-2 bg-[#E21B23] hover:bg-[#C1121F] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-neutral-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
