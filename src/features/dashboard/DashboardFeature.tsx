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
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { spendifyApi } from "../../lib/api";
import { supabase } from "../../lib/supabase";
import { formatCurrency } from "../../lib/utils";
import { NewGoalModal } from "../../components/ui/NewGoalModal";
import type { Database } from "../../types/database.types";

type Card = Database["public"]["Tables"]["cards"]["Row"];
type Transaction = Database["public"]["Tables"]["transactions"]["Row"] & {
  cards?: { brand: string; last4: string };
};

const generateChartData = (txs: { amount: number; date: string }[]) => {
  const data = [];
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const today = new Date();

  // Retroagir 6 meses a partir do mês atual
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthStr = months[d.getMonth()];
    const year = d.getFullYear();
    const monthNum = d.getMonth();

    // Somar transações deste mês específico
    const sum = txs.reduce((acc, tx) => {
      if (!tx.date) return acc;
      // Parse ajustado para fuso local para não pular de mês no dia 1
      const txDate = new Date(tx.date + "T12:00:00Z");
      if (txDate.getMonth() === monthNum && txDate.getFullYear() === year) {
        return acc + Number(tx.amount);
      }
      return acc;
    }, 0);

    data.push({ name: monthStr, value: sum });
  }
  return data;
};

// Tooltip customizado do Recharts para manter o design exigido
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#121626] text-white px-3 py-1.5 rounded-xl shadow-xl flex flex-col items-center relative -mt-4">
        <span className="text-[10px] font-bold text-slate-300">{label}</span>
        <span className="text-xs font-bold">
          {formatCurrency(payload[0].value)}
        </span>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#121626] rotate-45"></div>
      </div>
    );
  }
  return null;
};

export function DashboardFeature() {
  const [selectedCard, setSelectedCard] = useState(0);
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);

  const { data: cards = [], isLoading: isLoadingCards } = useQuery({
    queryKey: ["dashboard-cards"],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return [];
      return (await spendifyApi.getCards(session.user.id)) || [];
    },
  });

  const { data: transactions = [], isLoading: isLoadingTx } = useQuery({
    queryKey: ["dashboard-transactions"],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return [];
      return (await spendifyApi.getTransactions(session.user.id)) || [];
    },
  });

  // Query separada para o gráfico (pode ser maior que as últimas 5 transações)
  const { data: allTransactions = [] } = useQuery({
    queryKey: ["dashboard-all-transactions"],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return [];
      return (await spendifyApi.getAllTransactions(session.user.id)) || [];
    },
  });

  const activeCard = cards[selectedCard];

  // Resumo Mock calculations (using real transactions if present)
  const currentInvoice = useMemo(() => {
    return transactions.reduce((acc, curr) => acc + Number(curr.amount), 0);
  }, [transactions]);

  const availableLimit = activeCard
    ? (activeCard.total_limit || 0) - currentInvoice
    : 0;

  // Dados dinâmicos do gráfico
  const chartData = useMemo(
    () => generateChartData(allTransactions as any),
    [allTransactions],
  );

  return (
    <div className="fade-in block" data-testid="home-view">
      {/* 2. Meus Cartões */}
      <section className="mt-2 pl-6 overflow-hidden">
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 pr-6 snap-x snap-mandatory">
          {isLoadingCards ? (
            <div className="snap-start relative shrink-0 w-[85%] sm:w-[320px] h-48 rounded-3xl p-6 bg-slate-200 animate-pulse"></div>
          ) : cards.length === 0 ? (
            <div className="snap-start relative shrink-0 w-[85%] sm:w-[320px] h-48 rounded-3xl p-6 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
              <PlusCircle className="w-8 h-8 mb-2" />
              <p className="font-semibold text-sm">Nenhum cartão</p>
              <p className="text-xs">Adicione em "Cartões"</p>
            </div>
          ) : (
            cards.map((card, i) => (
              <div
                key={card.id}
                onClick={() => setSelectedCard(i)}
                className={`snap-start relative shrink-0 w-[85%] sm:w-[320px] h-48 rounded-3xl p-6 flex flex-col justify-between shadow-lg transition-transform duration-200 active:scale-95 ${
                  card.color_theme
                    ? card.color_theme
                    : i % 2 === 0
                      ? "bg-gradient-to-br from-[#8A05BE] to-[#4c0677]"
                      : "bg-gradient-to-br from-slate-900 to-slate-800"
                } text-white`}
              >
                <div className="flex justify-between items-start">
                  <Nfc className="w-6 h-6 opacity-70" />
                  <span className="font-semibold text-sm tracking-wider opacity-90">
                    {card.brand || "MASTERCARD"}
                  </span>
                </div>
                <div>
                  <p className="text-xs opacity-70 mb-1">Limite do Cartão</p>
                  <h2 className="text-2xl font-bold mb-4">
                    {formatCurrency(card.total_limit || 0)}
                  </h2>
                  <div className="flex justify-between items-end text-sm opacity-80">
                    <span className="tracking-widest">
                      **** {card.last4 || "1234"}
                    </span>
                    <span>{card.name || "Titular"}</span>
                  </div>
                </div>
                <div
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-slate-900 rounded-full transition-opacity ${selectedCard === i ? "opacity-100" : "opacity-0"}`}
                ></div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 3. Resumo do Mês */}
      <section className="px-6 mb-8">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">
                Fatura Atual
              </p>
              <h3 className="text-2xl font-bold text-slate-900">
                {formatCurrency(currentInvoice)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-1">
              Limite Disponível
            </p>
            <p className="text-sm font-bold text-emerald-600">
              {formatCurrency(availableLimit)}
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-1">
              Próximas Parcelas
            </p>
            <p className="text-sm font-bold text-orange-500">R$ 450,00</p>
          </div>
        </div>
      </section>

      {/* 3.5 Spendify AI Insight */}
      <section className="px-6 mb-8">
        <div className="bg-slate-900 rounded-3xl p-5 shadow-lg border border-slate-800 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>

          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              Spendify AI
            </h3>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-5">
            Notei que seus gastos com{" "}
            <strong className="text-white">Delivery (iFood)</strong> subiram{" "}
            <strong className="text-red-400">32%</strong> este mês. Se você
            investir esses R$ 240 em um CDB a 110% do CDI, renderia
            aproximadamente R$ 30 a mais no final do ano.
          </p>

          <button className="w-full py-3 rounded-2xl bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/30 text-purple-300 text-sm font-bold flex items-center justify-center gap-2 transition-colors">
            <Bot className="w-4 h-4" /> Pedir plano de ação completo
          </button>
        </div>
      </section>

      {/* 4. Últimas Compras */}
      <section className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">Últimas compras</h3>
          <button className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
            Ver todas
          </button>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-2">
          {isLoadingTx ? (
            <div className="p-4 text-center text-sm text-slate-400">
              Carregando...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-400">
              Nenhuma compra recente.
            </div>
          ) : (
            transactions.map((tx, index) => (
              <div
                key={tx.id}
                className={`flex items-center justify-between p-4 ${index !== transactions.length - 1 ? "border-b border-slate-50" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                    {tx.category?.toLowerCase().includes("alimentação") ? (
                      <ShoppingCart className="w-5 h-5" />
                    ) : tx.category?.toLowerCase().includes("lazer") ? (
                      <Tv className="w-5 h-5" />
                    ) : (
                      <Coffee className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800">
                      {tx.description}
                    </p>
                    <p className="text-xs text-slate-400">
                      {tx.date
                        ? new Date(tx.date + "T12:00:00Z").toLocaleDateString(
                            "pt-BR",
                            { day: "2-digit", month: "short" },
                          )
                        : ""}{" "}
                      • {tx.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-slate-900">
                    {formatCurrency(tx.amount)}
                  </p>
                  {tx.installments > 1 && (
                    <p className="text-[10px] text-slate-400 font-medium">
                      em {tx.installments}x
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 5. Metas do Mês */}
      <section className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            Metas do mês <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold">BETA</span>
          </h3>
          <button 
            onClick={() => setIsNewGoalModalOpen(true)}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
          >
            <PlusCircle className="w-3 h-3" /> Adicionar
          </button>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 space-y-5">
          <div>
            <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
              <span className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-orange-500" /> Delivery
              </span>
              <span>R$ 520 / R$ 600</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: "86%" }}
              ></div>
            </div>
            <p className="text-[10px] text-orange-500 font-medium mt-1">
              Você atingiu 86% da meta. Cuidado!
            </p>
          </div>
          <div>
            <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-emerald-500" /> Mercado
              </span>
              <span>R$ 400 / R$ 1.200</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: "33%" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Evolução de Gastos (Gráfico Real com Recharts) */}
      <section className="px-6 mb-8">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
          Evolução de Gastos
        </h3>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 pt-8">
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="purpleGradientReal"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                    <stop
                      offset="100%"
                      stopColor="#a855f7"
                      stopOpacity="0.01"
                    />
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
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "#f1f5f9",
                    strokeWidth: 2,
                    strokeDasharray: "4 4",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#a855f7"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#purpleGradientReal)"
                  activeDot={{
                    r: 6,
                    fill: "white",
                    stroke: "#a855f7",
                    strokeWidth: 3,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 7. Radar de Assinaturas */}
      <section className="px-6 mb-8">
        <div className="bg-slate-900 p-[1px] rounded-3xl shadow-md">
          <div className="bg-slate-900 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/30 blur-3xl rounded-full pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-purple-300 tracking-wide">
                  Radar de Assinaturas
                </h3>
              </div>
              <span className="bg-purple-500/20 text-purple-300 text-[10px] px-2 py-1 rounded-lg font-bold">
                3 Deteccões
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              O sistema identificou as seguintes cobranças recorrentes que estão
              consumindo o seu limite:
            </p>

            {/* Lista de Assinaturas */}
            <div className="flex flex-col gap-2 mb-5">
              <div className="flex items-center justify-between bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-xs">
                    N
                  </div>
                  <span className="text-sm font-semibold text-slate-200">
                    Netflix
                  </span>
                </div>
                <span className="text-sm font-bold text-white">R$ 55,90</span>
              </div>

              <div className="flex items-center justify-between bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 font-bold flex items-center justify-center text-xs">
                    S
                  </div>
                  <span className="text-sm font-semibold text-slate-200">
                    Spotify
                  </span>
                </div>
                <span className="text-sm font-bold text-white">R$ 21,90</span>
              </div>

              <div className="flex items-center justify-between bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                    A
                  </div>
                  <span className="text-sm font-semibold text-slate-200">
                    Amazon Prime
                  </span>
                </div>
                <span className="text-sm font-bold text-white">R$ 14,90</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 mb-4">
              <span className="text-xs text-slate-400 font-medium">
                Total invisível no mês:
              </span>
              <span className="text-sm font-bold text-red-400">R$ 92,70</span>
            </div>

            <button className="w-full py-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors">
              Gerenciar Assinaturas <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
      <NewGoalModal 
        isOpen={isNewGoalModalOpen} 
        onClose={() => setIsNewGoalModalOpen(false)} 
      />
    </div>
  );
}
