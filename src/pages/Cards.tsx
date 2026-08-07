import { BottomNav } from "../components/layout/BottomNav";
import { Header } from "../components/layout/Header";
import { CardDetail } from "../components/ui/CardDetail";
import { TotalLimitCard } from "../components/ui/TotalLimitCard";
import { meusCartoes } from "../data/cards";

export function Cards() {
  // Dados de exemplo para o card de limite total
  const totalLimitData = {
    availableLimit: "R$ 11.450,00",
    usedAmount: "R$ 5.550,00",
    totalAmount: "R$ 17.000,00",
    percentageUsed: 32,
  };

  // Dados de exemplo para os detalhes dos cartões (disponível, dias de fechamento/vencimento)
  // No futuro, isso viria de uma API ou de um cálculo mais complexo.
  const cardDetailsData = {
    "1": { availableLimit: "R$ 3.750,00", closingDay: 5, dueDay: 12 },
    "2": { availableLimit: "R$ 8.000,00", closingDay: 10, dueDay: 17 },
    "3": { availableLimit: "R$ 1.200,00", closingDay: 1, dueDay: 8 },
    "4": { availableLimit: "R$ 12.000,00", closingDay: 20, dueDay: 27 },
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      <Header />

      <main className="px-6 mt-4">
        {/* Card de Limite Total agora é um componente */}
        <TotalLimitCard
          availableLimit={totalLimitData.availableLimit}
          usedAmount={totalLimitData.usedAmount}
          totalAmount={totalLimitData.totalAmount}
          percentageUsed={totalLimitData.percentageUsed}
        />

        {/* Renderização dinâmica dos cartões */}
        {meusCartoes.map((cartao) => {
          const details =
            cardDetailsData[cartao.id as keyof typeof cardDetailsData];
          return (
            <CardDetail
              key={cartao.id}
              card={cartao}
              availableLimit={details?.availableLimit ?? "N/A"}
              closingDay={details?.closingDay ?? 0}
              dueDay={details?.dueDay ?? 0}
            />
          );
        })}
      </main>

      {/* Navegação Inferior */}
      <BottomNav />
    </div>
  );
}
