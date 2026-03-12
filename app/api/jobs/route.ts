import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const supabase = getSupabaseAdmin();
  const isAdmin = request.cookies.get("admin_session")?.value;
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const kategori = searchParams.get("kategori") || "";

  let query = supabase.from("jobs").select("*");

  if (!isAdmin) {
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

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const session = request.cookies.get("admin_session")?.value;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
