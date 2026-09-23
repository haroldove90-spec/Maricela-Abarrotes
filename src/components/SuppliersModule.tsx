import React, { useState } from 'react';
import { 
  Truck, Search, Plus, Phone, Calendar, DollarSign, CheckCircle2, 
  Clock, AlertCircle, FileText, Check, X, ShieldAlert 
} from 'lucide-react';
import { Supplier, PurchaseOrder, ProductCategory } from '../types/pos';
import { INITIAL_SUPPLIERS, INITIAL_PURCHASE_ORDERS } from '../data/suppliers';
import { playSuccessChime, playCashDrawerSound } from '../utils/audio';

interface SuppliersModuleProps {
  onNotifyStockUpdate?: () => void;
}

export const SuppliersModule: React.FC<SuppliersModuleProps> = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modals
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState<boolean>(false);
  const [isReceiveOrderOpen, setIsReceiveOrderOpen] = useState<boolean>(false);
  const [isPayDebtOpen, setIsPayDebtOpen] = useState<boolean>(false);
  const [selectedSupplierForPayment, setSelectedSupplierForPayment] = useState<Supplier | null>(null);

  // New supplier form
  const [newSupplier, setNewSupplier] = useState<{
    name: string;
    companyName: string;
    contactPerson: string;
    phone: string;
    email: string;
    deliveryDays: string[];
    creditDays: string;
  }>({
    name: '',
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    deliveryDays: ['Lunes'],
    creditDays: '7',
  });

  // Receive order form
  const [orderForm, setOrderForm] = useState<{
    supplierId: string;
    folio: string;
    totalCost: string;
    itemsCount: string;
    notes: string;
  }>({
    supplierId: INITIAL_SUPPLIERS[0]?.id || '',
    folio: '',
    totalCost: '',
    itemsCount: '12',
    notes: '',
  });

  // Pay debt form
  const [paymentAmount, setPaymentAmount] = useState<string>('');

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDebt = suppliers.reduce((acc, s) => acc + s.pendingBalance, 0);

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.name.trim()) return;

    const created: Supplier = {
      id: `sup-${Date.now()}`,
      name: newSupplier.name.trim(),
      companyName: newSupplier.companyName.trim() || newSupplier.name.trim(),
      contactPerson: newSupplier.contactPerson.trim() || 'Preventa en ruta',
      phone: newSupplier.phone.trim() || 'S/N',
      email: newSupplier.email.trim(),
      deliveryDays: newSupplier.deliveryDays,
      categories: ['abarrotes'],
      pendingBalance: 0,
      creditDays: parseInt(newSupplier.creditDays, 10) || 7,
      lastDelivery: 'Sin registros previos',
    };

    setSuppliers((prev) => [...prev, created]);
    setIsAddSupplierOpen(false);
    playSuccessChime();
  };

  const handleReceiveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find((s) => s.id === orderForm.supplierId);
    if (!sup) return;

    const costNum = parseFloat(orderForm.totalCost) || 0;
    const itemsNum = parseInt(orderForm.itemsCount, 10) || 1;

    const newPO: PurchaseOrder = {
      id: `PO-${Date.now()}`,
      folio: orderForm.folio.trim() || `FAC-${Math.floor(10000 + Math.random() * 90000)}`,
      supplierId: sup.id,
      supplierName: sup.name,
      date: 'Hoy, ' + new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      itemsCount: itemsNum,
      totalCost: costNum,
      status: 'recibido',
      notes: orderForm.notes.trim() || 'Mercancía recibida y verificada contra factura.',
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);

    // Update supplier pending balance and last delivery
    setSuppliers((prev) =>
      prev.map((s) => {
        if (s.id === sup.id) {
          return {
            ...s,
            pendingBalance: s.pendingBalance + costNum,
            lastDelivery: 'Hoy en tienda',
          };
        }
        return s;
      })
    );

    setIsReceiveOrderOpen(false);
    playSuccessChime();
  };

  const handlePaySupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierForPayment) return;
    const amount = parseFloat(paymentAmount) || 0;
    if (amount <= 0) return;

    setSuppliers((prev) =>
      prev.map((s) => {
        if (s.id === selectedSupplierForPayment.id) {
          const newBal = Math.max(0, s.pendingBalance - amount);
          return { ...s, pendingBalance: newBal };
        }
        return s;
      })
    );

    playCashDrawerSound();
    setIsPayDebtOpen(false);
    setSelectedSupplierForPayment(null);
    setPaymentAmount('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-100 overflow-hidden">
      {/* Top Header */}
      <div className="bg-white border-b border-neutral-300 p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h2 className="text-base sm:text-lg font-black text-neutral-900 font-sans flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <span>Módulo de Proveedores & Compras · Abarrotes Maricela</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Control de repartidores, días de visita, recepción de pedidos y cuentas por pagar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsReceiveOrderOpen(true)}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Recibir Mercancía</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddSupplierOpen(true)}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Proveedor</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 shrink-0">
        <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
            Proveedores Activos
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-neutral-900 mt-1">
            {suppliers.length} <span className="text-xs font-sans text-neutral-400 font-normal">empresas distribuidoras</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
            Saldo Pendiente a Proveedores
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-red-600 mt-1">
            ${totalDebt.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
            <span className="text-xs font-sans text-neutral-400 font-normal">MXN</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
            Pedidos Recibidos este Mes
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 mt-1">
            {purchaseOrders.length} <span className="text-xs font-sans text-neutral-400 font-normal">facturas surtidas</span>
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white border-y border-neutral-200 px-3 sm:px-4 py-2 flex items-center justify-between shrink-0">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar proveedor o preventista..."
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Suppliers Grid & History Split */}
      <div className="flex-1 overflow-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Suppliers List */}
        <div className="lg:col-span-8 space-y-3">
          <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
            Directorio de Proveedores y Rutas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-white p-4 rounded-xl border border-neutral-300 shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900 leading-tight">
                        {supplier.name}
                      </h4>
                      <span className="text-[11px] text-neutral-500 font-mono">
                        {supplier.companyName}
                      </span>
                    </div>
                    {supplier.pendingBalance > 0 ? (
                      <span className="bg-red-50 text-red-700 font-mono font-bold text-xs px-2 py-0.5 rounded border border-red-200">
                        Debe: ${supplier.pendingBalance.toFixed(2)}
                      </span>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-700 font-mono font-bold text-xs px-2 py-0.5 rounded border border-emerald-200">
                        Al corriente
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{supplier.contactPerson} ({supplier.phone})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Días de ruta: <strong className="text-neutral-800">{supplier.deliveryDays.join(', ')}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Última entrega: {supplier.lastDelivery || 'Sin datos'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                  <span className="text-[10px] text-neutral-400">
                    Plazo: {supplier.creditDays} días de crédito
                  </span>
                  {supplier.pendingBalance > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSupplierForPayment(supplier);
                        setPaymentAmount(supplier.pendingBalance.toString());
                        setIsPayDebtOpen(true);
                      }}
                      className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      Abonar Saldo
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase Orders Log */}
        <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-neutral-300 shadow-2xs flex flex-col">
          <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-neutral-500" />
            <span>Últimas Entregas Recibidas</span>
          </h3>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {purchaseOrders.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-6">
                No hay órdenes registradas.
              </p>
            ) : (
              purchaseOrders.map((po) => (
                <div
                  key={po.id}
                  className="p-3 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-neutral-900 mb-1">
                    <span>{po.supplierName}</span>
                    <span className="font-mono text-emerald-700">
                      ${po.totalCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                    <span>{po.folio}</span>
                    <span>{po.itemsCount} productos</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    {po.date} · {po.notes}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RECEIVE ORDER MODAL */}
      {isReceiveOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
          <div className="bg-white rounded-xl shadow-2xl border-4 border-emerald-600 w-full max-w-md overflow-hidden flex flex-col animate-scale-in">
            <div className="bg-emerald-600 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm font-sans flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Recepción de Mercancía de Proveedor</span>
              </h3>
              <button
                onClick={() => setIsReceiveOrderOpen(false)}
                className="p-1 hover:bg-emerald-700 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReceiveOrder} className="p-5 space-y-3 bg-neutral-50">
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block uppercase mb-1">
                  Seleccionar Proveedor:
                </label>
                <select
                  required
                  value={orderForm.supplierId}
                  onChange={(e) => setOrderForm({ ...orderForm, supplierId: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs focus:border-emerald-600 focus:outline-none"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.companyName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block uppercase mb-1">
                  No. Factura / Folio de Remisión:
                </label>
                <input
                  type="text"
                  required
                  value={orderForm.folio}
                  onChange={(e) => setOrderForm({ ...orderForm, folio: e.target.value })}
                  placeholder="Ej: FAC-BIM-98432"
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded font-mono text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block uppercase mb-1">
                    Importe Total Factura ($ MXN):
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    min="1"
                    required
                    value={orderForm.totalCost}
                    onChange={(e) => setOrderForm({ ...orderForm, totalCost: e.target.value })}
                    placeholder="1450.00"
                    className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded font-mono text-xs font-bold text-emerald-700 focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block uppercase mb-1">
                    Piezas Recibidas:
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={orderForm.itemsCount}
                    onChange={(e) => setOrderForm({ ...orderForm, itemsCount: e.target.value })}
                    placeholder="24"
                    className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded font-mono text-xs focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block uppercase mb-1">
                  Observaciones / Detalle:
                </label>
                <input
                  type="text"
                  value={orderForm.notes}
                  onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                  placeholder="Cajas selladas, caducidad revisada..."
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReceiveOrderOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Registrar Recepción</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SUPPLIER MODAL */}
      {isAddSupplierOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
          <div className="bg-white rounded-xl shadow-2xl border-4 border-blue-600 w-full max-w-md overflow-hidden flex flex-col animate-scale-in">
            <div className="bg-blue-600 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm font-sans flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Registrar Nuevo Proveedor</span>
              </h3>
              <button
                onClick={() => setIsAddSupplierOpen(false)}
                className="p-1 hover:bg-blue-700 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSupplier} className="p-5 space-y-3 bg-neutral-50">
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block uppercase mb-1">
                  Nombre Comercial:
                </label>
                <input
                  type="text"
                  required
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  placeholder="Ej: Jugos del Valle / Santa Clara"
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block uppercase mb-1">
                  Razón Social / Empresa:
                </label>
                <input
                  type="text"
                  value={newSupplier.companyName}
                  onChange={(e) => setNewSupplier({ ...newSupplier, companyName: e.target.value })}
                  placeholder="Ej: Distribuidora Valle S.A. de C.V."
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block uppercase mb-1">
                    Preventista / Chofer:
                  </label>
                  <input
                    type="text"
                    value={newSupplier.contactPerson}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                    placeholder="Ej: Juan Martínez"
                    className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block uppercase mb-1">
                    Teléfono Celular:
                  </label>
                  <input
                    type="text"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    placeholder="811-234-5678"
                    className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSupplierOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Proveedor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAY DEBT MODAL */}
      {isPayDebtOpen && selectedSupplierForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
          <div className="bg-white rounded-xl shadow-2xl border-4 border-neutral-900 w-full max-w-sm overflow-hidden flex flex-col animate-scale-in">
            <div className="bg-neutral-900 text-white px-5 py-3 flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase font-sans">
                Abono a Proveedor: {selectedSupplierForPayment.name}
              </h3>
              <button
                onClick={() => setIsPayDebtOpen(false)}
                className="p-1 hover:bg-neutral-800 rounded-full text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePaySupplier} className="p-4 space-y-3 bg-neutral-50">
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
                Saldo pendiente actual: <strong className="font-mono">${selectedSupplierForPayment.pendingBalance.toFixed(2)} MXN</strong>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block uppercase mb-1">
                  Monto a Abonar / Liquidar ($ MXN):
                </label>
                <input
                  type="number"
                  step="0.50"
                  min="1"
                  max={selectedSupplierForPayment.pendingBalance}
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded font-mono text-base font-bold focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPayDebtOpen(false)}
                  className="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-bold cursor-pointer"
                >
                  Confirmar Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
