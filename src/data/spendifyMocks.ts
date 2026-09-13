export interface MockCard {
  id: string;
  name: string;
  brand: string;
  last4: string;
  total_limit: number;
  available_limit: number;
  closing_day: number;
  due_day: number;
  color_theme: string;
  accent_glow: string;
  bank_name: string;
}

export interface MockTransaction {
  id: string;
  card_id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  installments: number;
  current_installment?: number;
  buyer_name?: string;
  type: 'credit' | 'pix' | 'cash';
}

export interface MockGoal {
  id: string;
  category: string;
  spent: number;
  limit: number;
  color: string;
}

export interface MockSubscription {
  id: string;
  name: string;
  amount: number;
  category: string;
  color: string;
  card_last4: string;
}

export const initialMockCards: MockCard[] = [
  {
    id: "card-nubank",
    name: "JORDAN C",
    brand: "MASTERCARD",
    last4: "4092",
    total_limit: 8500,
    available_limit: 5740.10,
    closing_day: 5,
    due_day: 12,
    color_theme: "from-[#820AD1] via-[#61079e] to-[#3a0261]",
    accent_glow: "rgba(130, 10, 209, 0.4)",
    bank_name: "Nubank Ultravioleta",
  },
  {
    id: "card-xp",
    name: "JORDAN C",
    brand: "VISA INFINITE",
    last4: "8821",
    total_limit: 25000,
    available_limit: 21850.50,
    closing_day: 15,
    due_day: 22,
    color_theme: "from-slate-950 via-slate-900 to-zinc-900",
    accent_glow: "rgba(245, 158, 11, 0.3)",
    bank_name: "XP Visa Infinite",
  },
  {
    id: "card-inter",
    name: "JORDAN C",
    brand: "MASTERCARD BLACK",
    last4: "1934",
    total_limit: 12000,
    available_limit: 9850.00,
    closing_day: 28,
    due_day: 5,
    color_theme: "from-amber-600 via-orange-600 to-amber-900",
    accent_glow: "rgba(234, 88, 12, 0.4)",
    bank_name: "Inter Black",
  },
];

export const initialMockTransactions: MockTransaction[] = [
  {
    id: "tx-1",
    card_id: "card-nubank",
    description: "Supermercado Assaí Atacadista",
    amount: 450.90,
    date: new Date().toISOString().split("T")[0],
    category: "Mercado",
    installments: 1,
    buyer_name: "Jordan",
    type: "credit",
  },
  {
    id: "tx-2",
    card_id: "card-nubank",
    description: "iFood Delivery Gourmet",
    amount: 89.90,
    date: new Date().toISOString().split("T")[0],
    category: "Alimentação",
    installments: 1,
    buyer_name: "Jordan",
    type: "credit",
  },
  {
    id: "tx-3",
    card_id: "card-xp",
    description: "Apple Store - iPhone 16 Pro",
    amount: 789.90,
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    category: "Tecnologia",
    installments: 10,
    current_installment: 3,
    buyer_name: "Mariana",
    type: "credit",
  },
  {
    id: "tx-4",
    card_id: "card-inter",
    description: "Posto Shell Combustível",
    amount: 220.00,
    date: new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0],
    category: "Transporte",
    installments: 1,
    buyer_name: "Jordan",
    type: "credit",
  },
  {
    id: "tx-5",
    card_id: "card-nubank",
    description: "Netflix Assinatura Mensal",
    amount: 55.90,
    date: new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0],
    category: "Assinaturas",
    installments: 1,
    buyer_name: "Jordan",
    type: "credit",
  },
  {
    id: "tx-6",
    card_id: "card-xp",
    description: "Zara Shopping Morumbi",
    amount: 349.50,
    date: new Date(Date.now() - 86400000 * 4).toISOString().split("T")[0],
    category: "Vestuário",
    installments: 3,
    current_installment: 1,
    buyer_name: "Mariana",
    type: "credit",
  },
  {
    id: "tx-7",
    card_id: "card-inter",
    description: "Smart Fit Mensalidade",
    amount: 119.90,
    date: new Date(Date.now() - 86400000 * 5).toISOString().split("T")[0],
    category: "Saúde & Fitness",
    installments: 1,
    buyer_name: "Jordan",
    type: "credit",
  },
];

export const initialMockGoals: MockGoal[] = [
  {
    id: "g-1",
    category: "Alimentação & Delivery",
    spent: 540,
    limit: 750,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "g-2",
    category: "Mercado & Feira",
    spent: 980,
    limit: 1500,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "g-3",
    category: "Lazer & Bares",
    spent: 420,
    limit: 500,
    color: "from-purple-500 to-indigo-500",
  },
];

export const initialMockSubscriptions: MockSubscription[] = [
  {
    id: "sub-1",
    name: "Netflix Premium 4K",
    amount: 55.90,
    category: "Streaming",
    color: "bg-red-500/20 text-red-500 border-red-500/30",
    card_last4: "4092",
  },
  {
    id: "sub-2",
    name: "Spotify Família",
    amount: 34.90,
    category: "Música",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    card_last4: "4092",
  },
  {
    id: "sub-3",
    name: "Amazon Prime + Vídeo",
    amount: 19.90,
    category: "E-commerce",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    card_last4: "8821",
  },
  {
    id: "sub-4",
    name: "OpenAI ChatGPT Plus",
    amount: 110.00,
    category: "Produtividade",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    card_last4: "8821",
  },
];

