import { Zap} from "lucide-react";


export function Header() {
  return (
    <header className="pt-8 pb-4 px-6 flex justify-between items-center sticky top-0 bg-slate-50/90 backdrop-blur-md z-10">
        <div>
          <p className="text-sm text-slate-500">Bom dia,</p>
          <h1 className="text-2xl font-bold text-slate-900">Jordan</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Badge de Score */}
          <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-bold text-sm relative shadow-sm">
            <Zap className="w-4 h-4 fill-emerald-700" />
            <span>850</span>
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white absolute -top-0.5 -right-0.5"></div>
          </div>
          
         <div className="h-12 w-12 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-600 text-lg">
        J
      </div>
        </div>
      </header>
    
  );
}
