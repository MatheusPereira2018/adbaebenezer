import logo from "@/assets/ebenezer-logo.png";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

export const SiteFooter = () => {
  return (
    <footer className="relative border-t border-gold/15 bg-surface px-6 py-12">
      <div className="container mx-auto max-w-4xl text-center">
        <img
          src={logo}
          alt="Projeto Ebenezer"
          width={600}
          height={150}
          loading="lazy"
          className="mx-auto h-auto w-full max-w-xs opacity-90"
        />
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
          “Até aqui nos ajudou o Senhor.” — 1 Samuel 7:12
        </p>
        <p className="mt-8 text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} Projeto Ebenezer. Todos os direitos
          reservados.
        </p>
      </div>

      <Link
        to="/admin/login"
        aria-label="Acessar painel administrativo"
        title="Painel administrativo"
        className="absolute bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-background/60 text-muted-foreground/70 backdrop-blur transition hover:border-gold/60 hover:text-gold active:scale-95"
      >
        <Settings className="h-4 w-4" />
      </Link>
    </footer>
  );
};
