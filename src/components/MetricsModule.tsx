import React, { useState, useMemo } from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, ShoppingBag, Users, 
  CreditCard, Banknote, Smartphone, Gift, Calendar, ArrowUpRight, Award 
} from 'lucide-react';
import { ShiftSummary, SaleTransaction, Product } from '../types/pos';

interface MetricsModuleProps {
  shift: ShiftSummary;
  products: Product[];
  recentTransactions?: SaleTransaction[];
}

export const MetricsModule: React.FC<MetricsModuleProps> = ({
  shift,
  products,
  recentTransactions = [],
}) => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  // Multiplier for mock weekly/monthly view
  const multiplier = timeRange === 'week' ? 6.8 : timeRange === 'month' ? 28.5 : 1;

  const totalSales = (shift.cashSales + shift.cardSales + shift.valesSales + shift.spinSales) * multiplier;
  const transactionCount = Math.max(1, Math.round(shift.totalTransactions * multiplier));
  const averageTicket = totalSales > 0 ? totalSales / transactionCount : 0;

  // Estimated gross profit margin (~28% retail grocery margin)
  const estimatedProfit = totalSales * 0.285;
  const marginPercent = 28.5;

  // Payment methods breakdown
  const paymentBreakdown = useMemo(() => {
    const cash = shift.cashSales * multiplier;
    const card = shift.cardSales * multiplier;
    const spin = shift.spinSales * multiplier;
    const vales = shift.valesSales * multiplier;
    const sum = cash + card + spin + vales || 1;

    return [
      { name: 'Efectivo', amount: cash, percent: (cash / sum) * 100, icon: Banknote, color: 'bg-emerald-500' },
      { name: 'Tarjeta Bancaria', amount: card, percent: (card / sum) * 100, icon: CreditCard, color: 'bg-blue-500' },
      { name: 'Spin by OXXO', amount: spin, percent: (spin / sum) * 100, icon: Smartphone, color: 'bg-purple-500' },
      { name: 'Vales Despensa', amount: vales, percent: (vales / sum) * 100, icon: Gift, color: 'bg-amber-500' },
    ];
  }, [shift, multiplier]);

  // Top selling products simulation based on inventory items
  const topProducts = useMemo(() => {
    return products
      .slice(0, 6)
      .map((p, idx) => {
        const unitsSold = Math.round((45 - idx * 6) * multiplier);
        const revenue = unitsSold * p.price;
        return {
          name: p.name,
          category: p.category,
          price: p.price,
          unitsSold,
          revenue,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);
  }, [products, multiplier]);

  // Category sales share
  const categorySales = [
    { name: 'Bebidas & Refrescos', share: 36, amount: totalSales * 0.36, color: 'bg-sky-500' },
    { name: 'Botanas & Sabritas', share: 24, amount: totalSales * 0.24, color: 'bg-amber-500' },
    { name: 'Abarrotes & Lácteos', share: 18, amount: totalSales * 0.18, color: 'bg-emerald-500' },
    { name: 'Cervezas', share: 12, amount: totalSales * 0.12, color: 'bg-red-500' },
    { name: 'Otros / Cafetería', share: 10, amount: totalSales * 0.10, color: 'bg-neutral-500' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-neutral-100 overflow-y-auto">
      {/* Top Header */}
      <div className="bg-white border-b border-neutral-300 p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h2 className="text-base sm:text-lg font-black text-neutral-900 font-sans flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span>Módulo de Métricas & Rendimiento · Abarrotes Maricela</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Estadísticas de ventas en tiempo real, márgenes de utilidad y comportamiento del ticket
          </p>
        </div>

        {/* Time period filter */}
        <div className="flex items-center border border-neutral-300 rounded-lg p-0.5 bg-neutral-100 text-xs shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTimeRange('today')}
            className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
              timeRange === 'today' ? 'bg-white shadow-2xs text-neutral-900 font-bold' : 'text-neutral-600'
            }`}
          >
            Turno de Hoy
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
              timeRange === 'week' ? 'bg-white shadow-2xs text-neutral-900 font-bold' : 'text-neutral-600'
            }`}
          >
            Últimos 7 Días
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
              timeRange === 'month' ? 'bg-white shadow-2xs text-neutral-900 font-bold' : 'text-neutral-600'
            }`}
          >
            Este Mes
          </button>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 p-3 sm:p-4 shrink-0">
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Ventas Brutas Totales
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-3xl font-black font-mono text-neutral-950">
              ${totalSales.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +14.2% vs periodo anterior
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Ganancia Bruta Estimada
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-3xl font-black font-mono text-blue-700">
              ${estimatedProfit.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-neutral-600 font-semibold mt-1 block">
              Margen promedio: <strong className="text-neutral-900 font-bold">{marginPercent}%</strong>
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Ticket Promedio
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-3xl font-black font-mono text-neutral-950">
              ${averageTicket.toFixed(2)} <span className="text-xs sm:text-sm font-sans text-neutral-500 font-bold">MXN</span>
            </div>
            <span className="text-xs text-neutral-600 font-semibold mt-1 block">
              Por cliente atendido
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Transacciones Registradas
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl sm:text-3xl font-black font-mono text-purple-700">
              {transactionCount}
            </div>
            <span className="text-xs text-neutral-600 font-semibold mt-1 block">
              {shift.redondeoTotal > 0 ? `Redondeo Pro-Niñez: $${(shift.redondeoTotal * multiplier).toFixed(2)}` : 'Sin donaciones'}
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Content Grid */}
      <div className="flex-1 overflow-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Top Sellers & Category Share */}
        <div className="lg:col-span-7 space-y-4">
          {/* Top Selling Products */}
          <div className="bg-white p-4 rounded-xl border border-neutral-300 shadow-2xs">
            <h3 className="text-xs sm:text-sm font-black text-neutral-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Top Productos Más Vendidos</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="text-neutral-500 border-b border-neutral-200 text-xs uppercase font-mono font-bold">
                    <th className="pb-2.5">Producto</th>
                    <th className="pb-2.5 text-center">Unidades</th>
                    <th className="pb-2.5 text-right">P. Unitario</th>
                    <th className="pb-2.5 text-right">Ingreso Generado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {topProducts.map((p, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50">
                      <td className="py-3 font-black text-neutral-950 pr-2 text-sm sm:text-base">
                        <span className="inline-block w-5 font-mono text-neutral-400 text-xs sm:text-sm font-bold">{idx + 1}.</span>
                        {p.name}
                      </td>
                      <td className="py-3 text-center font-mono font-bold text-neutral-700 text-sm">
                        {p.unitsSold}
                      </td>
                      <td className="py-3 text-right font-mono font-semibold text-neutral-600 text-sm">
                        ${p.price.toFixed(2)}
                      </td>
                      <td className="py-3 text-right font-mono font-black text-emerald-700 text-sm sm:text-base">
                        ${p.revenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Category Sales Distribution */}
          <div className="bg-white p-4 rounded-xl border border-neutral-300 shadow-2xs">
            <h3 className="text-xs sm:text-sm font-black text-neutral-800 uppercase tracking-wider mb-3">
              Participación por Categoría de Producto
            </h3>

            <div className="space-y-3">
              {categorySales.map((cat, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs sm:text-sm font-bold text-neutral-800">
                    <span>{cat.name}</span>
                    <span className="font-mono text-neutral-950 font-black">
                      ${cat.amount.toFixed(2)} ({cat.share}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Payment Methods & Service Totals */}
        <div className="lg:col-span-5 space-y-4">
          {/* Payment Methods Breakdown */}
          <div className="bg-white p-4 rounded-xl border border-neutral-300 shadow-2xs">
            <h3 className="text-xs sm:text-sm font-black text-neutral-800 uppercase tracking-wider mb-3">
              Ventas por Método de Pago
            </h3>

            <div className="space-y-3">
              {paymentBreakdown.map((pm, i) => {
                const Icon = pm.icon;
                return (
                  <div key={i} className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-5 h-5 text-neutral-700" />
                        <span className="text-xs sm:text-sm font-black text-neutral-900">{pm.name}</span>
                      </div>
                      <span className="font-mono font-black text-sm sm:text-base text-neutral-950">
                        ${pm.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden mt-2">
                      <div className={`h-full ${pm.color} rounded-full`} style={{ width: `${pm.percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Services & TAE Extra Revenue */}
          <div className="bg-white p-4 rounded-xl border border-neutral-300 shadow-2xs space-y-3 font-mono text-xs sm:text-sm">
            <h3 className="text-xs sm:text-sm font-black text-neutral-800 font-sans uppercase tracking-wider">
              Servicios & Corresponsalía
            </h3>

            <div className="flex justify-between py-1.5 border-b border-neutral-100 text-neutral-700">
              <span className="font-sans font-medium">Recaudación Servicios (CFE, agua, gas):</span>
              <span className="font-black text-neutral-950">${(shift.servicesCollected * multiplier).toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-neutral-100 text-neutral-600">
              <span>Recargas TAE (Telcel, Movistar, AT&T):</span>
              <span className="font-bold text-neutral-900">${(shift.airtimeSales * multiplier).toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-neutral-100 text-neutral-600">
              <span>Depósitos Bancarios Recibidos:</span>
              <span className="font-bold text-neutral-900">${(shift.depositsCollected * multiplier).toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-1 text-neutral-600">
              <span>Retiros en Tómbola de Seguridad:</span>
              <span className="font-bold text-red-600">-${(shift.safeDrops * multiplier).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
