export type SimulationId = "circular-motion" | "linked-list";

export type SimulationTemplate = {
  id: SimulationId;
  title: string;
  subject: "Physics" | "DSA";
  keywords: string[];
};

export const TEMPLATES: SimulationTemplate[] = [
  {
    id: "circular-motion",
    title: "Circular Motion",
    subject: "Physics",
    keywords: ["circular motion", "centripetal", "rotation", "angular velocity", "omega", "radius"]
  },
  {
    id: "linked-list",
    title: "Linked List",
    subject: "DSA",
    keywords: ["linked list", "node", "pointer", "insert", "delete", "traversal"]
  }
];

function normalize(s: string) {
  return s.toLowerCase().trim();
}

export function pickSimulationId(topic: string): SimulationId | null {
  const t = normalize(topic);
  if (!t) return null;

  let best: { id: SimulationId; score: number } | null = null;

  for (const tmpl of TEMPLATES) {
    let score = 0;
    for (const k of tmpl.keywords) {
      const kk = normalize(k);
      if (t.includes(kk)) score += 3;
      else {
        // small fuzzy: word overlap
        const words = kk.split(/\s+/);
        for (const w of words) if (w.length >= 4 && t.includes(w)) score += 1;
      }
    }
    if (!best || score > best.score) best = { id: tmpl.id, score };
  }

  if (!best || best.score === 0) return null;
  return best.id;
}