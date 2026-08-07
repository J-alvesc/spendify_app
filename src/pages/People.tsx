import { Header } from "../components/layout/Header";
import { BottomNav } from "../components/layout/BottomNav";

export function People() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Header />
      <main className="px-6 mt-4">
        <h2 className="text-xl font-bold text-slate-900">Pessoas</h2>
        <p className="text-slate-500 mt-2">Em breve: Lista de pessoas aqui.</p>
      </main>
      <BottomNav />
    </div>
  );
}
