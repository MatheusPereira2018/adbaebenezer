import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, Lock } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("Email inválido").max(255),
  password: z.string().min(6, "Senha precisa ter pelo menos 6 caracteres").max(72),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Conta criada! Você já pode entrar.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        navigate("/admin");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Falha na autenticação");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="h-px w-10 bg-gold/50" />
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="h-px w-10 bg-gold/50" />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-[0.3em] text-gold">
            EBENÉZER
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Área Administrativa
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="surface-card space-y-5 rounded-2xl p-8"
        >
          <div className="flex items-center gap-2 text-gold">
            <Lock className="h-4 w-4" />
            <h2 className="font-display text-xl font-medium">
              {mode === "signin" ? "Entrar" : "Criar conta admin"}
            </h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={255}
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              maxLength={72}
              className="bg-input border-border"
            />
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            {submitting
              ? "Aguarde..."
              : mode === "signin"
              ? "Entrar"
              : "Criar conta"}
          </Button>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="block w-full text-center text-xs text-muted-foreground hover:text-gold"
          >
            {mode === "signin"
              ? "Não tem conta? Criar uma"
              : "Já tem conta? Entrar"}
          </button>

          <p className="border-t border-border pt-4 text-center text-xs text-muted-foreground/70">
            O primeiro usuário criado se torna administrador automaticamente.
          </p>
        </form>
      </div>
    </main>
  );
};

export default AdminLogin;
