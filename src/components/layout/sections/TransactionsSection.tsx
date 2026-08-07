import { TransactionItem } from "../../ui/TransactionItem";
import { ultimasCompras } from "../../../data/dashboard";

export function TransactionsSection() {
  return (
    <section className="mt-2 pl-6">
      <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
        Últimas compras
      </h3>
      <div className="flex flex-col gap-3">
        {ultimasCompras.map((compra) => (
          <TransactionItem key={compra.id} {...compra} />
        ))}
      </div>
    </section>
  );
}
