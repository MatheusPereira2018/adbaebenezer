import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAllVideos, type VideoRow } from "@/hooks/useVideos";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtube";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  LogOut,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Star,
  Home,
} from "lucide-react";
import { z } from "zod";
import logo from "@/assets/ebenezer-logo.png";

const videoSchema = z.object({
  title: z.string().trim().min(2, "Título muito curto").max(200),
  youtube_url: z.string().trim().url("URL inválida").max(500),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  update_date: z.string().min(1, "Data obrigatória"),
  type: z.enum(["principal", "atualizacao"]),
});

type FormState = {
  id?: string;
  title: string;
  youtube_url: string;
  description: string;
  update_date: string;
  type: "principal" | "atualizacao";
};

const emptyForm: FormState = {
  title: "",
  youtube_url: "",
  description: "",
  update_date: new Date().toISOString().slice(0, 10),
  type: "atualizacao",
};

const Admin = () => {
  const { session, isAdmin, loading, signOut } = useAuth();
  const { data: videos = [], isLoading } = useAllVideos();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const mainVideos = videos.filter((v) => v.type === "principal");
  const updateVideosList = videos.filter((v) => v.type === "atualizacao");

  if (!loading && (!session || !isAdmin)) {
    return <Navigate to="/admin/login" replace />;
  }

  const openNew = (type: "principal" | "atualizacao" = "atualizacao") => {
    setForm({ ...emptyForm, type });
    setDialogOpen(true);
  };

  const openEdit = (v: VideoRow) => {
    setForm({
      id: v.id,
      title: v.title,
      youtube_url: v.youtube_url,
      description: v.description ?? "",
      update_date: v.update_date,
      type: v.type,
    });
    setDialogOpen(true);
  };

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["videos", "all"] });
    queryClient.invalidateQueries({ queryKey: ["videos", "atualizacao"] });
    queryClient.invalidateQueries({ queryKey: ["video", "principal"] });
  };

  const handleSave = async () => {
    const parsed = videoSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    const ytId = extractYouTubeId(parsed.data.youtube_url);
    if (!ytId) {
      toast.error("URL do YouTube inválida");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: parsed.data.title,
        youtube_url: parsed.data.youtube_url,
        youtube_video_id: ytId,
        description: parsed.data.description || null,
        update_date: parsed.data.update_date,
        type: parsed.data.type,
      };

      if (form.id) {
        const { error } = await supabase
          .from("videos")
          .update(payload)
          .eq("id", form.id);
        if (error) throw error;
        toast.success("Vídeo atualizado");
      } else {
        const { error } = await supabase.from("videos").insert(payload);
        if (error) throw error;
        toast.success("Vídeo adicionado");
      }
      setDialogOpen(false);
      refresh();
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao salvar");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from("videos").delete().eq("id", deleteId);
      if (error) throw error;
      toast.success("Vídeo excluído");
      refresh();
    } catch (err: any) {
      toast.error(err?.message ?? "Erro ao excluir");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header admin */}
      <header className="border-b border-gold/20 bg-surface/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Projeto Ebenezer"
              width={300}
              height={75}
              className="h-10 w-auto"
            />
            <div className="hidden sm:block border-l border-gold/30 pl-3">
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                Painel administrativo
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="goldOutline" size="sm" asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
                <span>Voltar ao site</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl space-y-12 px-6 py-10">
        <div>
          <h2 className="font-display text-3xl font-medium text-foreground">
            Gerenciar vídeos
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Adicione, edite ou remova vídeos da página pública.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-xl bg-surface-elevated"
              />
            ))}
          </div>
        ) : (
          <>
            {/* SEÇÃO 1: VÍDEO PRINCIPAL */}
            <section>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-gold/20 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-gold" />
                    <h3 className="font-display text-xl font-medium text-foreground">
                      Vídeo Principal
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Aparece em destaque no topo da página.
                  </p>
                </div>
                <Button variant="goldOutline" size="sm" onClick={() => openNew("principal")}>
                  <Plus className="h-4 w-4" />
                  {mainVideos.length > 0 ? "Trocar vídeo principal" : "Adicionar vídeo principal"}
                </Button>
              </div>

              {mainVideos.length === 0 ? (
                <div className="surface-card rounded-xl p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Nenhum vídeo principal cadastrado ainda.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mainVideos.map((v) => (
                    <VideoRowItem
                      key={v.id}
                      video={v}
                      onEdit={openEdit}
                      onDelete={setDeleteId}
                    />
                  ))}
                  {mainVideos.length > 1 && (
                    <p className="text-xs text-muted-foreground">
                      ⓘ Quando há mais de um vídeo principal, o mais recente é exibido na página.
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* SEÇÃO 2: TIMELINE DE ATUALIZAÇÕES */}
            <section>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-gold/20 pb-4">
                <div>
                  <h3 className="font-display text-xl font-medium text-foreground">
                    Vídeos da Timeline
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Aparecem no carrossel de "Atualizações do Projeto".
                  </p>
                </div>
                <Button variant="gold" size="sm" onClick={() => openNew("atualizacao")}>
                  <Plus className="h-4 w-4" />
                  Nova atualização
                </Button>
              </div>

              {updateVideosList.length === 0 ? (
                <div className="surface-card rounded-xl p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Nenhuma atualização cadastrada ainda.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {updateVideosList.map((v) => (
                    <VideoRowItem
                      key={v.id}
                      video={v}
                      onEdit={openEdit}
                      onDelete={setDeleteId}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* Dialog criação/edição */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {form.id ? "Editar vídeo" : "Novo vídeo"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label>Link do YouTube</Label>
              <Input
                value={form.youtube_url}
                onChange={(e) =>
                  setForm({ ...form, youtube_url: e.target.value })
                }
                placeholder="https://www.youtube.com/watch?v=..."
                maxLength={500}
              />
              {form.youtube_url && extractYouTubeId(form.youtube_url) && (
                <p className="text-xs text-gold">
                  ID detectado: {extractYouTubeId(form.youtube_url)}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={form.update_date}
                  onChange={(e) =>
                    setForm({ ...form, update_date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    setForm({ ...form, type: v as FormState["type"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="principal">Principal</SelectItem>
                    <SelectItem value="atualizacao">Atualização</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                maxLength={2000}
              />
            </div>
            {form.type === "principal" && (
              <p className="rounded-lg border border-gold/30 bg-gold/5 p-3 text-xs text-muted-foreground">
                ⓘ Vídeos do tipo <strong className="text-gold">Principal</strong>{" "}
                aparecem no topo da página. O mais recente sempre será exibido.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button variant="gold" onClick={handleSave} disabled={submitting}>
              {submitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmação de exclusão */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir vídeo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

type VideoRowItemProps = {
  video: VideoRow;
  onEdit: (v: VideoRow) => void;
  onDelete: (id: string) => void;
};

function VideoRowItem({ video: v, onEdit, onDelete }: VideoRowItemProps) {
  return (
    <div className="surface-card flex flex-col gap-3 rounded-xl p-3 transition hover:border-gold/40 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
      <img
        src={getYouTubeThumbnail(v.youtube_video_id)}
        alt=""
        loading="lazy"
        className="h-40 w-full shrink-0 rounded-lg object-cover sm:h-20 sm:w-32"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {v.type === "principal" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
              <Star className="h-3 w-3" />
              Principal
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Atualização
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {new Date(v.update_date + "T00:00:00").toLocaleDateString("pt-BR")}
          </span>
        </div>
        <h3 className="mt-1 line-clamp-2 font-medium text-foreground sm:truncate">
          {v.title}
        </h3>
        {v.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground sm:line-clamp-1">
            {v.description}
          </p>
        )}
      </div>
      <div className="flex items-center justify-end gap-1 border-t border-border pt-2 sm:border-0 sm:pt-0">
        <Button variant="ghost" size="icon" asChild>
          <a
            href={v.youtube_url}
            target="_blank"
            rel="noreferrer noopener"
            title="Abrir no YouTube"
            aria-label="Abrir no YouTube"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(v)}
          title="Editar"
          aria-label="Editar"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(v.id)}
          title="Excluir"
          aria-label="Excluir"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}

export default Admin;
