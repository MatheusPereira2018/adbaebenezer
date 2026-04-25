import { useRef } from "react";
import { useUpdateVideos } from "@/hooks/useVideos";
import { ChevronLeft, ChevronRight, PlayCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

function formatDate(iso: string) {
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export const UpdatesCarousel = () => {
  const { data: videos = [], isLoading } = useUpdateVideos();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85 * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section
      id="atualizacoes"
      className="relative border-t border-gold/15 bg-gradient-to-b from-background to-surface px-3 py-14 sm:px-4 sm:py-20 md:px-6 md:py-24"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 text-center sm:mb-12 md:mb-16">
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold sm:text-xs sm:tracking-[0.4em]">
            Acompanhe a obra
          </span>
          <h3 className="mt-3 font-display text-2xl font-medium text-foreground sm:mt-4 sm:text-3xl md:text-5xl">
            Atualizações do Projeto
          </h3>
          <div className="mx-auto mt-4 h-px w-12 bg-gold/40 sm:mt-6 sm:w-16" />
          <p className="mx-auto mt-4 max-w-2xl px-4 text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-base md:text-lg">
            Acompanhe os avanços, comunicados e novidades do Projeto Ebenezer.
          </p>
        </div>

        {isLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-72 w-80 shrink-0 animate-pulse rounded-2xl bg-surface-elevated"
              />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="surface-card mx-auto max-w-md rounded-2xl p-10 text-center">
            <PlayCircle className="mx-auto h-12 w-12 text-gold/40" />
            <p className="mt-4 text-sm text-muted-foreground">
              Em breve as primeiras atualizações estarão disponíveis aqui.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Botões nav (desktop) */}
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Anterior"
              className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-surface/90 p-3 text-gold backdrop-blur transition hover:bg-gold hover:text-primary-foreground md:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Próximo"
              className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-surface/90 p-3 text-gold backdrop-blur transition hover:bg-gold hover:text-primary-foreground md:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Esteira */}
            <div
              ref={scrollerRef}
              className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 md:gap-6"
            >
              {videos.map((v) => (
                <article
                  key={v.id}
                  className="group surface-card flex w-[85vw] shrink-0 snap-start flex-col overflow-hidden rounded-2xl transition-[var(--transition-smooth)] hover:border-gold/50 hover:shadow-[var(--shadow-gold)] sm:w-[360px] md:w-[380px]"
                >
                  <a
                    href={v.youtube_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="relative block overflow-hidden"
                    style={{ aspectRatio: "16 / 9" }}
                  >
                    <img
                      src={getYouTubeThumbnail(v.youtube_video_id)}
                      alt={v.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-90 transition-opacity group-hover:opacity-100">
                      <div className="rounded-full bg-gold/95 p-4 text-primary-foreground shadow-[var(--shadow-gold)]">
                        <PlayCircle className="h-7 w-7" />
                      </div>
                    </div>
                  </a>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold/80">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(v.update_date)}
                    </div>
                    <h4 className="mt-3 line-clamp-2 font-display text-xl font-medium leading-snug text-foreground">
                      {v.title}
                    </h4>
                    {v.description && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {v.description}
                      </p>
                    )}
                    <div className="mt-5 pt-1">
                      <Button variant="goldOutline" size="sm" asChild>
                        <a
                          href={v.youtube_url}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          Assistir atualização
                        </a>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
