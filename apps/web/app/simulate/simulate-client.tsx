"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Input, Pill, Select } from "./components/ui";
import { SIM_TEMPLATES, SimId } from "./sim-registry";

import CircularMotionSim from "./sims/circular-motion";
import ProjectileMotionSim from "./sims/projectile-motion";
import LinkedListSim from "./sims/linked-list";
import BubbleSortSim from "./sims/bubble-sort";
import PendulumSim from "./sims/pendulum";
import SHMSim from "./sims/simple-harmonic-motion";

type ResolveOk = {
    ok: true;
    prompt: string;
    grade: number;
    simId: SimId;
    source: "ai" | "cache" | "fallback" | "forced";
    content: {
        title: string;
        simpleMeaning: string[];
        whatToWatch: string[];
        tryThis: string[];
    };
};

type ResolveFail = {
    ok: false;
    prompt: string;
    message: string;
    suggestions: { id: SimId; title: string; subject: string }[];
};

export default function SimulateClient({
    initialTopic,
    initialSim
}: {
    initialTopic: string;
    initialSim: string;
}) {
    // Get the template title from the sim ID if forceSimId is provided
    const getInitialPrompt = () => {
        if (initialSim) {
            const template = SIM_TEMPLATES.find(t => t.id === initialSim);
            if (template) return template.title;
        }
        return initialTopic || "";
    };

    const [prompt, setPrompt] = useState(getInitialPrompt);
    const [grade, setGrade] = useState(6);

    // If user came from Home by clicking a template, we lock to that sim initially.
    const [forceSimId, setForceSimId] = useState<string>((initialSim ?? "").trim());

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ResolveOk | ResolveFail | null>(null);

    const simId = result && result.ok ? result.simId : null;

    async function resolveNow(p: string, g: number, forcedId?: string) {
        setLoading(true);
        try {
            const f = (forcedId ?? "").trim();
            const url = f
                ? `/api/resolve-sim?prompt=${encodeURIComponent(p)}&grade=${g}&forceSimId=${encodeURIComponent(f)}`
                : `/api/resolve-sim?prompt=${encodeURIComponent(p)}&grade=${g}`;

            const res = await fetch(url);
            const data = await res.json();
            setResult(data);
        } finally {
            setLoading(false);
        }
    }

    // Initial load: if initialSim exists, force it; else normal prompt.
    useEffect(() => {
        resolveNow(prompt, grade, forceSimId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sourceBadge = useMemo(() => {
        if (!result || !result.ok) return null;

        if (result.source === "forced") {
            return (
                <Badge className="border-violet-200 bg-violet-50 text-violet-700">
                    Forced
                </Badge>
            );
        }

        if (result.source === "ai") {
            return (
                <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                    AI
                </Badge>
            );
        }
        if (result.source === "cache") {
            return (
                <Badge className="border-sky-200 bg-sky-50 text-sky-700">
                    Cache
                </Badge>
            );
        }
        return (
            <Badge className="border-amber-200 bg-amber-50 text-amber-700">
                Fallback
            </Badge>
        );
    }, [result]);

    return (
        <div className="space-y-4">
            <Card
                title="SimSchool — Simulations"
                subtitle={
                    forceSimId
                        ? "This simulation was opened from Home (locked). Start typing to unlock and search normally."
                        : "Type a prompt and we’ll select the best simulation + explanation."
                }
                right={
                    <div className="w-40">
                        <Select
                            value={grade}
                            onChange={(e) => {
                                const g = parseInt(e.target.value, 10);
                                setGrade(g);
                                // re-resolve when grade changes (keeps content aligned)
                                resolveNow(prompt, g, forceSimId);
                            }}
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                                <option key={g} value={g}>
                                    Class {g}
                                </option>
                            ))}
                            <option value={13}>College</option>
                        </Select>
                    </div>
                }
            >
                <div className="grid gap-3 md:grid-cols-[1fr_240px] md:items-end">
                    <div>
                        <div className="text-sm font-medium text-slate-800">Your request</div>
                        <div className="mt-1">
                            <Input
                                value={prompt}
                                onChange={(e) => {
                                    setPrompt(e.target.value);
                                    // If user types, unlock forced sim selection
                                    if (forceSimId) setForceSimId("");
                                }}
                                placeholder="Example: explain pendulum for class 8"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") resolveNow(prompt, grade, forceSimId);
                                }}
                            />
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {SIM_TEMPLATES.map((t) => (
                                <Pill
                                    key={t.id}
                                    onClick={() => {
                                        setPrompt(t.title);
                                        setForceSimId(""); // pills should behave like normal search
                                        resolveNow(t.title, grade, "");
                                    }}
                                >
                                    {t.title}
                                </Pill>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Button
                            onClick={() => resolveNow(prompt, grade, forceSimId)}
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Generating..." : "Get Simulation"}
                        </Button>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
                            <div className="flex items-center justify-between">
                                <div className="text-slate-600">Selected</div>
                                {sourceBadge}
                            </div>
                            <div className="mt-1 font-semibold text-slate-900">
                                {simId ?? "—"}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {result && result.ok && (
                <Card title={result.content.title} subtitle="Explanation">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <div className="text-sm font-semibold text-slate-900">
                                In simple words
                            </div>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                                {result.content.simpleMeaning.map((x, i) => (
                                    <li key={i}>{x}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <div className="text-sm font-semibold text-slate-900">
                                What to watch
                            </div>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                                {result.content.whatToWatch.map((x, i) => (
                                    <li key={i}>{x}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <div className="text-sm font-semibold text-slate-900">Try this</div>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                                {result.content.tryThis.map((x, i) => (
                                    <li key={i}>{x}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Card>
            )}

            {simId === "circular-motion" && <CircularMotionSim />}
            {simId === "projectile-motion" && <ProjectileMotionSim />}
            {simId === "linked-list" && <LinkedListSim />}
            {simId === "bubble-sort" && <BubbleSortSim />}
            {simId === "pendulum" && <PendulumSim />}
            {simId === "simple-harmonic-motion" && <SHMSim />}

            {result && !result.ok && (
                <Card
                    title="No template found"
                    subtitle="AI could not match this request to our current simulation library."
                >
                    <div className="text-sm text-slate-700">{result.message}</div>
                    <div className="mt-3 text-sm font-semibold">Try:</div>
                    <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
                        {result.suggestions.map((s) => (
                            <li key={s.id}>
                                {s.title} ({s.subject})
                            </li>
                        ))}
                    </ul>
                </Card>
            )}
        </div>
    );
}