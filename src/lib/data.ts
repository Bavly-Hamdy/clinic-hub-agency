import { supabase, isSupabaseConfigured } from "./supabase";
import type { Service, Settings, Work } from "./types";

export type SiteData = {
  services: Service[];
  works: Work[];
  settings: Pick<Settings, "whatsapp" | "instagram" | "email">;
};

const fallbackSettings = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "",
  instagram: "",
  email: "",
};

export async function getSiteData(): Promise<SiteData> {
  if (!isSupabaseConfigured) {
    return { services: [], works: [], settings: fallbackSettings };
  }

  const [s, w, st] = await Promise.all([
    supabase.from("services").select("*").eq("is_active", true).order("sort_order"),
    supabase
      .from("works")
      .select("*")
      .eq("is_published", true)
      .order("sort_order")
      .order("created_at", { ascending: false }),
    supabase.from("settings").select("whatsapp,instagram,email").eq("id", 1).maybeSingle(),
  ]);

  return {
    services: (s.data as Service[]) ?? [],
    works: (w.data as Work[]) ?? [],
    settings: {
      whatsapp: st.data?.whatsapp || fallbackSettings.whatsapp,
      instagram: st.data?.instagram || "",
      email: st.data?.email || "",
    },
  };
}
