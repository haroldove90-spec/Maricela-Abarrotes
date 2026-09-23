import { Product, ServiceBillProvider, AirtimePackage, BankProvider } from '../types/pos';

export const INITIAL_PRODUCTS: Product[] = [
  // ANDATTI CAFÉ
  {
    id: 'andatti-12oz',
    barcode: '7501000100121',
    name: 'Café Andatti Americano 12oz',
    shortName: 'ANDATTI AMER 12OZ',
    brand: 'Andatti',
    category: 'andatti',
    price: 26.00,
    cost: 8.50,
    stock: 45,
    ivaRate: 0.16,
    iepsRate: 0,
    promoText: '2x $48.00',
    colorBadge: '#78350F'
  },
  {
    id: 'andatti-16oz',
    barcode: '7501000100169',
    name: 'Café Andatti Americano 16oz',
    shortName: 'ANDATTI AMER 16OZ',
    brand: 'Andatti',
    category: 'andatti',
    price: 30.00,
    cost: 10.00,
    stock: 60,
    ivaRate: 0.16,
    iepsRate: 0,
    promoText: 'En combo con galleta',
    colorBadge: '#78350F'
  },
  {
    id: 'andatti-capuchino-16oz',
    barcode: '7501000100206',
    name: 'Café Andatti Capuchino Vainilla 16oz',
    shortName: 'CAPUCHINO VAIN 16OZ',
    brand: 'Andatti',
    category: 'andatti',
    price: 36.00,
    cost: 13.00,
    stock: 35,
    ivaRate: 0.16,
    iepsRate: 0,
    colorBadge: '#92400E'
  },
  {
    id: 'andatti-galleta-chispas',
    barcode: '7501000100312',
    name: 'Galleta de Chispas Andatti 85g',
    shortName: 'GALLETA CHISPAS ANDATTI',
    brand: 'Andatti',
    category: 'andatti',
    price: 22.00,
    cost: 9.00,
    stock: 24,
    ivaRate: 0,
    iepsRate: 0.08,
    colorBadge: '#B45309'
  },

  // VIKINGO & ALIMENTOS PREPARADOS
  {
    id: 'vikingo-regular',
    barcode: '7501000200012',
    name: 'Hot Dog Vikingo Regular',
    shortName: 'HOT DOG VIKINGO REG',
    brand: 'Vikingo',
    category: 'alimentos',
    price: 34.00,
    cost: 14.00,
    stock: 40,
    ivaRate: 0.16,
    iepsRate: 0,
    promoText: 'Combo Vikingo + Coca $49',
    colorBadge: '#DC2626'
  },
  {
    id: 'vikingo-mega',
    barcode: '7501000200029',
    name: 'Hot Dog Vikingo Mega Queso',
    shortName: 'VIKINGO MEGA QUESO',
    brand: 'Vikingo',
    category: 'alimentos',
    price: 44.00,
    cost: 18.00,
    stock: 28,
    ivaRate: 0.16,
    iepsRate: 0,
    colorBadge: '#DC2626'
  },
  {
    id: 'sandwich-oxxo-clasico',
    barcode: '7501000200159',
    name: 'Sándwich Jamón y Queso OXXO',
    shortName: 'SANDWICH JAMON/QUESO',
    brand: 'OXXO',
    category: 'alimentos',
    price: 45.00,
    cost: 21.00,
    stock: 18,
    ivaRate: 0.16,
    iepsRate: 0,
    colorBadge: '#EA580C'
  },
  {
    id: 'maruchan-pollo',
    barcode: '041789001214',
    name: 'Sopa Maruchan Pollo 64g',
    shortName: 'MARUCHAN POLLO 64G',
    brand: 'Maruchan',
    category: 'alimentos',
    price: 19.50,
    cost: 11.00,
    stock: 80,
    ivaRate: 0,
    iepsRate: 0.08,
    colorBadge: '#EAB308'
  },
  {
    id: 'maruchan-camaron-limon',
    barcode: '041789001221',
    name: 'Sopa Maruchan Camarón con Limón 64g',
    shortName: 'MARUCHAN CAMARON LIMON',
    brand: 'Maruchan',
    category: 'alimentos',
    price: 21.00,
    cost: 12.00,
    stock: 75,
    ivaRate: 0,
    iepsRate: 0.08,
    colorBadge: '#F59E0B'
  },

  // BEBIDAS & REFRESCOS
  {
    id: 'coca-cola-600ml',
    barcode: '7501055301072',
    name: 'Coca-Cola Original 600ml',
    shortName: 'COCA COLA REG 600ML',
    brand: 'Coca-Cola',
    category: 'bebidas',
    price: 20.00,
    cost: 13.00,
    stock: 120,
    ivaRate: 0.16,
    iepsRate: 0,
    promoText: '2x $36.00',
    colorBadge: '#E11D48'
  },
  {
    id: 'coca-cola-sin-azucar-600ml',
    barcode: '7501055365456',
    name: 'Coca-Cola Sin Azúcar 600ml',
    shortName: 'COCA COLA SIN AZUCAR 600ML',
    brand: 'Coca-Cola',
    category: 'bebidas',
    price: 20.00,
    cost: 13.00,
    stock: 90,
    ivaRate: 0.16,
    iepsRate: 0,
    colorBadge: '#18181B'
  },
  {
    id: 'coca-cola-3lt-nr',
    barcode: '7501055303250',
    name: 'Coca-Cola Original 3 Litros NR',
    shortName: 'COCA COLA 3L NO RET',
    brand: 'Coca-Cola',
    category: 'bebidas',
    price: 54.00,
    cost: 38.00,
    stock: 35,
    ivaRate: 0.16,
    iepsRate: 0,
    colorBadge: '#BE123C'
  },
  {
    id: 'electrolit-coco',
    barcode: '7501125134104',
    name: 'Electrolit Suero Sabor Coco 625ml',
    shortName: 'ELECTROLIT COCO 625ML',
    brand: 'Electrolit',
    category: 'bebidas',
    price: 36.00,
    cost: 22.00,
    stock: 45,
    ivaRate: 0.16,
    iepsRate: 0,
    promoText: '2x $65.00',
    colorBadge: '#0284C7'
  },
  {
    id: 'monster-energy-473ml',
    barcode: '070847012475',
    name: 'Bebida Energética Monster Energy 473ml',
    shortName: 'MONSTER ENERGY 473ML',
    brand: 'Monster',
    category: 'bebidas',
    price: 46.00,
    cost: 29.00,
    stock: 50,
    ivaRate: 0.16,
    iepsRate: 0,
    colorBadge: '#16A34A'
  },
  {
    id: 'agua-ciel-1l',
    barcode: '7501055314782',
    name: 'Agua Purificada Ciel 1 Litro',
    shortName: 'AGUA CIEL 1LT',
    brand: 'Ciel',
    category: 'bebidas',
    price: 15.00,
    cost: 6.50,
    stock: 80,
    ivaRate: 0,
    iepsRate: 0,
    colorBadge: '#06B6D4'
  },
  {
    id: 'penafiel-limonada-600ml',
    barcode: '7501071112454',
    name: 'Peñafiel Limonada Mineral 600ml',
    shortName: 'PENAFIEL LIMON 600ML',
    brand: 'Peñafiel',
    category: 'bebidas',
    price: 18.50,
    cost: 10.50,
    stock: 40,
    ivaRate: 0.16,
    iepsRate: 0,
    colorBadge: '#84CC16'
  },

  // BOTANAS & FRITURAS
  {
    id: 'sabritas-original-160g',
    barcode: '7501011115439',
    name: 'Papas Sabritas Sal Original 160g',
    shortName: 'SABRITAS SAL 160G',
    brand: 'Sabritas',
    category: 'botanas',
    price: 48.00,
    cost: 32.00,
    stock: 65,
    ivaRate: 0,
    iepsRate: 0.08,
    promoText: '2x $85.00',
    colorBadge: '#EAB308'
  },
  {
    id: 'doritos-nacho-146g',
    barcode: '7501011115651',
    name: 'Totopos Doritos Nacho 146g',
    shortName: 'DORITOS NACHO 146G',
    brand: 'Sabritas',
    category: 'botanas',
    price: 44.00,
    cost: 29.00,
    stock: 55,
    ivaRate: 0,
    iepsRate: 0.08,
    colorBadge: '#EA580C'
  },
  {
    id: 'takis-fuego-140g',
    barcode: '7501030467885',
    name: 'Takis Fuego Barcel 140g',
    shortName: 'TAKIS FUEGO 140G',
    brand: 'Barcel',
    category: 'botanas',
    price: 38.00,
    cost: 24.00,
    stock: 70,
    ivaRate: 0,
    iepsRate: 0.08,
    promoText: '2x $68.00',
    colorBadge: '#7C3AED'
  },
  {
    id: 'ruffles-queso-120g',
    barcode: '7501011115781',
    name: 'Papas Ruffles Mega Crunch Queso 120g',
    shortName: 'RUFFLES QUESO 120G',
    brand: 'Sabritas',
    category: 'botanas',
    price: 42.00,
    cost: 27.50,
    stock: 45,
    ivaRate: 0,
    iepsRate: 0.08,
    colorBadge: '#2563EB'
  },
  {
    id: 'cacahuates-mafer-180g',
    barcode: '7501011124806',
    name: 'Cacahuates Mafer Tostados Salados 180g',
    shortName: 'CACAHUATE MAFER 180G',
    brand: 'Mafer',
    category: 'botanas',
    price: 36.00,
    cost: 23.00,
    stock: 35,
    ivaRate: 0,
    iepsRate: 0.08,
    colorBadge: '#D97706'
  },

  // DULCES & GALLETAS
  {
    id: 'galletas-emperador-choc',
    barcode: '7501000654321',
    name: 'Galletas Gamesa Emperador Chocolate 101g',
    shortName: 'EMPERADOR CHOCOLATE',
    brand: 'Gamesa',
    category: 'dulces',
    price: 24.00,
    cost: 14.50,
    stock: 50,
    ivaRate: 0,
    iepsRate: 0.08,
    colorBadge: '#451A03'
  },
  {
    id: 'mazapan-de-la-rosa-gigante',
    barcode: '7501041411234',
    name: 'Mazapán De la Rosa Gigante 50g',
    shortName: 'MAZAPAN GIGANTE 50G',
    brand: 'De la Rosa',
    category: 'dulces',
    price: 14.00,
    cost: 6.50,
    stock: 100,
    ivaRate: 0,
    iepsRate: 0.08,
    colorBadge: '#F43F5E'
  },
  {
    id: 'panditas-ricolino',
    barcode: '7501000155678',
    name: 'Gomitas Panditas Ricolino Clásicos 115g',
    shortName: 'PANDITAS RICOLINO 115G',
    brand: 'Ricolino',
    category: 'dulces',
    price: 26.00,
    cost: 15.00,
    stock: 45,
    ivaRate: 0,
    iepsRate: 0.08,
    colorBadge: '#10B981'
  },
  {
    id: 'chocolate-carlos-v',
    barcode: '7501058612345',
    name: 'Chocolate con Leche Nestlé Carlos V 18g',
    shortName: 'CHOC CARLOS V 18G',
    brand: 'Nestlé',
    category: 'dulces',
    price: 16.00,
    cost: 8.50,
    stock: 60,
    ivaRate: 0,
    iepsRate: 0.08,
    colorBadge: '#B45309'
  },

  // ABARROTES & LÁCTEOS
  {
    id: 'leche-santa-clara-1l',
    barcode: '7501020512398',
    name: 'Leche Santa Clara Entera 1 Litro',
    shortName: 'LECHE STA CLARA 1L',
    brand: 'Santa Clara',
    category: 'abarrotes',
    price: 32.00,
    cost: 23.50,
    stock: 40,
    ivaRate: 0,
    iepsRate: 0,
    colorBadge: '#3B82F6'
  },
  {
    id: 'pan-blanco-bimbo-grande',
    barcode: '7501000111190',
    name: 'Pan Blanco Bimbo Grande 680g',
    shortName: 'PAN BLANCO BIMBO GDE',
    brand: 'Bimbo',
    category: 'abarrotes',
    price: 52.00,
    cost: 38.00,
    stock: 25,
    ivaRate: 0,
    iepsRate: 0,
    colorBadge: '#0284C7'
  },
  {
    id: 'atun-dolores-agua',
    barcode: '7501048600123',
    name: 'Atún Dolores en Agua 140g',
    shortName: 'ATUN DOLORES AGUA 140G',
    brand: 'Dolores',
    category: 'abarrotes',
    price: 25.00,
    cost: 16.00,
    stock: 40,
    ivaRate: 0,
    iepsRate: 0,
    colorBadge: '#0D9488'
  },
  {
    id: 'mayonesa-mccormick-390g',
    barcode: '7501005112349',
    name: 'Mayonesa McCormick con Limón 390g',
    shortName: 'MAYONESA MCCORMICK 390G',
    brand: 'McCormick',
    category: 'abarrotes',
    price: 44.00,
    cost: 31.00,
    stock: 20,
    ivaRate: 0,
    iepsRate: 0,
    colorBadge: '#CA8A04'
  },

  // CERVEZAS (SECTOR +18)
  {
    id: 'tecate-light-6pack',
    barcode: '7501049912345',
    name: 'Cerveza Tecate Light 355ml Six Pack Latas',
    shortName: 'TECATE LIGHT 6PK LATA',
    brand: 'Tecate',
    category: 'cervezas',
    price: 105.00,
    cost: 78.00,
    stock: 30,
    ivaRate: 0.16,
    iepsRate: 0,
    promoText: '2x SixPack por $195',
    colorBadge: '#DC2626'
  },
  {
    id: 'corona-extra-6pack',
    barcode: '7501064112348',
    name: 'Cerveza Corona Extra 355ml Six Pack Botellas',
    shortName: 'CORONA EXTRA 6PK BOT',
    brand: 'Corona',
    category: 'cervezas',
    price: 112.00,
    cost: 84.00,
    stock: 25,
    ivaRate: 0.16,
    iepsRate: 0,
    colorBadge: '#D97706'
  },

  // FARMACIA & VARIOS
  {
    id: 'aspirina-protect-100mg',
    barcode: '7501008412341',
    name: 'Aspirina Protect Bayer 100mg 28 Tabletas',
    shortName: 'ASPIRINA PROTECT 28TAB',
    brand: 'Bayer',
    category: 'farmacia',
    price: 64.00,
    cost: 44.00,
    stock: 15,
    ivaRate: 0,
    iepsRate: 0,
    colorBadge: '#0284C7'
  },
  {
    id: 'encendedor-bic-maxi',
    barcode: '070330601234',
    name: 'Encendedor BIC Maxi Clásico',
    shortName: 'ENCENDEDOR BIC MAXI',
    brand: 'BIC',
    category: 'farmacia',
    price: 24.00,
    cost: 11.00,
    stock: 50,
    ivaRate: 0.16,
    iepsRate: 0,
    colorBadge: '#EA580C'
  }
];

export const SERVICE_PROVIDERS: ServiceBillProvider[] = [
  {
    id: 'cfe',
    name: 'CFE (Luz Eléctrica)',
    category: 'luz',
    fee: 15.00,
    referenceDigits: 30,
    sampleBarcode: '010103984712039485729103948571',
    iconName: 'Zap'
  },
  {
    id: 'agua-drenaje',
    name: 'Agua y Drenaje / Sistema de Aguas',
    category: 'agua',
    fee: 14.00,
    referenceDigits: 24,
    sampleBarcode: '584930219485720194837201',
    iconName: 'Droplets'
  },
  {
    id: 'telmex',
    name: 'Telmex / Infinitum',
    category: 'telefonia',
    fee: 12.00,
    referenceDigits: 20,
    sampleBarcode: '81834920495837201948',
    iconName: 'Phone'
  },
  {
    id: 'gas-naturgy',
    name: 'Naturgy Gas Natural',
    category: 'gas',
    fee: 14.00,
    referenceDigits: 22,
    sampleBarcode: '9920194820394857192837',
    iconName: 'Flame'
  },
  {
    id: 'izzi',
    name: 'Izzi Telecom',
    category: 'tv',
    fee: 12.00,
    referenceDigits: 18,
    sampleBarcode: '495830291847583920',
    iconName: 'Tv'
  },
  {
    id: 'tag-pase',
    name: 'Recarga TAG PASE / TeleVía',
    category: 'tag',
    fee: 10.00,
    referenceDigits: 16,
    sampleBarcode: '1029384756102938',
    iconName: 'CreditCard'
  },
  {
    id: 'predial',
    name: 'Impuesto Predial Municipal',
    category: 'gobierno',
    fee: 15.00,
    referenceDigits: 25,
    sampleBarcode: '7748392019485738291049581',
    iconName: 'Building'
  }
];

export const AIRTIME_PACKAGES: AirtimePackage[] = [
  // TELCEL
  { id: 't-amigo-50', carrier: 'telcel', name: 'Telcel Amigo Sin Límite $50', amount: 50, type: 'paquete', description: 'Redes + Llamadas + 500MB (7 días)' },
  { id: 't-amigo-100', carrier: 'telcel', name: 'Telcel Amigo Sin Límite $100', amount: 100, type: 'paquete', description: 'Redes ilimitadas + 1.3GB (15 días)' },
  { id: 't-amigo-150', carrier: 'telcel', name: 'Telcel Amigo Sin Límite $150', amount: 150, type: 'paquete', description: 'Redes ilimitadas + 2GB (26 días)' },
  { id: 't-amigo-200', carrier: 'telcel', name: 'Telcel Amigo Sin Límite $200', amount: 200, type: 'paquete', description: 'Redes ilimitadas + 3GB (30 días)' },
  { id: 't-saldo-20', carrier: 'telcel', name: 'Telcel Saldo $20', amount: 20, type: 'recarga', description: 'Saldo en llamada por segundo' },
  { id: 't-saldo-50', carrier: 'telcel', name: 'Telcel Saldo $50', amount: 50, type: 'recarga', description: 'Saldo tradicional' },
  { id: 't-saldo-500', carrier: 'telcel', name: 'Telcel Saldo $500', amount: 500, type: 'recarga', description: 'Saldo recarga alta vigencia' },

  // MOVISTAR
  { id: 'm-prepago-50', carrier: 'movistar', name: 'Movistar Paquete $50', amount: 50, type: 'paquete', description: 'Ilimitado 7 días' },
  { id: 'm-prepago-100', carrier: 'movistar', name: 'Movistar Paquete $100', amount: 100, type: 'paquete', description: 'Ilimitado 15 días + Redes' },
  { id: 'm-prepago-200', carrier: 'movistar', name: 'Movistar Paquete $200', amount: 200, type: 'paquete', description: 'Ilimitado 30 días' },

  // AT&T
  { id: 'att-mas-50', carrier: 'att', name: 'AT&T Más $50', amount: 50, type: 'paquete', description: 'Beneficios por 7 días' },
  { id: 'att-mas-100', carrier: 'att', name: 'AT&T Más $100', amount: 100, type: 'paquete', description: 'Beneficios por 14 días + Redes' },
  { id: 'att-mas-200', carrier: 'att', name: 'AT&T Más $200', amount: 200, type: 'paquete', description: 'Beneficios por 30 días' },

  // BAIT
  { id: 'bait-20', carrier: 'bait', name: 'Bait Mi Bait $20', amount: 20, type: 'paquete', description: '500MB + Llamadas 1 día' },
  { id: 'bait-100', carrier: 'bait', name: 'Bait Ilimitado $100', amount: 100, type: 'paquete', description: 'Internet Ilimitado 15 días' },
  { id: 'bait-200', carrier: 'bait', name: 'Bait Ilimitado $200', amount: 200, type: 'paquete', description: 'Internet Ilimitado 30 días' }
];

export const BANK_PROVIDERS: BankProvider[] = [
  { id: 'spin', name: 'Spin by OXXO', shortName: 'SPIN', allowsDeposit: true, allowsWithdrawal: true, maxDeposit: 10000, fee: 7.00, color: '#9333EA' },
  { id: 'bbva', name: 'BBVA México', shortName: 'BBVA', allowsDeposit: true, allowsWithdrawal: true, maxDeposit: 19000, fee: 15.00, color: '#1E3A8A' },
  { id: 'santander', name: 'Santander', shortName: 'SANTANDER', allowsDeposit: true, allowsWithdrawal: true, maxDeposit: 10000, fee: 15.00, color: '#DC2626' },
  { id: 'banorte', name: 'Banorte', shortName: 'BANORTE', allowsDeposit: true, allowsWithdrawal: true, maxDeposit: 10000, fee: 15.00, color: '#B91C1C' },
  { id: 'nu', name: 'Nu México (Cuenta Nu)', shortName: 'NU', allowsDeposit: true, allowsWithdrawal: false, maxDeposit: 5000, fee: 12.00, color: '#7E22CE' },
  { id: 'mercadopago', name: 'Mercado Pago Wallet', shortName: 'MERCADO PAGO', allowsDeposit: true, allowsWithdrawal: true, maxDeposit: 8000, fee: 12.00, color: '#0284C7' },
  { id: 'azteca', name: 'Banco Azteca', shortName: 'AZTECA', allowsDeposit: true, allowsWithdrawal: true, maxDeposit: 5000, fee: 14.00, color: '#15803D' },
  { id: 'citibanamex', name: 'Citibanamex', shortName: 'BANAMEX', allowsDeposit: true, allowsWithdrawal: true, maxDeposit: 10000, fee: 15.00, color: '#0369A1' }
];

export const INITIAL_SHIFT: {
  terminalId: string;
  storeName: string;
  storeNumber: string;
  cashierName: string;
  cashierId: string;
  initialCash: number;
} = {
  terminalId: 'CAJA 01',
  storeName: 'ABARROTES MARICELA',
  storeNumber: 'SUC-01-CENTRO',
  cashierName: 'Maricela G.',
  cashierId: 'MAR-101',
  initialCash: 1000.00
};
