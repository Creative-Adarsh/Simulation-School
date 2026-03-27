```md
<div align="center">

# SimSchool

### Learn complex concepts through interactive, visual simulations

<p>
  <strong>SimSchool</strong> is a modern simulation-based learning platform that helps students understand difficult topics through dynamic, intuitive, and hands-on visual experiences.
</p>

<p>
  <a href="https://simulation-school.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Now-000000?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
  <a href="https://github.com/Creative-Adarsh/Simulation-School">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/pnpm-Monorepo-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm Monorepo" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel" alt="Vercel" />
</p>

<p>
  <a href="#live-demo">Live Demo</a> •
  <a href="#overview">Overview</a> •
  <a href="#why-simschool">Why SimSchool</a> •
  <a href="#features">Features</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a>
</p>

</div>

---

<p align="center">
  <img src="preview/Home.png" alt="SimSchool Home" width="1000" />
</p>

---

## Live Demo

<div align="center">

### 🌐 Production URL  
[https://simulation-school.vercel.app/](https://simulation-school.vercel.app/)

</div>

---

## Overview

SimSchool is built for students and learners who understand better when they can **see a concept working**, **interact with it**, and **experiment with it in real time**.

Rather than relying only on static explanations, SimSchool transforms complex subjects into **visual simulation experiences** that make learning more intuitive, memorable, and engaging.

It is especially useful for learners who prefer:
- visual understanding over passive reading
- concept exploration over memorization
- interactive learning over static theory
- real intuition over surface-level familiarity

---

## Why SimSchool?

Traditional learning often explains dynamic ideas using static content.

That creates a major gap:
- motion is taught without movement
- algorithms are taught without step-by-step visualization
- systems are explained without interaction
- understanding is expected without exploration

SimSchool closes that gap by creating a space where learners can:
- search for topics
- open simulations instantly
- visualize the concept in action
- build intuition through interaction

In short, **SimSchool makes difficult ideas feel understandable**.

---

## Features

<div align="center">

| Feature | Description |
|---|---|
| Interactive Simulations | Explore concepts visually instead of only reading theory |
| Concept Search | Search and navigate simulations quickly |
| Multi-domain Learning | Covers Physics and DSA-based topics |
| Modern Web Experience | Fast and responsive UI with Next.js |
| Mobile App Foundation | Expo-powered mobile support for future expansion |
| Shared Core Package | Reusable simulation logic through a monorepo package |
| API Integration | Route handlers for simulation resolution and backend logic |
| Supabase Support | Connected backend utilities and service integration |
| AI-Assisted Logic | Topic-to-simulation resolution pipeline |

</div>

---

## Current Simulations

SimSchool currently includes interactive modules such as:

- **Bubble Sort**
- **Linked List**
- **Circular Motion**
- **Pendulum**
- **Projectile Motion**
- **Simple Harmonic Motion**

These simulations help learners understand:
- physical systems and movement
- oscillation and motion behavior
- algorithmic flow
- data structure mechanics
- concept relationships through interaction

---

## Screenshots

<div align="center">

### Home Experience

<p>
  <img src="preview/Home.png" alt="SimSchool Home Page" width="1000" />
</p>

<p>
  The landing experience allows learners to search for topics and quickly access available simulations through a clean, focused interface.
</p>

---

### Bubble Sort Simulation

<p>
  <img src="preview/Bubble Sort.png" alt="Bubble Sort Simulation" width="1000" />
</p>

<p>
  A visual and interactive way to understand how sorting works step by step, making algorithm behavior easier to follow.
</p>

---

### Circular Motion Simulation

<p>
  <img src="preview/Circular Motion.png" alt="Circular Motion Simulation" width="1000" />
</p>

<p>
  Designed to help learners understand rotational behavior, angular movement, and related physics concepts through motion-based visualization.
</p>

---

### Simple Harmonic Motion Simulation

<p>
  <img src="preview/Simple Harmonic Motion.png" alt="Simple Harmonic Motion Simulation" width="1000" />
</p>

<p>
  Helps students intuitively grasp oscillation, restoring forces, and repetitive motion patterns through interactive simulation.
</p>

</div>

---

## Architecture

SimSchool is structured as a **pnpm monorepo**, allowing multiple applications and shared packages to live in a unified codebase.

This architecture makes the project easier to scale, maintain, and extend across platforms.

### High-Level Structure

```bash
simschool/
├── apps/
│   ├── api/
│   ├── mobile/
│   └── web/
├── packages/
│   └── sim-core/
├── tools/
├── pnpm-workspace.yaml
└── package.json
```

---

## Project Breakdown

### `apps/web`
The main web application built with **Next.js**.

It includes:
- homepage and search experience
- simulation browsing
- simulation pages
- API route handlers
- simulation registry and UI logic

### `apps/mobile`
A mobile app built with **Expo / React Native**, laying the foundation for portable, cross-platform learning experiences.

### `apps/api`
A dedicated area for backend/API expansion and service separation.

### `packages/sim-core`
A shared package for reusable simulation logic and common abstractions across applications.

### `tools`
Project utilities and development support tooling.

---

## Web App Structure

```bash
apps/web/app/
├── api/
│   ├── _lib/
│   │   ├── ai-resolve.ts
│   │   └── supabase-admin.ts
│   ├── db-test/
│   └── resolve-sim/
├── simulate/
│   ├── components/
│   ├── sims/
│   │   ├── bubble-sort.tsx
│   │   ├── circular-motion.tsx
│   │   ├── linked-list.tsx
│   │   ├── pendulum.tsx
│   │   ├── projectile-motion.tsx
│   │   └── simple-harmonic-motion.tsx
│   ├── content.ts
│   ├── sim-registry.ts
│   └── simulate-client.tsx
├── globals.css
├── home-client.tsx
├── layout.tsx
└── page.tsx
```

---

## Tech Stack

<div align="center">

| Layer | Technologies |
|---|---|
| Web | Next.js, React, TypeScript |
| Mobile | Expo, React Native |
| Backend/API | Next.js Route Handlers |
| Validation | Zod |
| Backend Services | Supabase |
| Styling | Tailwind CSS, PostCSS |
| Tooling | pnpm Workspaces, ESLint |

</div>

---

## Design Philosophy

SimSchool is designed around one core principle:

> **If a learner can interact with a concept, they can understand it more deeply.**

That philosophy drives:
- simulation-first learning
- intuitive interfaces
- minimal friction exploration
- concept-centered product design

---

## Getting Started

### Prerequisites

Before running the project, make sure you have:

- **Node.js 18+**
- **pnpm 10+**

Install pnpm if needed:

```bash
npm install -g pnpm
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Creative-Adarsh/Simulation-School.git
cd Simulation-School
```

Install all dependencies from the root:

```bash
pnpm install
```

---

## Run Locally

### Web App

```bash
cd apps/web
pnpm dev
```

Then open:

```bash
http://localhost:3000
```

### Mobile App

```bash
cd apps/mobile
pnpm start
```

---

## Root Workspace Commands

From the project root:

```bash
pnpm dev:web
pnpm dev:mobile
pnpm dev:api
```

---

## Environment Variables

The project contains backend utility files such as:

- `apps/web/app/api/_lib/supabase-admin.ts`
- `apps/web/app/api/_lib/ai-resolve.ts`

This indicates that environment variables are required for services like:
- Supabase
- backend/admin access
- AI-related integration

Create a local environment file in:

```bash
apps/web/.env.local
```

Example placeholders:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
AI_API_KEY=your_ai_api_key
```

> Never commit real secrets into the repository.

---

## Deployment

SimSchool is deployed on **Vercel**.

<div align="center">

### 🚀 Live Application  
[https://simulation-school.vercel.app/](https://simulation-school.vercel.app/)

</div>

### Deployment Notes
- Framework: **Next.js**
- Root Directory: `apps/web`
- Package Manager: **pnpm**
- Structure: **Monorepo**

---

## Use Cases

SimSchool can be useful for:

- students learning difficult topics visually
- beginners understanding algorithm behavior
- educators demonstrating concepts interactively
- self-learners building conceptual intuition
- edtech prototypes and learning platforms

---

## Roadmap

Planned improvements and future directions may include:

- more simulations across subjects
- improved search and topic mapping
- user profiles and progress tracking
- richer mobile experience
- personalized learning paths
- broader AI-assisted educational features
- analytics and learning insights

---

## Contributing

Contributions, ideas, and improvements are welcome.

To contribute:

```bash
git checkout -b feature/your-feature-name
```

Then:
1. make your changes
2. commit clearly
3. push your branch
4. open a pull request

---

## Author

<div align="center">

### Adarsh  
GitHub: [@Creative-Adarsh](https://github.com/Creative-Adarsh)

</div>

---

<div align="center">

### Built to make learning more visual, intuitive, and interactive.

</div>

## License

This project is licensed under the **Apache License 2.0**.  
See the [LICENSE](./LICENSE) file for details.
```