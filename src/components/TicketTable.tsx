import React from 'react';
import { Trash2, Plus, Minus, Tag, Zap, Smartphone, Landmark, FileText } from 'lucide-react';
import { CartItem } from '../types/pos';

interface TicketTableProps {
  items: CartItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
}

export const TicketTable: React.FC<TicketTableProps> = ({
  items,
  selectedItemId,
  onSelectItem,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-neutral-400 bg-neutral-50/70 border-b border-neutral-300 select-none">
        <div className="w-16 h-16 rounded-full bg-neutral-200/70 flex items-center justify-center mb-3">
          <Zap className="w-8 h-8 text-neutral-400" />
        </div>
        <p className="text-base font-bold text-neutral-600 mb-1">
          Terminal Lista Para Escanear
        </p>
        <p className="text-xs text-neutral-400 max-w-sm text-center mb-4">
          Pase el código de barras por el lector o use las teclas rápidas de servicio (F1 Catálogo, F3 Tiempo Aire, F4 Servicios CFE).
        </p>
        <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono">
          <span className="bg-white px-2 py-1 rounded border border-neutral-300 shadow-2xs">
            [F1] Catálogo
          </span>
          <span className="bg-white px-2 py-1 rounded border border-neutral-300 shadow-2xs">
            [F3] Recargas TAE
          </span>
          <span className="bg-white px-2 py-1 rounded border border-neutral-300 shadow-2xs">
            [F4] Pago CFE/Luz
          </span>
          <span className="bg-white px-2 py-1 rounded border border-neutral-300 shadow-2xs">
            [F5] Depósitos Spin
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-white border-b border-neutral-300 select-none">
      <table className="w-full text-left border-collapse">
        <thead className="bg-neutral-800 text-neutral-200 text-[11px] font-mono uppercase sticky top-0 z-10">
          <tr>
            <th className="py-2 px-2 sm:px-3 w-10 sm:w-12 text-center hidden sm:table-cell">Part.</th>
            <th className="py-2 px-2 sm:px-3">Descripción / Artículo</th>
            <th className="py-2 px-2 sm:px-3 w-24 sm:w-28 text-center">Cant.</th>
            <th className="py-2 px-2 sm:px-3 w-20 sm:w-24 text-right hidden sm:table-cell">P. Unit.</th>
            <th className="py-2 px-2 sm:px-3 w-16 sm:w-24 text-right hidden md:table-cell">Descto.</th>
            <th className="py-2 px-2 sm:px-3 w-20 sm:w-28 text-right">Importe</th>
            <th className="py-2 px-1 sm:px-2 w-8 sm:w-10 text-center"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 text-xs font-mono">
          {items.map((item, index) => {
            const isSelected = item.id === selectedItemId;
            return (
              <tr
                key={item.id}
                onClick={() => onSelectItem(item.id)}
                className={`transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-amber-50/90 font-medium'
                    : index % 2 === 0
                    ? 'bg-white hover:bg-neutral-50'
                    : 'bg-neutral-50/50 hover:bg-neutral-100'
                }`}
              >
                {/* Partida number */}
                <td className="py-2 px-2 sm:px-3 text-center text-neutral-500 text-[11px] hidden sm:table-cell">
                  {String(index + 1).padStart(2, '0')}
                </td>

                {/* Description & metadata */}
                <td className="py-2 px-2 sm:px-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Service Icon Badges */}
                      {item.isService && item.serviceType === 'tae' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] bg-blue-100 text-blue-800 px-1 py-0.2 rounded font-sans font-bold">
                          <Smartphone className="w-2.5 h-2.5" /> TAE
                        </span>
                      )}
                      {item.isService && item.serviceType === 'bill' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-sans font-bold">
                          <FileText className="w-2.5 h-2.5" /> SERVICIO
                        </span>
                      )}
                      {item.isService && item.serviceType === 'deposit' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] bg-purple-100 text-purple-800 px-1 py-0.2 rounded font-sans font-bold">
                          <Landmark className="w-2.5 h-2.5" /> DEPÓSITO
                        </span>
                      )}

                      <span className="font-bold text-neutral-900 text-xs leading-tight">
                        {item.product.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 mt-0.5 flex-wrap">
                      <span>CB: {item.product.barcode}</span>
                      {item.product.brand && (
                        <>
                          <span className="hidden sm:inline">·</span>
                          <span className="hidden sm:inline">{item.product.brand}</span>
                        </>
                      )}
                      {item.serviceMetadata?.phoneNumber && (
                        <>
                          <span>·</span>
                          <span className="text-blue-700 font-bold">
                            Tel: {item.serviceMetadata.phoneNumber}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Promo notice */}
                    {item.discount > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-sans font-semibold mt-0.5">
                        <Tag className="w-3 h-3" />
                        <span>Ahorro: -${item.discount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Quantity Controls */}
                <td className="py-2 px-1 sm:px-3 text-center" onClick={(e) => e.stopPropagation()}>
                  {item.isService ? (
                    <span className="text-neutral-700 font-bold">{item.quantity}</span>
                  ) : (
                    <div className="inline-flex items-center border border-neutral-300 rounded bg-white shadow-2xs">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-0.5 sm:p-1 hover:bg-neutral-100 text-neutral-600 transition-colors"
                        title="Restar uno"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-1 sm:px-2 text-xs font-bold text-neutral-900 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="p-0.5 sm:p-1 hover:bg-neutral-100 text-neutral-600 transition-colors"
                        title="Sumar uno"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </td>

                {/* Unit Price */}
                <td className="py-2 px-2 sm:px-3 text-right text-neutral-600 tabular-nums hidden sm:table-cell">
                  ${item.unitPrice.toFixed(2)}
                </td>

                {/* Discount */}
                <td className="py-2 px-2 sm:px-3 text-right text-emerald-600 tabular-nums hidden md:table-cell">
                  {item.discount > 0 ? `-$${item.discount.toFixed(2)}` : '$0.00'}
                </td>

                {/* Row Total */}
                <td className="py-2 px-2 sm:px-3 text-right font-bold text-neutral-900 text-xs sm:text-sm tabular-nums whitespace-nowrap">
                  ${item.total.toFixed(2)}
                </td>

                {/* Remove Line Action */}
                <td className="py-2 px-1 sm:px-2 text-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Eliminar partida (F8)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
