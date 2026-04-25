import { useEffect, useRef, useState } from "react";
import { useMainVideo } from "@/hooks/useVideos";
import { PlayCircle, Volume2, VolumeX } from "lucide-react";

// Carrega a YouTube IFrame API uma única vez
let ytApiPromise: Promise<void> | null = null;
function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  // @ts-expect-error - YT injetado pela API
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    // @ts-expect-error - callback global esperado pela API
    window.onYouTubeIframeAPIReady = () => resolve();
  });
  return ytApiPromise;
}

export const MainVideo = () => {
  const { data: video, isLoading } = useMainVideo();
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!video?.youtube_video_id || !containerRef.current) return;

    let cancelled = false;
    setReady(false);

    loadYouTubeAPI().then(() => {
      if (cancelled || !containerRef.current) return;

      // Limpa container antes de criar o player
      containerRef.current.innerHTML = '<div id="ebenezer-yt-player" style="width:100%;height:100%"></div>';

      // @ts-expect-error - YT global
      playerRef.current = new window.YT.Player("ebenezer-yt-player", {
        width: "100%",
        height: "100%",
        videoId: video.youtube_video_id,
        playerVars: {
          autoplay: 1,
          mute: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          controls: 1,
          loop: 1,
          playlist: video.youtube_video_id,
        },
        events: {
          onReady: (e: any) => {
            try {
              e.target.mute();
              e.target.playVideo();
              setReady(true);
            } catch (_) {
              /* ignore */
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch (_) {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, [video?.youtube_video_id]);

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    try {
      if (muted) {
        p.unMute();
        // garante volume audível
        p.setVolume?.(80);
        setMuted(false);
      } else {
        p.mute();
        setMuted(true);
      }
    } catch (_) {
      /* ignore */
    }
  };

  return (
    <section className="relative -mt-4 px-3 pb-12 md:px-6 md:pb-24">
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
              <>
                <div ref={containerRef} className="h-full w-full" />
                {/* Botão mutar/desmutar */}
                {ready && (
                  <button
                    onClick={toggleMute}
                    aria-label={muted ? "Ativar som" : "Desativar som"}
                    className="absolute bottom-3 right-3 z-10 flex items-center gap-2 rounded-full border border-gold/50 bg-background/80 px-4 py-2.5 text-sm font-medium text-gold backdrop-blur-md transition hover:bg-gold hover:text-primary-foreground active:scale-95 sm:bottom-4 sm:right-4"
                  >
                    {muted ? (
                      <>
                        <VolumeX className="h-4 w-4" />
                        <span className="hidden sm:inline">Ativar som</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Mudo</span>
                      </>
                    )}
                  </button>
                )}
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-surface-elevated text-center">
                <PlayCircle className="h-16 w-16 text-gold/40" />
                <p className="px-4 text-sm text-muted-foreground">
                  O vídeo principal será exibido aqui em breve.
                </p>
              </div>
            )}
          </div>

          {video && muted && ready && (
            <p className="mt-3 text-center text-xs text-muted-foreground sm:text-sm">
              🔇 O vídeo começa sem som — toque em <span className="text-gold">"Ativar som"</span> para ouvir.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
