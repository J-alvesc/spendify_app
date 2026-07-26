import { BottomNav } from "./components/layout/BottomNav";
import { CreditCard } from "./components/layout/ui/CreditCard"; // <-- Importamos aqui!

function App() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Cabeçalho */}
      <header className="pt-8 pb-4 px-6 flex justify-between items-center sticky top-0 bg-slate-50/90 backdrop-blur-md z-10">
        <div>
          <p className="text-sm text-slate-500">Bom dia,</p>
          <h1 className="text-2xl font-bold text-slate-900">Jordan</h1>
        </div>

        <div className="h-12 w-12 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-600 text-lg">
          J
        </div>
      </header>

      <main>
        {/* Cartões */}
        <section className="mt-2 pl-6">
          <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
            Meus Cartões
          </h3>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 pr-6 snap-x snap-mandatory">
            <CreditCard
              name="JORDAN"
              flag="MASTERCARD"
              lastDigits="1234"
              limit="R$ 5.000,00"
              colorClass="bg-gradient-to-br from-purple-600 to-purple-900"
            />

            <CreditCard
              name="JORDAN"
              flag="VISA"
              lastDigits="9876"
              limit="R$ 12.000,00"
              colorClass="bg-gradient-to-br from-slate-800 to-black"
            />
          </div>
        </section>
      </main>

      {/* Barra inferior */}
      <BottomNav />
    </div>
  );
}

export default App;
