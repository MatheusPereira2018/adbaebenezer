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

      <div className="container relative z-10 mx-auto px-6 pb-16 pt-24 text-center md:pb-24 md:pt-32">
        {/* Logo Ebenezer */}
        <div className="mx-auto flex max-w-2xl justify-center animate-fade-in">
          <img
            src={logo}
            alt="Projeto Ebenezer – Juntos Mais Além"
            width={1200}
            height={300}
            className="h-auto w-full max-w-xl drop-shadow-[0_8px_30px_hsl(var(--gold)/0.35)]"
          />
        </div>

        <div className="mt-3 flex items-center justify-center gap-2 animate-fade-in">
          <span className="h-px w-10 bg-gold/50" />
          <Sparkles className="h-4 w-4 text-gold" />
          <span className="h-px w-10 bg-gold/50" />
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <h1
            className="font-display text-4xl font-medium leading-tight text-foreground md:text-6xl animate-fade-up opacity-0"
            style={{ animationDelay: "0.4s" }}
          >
            Projeto Ebenezer
            <span className="block gold-text">Juntos Mais Além</span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg animate-fade-up opacity-0"
            style={{ animationDelay: "0.55s" }}
          >
            Faça parte desse projeto e ajude a obra crescer.
          </p>
        </div>
      </div>
    </header>
  );
};
