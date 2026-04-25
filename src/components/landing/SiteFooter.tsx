import logo from "@/assets/ebenezer-logo.png";

export const SiteFooter = () => {
  return (
    <footer className="border-t border-gold/15 bg-surface px-6 py-12">
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
    </footer>
  );
};
