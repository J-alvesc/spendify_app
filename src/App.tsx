import { BottomNav } from './components/layout/BottomNav';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      
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

      {/* Área Principal de Conteúdo */}
      <main className="px-6 mt-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-center">
          <p className="text-slate-500 text-sm">
            Bem-vindo ao Spendify. <br/> Seu espaço de conteúdo ficará aqui.
          </p>
        </div>
      </main>

      {/* Nossa Barra de Navegação */}
      <BottomNav />
      
    </div>
  );
}

export default App;