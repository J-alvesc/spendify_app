import { SummaryCard } from "../../ui/SummaryCard";
import { resumoMes } from "../../../types/data/dashboard";

export function SummarySections() {
  return (
    <div className="flex gap-4">
      {resumoMes.map((item) => (
        <SummaryCard key={item.id} {...item} />
      ))}
    </div>
  );
}
