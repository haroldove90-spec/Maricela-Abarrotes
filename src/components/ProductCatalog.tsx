import React, { useState } from 'react';
import { Search, Coffee, Utensils, CupSoda, Cookie, ShoppingBag, Beer, Pill, Sparkles, Tag } from 'lucide-react';
import { Product, ProductCategory } from '../types/pos';
import { playScannerBeep } from '../utils/audio';

interface ProductCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: ProductCategory | 'todos'; label: string; icon: React.ReactNode }[] = [
    { id: 'todos', label: 'Todos', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'andatti', label: 'Andatti', icon: <Coffee className="w-3.5 h-3.5 text-amber-700" /> },
    { id: 'alimentos', label: 'Vikingos & Comida', icon: <Utensils className="w-3.5 h-3.5 text-red-600" /> },
    { id: 'bebidas', label: 'Bebidas & Refrescos', icon: <CupSoda className="w-3.5 h-3.5 text-blue-600" /> },
    { id: 'botanas', label: 'Botanas & Sabritas', icon: <Tag className="w-3.5 h-3.5 text-yellow-600" /> },
    { id: 'dulces', label: 'Dulces & Galletas', icon: <Cookie className="w-3.5 h-3.5 text-pink-600" /> },
    { id: 'abarrotes', label: 'Abarrotes', icon: <ShoppingBag className="w-3.5 h-3.5 text-teal-600" /> },
    { id: 'cervezas', label: 'Cervezas', icon: <Beer className="w-3.5 h-3.5 text-amber-500" /> },
    { id: 'farmacia', label: 'Farmacia & Varios', icon: <Pill className="w-3.5 h-3.5 text-purple-600" /> },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'todos' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (product: Product) => {
    playScannerBeep();
    onSelectProduct(product);
  };

  return (
    <div className="flex flex-col min-h-0 h-full bg-neutral-100 border-l border-neutral-300 no-print select-none">
      {/* Search Header */}
      <div className="p-2.5 bg-white border-b border-neutral-200">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o marca..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 border border-neutral-300 focus:border-[#E21B23] focus:bg-white rounded text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none"
          />
        </div>

        {/* Category Horizontal Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-0.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#E21B23] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 grid grid-cols-2 xl:grid-cols-3 gap-2.5">
        {filteredProducts.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => handleProductClick(product)}
            className="group relative bg-white border border-neutral-200 hover:border-[#E21B23] rounded-xl p-3 text-left shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between active:scale-[0.98]"
          >
            <div>
              {/* Product Category Brand Tag */}
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                <span className="font-bold uppercase truncate">{product.brand}</span>
                <span className="font-mono text-neutral-500 font-semibold">Stock: {product.stock}</span>
              </div>

              {/* Product Title */}
              <h4 className="text-sm font-black text-neutral-950 line-clamp-2 leading-tight group-hover:text-[#E21B23] transition-colors">
                {product.name}
              </h4>
            </div>

            {/* Promo Tag */}
            {product.promoText && (
              <div className="my-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 rounded-md text-xs font-bold border border-red-200">
                <Tag className="w-3 h-3" />
                <span>{product.promoText}</span>
              </div>
            )}

            {/* Bottom: Price in MXN */}
            <div className="mt-2.5 pt-1.5 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs text-neutral-500 font-mono font-medium">
                ...{product.barcode.slice(-5)}
              </span>
              <span className="text-base sm:text-lg font-black font-mono text-neutral-950 group-hover:text-[#E21B23]">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </button>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full py-12 text-center text-neutral-500 text-sm font-mono">
            No se encontraron productos con "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};
