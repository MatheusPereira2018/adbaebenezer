export const SiteFooter = () => {
  return (
    <footer className="border-t border-gold/15 bg-surface px-6 py-12">
      <div className="container mx-auto max-w-4xl text-center">
        <h4 className="font-display text-2xl font-semibold tracking-[0.3em] text-gold">
          EBENÉZER
        </h4>
        <p className="mt-2 text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Juntos Mais Além
        </p>
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
