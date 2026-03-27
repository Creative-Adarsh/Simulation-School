export type SimId =
  | "circular-motion"
  | "projectile-motion"
  | "linked-list"
  | "bubble-sort"
  | "pendulum"
  | "simple-harmonic-motion";

export type SimTemplate = {
  id: SimId;
  title: string;
  subject: "Physics" | "DSA";
  keywords: string[];
};

export const SIM_TEMPLATES: SimTemplate[] = [
  {
    id: "circular-motion",
    title: "Circular Motion",
    subject: "Physics",
    keywords: [
      "circular motion",
      "centripetal",
      "angular velocity",
      "omega",
      "rotation",
    ],
  },
  {
    id: "projectile-motion",
    title: "Projectile Motion",
    subject: "Physics",
    keywords: [
      "projectile motion",
      "trajectory",
      "parabola",
      "throw",
      "range",
      "time of flight",
    ],
  },
  {
    id: "linked-list",
    title: "Linked List",
    subject: "DSA",
    keywords: [
      "linked list",
      "linkedlist",
      "node",
      "pointer",
      "insert",
      "delete",
      "traversal",
    ],
  },
  {
    id: "pendulum",
    title: "Pendulum",
    subject: "Physics",
    keywords: [
      "pendulum",
      "oscillation",
      "swing",
      "period",
      "gravity",
      "length",
      "bob",
    ],
  },
  {
    id: "simple-harmonic-motion",
    title: "Simple Harmonic Motion (SHM)",
    subject: "Physics",
    keywords: [
      "shm",
      "simple harmonic motion",
      "harmonic",
      "spring",
      "mass spring",
      "oscillation",
      "amplitude",
      "frequency",
    ],
  },
  {
    id: "bubble-sort",
    title: "Bubble Sort",
    subject: "DSA",
    keywords: ["bubble sort", "sorting", "swap", "adjacent", "pass"],
  },  
];

function norm(s: string) {
  return s.toLowerCase().trim();
}

export function matchSimIdFromPrompt(
  prompt: string,
): { id: SimId; score: number } | null {
  const p = norm(prompt);
  if (!p) return null;

  const pWords = new Set(p.split(/\s+/).filter(Boolean));

  let best: { id: SimId; score: number } | null = null;

  for (const t of SIM_TEMPLATES) {
    let score = 0;

    for (const k of t.keywords) {
      const kk = norm(k);

      // strong match
      if (p.includes(kk)) score += 10;

      // weaker word overlap
      const kWords = kk.split(/\s+/).filter(Boolean);
      for (const w of kWords) {
        if (w.length >= 4 && pWords.has(w)) score += 2;
      }
    }

    if (!best || score > best.score) best = { id: t.id, score };
  }

  if (!best || best.score <= 0) return null;
  return best;
}
