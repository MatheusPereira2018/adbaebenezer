import { Building2, MapPin, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const priorities = [
  { icon: Building2, text: "Conclusão e construção de templos" },
  { icon: MapPin, text: "Aquisição de terrenos para novas congregações" },
  { icon: Wrench, text: "Melhoria da infraestrutura" },
];

export const Institutional = () => {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="container mx-auto max-w-4xl space-y-24">
        {/* Visão */}
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
            Visão do Projeto
          </span>
          <h3 className="mt-4 font-display text-3xl font-medium text-foreground md:text-4xl">
            Um propósito, uma missão.
          </h3>
          <div className="mx-auto mt-6 h-px w-16 bg-gold/40" />
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Concluir as principais obras de infraestrutura da igreja em até{" "}
            <span className="text-gold">cinco anos</span>, fortalecendo
            congregações, expandindo a presença do evangelho e oferecendo
            templos dignos para a adoração e o serviço a Deus.
          </p>
        </div>

        {/* Prioridades */}
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
            Prioridades do Projeto
          </span>
          <h3 className="mt-4 font-display text-3xl font-medium text-foreground md:text-4xl">
            Onde sua contribuição chega.
          </h3>
          <div className="mx-auto mt-6 h-px w-16 bg-gold/40" />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {priorities.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="surface-card group rounded-2xl p-8 transition-[var(--transition-smooth)] hover:border-gold/50 hover:shadow-[var(--shadow-gold)]"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10 transition-[var(--transition-smooth)] group-hover:bg-gold/20">
                  <Icon className="h-6 w-6 text-gold" />
                </div>
                <p className="mt-5 text-sm leading-relaxed text-foreground/90 md:text-base">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Como participar */}
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
            Como Participar
          </span>
          <h3 className="mt-4 font-display text-3xl font-medium text-foreground md:text-4xl">
            Seja um mantenedor da obra.
          </h3>
          <div className="mx-auto mt-6 h-px w-16 bg-gold/40" />
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Procure o agente do Projeto Ebenezer na sua congregação para
            conhecer as formas de contribuição e dar o próximo passo nessa
            jornada de fé com a gente.
          </p>

          <div className="mt-10">
            <Button variant="gold" size="xl" asChild>
              <a href="#atualizacoes">Quero ser um mantenedor</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
