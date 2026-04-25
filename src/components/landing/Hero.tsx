import { Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/ebenezer-logo.png";

export const Hero = () => {
  return (
    <header className="relative overflow-hidden">
      {/* Imagem de fundo */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt=""
          width={1920}
          height={1080}
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
      </div>

      <div className="container relative z-10 mx-auto px-5 pb-10 pt-14 text-center sm:px-6 sm:pb-16 sm:pt-20 md:pb-20 md:pt-28">
        {/* Logo Ebenezer */}
        <div className="mx-auto flex max-w-2xl justify-center animate-fade-in">
          <img
            src={logo}
            alt="Projeto Ebenezer – Juntos Mais Além"
            width={1200}
            height={300}
            className="h-auto w-full max-w-[280px] drop-shadow-[0_8px_30px_hsl(var(--gold)/0.35)] sm:max-w-md md:max-w-xl"
          />
        </div>

        <div className="mt-2 flex items-center justify-center gap-2 animate-fade-in sm:mt-3">
          <span className="h-px w-8 bg-gold/50 sm:w-10" />
          <Sparkles className="h-4 w-4 text-gold" />
          <span className="h-px w-8 bg-gold/50 sm:w-10" />
        </div>

        <div className="mx-auto mt-6 max-w-3xl sm:mt-10">
          <h1 className="sr-only">Projeto Ebenezer — Juntos Mais Além</h1>

          <p
            className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-base md:text-lg animate-fade-up opacity-0"
            style={{ animationDelay: "0.55s" }}
          >
            Faça parte desse projeto e ajude a obra crescer.
          </p>
        </div>
      </div>
    </header>
  );
};
