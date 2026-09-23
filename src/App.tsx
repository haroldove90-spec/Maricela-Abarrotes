import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Camera, Scan } from 'lucide-react';
import { Header, NavTab } from './components/Header';
import { ScannerInput } from './components/ScannerInput';
import { TicketTable } from './components/TicketTable';
import { TotalsSummary } from './components/TotalsSummary';
import { ProductCatalog } from './components/ProductCatalog';
import { FunctionKeyboard } from './components/FunctionKeyboard';
import { PaymentModal } from './components/PaymentModal';
import { ThermalTicketModal } from './components/ThermalTicketModal';
import { ServicesModal } from './components/ServicesModal';
import { AirtimeModal } from './components/AirtimeModal';
import { BankingModal } from './components/BankingModal';
import { PremiaModal } from './components/PremiaModal';
import { CorteCajaModal } from './components/CorteCajaModal';
import { SecondRegisterModal } from './components/SecondRegisterModal';
import { CashMovementModal } from './components/CashMovementModal';
import { BarcodeCameraModal } from './components/BarcodeCameraModal';
import { CombosModal } from './components/CombosModal';
import { InventoryModule } from './components/InventoryModule';
import { SuppliersModule } from './components/SuppliersModule';
import { MetricsModule } from './components/MetricsModule';

import { Product, CartItem, SaleTransaction, ShiftSummary } from './types/pos';
import { INITIAL_PRODUCTS, INITIAL_SHIFT } from './data/products';
import { playScannerBeep, playCashDrawerSound, playErrorBuzz } from './utils/audio';

export default function App() {
  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<NavTab>('pos');

  // Products state (persisted to localStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('maricela_pos_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('maricela_pos_products', JSON.stringify(products));
  }, [products]);

  const handleAddProduct = useCallback((newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  }, []);

  const handleUpdateProduct = useCallback((updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  }, []);

  const handleDeleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const handleAdjustStock = useCallback((productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.stock + delta);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  }, []);

  // Cart & Transaction State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [redondeoEnabled, setRedondeoEnabled] = useState<boolean>(true);
  const [premiaCardNumber, setPremiaCardNumber] = useState<string | null>(null);

  // Sound preference
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Recent transactions list for metrics
  const [recentTransactions, setRecentTransactions] = useState<SaleTransaction[]>([]);

  // Shift & Cash Drawer Accounting State
  const [shift, setShift] = useState<ShiftSummary>(() => {
    const saved = localStorage.getItem('oxxo_pos_shift');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      terminalId: INITIAL_SHIFT.terminalId,
      openedAt: new Date().toLocaleTimeString('es-MX'),
      cashierName: INITIAL_SHIFT.cashierName,
      cashierId: INITIAL_SHIFT.cashierId,
      initialCash: INITIAL_SHIFT.initialCash,
      cashSales: 0,
      cardSales: 0,
      valesSales: 0,
      spinSales: 0,
      totalTransactions: 0,
      servicesCollected: 0,
      serviceCommissions: 0,
      airtimeSales: 0,
      depositsCollected: 0,
      withdrawalsPaid: 0,
      redondeoTotal: 0,
      safeDrops: 0,
      expectedCashInDrawer: INITIAL_SHIFT.initialCash,
      movements: [
        {
          id: 'MOV-INIT',
          timestamp: Date.now(),
          timeString: new Date().toLocaleTimeString('es-MX'),
          type: 'fondo_inicial',
          amount: INITIAL_SHIFT.initialCash,
          reason: 'Fondo Inicial de Apertura de Turno',
          cashier: INITIAL_SHIFT.cashierName,
        },
      ],
    };
  });

  // Save shift state to localStorage
  useEffect(() => {
    localStorage.setItem('oxxo_pos_shift', JSON.stringify(shift));
  }, [shift]);

  // Last completed transaction for receipt
  const [lastTransaction, setLastTransaction] = useState<SaleTransaction | null>(null);

  // Modal Visibility States
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [showQuickCatalog, setShowQuickCatalog] = useState<boolean>(false);
  const [showAirtimeModal, setShowAirtimeModal] = useState<boolean>(false);
  const [showServicesModal, setShowServicesModal] = useState<boolean>(false);
  const [showBankingModal, setShowBankingModal] = useState<boolean>(false);
  const [showPremiaModal, setShowPremiaModal] = useState<boolean>(false);
  const [showCombosModal, setShowCombosModal] = useState<boolean>(false);
  const [showCorteCajaModal, setShowCorteCajaModal] = useState<boolean>(false);
  const [showSecondRegisterModal, setShowSecondRegisterModal] = useState<boolean>(false);
  const [showCashMovementModal, setShowCashMovementModal] = useState<boolean>(false);
  const [showCameraScanner, setShowCameraScanner] = useState<boolean>(false);

  // Calculation Math
  const { subtotal, iva, ieps, totalDiscount, redondeo, grandTotal, premiaPointsEarned } = useMemo(() => {
    let rawSubtotal = 0;
    let rawIva = 0;
    let rawIeps = 0;
    let discountSum = 0;

    cartItems.forEach((item) => {
      rawSubtotal += item.unitPrice * item.quantity;
      discountSum += item.discount;

      const taxableAmount = item.total;
      if (item.product.ivaRate > 0) {
        rawIva += taxableAmount - taxableAmount / (1 + item.product.ivaRate);
      }
      if (item.product.iepsRate > 0) {
        rawIeps += taxableAmount - taxableAmount / (1 + item.product.iepsRate);
      }
    });

    const netBeforeRedondeo = Math.max(0, rawSubtotal - discountSum);

    // Calculate Mexican Redondeo (Cents to next integer peso)
    let calculatedRedondeo = 0;
    if (redondeoEnabled && netBeforeRedondeo > 0) {
      const remainder = netBeforeRedondeo % 1;
      if (remainder > 0.001) {
        calculatedRedondeo = parseFloat((1 - remainder).toFixed(2));
      }
    }

    const calculatedTotal = parseFloat((netBeforeRedondeo + calculatedRedondeo).toFixed(2));

    // OXXO Premia: 1 pt per $10 MXN spent on standard retail items
    const premiaBase = cartItems
      .filter((i) => !i.isService)
      .reduce((acc, i) => acc + i.total, 0);
    const calculatedPoints = Math.floor(premiaBase / 10);

    return {
      subtotal: rawSubtotal,
      iva: rawIva,
      ieps: rawIeps,
      totalDiscount: discountSum,
      redondeo: calculatedRedondeo,
      grandTotal: calculatedTotal,
      premiaPointsEarned: calculatedPoints,
    };
  }, [cartItems, redondeoEnabled]);

  // Scan product handler
  const handleScanProduct = useCallback(
    (product: Product, quantity: number = 1) => {
      setCartItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (item) => item.product.id === product.id && !item.isService
        );

        if (existingIndex > -1) {
          const updated = [...prevItems];
          const curr = updated[existingIndex];
          const newQty = curr.quantity + quantity;
          const newTotal = curr.unitPrice * newQty - curr.discount;
          updated[existingIndex] = {
            ...curr,
            quantity: newQty,
            total: Math.max(0, newTotal),
          };
          setSelectedItemId(curr.id);
          return updated;
        } else {
          const newItemId = `ITEM-${Date.now()}-${Math.random()}`;
          const newItem: CartItem = {
            id: newItemId,
            product,
            quantity,
            unitPrice: product.price,
            discount: 0,
            total: product.price * quantity,
          };
          setSelectedItemId(newItemId);
          return [...prevItems, newItem];
        }
      });
    },
    []
  );

  // Add custom service item (TAE, Bill, Banking)
  const handleAddServiceItem = useCallback((item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
    setSelectedItemId(item.id);
  }, []);

  // Update item quantity (+/-)
  const handleUpdateQuantity = useCallback((id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const newTotal = item.unitPrice * newQty - item.discount;
            return {
              ...item,
              quantity: newQty,
              total: Math.max(0, newTotal),
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  }, []);

  // Remove single line item (F8)
  const handleRemoveItem = useCallback((id: string) => {
    playScannerBeep();
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Clear current ticket (Esc)
  const handleClearCart = useCallback(() => {
    if (cartItems.length > 0) {
      playErrorBuzz();
      setCartItems([]);
      setSelectedItemId(null);
    }
  }, [cartItems.length]);

  // Multiplier function (F2)
  const handleF2Multiplier = useCallback(() => {
    if (!selectedItemId) {
      alert('Seleccione un artículo de la lista para cambiar la cantidad con F2.');
      return;
    }
    const input = prompt('Ingrese la nueva cantidad para el producto seleccionado:');
    if (input) {
      const parsed = parseInt(input, 10);
      if (!isNaN(parsed) && parsed > 0) {
        setCartItems((prev) =>
          prev.map((item) => {
            if (item.id === selectedItemId) {
              const newTotal = item.unitPrice * parsed - item.discount;
              return { ...item, quantity: parsed, total: Math.max(0, newTotal) };
            }
            return item;
          })
        );
      }
    }
  }, [selectedItemId]);

  // Payment complete callback
  const handlePaymentComplete = useCallback(
    (transaction: SaleTransaction) => {
      // Update accounting shift state
      setShift((prev) => {
        let newCashSales = prev.cashSales;
        let newCardSales = prev.cardSales;
        let newValesSales = prev.valesSales;
        let newSpinSales = prev.spinSales;
        let newServicesCollected = prev.servicesCollected;
        let newAirtimeSales = prev.airtimeSales;
        let newDepositsCollected = prev.depositsCollected;
        let newCashInDrawer = prev.expectedCashInDrawer;

        if (transaction.paymentMethod === 'cash') {
          newCashSales += transaction.total;
          newCashInDrawer += transaction.total;
        } else if (transaction.paymentMethod === 'card') {
          newCardSales += transaction.total;
        } else if (transaction.paymentMethod === 'vales') {
          newValesSales += transaction.total;
        } else if (transaction.paymentMethod === 'spin') {
          newSpinSales += transaction.total;
        }

        // Add service breakdown
        transaction.items.forEach((item) => {
          if (item.isService) {
            if (item.serviceType === 'tae') newAirtimeSales += item.total;
            if (item.serviceType === 'bill') newServicesCollected += item.total;
            if (item.serviceType === 'deposit') newDepositsCollected += item.total;
          }
        });

        return {
          ...prev,
          totalTransactions: prev.totalTransactions + 1,
          cashSales: newCashSales,
          cardSales: newCardSales,
          valesSales: newValesSales,
          spinSales: newSpinSales,
          servicesCollected: newServicesCollected,
          airtimeSales: newAirtimeSales,
          depositsCollected: newDepositsCollected,
          redondeoTotal: prev.redondeoTotal + transaction.redondeo,
          expectedCashInDrawer: newCashInDrawer,
        };
      });

      // Deduct sold units from inventory stock
      setProducts((prev) =>
        prev.map((prod) => {
          const itemSold = transaction.items.find((i) => i.product.id === prod.id && !i.isService);
          if (itemSold) {
            return { ...prod, stock: Math.max(0, prod.stock - itemSold.quantity) };
          }
          return prod;
        })
      );

      setRecentTransactions((prev) => [transaction, ...prev.slice(0, 49)]);
      setLastTransaction(transaction);
      setShowPaymentModal(false);
      setShowReceiptModal(true);
      setCartItems([]);
      setSelectedItemId(null);
    },
    []
  );

  // Safe Drop (Retiro a Tómbola) confirmation
  const handleConfirmSafeDrop = useCallback((amount: number, reason: string) => {
    setShift((prev) => ({
      ...prev,
      safeDrops: prev.safeDrops + amount,
      expectedCashInDrawer: prev.expectedCashInDrawer - amount,
      movements: [
        ...prev.movements,
        {
          id: `DROP-${Date.now()}`,
          timestamp: Date.now(),
          timeString: new Date().toLocaleTimeString('es-MX'),
          type: 'retiro_tombola',
          amount,
          reason,
          cashier: prev.cashierName,
        },
      ],
    }));
  }, []);

  // Corte Z completion (Resets shift for next cashier)
  const handleConfirmCorteZ = useCallback(() => {
    playCashDrawerSound();
    localStorage.removeItem('oxxo_pos_shift');
    setShift({
      terminalId: INITIAL_SHIFT.terminalId,
      openedAt: new Date().toLocaleTimeString('es-MX'),
      cashierName: INITIAL_SHIFT.cashierName,
      cashierId: INITIAL_SHIFT.cashierId,
      initialCash: INITIAL_SHIFT.initialCash,
      cashSales: 0,
      cardSales: 0,
      valesSales: 0,
      spinSales: 0,
      totalTransactions: 0,
      servicesCollected: 0,
      serviceCommissions: 0,
      airtimeSales: 0,
      depositsCollected: 0,
      withdrawalsPaid: 0,
      redondeoTotal: 0,
      safeDrops: 0,
      expectedCashInDrawer: INITIAL_SHIFT.initialCash,
      movements: [
        {
          id: `MOV-INIT-${Date.now()}`,
          timestamp: Date.now(),
          timeString: new Date().toLocaleTimeString('es-MX'),
          type: 'fondo_inicial',
          amount: INITIAL_SHIFT.initialCash,
          reason: 'Fondo Inicial de Apertura de Turno Nuevo',
          cashier: INITIAL_SHIFT.cashierName,
        },
      ],
    });
    setShowCorteCajaModal(false);
    alert('Turno cerrado exitosamente con Corte Z. Listo para nuevo cajero.');
  }, []);

  // Keyboard shortcut listener for Esc (Clear cart or close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showPaymentModal) setShowPaymentModal(false);
        else if (showReceiptModal) setShowReceiptModal(false);
        else if (showQuickCatalog) setShowQuickCatalog(false);
        else if (showAirtimeModal) setShowAirtimeModal(false);
        else if (showServicesModal) setShowServicesModal(false);
        else if (showBankingModal) setShowBankingModal(false);
        else if (showPremiaModal) setShowPremiaModal(false);
        else if (showCombosModal) setShowCombosModal(false);
        else if (showCorteCajaModal) setShowCorteCajaModal(false);
        else if (showSecondRegisterModal) setShowSecondRegisterModal(false);
        else if (showCashMovementModal) setShowCashMovementModal(false);
        else if (showCameraScanner) setShowCameraScanner(false);
        else if (cartItems.length > 0) {
          handleClearCart();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    showPaymentModal,
    showReceiptModal,
    showQuickCatalog,
    showAirtimeModal,
    showServicesModal,
    showBankingModal,
    showPremiaModal,
    showCombosModal,
    showCorteCajaModal,
    showSecondRegisterModal,
    showCashMovementModal,
    showCameraScanner,
    cartItems.length,
    handleClearCart,
  ]);

  return (
    <div className="flex flex-col h-screen w-screen bg-neutral-100 overflow-hidden text-neutral-900 font-sans">
      {/* Top Header */}
      <Header
        storeName={INITIAL_SHIFT.storeName}
        storeNumber={INITIAL_SHIFT.storeNumber}
        terminalNumber={shift.terminalId}
        cashierName={shift.cashierName}
        cashierId={shift.cashierId}
        soundEnabled={soundEnabled}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onOpenSecondRegister={() => setShowSecondRegisterModal(true)}
        onOpenCorteCaja={() => setShowCorteCajaModal(true)}
        onOpenCameraScanner={() => setShowCameraScanner(true)}
        cartCount={cartItems.length}
      />

      {/* Main Content Router based on Active Navigation Tab */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'pos' && (
          <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
            {/* Left Side: Workstation Register (Scanner, Items Table, Totals, Actions) */}
            <section className="flex-1 flex flex-col h-full overflow-hidden bg-white lg:border-r border-neutral-300">
              {/* Scanner Barcode Input */}
              <ScannerInput
                products={products}
                onScanProduct={(prod, qty) => handleScanProduct(prod, qty)}
                onOpenQuickCatalog={() => setActiveTab('catalog')}
                onOpenAirtime={() => setShowAirtimeModal(true)}
                onOpenServices={() => setShowServicesModal(true)}
                onOpenBanking={() => setShowBankingModal(true)}
                onOpenPremia={() => setShowPremiaModal(true)}
                onOpenCameraScanner={() => setShowCameraScanner(true)}
              />

              {/* Current Sale Ticket Table */}
              <TicketTable
                items={cartItems}
                selectedItemId={selectedItemId}
                onSelectItem={(id) => setSelectedItemId(id)}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />

              {/* Large POS Totals Summary Bar */}
              <TotalsSummary
                items={cartItems}
                subtotal={subtotal}
                iva={iva}
                ieps={ieps}
                totalDiscount={totalDiscount}
                redondeo={redondeo}
                total={grandTotal}
                redondeoEnabled={redondeoEnabled}
                onToggleRedondeo={() => setRedondeoEnabled((prev) => !prev)}
                premiaCardNumber={premiaCardNumber}
                premiaPointsEarned={premiaPointsEarned}
                onOpenPaymentModal={() => setShowPaymentModal(true)}
                onClearCart={handleClearCart}
                onOpenPremiaModal={() => setShowPremiaModal(true)}
              />
            </section>

            {/* Right Side: Quick Product Touchpad Catalog (Side-by-side on desktop) */}
            <aside className="hidden lg:flex w-80 lg:w-96 xl:w-[400px] h-full flex-col shrink-0">
              <ProductCatalog
                products={products}
                onSelectProduct={(prod) => handleScanProduct(prod, 1)}
              />
            </aside>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="bg-amber-50 border-b border-amber-200 px-3 sm:px-4 py-2 flex items-center justify-between text-xs shrink-0">
              <span className="font-bold text-amber-900 truncate">
                Catálogo Táctil: Toque cualquier producto para agregarlo a la cuenta.
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('pos')}
                className="px-3 py-1 bg-[#E21B23] text-white rounded font-bold cursor-pointer hover:bg-red-700 whitespace-nowrap ml-2"
              >
                Volver a Caja ({cartItems.length} items)
              </button>
            </div>
            <ProductCatalog
              products={products}
              onSelectProduct={(prod) => {
                handleScanProduct(prod, 1);
              }}
            />
          </div>
        )}

        {activeTab === 'inventory' && (
          <InventoryModule
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onAdjustStock={handleAdjustStock}
            onOpenCameraScanner={() => setShowCameraScanner(true)}
          />
        )}

        {activeTab === 'suppliers' && (
          <SuppliersModule />
        )}

        {activeTab === 'metrics' && (
          <MetricsModule
            shift={shift}
            products={products}
            recentTransactions={recentTransactions}
          />
        )}
      </main>

      {/* Bottom Physical POS Function Keyboard Strip (F1 to F12) */}
      <FunctionKeyboard
        onF1={() => {
          setActiveTab((prev) => (prev === 'catalog' ? 'pos' : 'catalog'));
        }}
        onF2={handleF2Multiplier}
        onF3={() => setShowAirtimeModal(true)}
        onF4={() => setShowServicesModal(true)}
        onF5={() => setShowBankingModal(true)}
        onF6={() => setShowPremiaModal(true)}
        onF7={() => setShowCombosModal(true)}
        onF8={() => {
          if (selectedItemId) handleRemoveItem(selectedItemId);
        }}
        onF9={() => setShowCashMovementModal(true)}
        onF10={() => setShowCorteCajaModal(true)}
        onF11={() => setShowSecondRegisterModal(true)}
        onF12={() => {
          if (cartItems.length > 0) setShowPaymentModal(true);
        }}
        onCameraScanner={() => setShowCameraScanner(true)}
      />

      {/* Floating Camera Scanner Action Button (Unmissable across all views and devices) */}
      <button
        onClick={() => setShowCameraScanner(true)}
        type="button"
        className="fixed bottom-16 right-3 sm:bottom-16 sm:right-6 z-40 bg-[#E21B23] hover:bg-[#C1121F] text-white p-3 sm:px-4 sm:py-3 rounded-full sm:rounded-2xl shadow-2xl border-2 border-white flex items-center gap-2.5 cursor-pointer transition-all hover:scale-105 active:scale-95 group ring-4 ring-red-500/40 no-print"
        title="Activar Cámara para escanear código de barras"
      >
        <div className="relative">
          <Camera className="w-6 h-6 text-white" />
          <Scan className="w-3.5 h-3.5 text-[#FFCE00] absolute -top-1 -right-1" />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-black text-xs sm:text-sm tracking-wide text-white leading-tight">
            Activar Cámara
          </span>
          <span className="text-[10px] text-yellow-300 font-bold uppercase hidden sm:block">
            Escanear Código
          </span>
        </div>
      </button>

      {/* MODALS */}
      {/* 1. Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          total={grandTotal}
          subtotal={subtotal}
          iva={iva}
          ieps={ieps}
          discountTotal={totalDiscount}
          redondeo={redondeo}
          items={cartItems}
          cashierName={shift.cashierName}
          cashierId={shift.cashierId}
          storeName={INITIAL_SHIFT.storeName}
          storeNumber={INITIAL_SHIFT.storeNumber}
          terminalNumber={shift.terminalId}
          premiaCardNumber={premiaCardNumber}
          premiaPointsEarned={premiaPointsEarned}
          onClose={() => setShowPaymentModal(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      {/* 2. Thermal Receipt Ticket Modal */}
      {showReceiptModal && lastTransaction && (
        <ThermalTicketModal
          transaction={lastTransaction}
          onClose={() => setShowReceiptModal(false)}
          onNewSale={() => {
            setShowReceiptModal(false);
            setCartItems([]);
          }}
        />
      )}

      {/* 3. Services Modal (CFE, Telmex, Agua, etc.) */}
      {showServicesModal && (
        <ServicesModal
          onClose={() => setShowServicesModal(false)}
          onAddServiceToCart={handleAddServiceItem}
        />
      )}

      {/* 4. Airtime / TAE Modal (Telcel, Movistar, AT&T, Bait) */}
      {showAirtimeModal && (
        <AirtimeModal
          onClose={() => setShowAirtimeModal(false)}
          onAddAirtimeToCart={handleAddServiceItem}
        />
      )}

      {/* 5. Banking / Spin by OXXO Modal */}
      {showBankingModal && (
        <BankingModal
          onClose={() => setShowBankingModal(false)}
          onAddBankingToCart={handleAddServiceItem}
        />
      )}

      {/* 6. OXXO Premia Modal */}
      {showPremiaModal && (
        <PremiaModal
          currentCardNumber={premiaCardNumber}
          onSetPremiaCard={(card) => setPremiaCardNumber(card)}
          onRedeemFreeItem={(itemName) => {
            // Add free promotional product with 100% discount
            const promoProduct: Product = {
              id: `prem-${Date.now()}`,
              barcode: 'PREMIA0001',
              name: itemName,
              shortName: itemName.slice(0, 16),
              brand: 'OXXO PREMIA',
              category: 'andatti',
              price: 0,
              cost: 0,
              stock: 999,
              ivaRate: 0,
              iepsRate: 0,
            };
            handleScanProduct(promoProduct, 1);
          }}
          onClose={() => setShowPremiaModal(false)}
        />
      )}

      {/* 7. Combos & Promos Modal (F7) */}
      {showCombosModal && (
        <CombosModal
          products={products}
          onAddComboItems={(items) => {
            setCartItems((prev) => [...prev, ...items]);
          }}
          onClose={() => setShowCombosModal(false)}
        />
      )}

      {/* 8. Corte de Caja Modal (F10) */}
      {showCorteCajaModal && (
        <CorteCajaModal
          shift={shift}
          onClose={() => setShowCorteCajaModal(false)}
          onPrintTicket={() => window.print()}
          onConfirmCorteZ={handleConfirmCorteZ}
        />
      )}

      {/* 9. Second Register Modal (F11) */}
      {showSecondRegisterModal && (
        <SecondRegisterModal
          currentTerminal={shift.terminalId}
          onSwitchTerminal={(newId) =>
            setShift((prev) => ({ ...prev, terminalId: newId }))
          }
          onClose={() => setShowSecondRegisterModal(false)}
        />
      )}

      {/* 10. Cash Movement / Drop Safe Modal (F9) */}
      {showCashMovementModal && (
        <CashMovementModal
          currentCashInDrawer={shift.expectedCashInDrawer}
          cashierName={shift.cashierName}
          onConfirmSafeDrop={handleConfirmSafeDrop}
          onClose={() => setShowCashMovementModal(false)}
        />
      )}

      {/* 11. Barcode Camera Scanner Modal */}
      {showCameraScanner && (
        <BarcodeCameraModal
          products={products}
          onScanProduct={(prod, qty) => handleScanProduct(prod, qty)}
          onClose={() => setShowCameraScanner(false)}
        />
      )}
    </div>
  );
}
