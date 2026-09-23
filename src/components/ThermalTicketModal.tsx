import React, { useRef, useEffect } from 'react';
import { Printer, Check, X, RotateCcw, Share2 } from 'lucide-react';
import { SaleTransaction } from '../types/pos';
import { playPrinterSound } from '../utils/audio';

interface ThermalTicketModalProps {
  transaction: SaleTransaction;
  onClose: () => void;
  onNewSale: () => void;
}

export const ThermalTicketModal: React.FC<ThermalTicketModalProps> = ({
  transaction,
  onClose,
  onNewSale,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    playPrinterSound();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 select-none">
      <div className="flex flex-col md:flex-row items-center gap-6 max-h-[95vh]">
        {/* The Authentic Thermal Receipt */}
        <div
          ref={receiptRef}
          className="receipt-paper print-area w-[320px] max-h-[85vh] overflow-y-auto p-4 rounded shadow-2xl border border-neutral-300 text-[11px] leading-tight flex flex-col"
        >
          {/* Top jagged tear edge */}
          <div className="w-full h-2 ticket-tear-top -mt-3 mb-2 no-print opacity-60"></div>

          {/* Authentic Fiscal Header */}
          <div className="text-center space-y-0.5 border-b border-dashed border-neutral-400 pb-3">
            <h2 className="text-base font-black tracking-tighter text-neutral-900 font-sans">
              ABARROTES MARICELA, S.A. DE C.V.
            </h2>
            <p className="font-bold">RFC: MAR-860523-1N4</p>
            <p className="text-[10px]">AV. HIDALGO 450 COL. CENTRO</p>
            <p className="text-[10px]">MONTERREY, NUEVO LEÓN C.P. 64000</p>
            <p className="text-[10px] text-neutral-600">
              RÉGIMEN GENERAL DE LEY PERSONAS MORALES
            </p>
          </div>

          {/* Store & Cashier Details */}
          <div className="py-2 space-y-0.5 border-b border-dashed border-neutral-400 text-[10px]">
            <div className="flex justify-between font-bold">
              <span>TIENDA: {transaction.storeName}</span>
            </div>
            <div className="flex justify-between">
              <span>ID TIENDA: {transaction.storeNumber}</span>
              <span>TERMINAL: {transaction.terminalNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>FECHA: {transaction.date}</span>
            </div>
            <div className="flex justify-between">
              <span>FOLIO DE VENTA:</span>
              <span className="font-bold">{transaction.folio}</span>
            </div>
            <div className="flex justify-between">
              <span>CAJERO: {transaction.cashierName}</span>
              <span>#{transaction.cashierId}</span>
            </div>
          </div>

          {/* Itemized Products & Services Table */}
          <div className="py-2 border-b border-dashed border-neutral-400 space-y-1">
            <div className="flex justify-between font-bold text-[10px] pb-1 border-b border-neutral-300">
              <span>CANT. ARTICULO</span>
              <span>TOTAL</span>
            </div>

            {transaction.items.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between items-start">
                  <span className="pr-1">
                    {item.quantity}x {item.product.shortName || item.product.name}
                  </span>
                  <span className="font-mono tabular-nums whitespace-nowrap">
                    ${item.total.toFixed(2)}
                  </span>
                </div>
                {item.quantity > 1 && (
                  <div className="text-[9px] text-neutral-500 pl-4">
                    ({item.quantity} x ${item.unitPrice.toFixed(2)})
                  </div>
                )}
                {item.isService && item.serviceMetadata && (
                  <div className="text-[9px] text-neutral-600 pl-2">
                    {item.serviceMetadata.phoneNumber && `Tel: ${item.serviceMetadata.phoneNumber}`}
                    {item.serviceMetadata.serviceAccount && `Ref: ${item.serviceMetadata.serviceAccount}`}
                    {item.serviceMetadata.cardNumber && `Tarjeta: ${item.serviceMetadata.cardNumber}`}
                    {item.serviceMetadata.authCode && ` · Aut: ${item.serviceMetadata.authCode}`}
                  </div>
                )}
                {item.discount > 0 && (
                  <div className="text-[9px] text-neutral-700 pl-2">
                    * PROMO APLICADA: -${item.discount.toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Financial Totals & Taxes */}
          <div className="py-2 border-b border-dashed border-neutral-400 space-y-1">
            <div className="flex justify-between">
              <span>SUBTOTAL:</span>
              <span className="font-mono tabular-nums">${transaction.subtotal.toFixed(2)}</span>
            </div>

            {(transaction.iva > 0 || transaction.ieps > 0) && (
              <div className="flex justify-between text-[10px] text-neutral-600">
                <span>IVA 16% + IEPS 8% TRASLADADO:</span>
                <span className="font-mono tabular-nums">
                  ${(transaction.iva + transaction.ieps).toFixed(2)}
                </span>
              </div>
            )}

            {transaction.discountTotal > 0 && (
              <div className="flex justify-between text-neutral-800 font-bold">
                <span>TOTAL AHORRO OXXO:</span>
                <span className="font-mono tabular-nums">
                  -${transaction.discountTotal.toFixed(2)}
                </span>
              </div>
            )}

            {transaction.redondeo > 0 && (
              <div className="flex justify-between text-neutral-800">
                <span>REDONDEO PRO-NINEZ:</span>
                <span className="font-mono tabular-nums">+${transaction.redondeo.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between font-black text-sm pt-1 border-t border-neutral-400">
              <span>TOTAL:</span>
              <span className="font-mono tabular-nums">${transaction.total.toFixed(2)} MXN</span>
            </div>

            <div className="text-[10px] pt-1">
              <div className="flex justify-between">
                <span className="uppercase">FORMA DE PAGO: {transaction.paymentMethod}</span>
                <span className="font-mono tabular-nums">
                  ${transaction.amountPaid.toFixed(2)}
                </span>
              </div>
              {transaction.change > 0 && (
                <div className="flex justify-between font-bold">
                  <span>CAMBIO:</span>
                  <span className="font-mono tabular-nums">${transaction.change.toFixed(2)}</span>
                </div>
              )}
              {transaction.authCode && (
                <div className="flex justify-between">
                  <span>NO. AUTORIZACION BANCARIA:</span>
                  <span className="font-mono">{transaction.authCode}</span>
                </div>
              )}
            </div>
          </div>

          {/* OXXO Premia Loyalty Section */}
          <div className="py-2 border-b border-dashed border-neutral-400 text-center space-y-0.5">
            <p className="font-bold text-neutral-900 uppercase">
              *** PROGRAMA OXXO PREMIA ***
            </p>
            {transaction.premiaCardNumber ? (
              <>
                <p className="text-[10px]">
                  TARJETA PREMIA: *******{transaction.premiaCardNumber.slice(-4)}
                </p>
                <p className="font-bold text-[10px]">
                  PUNTOS GENERADOS EN ESTA COMPRA: +{transaction.premiaPointsEarned}
                </p>
                <p className="text-[9px] text-neutral-600">
                  ¡Sigue acumulando para canjear por café Andatti y productos gratis!
                </p>
              </>
            ) : (
              <p className="text-[9px] text-neutral-600">
                Presenta tu tarjeta OXXO PREMIA o Spin en tu próxima compra y acumula puntos.
              </p>
            )}
          </div>

          {/* Barcode Graphic & Footer */}
          <div className="pt-3 pb-1 text-center space-y-2">
            {/* Realistic Barcode Lines CSS */}
            <div className="flex justify-center items-end h-10 gap-[2px] px-4 opacity-80">
              {Array.from({ length: 42 }).map((_, i) => (
                <div
                  key={i}
                  className={`bg-black h-full ${
                    i % 3 === 0
                      ? 'w-[3px]'
                      : i % 2 === 0
                      ? 'w-[1.5px]'
                      : 'w-[1px]'
                  }`}
                />
              ))}
            </div>
            <p className="font-mono tracking-widest text-[9px]">{transaction.folio}</p>

            <div className="text-[9px] text-neutral-600 space-y-0.5 pt-1">
              <p className="font-bold">PAGO HECHO EN UNA SOLA EXHIBICION</p>
              <p>LUGAR DE EXPEDICION: MONTERREY, N.L.</p>
              <p>GRACIAS POR SU COMPRA EN ABARROTES MARICELA</p>
              <p className="italic">¡Siempre surtido, siempre cerca de ti!</p>
            </div>
          </div>

          {/* Bottom jagged tear edge */}
          <div className="w-full h-2 ticket-tear-bottom mt-2 -mb-3 no-print opacity-60"></div>
        </div>

        {/* Action Controls Side Box */}
        <div className="bg-white rounded-xl p-5 shadow-2xl border border-neutral-300 w-full md:w-64 space-y-3 no-print">
          <div className="text-center pb-2 border-b border-neutral-200">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-neutral-900 text-sm">Venta Finalizada</h3>
            <p className="text-xs text-neutral-500 font-mono">
              Folio: {transaction.folio}
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="w-full py-2.5 px-3 bg-[#E21B23] hover:bg-[#C1121F] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Ticket (80mm)</span>
          </button>

          <button
            onClick={onNewSale}
            className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Nueva Venta [Enter]</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-neutral-300"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cerrar Ventana</span>
          </button>
        </div>
      </div>
    </div>
  );
};
