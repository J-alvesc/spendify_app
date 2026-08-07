import { BottomNav } from "../components/layout/BottomNav";
import { Header } from "../components/layout/Header";
import { SummarySections } from "../components/layout/sections/SummarySection";
import { CardsSection } from "../components/layout/sections/CardsSection";
import { TransactionsSection } from "../components/layout/sections/TransactionsSection";

export function Home() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Cabeçalho */}
      <Header />

      <main>
        {/* Cartões */}
        <CardsSection />

        {/* resumo do mes*/}

        <SummarySections />

        {/* Ultimas compras */}
        <TransactionsSection />
      </main>

      {/* Barra inferior */}
      <BottomNav />
    </div>
  );
}

export default Home;
