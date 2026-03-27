import type { SimId } from "./sim-registry";

export type GradeBand = "primary" | "middle" | "high" | "college";

export function gradeBand(grade: number): GradeBand {
  if (grade <= 5) return "primary";
  if (grade <= 8) return "middle";
  if (grade <= 12) return "high";
  return "college";
}

export type SimContent = {
  title: string;
  simpleMeaning: string[];
  whatToWatch: string[];
  tryThis: string[];
};

export const CONTENT: Record<SimId, Record<GradeBand, SimContent>> = {
  "circular-motion": {
    primary: {
      title: "Circular Motion (easy)",
      simpleMeaning: [
        "Something moves around in a circle again and again.",
        "Even if the speed is the same, the direction keeps changing.",
        "A pull toward the center keeps it moving in a circle.",
      ],
      whatToWatch: [
        "Green arrow shows direction of motion.",
        "Red arrow points toward the center.",
      ],
      tryThis: [
        "Make the circle bigger (radius). What changes?",
        "Increase ω. Does the motion look faster?",
      ],
    },
    middle: {
      title: "Circular Motion",
      simpleMeaning: [
        "Velocity is always tangent (sideways) to the circle.",
        "Acceleration points toward the center (centripetal acceleration).",
        "Bigger ω or bigger radius means bigger speed.",
      ],
      whatToWatch: [
        "Velocity arrow rotates with the object.",
        "Acceleration arrow always aims inward.",
      ],
      tryThis: [
        "Increase ω slowly and observe the arrows.",
        "Try small radius vs large radius.",
      ],
    },
    high: {
      title: "Uniform Circular Motion",
      simpleMeaning: [
        "Speed: v = ωr",
        "Centripetal acceleration: a = ω²r",
        "Direction of a is toward the center.",
      ],
      whatToWatch: [
        "If ω increases, both v and a increase.",
        "If r increases, v increases; a also increases.",
      ],
      tryThis: [
        "Double ω (approximately). What happens to acceleration?",
        "Keep ω fixed and change radius.",
      ],
    },
    college: {
      title: "Circular Motion (college)",
      simpleMeaning: [
        "a_c = v²/r = ω²r",
        "a points inward; v is tangential.",
        "Uniform circular motion has constant speed but changing velocity.",
      ],
      whatToWatch: [
        "Direction changes cause acceleration.",
        "Vectors help avoid the ‘outward force’ misconception.",
      ],
      tryThis: [
        "Compare ω changes vs r changes on a.",
        "Explain why acceleration exists even with constant speed.",
      ],
    },
  },

  "projectile-motion": {
    primary: {
      title: "Projectile Motion (easy)",
      simpleMeaning: [
        "When you throw a ball, it goes forward and falls down.",
        "Gravity pulls it downward all the time.",
        "That makes a curved path.",
      ],
      whatToWatch: [
        "The ball keeps moving forward.",
        "It also keeps falling down.",
      ],
      tryThis: [
        "Try a bigger angle. Does it go higher?",
        "Try a bigger speed. Does it go farther?",
      ],
    },
    middle: {
      title: "Projectile Motion",
      simpleMeaning: [
        "Horizontal motion is steady (no gravity sideways).",
        "Vertical motion accelerates downward because of gravity.",
        "Together they make a curved path.",
      ],
      whatToWatch: [
        "Angle controls height and time.",
        "Speed controls distance.",
      ],
      tryThis: [
        "Try 30° vs 60° with same speed.",
        "Change gravity to see what happens on Moon-like g.",
      ],
    },
    high: {
      title: "Projectile Motion (Class 11/12)",
      simpleMeaning: [
        "x = (v cosθ) t",
        "y = (v sinθ) t − ½gt²",
        "Trajectory becomes a parabola (ignoring air resistance).",
      ],
      whatToWatch: [
        "Range depends on v and θ.",
        "g changes flight time and height.",
      ],
      tryThis: [
        "Try θ ≈ 45° and compare range.",
        "Reduce g and watch flight time increase.",
      ],
    },
    college: {
      title: "Projectile Motion (college)",
      simpleMeaning: [
        "Decompose velocity into vx and vy.",
        "Horizontal: constant, Vertical: uniformly accelerated.",
        "Use kinematics + constraints (landing y=0) to derive time/range.",
      ],
      whatToWatch: [
        "vx stays constant in ideal model.",
        "vy decreases linearly with time.",
      ],
      tryThis: [
        "Explain why 30° and 60° can have similar ranges (ideal).",
        "Add ‘air resistance’ later as extension.",
      ],
    },
  },

  "linked-list": {
    primary: {
      title: "Linked List (easy)",
      simpleMeaning: [
        "Think of boxes connected like a chain.",
        "Each box has a value and points to the next box.",
        "To insert, you connect links again.",
      ],
      whatToWatch: ["Head means first box.", "Arrows show the next box."],
      tryThis: [
        "Insert at index 0 (front).",
        "Delete a value and watch the chain shorten.",
      ],
    },
    middle: {
      title: "Linked List",
      simpleMeaning: [
        "Nodes store (value + next).",
        "Traversal means following arrows one by one.",
        "Insert/delete changes arrows (pointers).",
      ],
      whatToWatch: [
        "Index 0 is head.",
        "Insertion shifts links, not array positions.",
      ],
      tryThis: [
        "Insert in the middle and observe arrows.",
        "Delete the head value and see what becomes head.",
      ],
    },
    high: {
      title: "Linked List (DSA)",
      simpleMeaning: [
        "Insert/delete is pointer rewiring.",
        "Search/traversal is O(n).",
        "Edge cases: empty list, delete head.",
      ],
      whatToWatch: [
        "Operations affect only nearby links.",
        "No contiguous memory like arrays.",
      ],
      tryThis: [
        "Try insert at end (index = length).",
        "Try delete a value not in list (should do nothing).",
      ],
    },
    college: {
      title: "Linked List (college)",
      simpleMeaning: [
        "Model nodes + references; maintain invariants.",
        "Be careful with order of pointer updates.",
        "Understand complexity tradeoffs vs arrays.",
      ],
      whatToWatch: [
        "Watch pointer changes carefully.",
        "Head changes on insert/delete at front.",
      ],
      tryThis: [
        "Explain why insert is O(1) after locating node, but locating is O(n).",
        "Discuss singly vs doubly linked lists.",
      ],
    },
  },

  "bubble-sort": {
    primary: {
      title: "Bubble Sort (easy)",
      simpleMeaning: [
        "Look at two neighbors.",
        "Swap if they are in the wrong order.",
        "Repeat until sorted.",
      ],
      whatToWatch: [
        "Big numbers move to the right.",
        "Green bars at right become ‘fixed’.",
      ],
      tryThis: [
        "Press Step and watch swaps.",
        "Press Randomize and try again.",
      ],
    },
    middle: {
      title: "Bubble Sort",
      simpleMeaning: [
        "Each pass pushes the biggest element to the end.",
        "Repeat passes until no swaps.",
        "Easy but slow for big lists.",
      ],
      whatToWatch: [
        "Amber bars are being compared.",
        "Right side becomes sorted zone.",
      ],
      tryThis: [
        "Use Play then Pause and Step.",
        "Explain what one ‘pass’ means.",
      ],
    },
    high: {
      title: "Bubble Sort (DSA)",
      simpleMeaning: [
        "Worst-case time: O(n²).",
        "Stable sort, in-place.",
        "After each pass, one element is fixed at the end.",
      ],
      whatToWatch: [
        "Comparisons reduce as sorted zone grows.",
        "Swaps happen only for out-of-order pairs.",
      ],
      tryThis: [
        "Count how many steps it takes.",
        "Try nearly sorted array (should need fewer swaps).",
      ],
    },
    college: {
      title: "Bubble Sort (college)",
      simpleMeaning: [
        "O(n²) comparisons, O(1) extra space.",
        "Stable; early-exit optimization exists.",
        "Used mainly for teaching, not production.",
      ],
      whatToWatch: [
        "Observe comparisons vs swaps.",
        "Sorted suffix grows each pass.",
      ],
      tryThis: [
        "Add early-exit flag later.",
        "Compare with selection sort and insertion sort.",
      ],
    },
  },
  pendulum: {
    primary: {
      title: "Pendulum (easy)",
      simpleMeaning: [
        "A pendulum is a weight hanging on a string that swings back and forth.",
        "Gravity pulls it down, so it keeps returning toward the middle.",
        "It repeats the motion again and again (oscillation).",
      ],
      whatToWatch: [
        "The pendulum moves fastest at the bottom.",
        "The direction changes at the ends (turning points).",
      ],
      tryThis: [
        "Increase the length. Does it swing slower?",
        "Increase the starting angle and observe the motion.",
      ],
    },
    middle: {
      title: "Pendulum",
      simpleMeaning: [
        "The pendulum swings because gravity creates a restoring pull toward the center.",
        "Longer length usually means a longer period (slower swing).",
        "Small damping slowly reduces the swing.",
      ],
      whatToWatch: [
        "Watch speed near the bottom vs near the ends.",
        "See how damping makes the swing smaller over time.",
      ],
      tryThis: [
        "Turn damping on/off and compare.",
        "Change gravity to see how it affects the swing.",
      ],
    },
    high: {
      title: "Simple Pendulum (Class 11/12)",
      simpleMeaning: [
        "For small angles, motion is close to SHM.",
        "Period (approx): T = 2π √(L/g).",
        "Damping reduces amplitude with time.",
      ],
      whatToWatch: [
        "T depends mainly on L and g.",
        "Amplitude changes the energy, but small-angle period stays similar.",
      ],
      tryThis: [
        "Double L and observe period change.",
        "Lower g and observe period increase.",
      ],
    },
    college: {
      title: "Pendulum (college)",
      simpleMeaning: [
        "Nonlinear model: θ'' + (b)θ' + (g/L)sinθ = 0.",
        "Small-angle: sinθ ≈ θ → SHM approximation.",
        "Energy swaps between PE and KE.",
      ],
      whatToWatch: [
        "Large angles behave slightly differently than the small-angle model.",
        "Damping causes energy loss.",
      ],
      tryThis: [
        "Compare small vs large starting angles.",
        "Try damping and observe energy decrease.",
      ],
    },
  },

  "simple-harmonic-motion": {
    primary: {
      title: "SHM (easy)",
      simpleMeaning: [
        "SHM means moving back and forth in a repeating way.",
        "A spring pulls an object back toward the middle.",
        "The motion repeats in equal time steps (period).",
      ],
      whatToWatch: [
        "Fastest at the center, slowest at the ends.",
        "Always pulled toward the center.",
      ],
      tryThis: [
        "Make the spring stronger and see it oscillate faster.",
        "Add damping and watch it stop slowly.",
      ],
    },
    middle: {
      title: "Simple Harmonic Motion",
      simpleMeaning: [
        "Restoring force points toward the equilibrium position.",
        "Bigger spring constant k makes it oscillate faster.",
        "Bigger mass m makes it oscillate slower.",
      ],
      whatToWatch: [
        "The graph of displacement looks like a wave.",
        "Damping makes the wave shrink over time.",
      ],
      tryThis: [
        "Increase k, then increase m, and compare period.",
        "Try a larger amplitude and see the same rhythm.",
      ],
    },
    high: {
      title: "SHM (Class 11/12)",
      simpleMeaning: [
        "Equation: x'' + (k/m)x = 0 (no damping).",
        "Angular frequency: ω = √(k/m).",
        "Period: T = 2π/ω.",
      ],
      whatToWatch: [
        "T depends on m and k, not on amplitude (ideal).",
        "Energy swaps between KE and spring PE.",
      ],
      tryThis: [
        "Double m and observe slower oscillations.",
        "Double k and observe faster oscillations.",
      ],
    },
    college: {
      title: "SHM (college)",
      simpleMeaning: [
        "Damped model: x'' + (c/m)x' + (k/m)x = 0.",
        "Light damping keeps oscillations but decreases amplitude.",
        "Study phase, frequency shift, and energy decay.",
      ],
      whatToWatch: [
        "Compare undamped vs damped motion.",
        "Observe how frequency changes slightly with damping.",
      ],
      tryThis: [
        "Increase damping gradually until motion almost stops oscillating.",
        "Compare measured period with 2π√(m/k).",
      ],
    },
  },
};
