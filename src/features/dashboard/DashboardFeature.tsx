import { useState, useMemo } from "react";
import {
  Nfc,
  Sparkles,
  Bot,
  PlusCircle,
  ShoppingCart,
  Tv,
  Coffee,
  ArrowRight,
  ShieldAlert,
  FileText,
  CreditCard as CreditCardIcon,
  TrendingUp,
  Layers,
  ChevronRight,
  Lock,
  Flame,
  Smartphone,
  Tag,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { spendifyApi } from "../../lib/api";
import { supabase } from "../../lib/supabase";
import { formatCurrency } from "../../lib/utils";
import { NewGoalModal } from "../../components/ui/NewGoalModal";
import { usePrivacyContext } from "../../hooks/PrivacyContext";
import {
  initialMockCards,
  initialMockTransactions,
  initialMockGoals,
  initialMockSubscriptions,
  type MockCard,
  type MockTransaction,
} from "../../data/spendifyMocks";

const timeRangeOptions = [
  { id: "7D", label: "7 Dias" },
  { id: "30D", label: "30 Dias" },
  { id: "6M", label: "6 Meses" },
];

export function DashboardFeature() {
  // Estado de seleção do filtro de cartão: "all" para todos ou o id do cartão
  const [selectedCardFilter, setSelectedCardFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("30D");
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [isCardLocked, setIsCardLocked] = useState<Record<string, boolean>>({});

  const { formatPrivate } = usePrivacyContext();

  // 1. Busca cartões do Supabase (com fallback pros mocks ricos)
  const { data: dbCards = [], isLoading: isLoadingCards } = useQuery({
    queryKey: ["dashboard-cards"],
    queryFn: async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user) return [];
        return (await spendifyApi.getCards(session.user.id)) || [];
      } catch {
        return [];
      }
    },
  });

  // 2. Busca transações do Supabase (com fallback pros mocks)
  const { data: dbTransactions = [], isLoading: isLoadingTx } = useQuery({
    queryKey: ["dashboard-transactions"],
    queryFn: async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user) return [];
        return (await spendifyApi.getTransactions(session.user.id)) || [];
      } catch {
        return [];
      }
    },
  });

  // Lista unificada de cartões (usa os dados do banco ou os mocks visuais ricos)
  const cards: MockCard[] = useMemo(() => {
    if (dbCards.length > 0) {
      return dbCards.map((c: any, index: number) => ({
        id: c.id,
        name: c.name || "Titular",
        brand: c.brand || "MASTERCARD",
        last4: c.last4 || "9999",
        total_limit: c.total_limit || 10000,
        available_limit: c.available_limit || 7500,
        closing_day: c.closing_day || 5,
        due_day: c.due_day || 12,
        color_theme:
          c.color_theme ||
          (index === 0
            ? "from-[#820AD1] via-[#61079e] to-[#3a0261]"
            : index === 1
            ? "from-slate-950 via-slate-900 to-zinc-900"
            : "from-blue-600 via-cyan-700 to-sky-900"),
        accent_glow:
          index === 0
            ? "rgba(130, 10, 209, 0.4)"
            : "rgba(15, 23, 42, 0.4)",
        bank_name: c.brand || "Cartão Principal",
      }));
    }
    return initialMockCards;
  }, [dbCards]);

  // Lista unificada de transações
  const allTransactions: MockTransaction[] = useMemo(() => {
    if (dbTransactions.length > 0) {
      return dbTransactions.map((t: any): MockTransaction => ({
        id: t.id,
        card_id: t.card_id || cards[0]?.id || "card-nubank",
        description: t.description,
        amount: Number(t.amount),
        date: t.date,
        category: t.category || "Outros",
        installments: t.installments || 1,
        current_installment: 1,
        buyer_name: "Jordan",
        type: (t.type as 'credit' | 'pix' | 'cash') || "credit",
      }));
    }
    return initialMockTransactions;
  }, [dbTransactions, cards]);

  // Transações filtradas pelo cartão selecionado
  const filteredTransactions = useMemo(() => {
    if (selectedCardFilter === "all") {
      return allTransactions;
    }
    return allTransactions.filter((tx) => tx.card_id === selectedCardFilter);
  }, [allTransactions, selectedCardFilter]);

  // Cartão ativo no momento (se selecionado individualmente)
  const currentCard = useMemo(() => {
    if (selectedCardFilter === "all") return null;
    return cards.find((c) => c.id === selectedCardFilter) || null;
  }, [cards, selectedCardFilter]);

  // Totais calculados dinamicamente com base no filtro
  const metrics = useMemo(() => {
    if (currentCard) {
      const invoice = filteredTransactions.reduce(
        (sum, tx) => sum + tx.amount,
        0
      );
      const totalLimit = currentCard.total_limit;
      const available = Math.max(0, totalLimit - invoice);
      const percentUsed =
        totalLimit > 0 ? Math.min(100, Math.round((invoice / totalLimit) * 100)) : 0;
      return {
        invoice,
        available,
        totalLimit,
        percentUsed,
        closingDay: currentCard.closing_day,
        dueDay: currentCard.due_day,
      };
    }

    // Visão Geral (Todos os cartões somados)
    const invoice = allTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalLimit = cards.reduce((sum, c) => sum + c.total_limit, 0);
    const available = Math.max(0, totalLimit - invoice);
    const percentUsed =
      totalLimit > 0 ? Math.min(100, Math.round((invoice / totalLimit) * 100)) : 0;
    return {
      invoice,
      available,
      totalLimit,
      percentUsed,
      closingDay: 5,
      dueDay: 12,
    };
  }, [currentCard, filteredTransactions, allTransactions, cards]);

  // Gráfico adaptativo ao período selecionado
  const chartData = useMemo(() => {
    if (timeRange === "7D") {
      const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dayLabel = days[d.getDay()];
        // Gera valor plausível com base no total
        const base = (metrics.invoice / 7) * (0.6 + (i % 3) * 0.3);
        return { name: dayLabel, value: Math.round(base) };
      });
    }

    if (timeRange === "30D") {
      return [
        { name: "Sem 1", value: Math.round(metrics.invoice * 0.22) },
        { name: "Sem 2", value: Math.round(metrics.invoice * 0.35) },
        { name: "Sem 3", value: Math.round(metrics.invoice * 0.18) },
        { name: "Sem 4", value: Math.round(metrics.invoice * 0.25) },
      ];
    }

    // 6M
    const months = ["Out", "Nov", "Dez", "Jan", "Fev", "Mar"];
    return months.map((m, i) => ({
      name: m,
      value: Math.round(metrics.invoice * (0.75 + i * 0.08)),
    }));
  }, [timeRange, metrics.invoice]);

  const toggleLock = (cardId: string) => {
    setIsCardLocked((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  return (
    <div className="fade-in block pb-6" data-testid="home-view">
      {/* 1. SELETOR / FILTRO HORIZONTAL DE CONTEXTO */}
      <section className="px-6 mb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {/* Pílula: Todos os Cartões */}
          <button
            onClick={() => setSelectedCardFilter("all")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
              selectedCardFilter === "all"
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-100 ring-2 ring-slate-900/20"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Todos os Cartões</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                selectedCardFilter === "all"
                  ? "bg-slate-800 text-slate-300"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {cards.length}
            </span>
          </button>

          {/* Pílula de cada cartão individual */}
          {cards.map((card) => {
            const isSelected = selectedCardFilter === card.id;
            return (
              <button
                key={card.id}
                onClick={() => setSelectedCardFilter(card.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-100 ring-2 ring-slate-900/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${card.color_theme}`}
                />
                <span>{card.bank_name || card.brand}</span>
                <span className="text-[10px] opacity-60">•••• {card.last4}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. CARROSSEL DE CARTÕES MODERNO COM SNAP & GLOW */}
      <section className="pl-6 mb-6 overflow-hidden">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pr-6 snap-x snap-mandatory">
          {isLoadingCards ? (
            <div className="snap-start shrink-0 w-[88%] sm:w-[340px] h-52 rounded-3xl p-6 bg-slate-200 animate-pulse" />
          ) : (
            cards.map((card) => {
              const isSelected = selectedCardFilter === card.id;
              const isLocked = !!isCardLocked[card.id];

              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedCardFilter(card.id)}
                  className={`snap-start relative shrink-0 w-[88%] sm:w-[340px] h-52 rounded-3xl p-6 flex flex-col justify-between shadow-xl transition-all duration-300 cursor-pointer select-none bg-gradient-to-br ${
                    card.color_theme
                  } text-white overflow-hidden ${
                    isSelected
                      ? "scale-[1.02] ring-4 ring-offset-2 ring-purple-500 shadow-2xl"
                      : "opacity-85 hover:opacity-100 scale-95"
                  }`}
                  style={{
                    boxShadow: isSelected
                      ? `0 20px 30px -10px ${card.accent_glow || "rgba(0,0,0,0.3)"}`
                      : undefined,
                  }}
                >
                  {/* Textura sutil de fundo */}
                  <div className="absolute -top-16 -right-16 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-black/20 rounded-full blur-2xl pointer-events-none" />

                  {/* Header do Cartão */}
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-2">
                      <Nfc className="w-6 h-6 opacity-80" />
                      {isLocked && (
                        <span className="flex items-center gap-1 bg-red-500/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold">
                          <Lock className="w-3 h-3" /> Bloqueado
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-black text-xs tracking-wider opacity-90 block">
                        {card.brand}
                      </span>
                      <span className="text-[10px] font-medium opacity-70">
                        Fecha dia {card.closing_day}
                      </span>
                    </div>
                  </div>

                  {/* Corpo com Limite */}
                  <div className="relative z-10 my-auto">
                    <p className="text-[11px] font-semibold uppercase tracking-wider opacity-75 mb-0.5">
                      Limite Total
                    </p>
                    <h2 className="text-3xl font-extrabold tracking-tight">
                      {formatPrivate(card.total_limit, formatCurrency)}
                    </h2>
                  </div>

                  {/* Rodapé do Cartão */}
                  <div className="flex justify-between items-end text-xs relative z-10">
                    <div>
                      <p className="text-[10px] opacity-70">Disponível</p>
                      <p className="font-bold text-emerald-300">
                        {formatPrivate(card.available_limit, formatCurrency)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="tracking-widest font-mono text-xs opacity-90 block">
                        •••• {card.last4}
                      </span>
                      <span className="font-semibold text-[11px] opacity-80 uppercase">
                        {card.name}
                      </span>
                    </div>
                  </div>

                  {/* Indicador inferior de seleção */}
                  <div
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-1 bg-white rounded-full transition-opacity ${
                      isSelected ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              );
            })
          )}

          {/* Card de Adicionar Novo Cartão */}
          <div
            onClick={() =>
              alert("Adicione um novo cartão de crédito na aba Cartões")
            }
            className="snap-start shrink-0 w-[88%] sm:w-[340px] h-52 rounded-3xl p-6 border-2 border-dashed border-slate-300 hover:border-purple-400 bg-white/50 hover:bg-purple-50/40 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-purple-600 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <PlusCircle className="w-6 h-6 text-purple-600" />
            </div>
            <p className="font-bold text-sm text-slate-800">Novo Cartão</p>
            <p className="text-xs text-slate-500">Vincule outro cartão de crédito</p>
          </div>
        </div>
      </section>

      {/* 3. RESUMO INTELIGENTE: FATURA + BARRA DE COMPROMETIMENTO */}
      <section className="px-4 sm:px-6 mb-6">
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider truncate">
                  {currentCard
                    ? `Fatura • ${currentCard.bank_name || currentCard.brand}`
                    : "Fatura Atual Consolidada"}
                </p>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight truncate">
                {formatPrivate(metrics.invoice, formatCurrency)}
              </h3>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block">
                Vence em
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-800 bg-slate-100 px-2 sm:px-2.5 py-1 rounded-xl whitespace-nowrap">
                Dia {metrics.dueDay}
              </span>
            </div>
          </div>

          {/* Barra de Progresso do Limite Comprometido */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-[11px] sm:text-xs font-semibold text-slate-600 gap-2">
              <span className="truncate">
                Limite Livre:{" "}
                <strong className="text-emerald-600 font-extrabold">
                  {formatPrivate(metrics.available, formatCurrency)}
                </strong>
              </span>
              <span className="shrink-0 text-[10px] sm:text-xs text-slate-500">
                {metrics.percentUsed}% do limite total (
                {formatPrivate(metrics.totalLimit, formatCurrency)})
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 sm:h-3 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  metrics.percentUsed > 85
                    ? "bg-red-500"
                    : metrics.percentUsed > 60
                    ? "bg-amber-500"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600"
                }`}
                style={{ width: `${Math.max(4, metrics.percentUsed)}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. QUICK ACTION CHIPS (ATALHOS ERGONÔMICOS) */}
      <section className="px-4 sm:px-6 mb-8">
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
          <button
            onClick={() =>
              alert("Direcionando para o detalhamento da fatura...")
            }
            className="flex flex-col items-center justify-center p-2.5 sm:p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl shadow-sm transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1 sm:mb-1.5 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 text-center leading-tight truncate max-w-full">
              Ver Fatura
            </span>
          </button>

          <button
            onClick={() => {
              if (currentCard) {
                toggleLock(currentCard.id);
              } else if (cards[0]) {
                toggleLock(cards[0].id);
              }
            }}
            className="flex flex-col items-center justify-center p-2.5 sm:p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl shadow-sm transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1 sm:mb-1.5 group-hover:scale-110 transition-transform">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 text-center leading-tight truncate max-w-full">
              {currentCard && isCardLocked[currentCard.id]
                ? "Desbloquear"
                : "Bloquear"}
            </span>
          </button>

          <button
            onClick={() => setIsNewGoalModalOpen(true)}
            className="flex flex-col items-center justify-center p-2.5 sm:p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl shadow-sm transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1 sm:mb-1.5 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 text-center leading-tight truncate max-w-full">
              Ajustar Meta
            </span>
          </button>

          <button
            onClick={() =>
              alert("Leitor de Cupons e Comprovantes com IA (Em Breve)")
            }
            className="flex flex-col items-center justify-center p-2.5 sm:p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl shadow-sm transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1 sm:mb-1.5 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 text-center leading-tight truncate max-w-full">
              Escanear IA
            </span>
          </button>
        </div>
      </section>

      {/* 5. SPENDIFY AI INSIGHT CARD (EXPERIÊNCIA PREMIUM) */}
      <section className="px-6 mb-8">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden text-white">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-600/30 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-600/20 blur-3xl rounded-full pointer-events-none" />

          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-xs font-black text-purple-300 uppercase tracking-widest">
                Spendify AI • Insight Ativo
              </h3>
            </div>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-500/30">
              Economia Prevista
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-5 relative z-10 font-medium">
            Seus gastos com <strong className="text-white">Delivery e Restaurantes</strong>{" "}
            somam <strong className="text-purple-300">R$ 540,80</strong> neste mês (
            <span className="text-red-400 font-bold">+28%</span> vs mês passado).
            Reduzindo 1 pedido semanal, você economiza{" "}
            <strong className="text-emerald-400">R$ 360,00</strong> até o fechamento.
          </p>

          <button
            onClick={() =>
              alert("Plano de Economia Gerado! Vamos definir um limite de Delivery.")
            }
            className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-98 text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/30 cursor-pointer"
          >
            <Bot className="w-4 h-4" /> Ativar Plano de Redução
          </button>
        </div>
      </section>

      {/* 6. GRÁFICO DE EVOLUÇÃO DE GASTOS COM FILTRO DE TEMPO */}
      <section className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Evolução de Gastos
            </h3>
            <p className="text-xs text-slate-400">
              {selectedCardFilter === "all"
                ? "Todos os cartões combinados"
                : `Apenas ${currentCard?.bank_name || currentCard?.brand}`}
            </p>
          </div>

          {/* Filtro de Janela Temporal (7D, 30D, 6M) */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {timeRangeOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTimeRange(opt.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  timeRange === opt.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {opt.id}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 pt-7">
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="spendifyPurpleGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.01" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-2xl flex flex-col items-center">
                          <span className="text-[10px] font-bold text-slate-400">
                            {label}
                          </span>
                          <span className="text-xs font-black text-purple-300">
                            {formatPrivate(
                              Number(payload[0].value),
                              formatCurrency
                            )}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{
                    stroke: "#e2e8f0",
                    strokeWidth: 2,
                    strokeDasharray: "4 4",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={3.5}
                  fillOpacity={1}
                  fill="url(#spendifyPurpleGradient)"
                  activeDot={{
                    r: 6,
                    fill: "white",
                    stroke: "#8b5cf6",
                    strokeWidth: 3,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 7. FEED DE ÚLTIMAS TRANSAÇÕES DINÂMICAS */}
      <section className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Últimas Compras
            </h3>
            <p className="text-xs text-slate-500">
              {filteredTransactions.length} movimentações no período
            </p>
          </div>
          <button
            onClick={() => alert("Histórico Completo em Faturas")}
            className="text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            Ver todas <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
          {isLoadingTx ? (
            <div className="p-6 text-center text-sm text-slate-400">
              Carregando compras...
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                <CreditCardIcon className="w-6 h-6" />
              </div>
              <p className="font-bold text-sm text-slate-700">
                Nenhuma compra encontrada
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {selectedCardFilter !== "all"
                  ? "Este cartão não possui compras registradas."
                  : "Comece registrando uma compra com o botão (+)."}
              </p>
            </div>
          ) : (
            filteredTransactions.slice(0, 6).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    {tx.category.toLowerCase().includes("mercado") ? (
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                    ) : tx.category.toLowerCase().includes("alimentação") ? (
                      <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                    ) : tx.category.toLowerCase().includes("streaming") ||
                      tx.category.toLowerCase().includes("lazer") ? (
                      <Tv className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    ) : tx.category.toLowerCase().includes("tecnologia") ? (
                      <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    ) : (
                      <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-xs sm:text-sm text-slate-900 leading-tight truncate">
                      {tx.description}
                    </p>
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] sm:text-[11px] text-slate-400 shrink-0">
                        {tx.date
                          ? new Date(tx.date + "T12:00:00Z").toLocaleDateString(
                              "pt-BR",
                              { day: "2-digit", month: "short" }
                            )
                          : "Hoje"}
                      </span>
                      <span className="text-[9px] sm:text-[10px] bg-slate-100 text-slate-600 font-semibold px-1.5 sm:px-2 py-0.5 rounded-md truncate max-w-[110px]">
                        {tx.category}
                      </span>
                      {tx.buyer_name && tx.buyer_name !== "Jordan" && (
                        <span className="text-[9px] sm:text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded-md truncate max-w-[90px]">
                          {tx.buyer_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-extrabold text-xs sm:text-sm text-slate-900 whitespace-nowrap">
                    {formatPrivate(tx.amount, formatCurrency)}
                  </p>
                  {tx.installments > 1 && (
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {tx.current_installment
                        ? `${tx.current_installment}/${tx.installments}x`
                        : `${tx.installments}x`}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 8. METAS DO MÊS (PROGRESSO VISUAL) */}
      <section className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 text-base">
              Metas de Gastos
            </h3>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
              3 Ativas
            </span>
          </div>
          <button
            onClick={() => setIsNewGoalModalOpen(true)}
            className="text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Adicionar
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 space-y-5">
          {initialMockGoals.map((goal) => {
            const percent = Math.round((goal.spent / goal.limit) * 100);
            return (
              <div key={goal.id}>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    {goal.category}
                  </span>
                  <span>
                    {formatPrivate(goal.spent, formatCurrency)} /{" "}
                    {formatPrivate(goal.limit, formatCurrency)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${goal.color}`}
                    style={{ width: `${Math.min(100, percent)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span
                    className={`text-[10px] font-bold ${
                      percent > 85 ? "text-red-500" : "text-slate-400"
                    }`}
                  >
                    {percent}% consumido
                  </span>
                  {percent > 85 && (
                    <span className="text-[10px] text-red-500 font-bold flex items-center gap-0.5">
                      <Flame className="w-3 h-3" /> Perto do limite
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. RADAR DE ASSINATURAS INVISÍVEIS */}
      <section className="px-6 mb-4">
        <div className="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800 relative overflow-hidden text-white">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-extrabold text-purple-300">
                Radar de Assinaturas
              </h3>
            </div>
            <span className="bg-purple-500/20 text-purple-300 text-[10px] px-2.5 py-1 rounded-xl font-extrabold border border-purple-500/30">
              {initialMockSubscriptions.length} Detectadas
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-4 font-medium">
            Cobranças automáticas recorrentes identificadas que impactam seu limite todo mês:
          </p>

          <div className="flex flex-col gap-2 mb-4">
            {initialMockSubscriptions.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs border ${sub.color}`}
                  >
                    {sub.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">
                      {sub.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Cartão •••• {sub.card_last4} • {sub.category}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-white">
                  {formatPrivate(sub.amount, formatCurrency)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800 mb-4">
            <span className="text-xs text-slate-400 font-semibold">
              Total recorrente mensal:
            </span>
            <span className="text-sm font-black text-red-400">
              {formatPrivate(
                initialMockSubscriptions.reduce((acc, s) => acc + s.amount, 0),
                formatCurrency
              )}
            </span>
          </div>

          <button
            onClick={() => alert("Gerenciador de assinaturas em desenvolvimento!")}
            className="w-full py-3 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 text-xs font-extrabold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            Auditar Assinaturas <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Modal de Nova Meta */}
      <NewGoalModal
        isOpen={isNewGoalModalOpen}
        onClose={() => setIsNewGoalModalOpen(false)}
      />
    </div>
  );
}
