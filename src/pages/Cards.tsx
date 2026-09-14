import { useState, useMemo } from "react";
import { Plus, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CardDetail } from "../components/ui/CardDetail";
import { TotalLimitCard } from "../components/ui/TotalLimitCard";
import { CardConfigModal } from "../components/ui/CardConfigModal";
import { initialMockCards, type MockCard } from "../data/spendifyMocks";

export function Cards() {
  const navigate = useNavigate();
  const [cardsList, setCardsList] = useState<MockCard[]>(initialMockCards);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedCardForConfig, setSelectedCardForConfig] =
    useState<MockCard | null>(null);

  // Totais calculados dinamicamente
  const metrics = useMemo(() => {
    const totalAmount = cardsList.reduce(
      (acc, c) => acc + (c.total_limit || 0),
      0,
    );
    const availableLimit = cardsList.reduce(
      (acc, c) => acc + (c.available_limit || 0),
      0,
    );
    const usedAmount = Math.max(0, totalAmount - availableLimit);
    const percentageUsed =
      totalAmount > 0 ? Math.round((usedAmount / totalAmount) * 100) : 0;

    return {
      totalAmount,
      availableLimit,
      usedAmount,
      percentageUsed,
    };
  }, [cardsList]);

  // Advisor de melhor cartão para compras hoje
  const bestCardRecommendation = useMemo(() => {
    if (cardsList.length === 0) return null;

    const today = new Date().getDate();

    // Calcula a distância até a data de fechamento (quanto maior a distância, mais dias até o vencimento para pagar)
    const scored = cardsList.map((card) => {
      let daysUntilClosing = card.closing_day - today;
      if (daysUntilClosing <= 0) {
        daysUntilClosing += 30; // ciclo do próximo mês
      }
      return { card, daysUntilClosing };
    });

    // Ordena pelo que dá mais prazo de pagamento
    scored.sort((a, b) => b.daysUntilClosing - a.daysUntilClosing);
    return scored[0];
  }, [cardsList]);

  // Abertura do modal para edição
  const handleOpenEdit = (card: MockCard) => {
    setSelectedCardForConfig(card);
    setIsConfigModalOpen(true);
  };

  // Abertura do modal para novo cartão
  const handleOpenCreate = () => {
    setSelectedCardForConfig(null);
    setIsConfigModalOpen(true);
  };

  // Navegar direto para a fatura do cartão
  const handleViewInvoice = (card: MockCard) => {
    navigate(`/invoices?cardId=${card.id}`);
  };

  // Salvar alterações ou adicionar novo cartão
  const handleSaveCard = (savedCard: MockCard) => {
    setCardsList((prev) => {
      const exists = prev.some((c) => c.id === savedCard.id);
      if (exists) {
        return prev.map((c) => (c.id === savedCard.id ? savedCard : c));
      }
      return [savedCard, ...prev];
    });
  };

  // Excluir cartão
  const handleDeleteCard = (cardId: string) => {
    setCardsList((prev) => prev.filter((c) => c.id !== cardId));
  };

  return (
    <div className="fade-in block px-6 pb-6 pt-2" data-testid="cards-view">
      {/* Cabeçalho da Seção com Título e Botão "+ Novo" idêntico ao protótipo */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Cartões
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Gerencie limites, faturas e datas de corte
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-slate-950 hover:bg-slate-800 active:scale-95 text-white px-4 py-2 rounded-full text-xs font-black flex items-center gap-1.5 shadow-md shadow-slate-950/15 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Novo
        </button>
      </div>

      {/* Card de Limite Total Consolidado */}
      <TotalLimitCard
        availableLimit={metrics.availableLimit}
        usedAmount={metrics.usedAmount}
        totalAmount={metrics.totalAmount}
        percentageUsed={metrics.percentageUsed}
      />

      {/* Banner de Inteligência Financeira: Melhor Cartão Para Compras Hoje */}
      {bestCardRecommendation && cardsList.length > 1 && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm font-black">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">
                Dica Inteligente do Spendify
              </span>
              <p className="text-xs font-bold text-slate-800 truncate">
                Melhor cartão hoje:{" "}
                <span className="text-slate-950 font-black underline decoration-emerald-400">
                  {bestCardRecommendation.card.bank_name ||
                    bestCardRecommendation.card.name}
                </span>{" "}
                ({bestCardRecommendation.daysUntilClosing} dias até o fechamento)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleViewInvoice(bestCardRecommendation.card)}
            className="hidden sm:flex shrink-0 items-center gap-1 text-[11px] font-extrabold text-emerald-800 hover:text-emerald-950 cursor-pointer"
          >
            Usar este <TrendingUp className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Lista de Cartões com UI Humanizada e Ações */}
      <div className="space-y-4">
        {cardsList.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-8 text-center border border-slate-100 shadow-sm">
            <p className="font-extrabold text-sm text-slate-800 mb-1">
              Nenhum cartão cadastrado
            </p>
            <p className="text-xs text-slate-400 mb-4">
              Adicione seu primeiro cartão para acompanhar faturas e limites.
            </p>
            <button
              onClick={handleOpenCreate}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-full text-xs font-black transition-colors cursor-pointer"
            >
              Cadastrar Cartão
            </button>
          </div>
        ) : (
          cardsList.map((card) => (
            <CardDetail
              key={card.id}
              card={card}
              isBestDayToBuy={bestCardRecommendation?.card.id === card.id}
              onConfigure={handleOpenEdit}
              onViewInvoice={handleViewInvoice}
            />
          ))
        )}
      </div>

      {/* Modal de Configuração / Criação com Live Preview */}
      <CardConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        card={selectedCardForConfig}
        onSave={handleSaveCard}
        onDelete={handleDeleteCard}
      />
    </div>
  );
}

export default Cards;
