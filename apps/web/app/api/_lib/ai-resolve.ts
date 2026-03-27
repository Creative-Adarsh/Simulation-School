import { z } from "zod";
import { SIM_TEMPLATES, SimId } from "../../simulate/sim-registry";

const AiSchema = z.object({
  simId: z.string(),
  content: z.object({
    title: z.string(),
    simpleMeaning: z.array(z.string()).min(2).max(7),
    whatToWatch: z.array(z.string()).min(2).max(7),
    tryThis: z.array(z.string()).min(2).max(7),
  }),
});

function buildPrompt(userPrompt: string, grade: number) {
  const templates = SIM_TEMPLATES.map((t) => ({
    id: t.id,
    title: t.title,
    subject: t.subject,
    keywords: t.keywords,
  }));

  return `
You are an educational assistant.

Student class: ${grade}
User request: "${userPrompt}"

Choose the best simulation id from the list. Then write a very simple explanation.
Return JSON ONLY (no markdown, no extra text).

Templates:
${JSON.stringify(templates, null, 2)}

Return exactly:
{
  "simId": "one-of-the-template-ids",
  "content": {
    "title": "short title",
    "simpleMeaning": ["...", "..."],
    "whatToWatch": ["...", "..."],
    "tryThis": ["...", "..."]
  }
}

Rules:
- Very simple English.
- No links.
- simId MUST match exactly one of the ids above.
`.trim();
}

export async function aiResolve(
  prompt: string,
  grade: number,
): Promise<{ simId: SimId; content: any }> {
  const token = process.env.HF_TOKEN!;
  const model = process.env.HF_MODEL || "Qwen/Qwen2.5-7B-Instruct";
  if (!token) throw new Error("Missing HF_TOKEN");

  const res = await fetch(
    `https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: buildPrompt(prompt, grade),
        parameters: {
          max_new_tokens: 450,
          temperature: 0.2,
          return_full_text: false,
        },
        options: { wait_for_model: true },
      }),
    },
  );

  const data = await res.json();

  // HF often returns: [{ generated_text: "..." }]
  const text = Array.isArray(data)
    ? data?.[0]?.generated_text
    : data?.generated_text;
  if (!text || typeof text !== "string") {
    throw new Error(
      "HF returned unexpected response: " + JSON.stringify(data).slice(0, 200),
    );
  }

  // Extract JSON
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("AI did not return JSON");

  const parsed = AiSchema.parse(JSON.parse(text.slice(start, end + 1)));

  const valid = new Set(SIM_TEMPLATES.map((t) => t.id));
  if (!valid.has(parsed.simId as SimId)) throw new Error("AI returned invalid simId");

  return { simId: parsed.simId as SimId, content: parsed.content };
}
