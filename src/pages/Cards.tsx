import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { CardDetail } from "../components/ui/CardDetail";
import { TotalLimitCard } from "../components/ui/TotalLimitCard";
import { CardConfigModal } from "../components/ui/CardConfigModal";
import { initialMockCards, type MockCard } from "../data/spendifyMocks";

export function Cards() {
  const [cardsList, setCardsList] = useState<MockCard[]>(initialMockCards);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedCardForConfig, setSelectedCardForConfig] = useState<MockCard | null>(null);

  // Totais calculados dinamicamente
  const metrics = useMemo(() => {
    const totalAmount = cardsList.reduce((acc, c) => acc + (c.total_limit || 0), 0);
    const availableLimit = cardsList.reduce((acc, c) => acc + (c.available_limit || 0), 0);
    const usedAmount = Math.max(0, totalAmount - availableLimit);
    const percentageUsed = totalAmount > 0 ? Math.round((usedAmount / totalAmount) * 100) : 0;

    return {
      totalAmount,
      availableLimit,
      usedAmount,
      percentageUsed,
    };
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
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Cartões
        </h2>
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

      {/* Lista de Cartões */}
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
              onConfigure={handleOpenEdit}
            />
          ))
        )}
      </div>

      {/* Modal de Configuração / Criação */}
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
