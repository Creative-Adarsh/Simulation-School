import { NextResponse } from "next/server";
import { createHash } from "crypto";

import { supabaseAdmin } from "../_lib/supabase-admin";
import { aiResolve } from "../_lib/ai-resolve";
import {
  matchSimIdFromPrompt,
  SIM_TEMPLATES,
  type SimId,
} from "../../simulate/sim-registry";
import { CONTENT, gradeBand } from "../../simulate/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function norm(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}
function hash(s: string) {
  return createHash("sha256").update(s).digest("hex");
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const prompt = url.searchParams.get("prompt") ?? "";
  const gradeParam = Number(url.searchParams.get("grade") ?? "6");
  const grade = Number.isFinite(gradeParam) ? gradeParam : 6;

  const forceSimIdParam = (url.searchParams.get("forceSimId") ?? "").trim();

  // ------------------------------------------------------------
  // 0) FORCED SIM MODE (Home template click) - CHECK FIRST!
  // If forceSimId is valid, we immediately return that sim.
  // This works WITHOUT Supabase to ensure it always works
  // ------------------------------------------------------------
  if (forceSimIdParam) {
    const valid = new Set(SIM_TEMPLATES.map((t) => t.id));
    if (valid.has(forceSimIdParam as SimId)) {
      const simId = forceSimIdParam as SimId;
      const band = gradeBand(grade);

      // Prefer curated content for correctness
      const content =
        (CONTENT as any)?.[simId]?.[band] ?? {
          title: "Simulation",
          simpleMeaning: ["This simulation was opened directly from Home."],
          whatToWatch: ["Try changing one slider at a time."],
          tryThis: ["Press Reset and repeat with different values."],
        };

      return NextResponse.json({
        ok: true,
        prompt,
        grade,
        simId,
        content,
        source: "forced",
      });
    }
    // If invalid forceSimId, we just continue to normal flow below
  }

  const templatesVersion = Number(process.env.TEMPLATES_VERSION ?? "1");
  const promptNorm = norm(prompt);
  const promptHash = hash(promptNorm);

  // Supabase is optional - only initialize if environment variables are set
  let sb;
  try {
    sb = supabaseAdmin();
  } catch (e) {
    // Supabase not configured, continue without caching
    sb = null;
  }

  // Optional analytics log (don't fail user flow if logging fails)
  if (sb) {
    const { error } = await sb.from("sim_requests").insert({
      prompt,
      grade,
      resolved_sim_id: forceSimIdParam || null,
      source: forceSimIdParam ? "forced" : null,
    });
    void error;
  }

  // ------------------------------------------------------------
  // 1) CACHE lookup (prompt-based) - only if sb is available
  // ------------------------------------------------------------
  if (sb) {
    const { data: cached, error: cacheErr } = await sb
      .from("sim_resolution_cache")
      .select("*")
      .eq("prompt_hash", promptHash)
      .eq("grade", grade)
      .eq("templates_version", templatesVersion)
      .maybeSingle();

    void cacheErr;

    if (cached) {
      return NextResponse.json({
        ok: true,
        prompt,
        grade,
        simId: cached.sim_id,
        content: cached.content,
        source: "cache",
      });
    }
  }

  // ------------------------------------------------------------
  // 2) AI resolve
  // ------------------------------------------------------------
  try {
    const ai = await aiResolve(prompt, grade);

    if (sb) {
      const { error: insErr } = await sb.from("sim_resolution_cache").insert({
        prompt,
        prompt_norm: promptNorm,
        prompt_hash: promptHash,
        grade,
        sim_id: ai.simId,
        content: ai.content,
        source: "ai",
        templates_version: templatesVersion,
      });
      void insErr;
    }

    return NextResponse.json({
      ok: true,
      prompt,
      grade,
      simId: ai.simId,
      content: ai.content,
      source: "ai",
    });
  } catch (e) {
    // ------------------------------------------------------------
    // 3) FALLBACK (deterministic match + curated content)
    // ------------------------------------------------------------
    const match = matchSimIdFromPrompt(prompt);

    if (!match) {
      return NextResponse.json({
        ok: false,
        prompt,
        message: "No matching simulation template found yet.",
        suggestions: SIM_TEMPLATES.map((t) => ({
          id: t.id,
          title: t.title,
          subject: t.subject,
        })),
      });
    }

    const band = gradeBand(grade);
    const content = (CONTENT as any)[match.id][band];

    if (sb) {
      const { error: insErr } = await sb.from("sim_resolution_cache").insert({
        prompt,
        prompt_norm: promptNorm,
        prompt_hash: promptHash,
        grade,
        sim_id: match.id,
        content,
        source: "fallback",
        templates_version: templatesVersion,
      });
      void insErr;
    }

    return NextResponse.json({
      ok: true,
      prompt,
      grade,
      simId: match.id,
      content,
      source: "fallback",
    });
  }
}
