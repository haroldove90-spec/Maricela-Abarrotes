export type ProductCategory = 
  | 'andatti'
  | 'alimentos'
  | 'bebidas'
  | 'botanas'
  | 'dulces'
  | 'abarrotes'
  | 'cervezas'
  | 'farmacia'
  | 'servicios';

export interface Product {
  id: string;
  barcode: string;
  name: string;
  shortName: string;
  brand: string;
  category: ProductCategory;
  price: number;
  cost: number;
  stock: number;
  ivaRate: number; // 0.16 or 0
  iepsRate: number; // 0.08 or 0
  promoText?: string;
  colorBadge?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  isService?: boolean;
  serviceType?: 'tae' | 'bill' | 'deposit' | 'withdrawal';
  serviceMetadata?: {
    carrier?: string;
    phoneNumber?: string;
    serviceName?: string;
    serviceAccount?: string;
    bankName?: string;
    cardNumber?: string;
    authCode?: string;
    commissionFee?: number;
  };
}

export type PaymentMethod = 'cash' | 'card' | 'vales' | 'spin' | 'transfer';

export interface SaleTransaction {
  id: string;
  folio: string;
  date: string;
  timestamp: number;
  cashierName: string;
  cashierId: string;
  storeName: string;
  storeNumber: string;
  terminalNumber: string;
  items: CartItem[];
  subtotal: number;
  iva: number;
  ieps: number;
  discountTotal: number;
  redondeo: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number;
  premiaCardNumber?: string;
  premiaPointsEarned: number;
  premiaPointsRedeemed?: number;
  authCode?: string;
}

export interface ServiceBillProvider {
  id: string;
  name: string;
  category: 'luz' | 'agua' | 'telefonia' | 'gas' | 'tv' | 'tag' | 'gobierno';
  fee: number;
  referenceDigits: number;
  sampleBarcode: string;
  iconName: string;
}

export interface AirtimePackage {
  id: string;
  carrier: 'telcel' | 'movistar' | 'att' | 'bait' | 'unefon';
  name: string;
  amount: number;
  type: 'recarga' | 'paquete';
  description: string;
}

export interface BankProvider {
  id: string;
  name: string;
  shortName: string;
  allowsDeposit: boolean;
  allowsWithdrawal: boolean;
  maxDeposit: number;
  fee: number;
  color: string;
}

export interface CashMovement {
  id: string;
  timestamp: number;
  timeString: string;
  type: 'fondo_inicial' | 'retiro_tombola' | 'gasto' | 'entrada_manual';
  amount: number;
  reason: string;
  cashier: string;
}

export interface ShiftSummary {
  terminalId: string;
  openedAt: string;
  cashierName: string;
  cashierId: string;
  initialCash: number;
  cashSales: number;
  cardSales: number;
  valesSales: number;
  spinSales: number;
  totalTransactions: number;
  servicesCollected: number;
  serviceCommissions: number;
  airtimeSales: number;
  depositsCollected: number;
  withdrawalsPaid: number;
  redondeoTotal: number;
  safeDrops: number; // Retiros a tómbola
  expectedCashInDrawer: number;
  movements: CashMovement[];
}
