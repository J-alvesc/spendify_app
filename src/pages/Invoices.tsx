import { useState, useMemo } from "react";
import {
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Users,
  MoreHorizontal,
  Filter,
  ShoppingCart,
  Monitor,
  Tv,
  Tag,
  X,
  Plus,
  Check,
  Calculator,
  FileCheck,
  ArrowRight,
  RefreshCw,
  Sliders,
  Coins,
} from "lucide-react";
import { usePrivacyContext } from "../hooks/PrivacyContext";
import { formatCurrency } from "../lib/utils";
import { initialMockCards, type MockCard } from "../data/spendifyMocks";

interface InvoiceTransaction {
  id: string;
  card_id: string;
  description: string;
  category: string;
  date: string;
  amount: number;
  installments: number;
  currentInstallment?: number;
  isSplit?: boolean;
  splitWith?: string[];
  isReconciled?: boolean; // Conciliado com o banco
  isFromAi?: boolean; // Identificado via leitura de IA
}

interface SplitPerson {
  id: string;
  name: string;
  color: string;
}

// Fatura de cada cartão com valores reais do banco para conferência
interface CardInvoiceMeta {
  bankTotal: number;
  bankItemCount: number;
  status: "aberta" | "fechada" | "paga";
  closingDay: number;
  dueDay: number;
}

const cardInvoiceSettings: Record<string, CardInvoiceMeta> = {
  "card-nubank": {
    bankTotal: 1250.0,
    bankItemCount: 6,
    status: "fechada",
    closingDay: 5,
    dueDay: 12,
  },
  "card-xp": {
    bankTotal: 2840.5,
    bankItemCount: 4,
    status: "aberta",
    closingDay: 15,
    dueDay: 22,
  },
  "card-inter": {
    bankTotal: 850.0,
    bankItemCount: 3,
    status: "paga",
    closingDay: 28,
    dueDay: 5,
  },
};

export function Invoices() {
  const { formatPrivate } = usePrivacyContext();

  const cards: MockCard[] = initialMockCards;
  const [selectedCardId, setSelectedCardId] = useState<string>("card-nubank");
  const [selectedMonth, setSelectedMonth] = useState<string>("Julho");

  // Estado de edição do valor no banco
  const activeMeta = cardInvoiceSettings[selectedCardId] || {
    bankTotal: 1250.0,
    bankItemCount: 6,
    status: "fechada",
    closingDay: 5,
    dueDay: 12,
  };

  const [bankValues, setBankValues] = useState<Record<string, number>>({
    "card-nubank": 1250.0,
    "card-xp": 2840.5,
    "card-inter": 850.0,
  });

  const [isEditingBankValue, setIsEditingBankValue] = useState(false);
  const [editInputValue, setEditInputValue] = useState("1250,00");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Estado da simulação da IA
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiDiscrepancyFound, setAiDiscrepancyFound] = useState<boolean>(true);

  // Modal de Rachar Compra
  const [splitModalTx, setSplitModalTx] = useState<InvoiceTransaction | null>(
    null,
  );
  const [selectedPeople, setSelectedPeople] = useState<string[]>([
    "you",
    "paula",
    "ricardo",
  ]);
  const [splitMode, setSplitMode] = useState<"equal" | "custom">("equal");
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>(
    {},
  );

  const availablePeople: SplitPerson[] = [
    { id: "you", name: "Você", color: "bg-slate-200 text-slate-700" },
    { id: "paula", name: "Paula", color: "bg-purple-100 text-purple-700" },
    {
      id: "ricardo",
      name: "Ricardo",
      color: "bg-emerald-100 text-emerald-700",
    },
  ];

  // Base inicial de transações atreladas a cada cartão
  const [transactions, setTransactions] = useState<InvoiceTransaction[]>([
    // Transações do Nubank
    {
      id: "tx-inv-1",
      card_id: "card-nubank",
      description: "Supermercado Extra",
      category: "Alimentação",
      date: "12 Jul",
      amount: 450.0,
      installments: 1,
      isReconciled: true,
    },
    {
      id: "tx-inv-2",
      card_id: "card-nubank",
      description: "Amazon - Monitor",
      category: "Eletrônicos",
      date: "05 Jul",
      amount: 150.0,
      installments: 10,
      currentInstallment: 2,
      isReconciled: true,
    },
    {
      id: "tx-inv-3",
      card_id: "card-nubank",
      description: "iFood Gourmet",
      category: "Alimentação",
      date: "18 Jul",
      amount: 89.9,
      installments: 1,
      isReconciled: true,
    },
    {
      id: "tx-inv-4",
      card_id: "card-nubank",
      description: "Zara Shopping Morumbi",
      category: "Vestuário",
      date: "20 Jul",
      amount: 280.0,
      installments: 3,
      currentInstallment: 1,
      isReconciled: true,
    },
    {
      id: "tx-inv-5",
      card_id: "card-nubank",
      description: "Netflix Assinatura",
      category: "Streaming",
      date: "02 Jul",
      amount: 55.9,
      installments: 1,
      isReconciled: true,
    },

    // Transações da XP
    {
      id: "tx-inv-xp-1",
      card_id: "card-xp",
      description: "Apple Store - Acessórios",
      category: "Eletrônicos",
      date: "08 Jul",
      amount: 1890.0,
      installments: 6,
      currentInstallment: 1,
      isReconciled: true,
    },
    {
      id: "tx-inv-xp-2",
      card_id: "card-xp",
      description: "Restaurante Fasano",
      category: "Alimentação",
      date: "14 Jul",
      amount: 950.5,
      installments: 1,
      isReconciled: true,
    },

    // Transações do Inter
    {
      id: "tx-inv-int-1",
      card_id: "card-inter",
      description: "Posto Shell Combustível",
      category: "Transporte",
      date: "03 Jul",
      amount: 320.0,
      installments: 1,
      isReconciled: true,
    },
    {
      id: "tx-inv-int-2",
      card_id: "card-inter",
      description: "Drogaria São Paulo",
      category: "Saúde",
      date: "11 Jul",
      amount: 530.0,
      installments: 2,
      currentInstallment: 1,
      isReconciled: true,
    },
  ]);

  const activeCard = useMemo(() => {
    return cards.find((c) => c.id === selectedCardId) || cards[0];
  }, [cards, selectedCardId]);

  // Transações do cartão ativo
  const cardTransactions = useMemo(() => {
    return transactions.filter((t) => t.card_id === selectedCardId);
  }, [transactions, selectedCardId]);

  // Total apurado pelo app para o cartão selecionado
  const calculatedTotal = useMemo(() => {
    return cardTransactions.reduce((acc, tx) => acc + tx.amount, 0);
  }, [cardTransactions]);

  const currentBankTotal = bankValues[selectedCardId] ?? activeMeta.bankTotal;

  // Cálculos de conferência
  const diff = Math.abs(calculatedTotal - currentBankTotal);
  const isPriceMatch = diff < 0.05;
  const appItemCount = cardTransactions.length;
  const bankItemCount = activeMeta.bankItemCount;
  const isCountMatch = appItemCount === bankItemCount;
  const isFullyReconciled = isPriceMatch && isCountMatch;

  // Filtragem de categoria
  const filteredTransactions = useMemo(() => {
    if (categoryFilter === "all") return cardTransactions;
    return cardTransactions.filter((t) =>
      t.category.toLowerCase().includes(categoryFilter.toLowerCase()),
    );
  }, [cardTransactions, categoryFilter]);

  // Abre o modal inicializando a divisão
  const openSplitModal = (tx: InvoiceTransaction) => {
    setSplitModalTx(tx);
    const people = ["you", "paula", "ricardo"];
    setSelectedPeople(people);
    setSplitMode("equal");

    // Inicializa valores personalizados divididos igualmente por padrão
    const equalShare = Number((tx.amount / people.length).toFixed(2));
    const initialAmounts: Record<string, number> = {};
    people.forEach((p, idx) => {
      // Ajusta centavos na última pessoa para fechar a soma perfeitamente
      if (idx === people.length - 1) {
        const allocatedSoFar = equalShare * (people.length - 1);
        initialAmounts[p] = Number((tx.amount - allocatedSoFar).toFixed(2));
      } else {
        initialAmounts[p] = equalShare;
      }
    });
    setCustomAmounts(initialAmounts);
  };

  // Divisão no modal (Modo Igualitário)
  const perPersonAmount = useMemo(() => {
    if (!splitModalTx || selectedPeople.length === 0) return 0;
    return splitModalTx.amount / selectedPeople.length;
  }, [splitModalTx, selectedPeople]);

  // Soma dos valores personalizados no Modo Personalizado
  const totalCustomAllocated = useMemo(() => {
    return selectedPeople.reduce((sum, p) => sum + (customAmounts[p] || 0), 0);
  }, [selectedPeople, customAmounts]);

  const customDifference = useMemo(() => {
    if (!splitModalTx) return 0;
    return Number((splitModalTx.amount - totalCustomAllocated).toFixed(2));
  }, [splitModalTx, totalCustomAllocated]);

  const isCustomBalanced = Math.abs(customDifference) < 0.01;

  // Atualiza valor de uma pessoa e avisa diferença
  const updatePersonAmount = (personId: string, val: number) => {
    setCustomAmounts((prev) => ({
      ...prev,
      [personId]: Math.max(0, val),
    }));
  };

  // Preenche automaticamente o saldo restante para quem estiver focado
  const balanceRemainingToPerson = (personId: string) => {
    if (!splitModalTx) return;
    const othersTotal = selectedPeople
      .filter((p) => p !== personId)
      .reduce((sum, p) => sum + (customAmounts[p] || 0), 0);
    const remaining = Math.max(
      0,
      Number((splitModalTx.amount - othersTotal).toFixed(2)),
    );
    setCustomAmounts((prev) => ({
      ...prev,
      [personId]: remaining,
    }));
  };

  const togglePersonSelection = (id: string) => {
    if (id === "you") return;
    const newPeople = selectedPeople.includes(id)
      ? selectedPeople.filter((p) => p !== id)
      : [...selectedPeople, id];

    setSelectedPeople(newPeople);

    // Redistribui valores personalizados
    if (splitModalTx && newPeople.length > 0) {
      const share = Number((splitModalTx.amount / newPeople.length).toFixed(2));
      const updated: Record<string, number> = {};
      newPeople.forEach((p, idx) => {
        if (idx === newPeople.length - 1) {
          const soFar = share * (newPeople.length - 1);
          updated[p] = Number((splitModalTx.amount - soFar).toFixed(2));
        } else {
          updated[p] = share;
        }
      });
      setCustomAmounts(updated);
    }
  };

  const handleConfirmSplit = () => {
    if (!splitModalTx) return;
    if (splitMode === "custom" && !isCustomBalanced) {
      alert(
        `A soma dos valores (R$ ${totalCustomAllocated.toFixed(2)}) precisa ser igual ao total da compra (R$ ${splitModalTx.amount.toFixed(2)}).`,
      );
      return;
    }

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === splitModalTx.id
          ? {
              ...t,
              isSplit: true,
              splitWith: selectedPeople.filter((p) => p !== "you"),
            }
          : t,
      ),
    );
    setSplitModalTx(null);
  };

  const saveBankValue = () => {
    const parsed = parseFloat(
      editInputValue.replace(/[^\d.,]/g, "").replace(",", "."),
    );
    if (!isNaN(parsed) && parsed >= 0) {
      setBankValues((prev) => ({
        ...prev,
        [selectedCardId]: parsed,
      }));
    }
    setIsEditingBankValue(false);
  };

  // Ação de conciliação automática com a IA: inclui a compra faltante detectada
  const handleAddMissingItemViaAi = () => {
    const missingTx: InvoiceTransaction = {
      id: `tx-ai-missing-${Date.now()}`,
      card_id: "card-nubank",
      description: "Posto Ipiranga Combustível (Detectado via PDF)",
      category: "Transporte",
      date: "10 Jul",
      amount: 224.2, // valor exato para fechar R$ 1.250,00
      installments: 1,
      isReconciled: true,
      isFromAi: true,
    };

    setTransactions((prev) => [missingTx, ...prev]);
    setAiDiscrepancyFound(false);
  };

  const simulateAiScan = () => {
    setIsAiScanning(true);
    setTimeout(() => {
      setIsAiScanning(false);
      alert(
        `Fatura digital do ${activeCard.bank_name} lida com sucesso! Encontramos ${activeMeta.bankItemCount} lançamentos no documento.`,
      );
    }, 1200);
  };

  return (
    <div className="fade-in block px-6 pb-6 pt-2" data-testid="invoices-view">
      {/* 1. SELETOR DE CARTÕES MASTER DA FATURA (UX DE ALTO NÍVEL) */}
      <section className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Cartão da Fatura
          </span>
          <span className="text-[11px] font-extrabold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
            {cards.length} Cartões vinculados
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          {cards.map((card) => {
            const isSelected = selectedCardId === card.id;
            const meta = cardInvoiceSettings[card.id];

            return (
              <button
                key={card.id}
                onClick={() => {
                  setSelectedCardId(card.id);
                  setIsEditingBankValue(false);
                }}
                className={`px-4 py-3 rounded-2xl text-left shrink-0 flex items-center gap-3 transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? "bg-slate-950 text-white border-slate-900 shadow-lg shadow-slate-950/15 scale-[1.02] ring-2 ring-purple-500/40"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {/* Mini ícone com gradiente do cartão */}
                <div
                  className={`w-4 h-4 rounded-full bg-gradient-to-tr ${card.color_theme} shrink-0 ring-1 ring-white/30`}
                />

                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-black text-xs leading-none">
                      {card.bank_name}
                    </p>
                    <span className="text-[10px] opacity-60">
                      •••• {card.last4}
                    </span>
                  </div>
                  <p
                    className={`text-[10px] mt-1 font-semibold ${
                      isSelected ? "text-purple-300" : "text-slate-400"
                    }`}
                  >
                    Vence dia {meta?.dueDay || card.due_day} •{" "}
                    <span
                      className={`capitalize ${
                        meta?.status === "fechada"
                          ? "text-amber-400"
                          : meta?.status === "aberta"
                            ? "text-blue-400"
                            : "text-emerald-400"
                      }`}
                    >
                      {meta?.status || "aberta"}
                    </span>
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. TÍTULO E SELETOR DE MÊS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Fatura de {selectedMonth}
            </h2>
            <span
              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                activeMeta.status === "fechada"
                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                  : activeMeta.status === "aberta"
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
              }`}
            >
              {activeMeta.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {activeCard.bank_name} • Fecha dia {activeMeta.closingDay} • Vence
            dia {activeMeta.dueDay}
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm self-start sm:self-auto">
          {["Junho", "Julho", "Agosto"].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedMonth === m
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* 3. CARD DE CONFERÊNCIA DE VALORES & CONCILIAÇÃO BANCÁRIA */}
      <section className="mb-5">
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 relative overflow-hidden">
          {/* Barra lateral indicadora de status */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-2.5 ${
              isFullyReconciled ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />

          {/* Cabeçalho da Conferência */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Conferência de Valores
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Conciliação entre app e banco
              </p>
            </div>

            <span
              className={`text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-auto ${
                isFullyReconciled
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70"
                  : "bg-amber-50 text-amber-700 border border-amber-200/70"
              }`}
            >
              {isFullyReconciled ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tudo Certo (100%)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Divergência de {formatCurrency(diff)}</span>
                </>
              )}
            </span>
          </div>

          {/* Comparativo de Valores */}
          <div className="grid grid-cols-2 divide-x divide-slate-100 gap-3 sm:gap-4 pt-1 mb-4">
            {/* Calculado pelo App */}
            <div className="min-w-0 pr-1">
              <div className="flex items-center justify-between gap-1 flex-wrap">
                <p className="text-[11px] font-semibold text-slate-400 truncate">
                  Calculado pelo App
                </p>
                <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded shrink-0">
                  {appItemCount} itens
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 truncate">
                {formatPrivate(calculatedTotal, formatCurrency)}
              </p>
            </div>

            {/* Valor no Banco (Editável) */}
            <div className="pl-3 sm:pl-4 min-w-0">
              <div className="flex items-center justify-between gap-1 flex-wrap">
                <p className="text-[11px] font-semibold text-slate-400 truncate">
                  Valor no Banco
                </p>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    {bankItemCount} itens
                  </span>
                  <button
                    onClick={() => {
                      setEditInputValue(
                        currentBankTotal.toFixed(2).replace(".", ","),
                      );
                      setIsEditingBankValue(true);
                    }}
                    className="text-slate-400 hover:text-purple-600 cursor-pointer transition-colors p-0.5"
                    title="Editar valor oficial da fatura no banco"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {isEditingBankValue ? (
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs font-bold text-slate-400">R$</span>
                  <input
                    type="text"
                    value={editInputValue}
                    onChange={(e) => setEditInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveBankValue()}
                    autoFocus
                    className="w-20 sm:w-28 text-sm sm:text-lg font-black text-slate-900 border-b-2 border-purple-600 outline-none bg-transparent"
                  />
                  <button
                    onClick={saveBankValue}
                    className="p-1 bg-slate-900 text-white rounded-lg text-xs hover:bg-slate-800 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 truncate">
                  {formatPrivate(currentBankTotal, formatCurrency)}
                </p>
              )}
            </div>
          </div>

          {/* Barra de Progresso da Conciliação de Itens */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-purple-600" />
                Auditoria de Lançamentos:
              </span>
              <span>
                {appItemCount} de {bankItemCount} itens conferidos
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFullyReconciled
                    ? "bg-emerald-500"
                    : "bg-gradient-to-r from-amber-500 to-orange-500"
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(
                      (appItemCount / Math.max(1, bankItemCount)) * 100,
                    ),
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. CARD: LER FATURA COM IA (COM FEEDBACK DE AUDITORIA E OCR) */}
      <section className="mb-6">
        <div
          onClick={simulateAiScan}
          className="bg-gradient-to-r from-purple-50/80 via-indigo-50/50 to-white hover:bg-purple-50 border border-purple-200 rounded-3xl p-5 shadow-sm cursor-pointer transition-all duration-200 active:scale-[0.99] group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform">
                {isAiScanning ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm text-slate-900">
                    Ler fatura com IA (OCR)
                  </h4>
                  <span className="text-[10px] bg-purple-200/60 text-purple-800 font-extrabold px-1.5 py-0.5 rounded">
                    PDF & Foto
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Importe o PDF do {activeCard.bank_name} para apurar
                  automaticamente
                </p>
              </div>
            </div>

            <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-purple-200 flex items-center justify-center text-purple-600 group-hover:translate-y-[-2px] transition-transform">
              <UploadCloud className="w-5 h-5" />
            </div>
          </div>

          {/* BANNER DINÂMICO DE DIVERGÊNCIA SE HOUVER ITEM FALTANDO */}
          {!isFullyReconciled && aiDiscrepancyFound && (
            <div className="mt-4 pt-3.5 border-t border-purple-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  IA detectou <strong>1 lançamento faltante</strong> no PDF (
                  <strong className="text-purple-700">R$ 224,20</strong> em
                  Transporte).
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddMissingItemViaAi();
                }}
                className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <span>Conciliar e Adicionar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. SEÇÃO COMPRAS DESTE MÊS COM FILTRO */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Compras Deste Mês
            </h3>
            <p className="text-xs text-slate-400">
              {filteredTransactions.length} lançamentos no{" "}
              {activeCard.bank_name}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {["all", "Alimentação", "Eletrônicos", "Transporte"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 bg-white border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat === "all" ? (
                  <span className="flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Todos
                  </span>
                ) : (
                  cat
                )}
              </button>
            ))}
          </div>
        </div>

        {/* LISTA DE COMPRAS */}
        <div className="space-y-3.5">
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-100">
              <p className="font-bold text-sm text-slate-700">
                Nenhuma compra neste filtro
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Selecione outro cartão ou limpe o filtro de categorias.
              </p>
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className={`bg-white rounded-3xl p-5 shadow-sm border transition-all ${
                  tx.isFromAi
                    ? "border-purple-300 ring-2 ring-purple-100 bg-purple-50/20"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        tx.category === "Alimentação"
                          ? "bg-orange-50 text-orange-500"
                          : tx.category === "Eletrônicos"
                            ? "bg-blue-50 text-blue-500"
                            : tx.category === "Streaming"
                              ? "bg-indigo-50 text-indigo-500"
                              : tx.category === "Transporte"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-slate-50 text-slate-600"
                      }`}
                    >
                      {tx.category === "Alimentação" ? (
                        <ShoppingCart className="w-5 h-5" />
                      ) : tx.category === "Eletrônicos" ? (
                        <Monitor className="w-5 h-5" />
                      ) : tx.category === "Streaming" ? (
                        <Tv className="w-5 h-5" />
                      ) : (
                        <Tag className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                          {tx.description}
                        </h4>
                        {tx.isFromAi && (
                          <span className="text-[9px] bg-purple-600 text-white font-black px-1.5 py-0.2 rounded uppercase">
                            Via IA
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {tx.date} • {tx.category} • {activeCard.brand}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-black text-base text-slate-900">
                      {formatPrivate(tx.amount, formatCurrency)}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                      {tx.installments > 1
                        ? `Parc ${tx.currentInstallment || 1}/${
                            tx.installments
                          }`
                        : "À vista"}
                    </p>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-50">
                  <button
                    onClick={() => openSplitModal(tx)}
                    className="flex-1 py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-xs font-bold text-slate-600 flex items-center justify-center gap-2 transition-colors cursor-pointer group active:scale-[0.99]"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                    <span>
                      {tx.installments > 1 ? "Rachar Parcela" : "Rachar"}
                    </span>
                    {tx.isSplit && (
                      <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-extrabold">
                        Rachado (
                        {tx.splitWith?.length ? tx.splitWith.length + 1 : 2}{" "}
                        pessoas)
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => alert(`Opções da compra: ${tx.description}`)}
                    className="w-9 h-9 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    title="Mais opções"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 6. MODAL BOTTOM-SHEET: RACHAR COMPRA (FIDELIDADE TOTAL) */}
      {splitModalTx && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm transition-opacity"
            onClick={() => setSplitModalTx(null)}
          />

          <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-lg p-6 pb-8 relative z-10 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4" />

            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Rachar Compra
                </h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  {splitModalTx.description} • {activeCard.bank_name}
                </p>
              </div>
              <button
                onClick={() => setSplitModalTx(null)}
                className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Valor Total da Compra
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {formatCurrency(splitModalTx.amount)}
              </h2>
            </div>

            {/* SELETOR DE MODO DE DIVISÃO (IGUALITÁRIO VS PERSONALIZADO) */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-5">
              <button
                type="button"
                onClick={() => setSplitMode("equal")}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  splitMode === "equal"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Divisão Igual</span>
              </button>

              <button
                type="button"
                onClick={() => setSplitMode("custom")}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  splitMode === "custom"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Personalizar Valores</span>
              </button>
            </div>

            {/* CARD RESUMO CONFORME O MODO SELECIONADO */}
            {splitMode === "equal" ? (
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex items-center justify-between mb-5 shadow-sm">
                <div className="flex items-center gap-2.5 text-blue-700">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-bold">Ficará para cada:</span>
                </div>
                <span className="text-lg font-black text-blue-800">
                  {formatCurrency(perPersonAmount)}
                </span>
              </div>
            ) : (
              <div
                className={`border rounded-2xl p-4 mb-5 transition-all ${
                  isCustomBalanced
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-800"
                    : "bg-amber-50/80 border-amber-200 text-amber-800"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4" /> Total Distribuído:
                  </span>
                  <span className="text-sm font-black">
                    {formatCurrency(totalCustomAllocated)} de{" "}
                    {formatCurrency(splitModalTx.amount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-semibold mt-1 pt-1.5 border-t border-black/5">
                  <span>
                    {isCustomBalanced
                      ? "✓ Conta fechada perfeitamente!"
                      : customDifference > 0
                        ? `Resta alocar: ${formatCurrency(customDifference)}`
                        : `Ultrapassou: ${formatCurrency(Math.abs(customDifference))}`}
                  </span>

                  {!isCustomBalanced && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded-md">
                      Ajuste os valores
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* LISTA DE PESSOAS */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {splitMode === "equal"
                    ? "Com quem você vai rachar?"
                    : "Defina o valor de cada um:"}
                </p>
                {splitMode === "custom" && (
                  <span className="text-[10px] text-purple-600 font-bold">
                    Toque no valor para editar
                  </span>
                )}
              </div>

              {availablePeople.map((person) => {
                const isChecked = selectedPeople.includes(person.id);
                const isYou = person.id === "you";
                const personAmount = customAmounts[person.id] || 0;
                const personPercent =
                  splitModalTx.amount > 0
                    ? Math.round((personAmount / splitModalTx.amount) * 100)
                    : 0;

                return (
                  <div
                    key={person.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isChecked
                        ? "bg-slate-50 border-slate-300 shadow-xs"
                        : "bg-white border-slate-100 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      {/* Lado Esquerdo: Checkbox + Avatar + Nome */}
                      <div
                        onClick={() => togglePersonSelection(person.id)}
                        className="flex items-center gap-3 cursor-pointer flex-1 select-none"
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                            isChecked
                              ? "bg-slate-900 text-white"
                              : "border-2 border-slate-300 bg-white"
                          } ${isYou ? "opacity-60 cursor-not-allowed" : ""}`}
                        >
                          {isChecked && (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          )}
                        </div>

                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${person.color}`}
                        >
                          {person.name.charAt(0)}
                        </div>

                        <div>
                          <span className="text-sm font-extrabold text-slate-800 block leading-tight">
                            {person.name}
                          </span>
                          {splitMode === "custom" && isChecked && (
                            <span className="text-[10px] text-slate-400 font-bold">
                              {personPercent}% do total
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Lado Direito: Modo Igual vs Input de Valor Personalizado */}
                      {splitMode === "equal" ? (
                        <span className="text-xs font-black text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-xl">
                          {isChecked
                            ? formatCurrency(perPersonAmount)
                            : "R$ 0,00"}
                        </span>
                      ) : isChecked ? (
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center bg-white border border-slate-300 focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-100 rounded-xl px-2.5 py-1 shadow-xs">
                            <span className="text-xs font-bold text-slate-400 mr-1">
                              R$
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max={splitModalTx.amount}
                              value={personAmount || ""}
                              placeholder="0,00"
                              onChange={(e) =>
                                updatePersonAmount(
                                  person.id,
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              className="w-20 text-sm font-black text-slate-900 outline-none text-right"
                            />
                          </div>

                          {/* Botão para completar o saldo restante para esta pessoa com 1 toque */}
                          <button
                            type="button"
                            onClick={() => balanceRemainingToPerson(person.id)}
                            title="Completar o restante nesta pessoa"
                            className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[10px] font-extrabold transition-colors cursor-pointer"
                          >
                            Auto
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400">
                          Não participa
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() =>
                  alert(
                    "Você pode cadastrar novas pessoas com chave Pix na aba 'Pessoas'!",
                  )
                }
                className="w-full py-3.5 border border-dashed border-slate-300 hover:border-slate-400 rounded-2xl text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-2 transition-colors cursor-pointer bg-white"
              >
                <Plus className="w-4 h-4" /> Adicionar nova pessoa
              </button>
            </div>

            <button
              onClick={handleConfirmSplit}
              disabled={splitMode === "custom" && !isCustomBalanced}
              className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide shadow-xl transition-all cursor-pointer flex items-center justify-center ${
                splitMode === "custom" && !isCustomBalanced
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                  : "bg-slate-950 hover:bg-slate-800 active:scale-98 text-white shadow-slate-950/20"
              }`}
            >
              {splitMode === "custom" && !isCustomBalanced
                ? `Ajuste a diferença de ${formatCurrency(Math.abs(customDifference))}`
                : "Confirmar Divisão"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Invoices;
