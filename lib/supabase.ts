import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client dengan service role key untuk operasi admin (server-side only)
export function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceRoleKey);
}

export type Job = {
  id: string;
  nama_posisi: string;
  nama_perusahaan: string;
  lokasi: string;
  kategori: string;
  deskripsi: string;
  persyaratan: string | null;
  link_lamaran: string;
  tanggal_deadline: string | null;
  status: "Aktif" | "Nonaktif";
  created_at: string;
  updated_at: string;
};
