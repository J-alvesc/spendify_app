import { CreditCard } from "../../ui/CreditCard";
import { meusCartoes } from "../../../data/cards";

export function CardsSection() {
  return (
    <section className="mt-2 pl-6">
      <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
        Meus Cartões
      </h3>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 pr-6 snap-x snap-mandatory">
        {meusCartoes.map((cartao) => (
          <CreditCard key={cartao.id} {...cartao} />
        ))}
      </div>
    </section>
  );
}
