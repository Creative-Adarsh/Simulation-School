import { NextResponse } from "next/server";
import { supabaseAdmin } from "../_lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const sb = supabaseAdmin();

  const { data, error } = await sb
    .from("sim_requests")
    .insert({ prompt: "db test", grade: 6 })
    .select()
    .single();

  if (error) return NextResponse.json({ ok: false, error }, { status: 500 });
  return NextResponse.json({ ok: true, row: data });
}