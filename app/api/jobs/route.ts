import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, Job } from "@/lib/supabase";

// GET /api/jobs — ambil semua jobs
export async function GET(request: NextRequest) {
  const supabase = getSupabaseAdmin();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const kategori = searchParams.get("kategori") || "";
  const showAll = searchParams.get("all") === "1";

  let query = supabase.from("jobs").select("*");

  if (!showAll) {
    query = query.eq("status", "Aktif");
  }

  if (search) {
    query = query.or(
      `nama_posisi.ilike.%${search}%,nama_perusahaan.ilike.%${search}%,lokasi.ilike.%${search}%`
    );
  }

  if (kategori) {
    query = query.ilike("kategori", `%${kategori}%`);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data as Job[]);
}

// POST /api/jobs — tambah job baru
export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("jobs")
    .insert([body])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
