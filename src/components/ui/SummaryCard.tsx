import type {SummaryCardProps} from "../../types/index";

export function SummaryCard({ title, 
    value, 
    icon, 
    isHighlighted = false }: SummaryCardProps) {
  
    return (
    <div className={`p-5 rounded-3xl flex-1 flex flex-col gap-3 shadow-sm border border-slate-100 ${isHighlighted ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}>
      <div className="flex justify-between items-center">
        <div className={`p-2 rounded-xl ${isHighlighted ? "bg-slate-800" : "bg-slate-100"}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-xs mb-1 ${isHighlighted ? "text-slate-400" : "text-slate-500"}`}>
          {title}
        </p>
        <h3 className="text-xl font-bold">{value}</h3>
      </div>
    </div>
  );
}
