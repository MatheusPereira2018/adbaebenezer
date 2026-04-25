import { useMainVideo } from "@/hooks/useVideos";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { PlayCircle } from "lucide-react";

export const MainVideo = () => {
  const { data: video, isLoading } = useMainVideo();

  return (
    <section className="relative -mt-4 px-4 pb-16 md:px-6 md:pb-24">
      <div className="container mx-auto max-w-5xl">
        <div className="group relative">
          {/* Glow dourado */}
          <div className="pointer-events-none absolute -inset-1 rounded-[1.25rem] bg-gradient-to-r from-gold/40 via-gold-glow/30 to-gold/40 opacity-50 blur-2xl transition-opacity duration-500 group-hover:opacity-80" />

          {/* Card */}
          <div
            className="relative overflow-hidden rounded-[1.25rem] border border-gold/40 bg-surface shadow-[var(--shadow-elevated)]"
            style={{ aspectRatio: "16 / 9" }}
          >
            {isLoading ? (
              <div className="flex h-full w-full animate-pulse items-center justify-center bg-surface-elevated">
                <PlayCircle className="h-16 w-16 text-gold/30" />
              </div>
            ) : video ? (
              <iframe
                src={getYouTubeEmbedUrl(video.youtube_video_id)}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-surface-elevated text-center">
                <PlayCircle className="h-16 w-16 text-gold/40" />
                <p className="px-4 text-sm text-muted-foreground">
                  O vídeo principal será exibido aqui em breve.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
