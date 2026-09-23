import React, { useState, useMemo } from 'react';
import { 
  Package, Search, Plus, AlertTriangle, CheckCircle, Edit3, Trash2, 
  ArrowUpDown, DollarSign, Filter, RefreshCw, Barcode, Check, X
} from 'lucide-react';
import { Product, ProductCategory } from '../types/pos';
import { playSuccessChime, playScannerBeep } from '../utils/audio';

interface InventoryModuleProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAdjustStock: (productId: string, delta: number) => void;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAdjustStock,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  
  // Modals for add & edit
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    barcode: string;
    name: string;
    shortName: string;
    brand: string;
    category: ProductCategory;
    price: string;
    cost: string;
    stock: string;
    minStock: string;
  }>({
    barcode: '',
    name: '',
    shortName: '',
    brand: '',
    category: 'abarrotes',
    price: '',
    cost: '',
    stock: '10',
    minStock: '5',
  });

  // Categories list
  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Todas las Categorías' },
    { id: 'abarrotes', label: 'Abarrotes' },
    { id: 'bebidas', label: 'Bebidas & Refrescos' },
    { id: 'botanas', label: 'Botanas & Sabritas' },
    { id: 'dulces', label: 'Dulces & Galletas' },
    { id: 'alimentos', label: 'Comida Preparada' },
    { id: 'andatti', label: 'Café & Panadería' },
    { id: 'cervezas', label: 'Cervezas' },
    { id: 'farmacia', label: 'Farmacia & Cuidado' },
  ];

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;

      const minThreshold = p.minStock || 8;
      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'low' && p.stock > 0 && p.stock <= minThreshold) ||
        (stockFilter === 'out' && p.stock <= 0);

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [products, searchTerm, selectedCategory, stockFilter]);

  // Inventory valuation KPIs
  const { totalUnits, totalCostValuation, totalRetailValuation, lowStockCount, outOfStockCount } = useMemo(() => {
    let units = 0;
    let costVal = 0;
    let retailVal = 0;
    let lowCount = 0;
    let outCount = 0;

    products.forEach((p) => {
      units += p.stock;
      costVal += p.cost * p.stock;
      retailVal += p.price * p.stock;

      const minThreshold = p.minStock || 8;
      if (p.stock <= 0) outCount++;
      else if (p.stock <= minThreshold) lowCount++;
    });

    return {
      totalUnits: units,
      totalCostValuation: costVal,
      totalRetailValuation: retailVal,
      lowStockCount: lowCount,
      outOfStockCount: outCount,
    };
  }, [products]);

  const handleOpenAddModal = () => {
    // Generate sample EAN-13 barcode starting with 750 (Mexico)
    const randomBarcode = `750${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    setFormData({
      barcode: randomBarcode,
      name: '',
      shortName: '',
      brand: 'Abarrotes Maricela',
      category: 'abarrotes',
      price: '',
      cost: '',
      stock: '24',
      minStock: '6',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      barcode: product.barcode,
      name: product.name,
      shortName: product.shortName || product.name.slice(0, 16),
      brand: product.brand,
      category: product.category,
      price: product.price.toString(),
      cost: product.cost.toString(),
      stock: product.stock.toString(),
      minStock: (product.minStock || 8).toString(),
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(formData.price) || 0;
    const costNum = parseFloat(formData.cost) || 0;
    const stockNum = parseInt(formData.stock, 10) || 0;
    const minStockNum = parseInt(formData.minStock, 10) || 5;

    if (!formData.name.trim() || !formData.barcode.trim()) {
      alert('Por favor ingrese el nombre y código de barras.');
      return;
    }

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: formData.name.trim(),
        shortName: (formData.shortName || formData.name).trim().slice(0, 20),
        brand: formData.brand.trim() || 'General',
        category: formData.category,
        barcode: formData.barcode.trim(),
        price: priceNum,
        cost: costNum,
        stock: stockNum,
        minStock: minStockNum,
      };
      onUpdateProduct(updated);
      setEditingProduct(null);
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        barcode: formData.barcode.trim(),
        name: formData.name.trim(),
        shortName: (formData.shortName || formData.name).trim().slice(0, 20),
        brand: formData.brand.trim() || 'General',
        category: formData.category,
        price: priceNum,
        cost: costNum,
        stock: stockNum,
        minStock: minStockNum,
        ivaRate: formData.category === 'bebidas' ? 0.16 : 0,
        iepsRate: formData.category === 'botanas' || formData.category === 'dulces' ? 0.08 : 0,
      };
      onAddProduct(newProduct);
      setIsAddModalOpen(false);
    }
    playSuccessChime();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-100 overflow-hidden">
      {/* Top Action Bar */}
      <div className="bg-white border-b border-neutral-300 p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h2 className="text-base sm:text-lg font-black text-neutral-900 font-sans flex items-center gap-2">
            <Package className="w-5 h-5 text-[#E21B23]" />
            <span>Módulo de Inventario · Abarrotes Maricela</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Control de existencias en almacén, costos, precios al público y alertas de resurtido
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex-1 sm:flex-none px-4 py-2 bg-[#E21B23] hover:bg-[#C1121F] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Artículo</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5 p-3 sm:p-4 shrink-0">
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
            Total Artículos en Catálogo
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-neutral-950 mt-1">
            {products.length} <span className="text-xs sm:text-sm font-sans text-neutral-500 font-bold">({totalUnits} pzas)</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
            Valor de Almacén al Costo
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-blue-700 mt-1">
            ${totalCostValuation.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
            Valor Estimado Venta
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700 mt-1">
            ${totalRetailValuation.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
            Alertas de Stock
          </span>
          <div className="flex items-center gap-3 mt-1 font-mono text-base font-bold">
            <span className="text-amber-600 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              {lowStockCount} Bajo
            </span>
            <span className="text-red-600 flex items-center gap-1">
              <X className="w-4 h-4" />
              {outOfStockCount} Agotado
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white border-y border-neutral-200 px-3 sm:px-4 py-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, marca o código de barras..."
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs focus:bg-white focus:border-[#E21B23] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {/* Category dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs text-neutral-800 focus:outline-none focus:border-[#E21B23]"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Stock state pills */}
          <div className="flex items-center border border-neutral-300 rounded-lg p-0.5 bg-neutral-100 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setStockFilter('all')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                stockFilter === 'all' ? 'bg-white shadow-2xs text-neutral-900 font-bold' : 'text-neutral-600'
              }`}
            >
              Todos ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setStockFilter('low')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                stockFilter === 'low' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-neutral-600'
              }`}
            >
              Stock Bajo ({lowStockCount})
            </button>
            <button
              type="button"
              onClick={() => setStockFilter('out')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                stockFilter === 'out' ? 'bg-red-100 text-red-900 font-bold' : 'text-neutral-600'
              }`}
            >
              Agotados ({outOfStockCount})
            </button>
          </div>
        </div>
      </div>

      {/* Products Table (Scrollable & Responsive) */}
      <div className="flex-1 overflow-auto p-3 sm:p-4">
        <div className="bg-white rounded-xl border border-neutral-300 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-neutral-800 text-neutral-100 border-b border-neutral-300 font-mono text-xs sm:text-sm uppercase tracking-wider font-bold">
                  <th className="py-3 px-3">Código Barras</th>
                  <th className="py-3 px-3">Producto / Descripción</th>
                  <th className="py-3 px-3">Categoría</th>
                  <th className="py-3 px-3 text-right">Costo ($)</th>
                  <th className="py-3 px-3 text-right">Precio Venta ($)</th>
                  <th className="py-3 px-3 text-right">Margen</th>
                  <th className="py-3 px-3 text-center">Existencias</th>
                  <th className="py-3 px-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-sans">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-neutral-500 font-medium text-sm">
                      No se encontraron productos coincidentes en el inventario.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const minThresh = product.minStock || 8;
                    const isLow = product.stock > 0 && product.stock <= minThresh;
                    const isOut = product.stock <= 0;
                    const margin = product.price > 0 ? ((product.price - product.cost) / product.price) * 100 : 0;

                    return (
                      <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="py-3 px-3 font-mono text-xs text-neutral-700 font-semibold whitespace-nowrap">
                          {product.barcode}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-extrabold text-neutral-950 text-sm sm:text-base leading-tight">{product.name}</div>
                          <span className="text-xs text-neutral-500 font-mono font-medium">{product.brand}</span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-neutral-100 text-neutral-800 capitalize border border-neutral-200">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-neutral-700 font-semibold whitespace-nowrap text-sm">
                          ${product.cost.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-black text-neutral-950 whitespace-nowrap text-sm sm:text-base">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-xs sm:text-sm text-emerald-700 font-black whitespace-nowrap">
                          {margin.toFixed(0)}%
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            {/* Quick adjust minus */}
                            <button
                              type="button"
                              onClick={() => onAdjustStock(product.id, -1)}
                              className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-black flex items-center justify-center text-sm cursor-pointer transition-colors shadow-2xs"
                              title="Restar 1 unidad"
                            >
                              -
                            </button>
                            <span
                              className={`px-3 py-1 rounded-lg font-mono font-black text-sm ${
                                isOut
                                  ? 'bg-red-100 text-red-800 border border-red-300'
                                  : isLow
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              }`}
                            >
                              {product.stock}
                            </span>
                            {/* Quick adjust plus */}
                            <button
                              type="button"
                              onClick={() => onAdjustStock(product.id, 1)}
                              className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-black flex items-center justify-center text-sm cursor-pointer transition-colors shadow-2xs"
                              title="Agregar 1 unidad"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(product)}
                              className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors cursor-pointer"
                              title="Editar producto"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`¿Eliminar ${product.name} del inventario?`)) {
                                  onDeleteProduct(product.id);
                                }
                              }}
                              className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors cursor-pointer"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
          <div className="bg-white rounded-xl shadow-2xl border-4 border-[#E21B23] w-full max-w-lg overflow-hidden flex flex-col animate-scale-in">
            <div className="bg-[#E21B23] text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm font-sans flex items-center gap-2">
                <Package className="w-4 h-4 text-[#FFCE00]" />
                <span>{editingProduct ? 'Editar Producto' : 'Registrar Nuevo Producto'}</span>
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1 hover:bg-red-800 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 space-y-3 bg-neutral-50 overflow-y-auto max-h-[80vh]">
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block uppercase mb-1">
                  Código de Barras (EAN-13 o Personalizado):
                </label>
                <div className="relative">
                  <Barcode className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="7501000000000"
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-neutral-300 rounded font-mono text-xs focus:border-[#E21B23] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block uppercase mb-1">
                  Nombre Completo del Producto:
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Leche Entera Lala 1 Litro"
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs focus:border-[#E21B23] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block uppercase mb-1">
                    Marca / Fabricante:
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Ej: Lala"
                    className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs focus:border-[#E21B23] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block uppercase mb-1">
                    Categoría:
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs focus:border-[#E21B23] focus:outline-none"
                  >
                    <option value="abarrotes">Abarrotes</option>
                    <option value="bebidas">Bebidas & Refrescos</option>
                    <option value="botanas">Botanas & Sabritas</option>
                    <option value="dulces">Dulces & Galletas</option>
                    <option value="alimentos">Comida / Fast Food</option>
                    <option value="andatti">Cafetería & Pan</option>
                    <option value="cervezas">Cervezas</option>
                    <option value="farmacia">Farmacia</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block uppercase mb-1">
                    Costo Proveedor ($ MXN):
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    required
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    placeholder="18.50"
                    className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded font-mono text-xs focus:border-[#E21B23] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block uppercase mb-1">
                    Precio Venta Público ($ MXN):
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="26.00"
                    className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded font-mono text-xs font-bold text-[#E21B23] focus:border-[#E21B23] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block uppercase mb-1">
                    Stock Inicial (Unidades):
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="24"
                    className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded font-mono text-xs focus:border-[#E21B23] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block uppercase mb-1">
                    Alerta de Stock Mínimo:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    placeholder="6"
                    className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded font-mono text-xs focus:border-[#E21B23] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E21B23] hover:bg-[#C1121F] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Producto</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
