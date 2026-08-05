import { SummaryCard } from "../../ui/SummaryCard";
import { resumoMes } from "../../../types/data/dashboard";

export function SummarySections() {
  return (
    <section className="mt-2 pl-6">
      <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
        Resumo do mês
      </h3>
      <div className="flex gap-4">
        {resumoMes.map((item) => (
          <SummaryCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
