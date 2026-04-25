import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type VideoRow = {
  id: string;
  title: string;
  youtube_url: string;
  youtube_video_id: string;
  description: string | null;
  update_date: string;
  type: "principal" | "atualizacao";
  created_at: string;
  updated_at: string;
};

export function useMainVideo() {
  return useQuery({
    queryKey: ["video", "principal"],
    queryFn: async (): Promise<VideoRow | null> => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("type", "principal")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as VideoRow | null;
    },
  });
}

export function useUpdateVideos() {
  return useQuery({
    queryKey: ["videos", "atualizacao"],
    queryFn: async (): Promise<VideoRow[]> => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("type", "atualizacao")
        .order("update_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as VideoRow[];
    },
  });
}

export function useAllVideos() {
  return useQuery({
    queryKey: ["videos", "all"],
    queryFn: async (): Promise<VideoRow[]> => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("update_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as VideoRow[];
    },
  });
}
