"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, MiniHint } from "../components/ui";

function randomArray(n: number) {
    return Array.from({ length: n }, () => Math.floor(10 + Math.random() * 90));
}

type Model = {
    arr: number[];
    i: number; // pass
    j: number; // index inside pass
    swappedInPass: boolean;
    comparisons: number;
    swaps: number;
    passes: number;
    done: boolean;
};

function initModel(n: number): Model {
    return {
        arr: randomArray(n),
        i: 0,
        j: 0,
        swappedInPass: false,
        comparisons: 0,
        swaps: 0,
        passes: 0,
        done: false
    };
}

function stepModel(m: Model): Model {
    const n = m.arr.length;
    if (m.done || n <= 1) return { ...m, done: true };

    let { i, j, swappedInPass, comparisons, swaps, passes } = m;
    let done = false;

    const arr = m.arr.slice();

    comparisons += 1;
    if (arr[j] > arr[j + 1]) {
        const tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
        swaps += 1;
        swappedInPass = true;
    }

    j += 1;

    const endOfPass = j >= n - 1 - i;
    if (endOfPass) {
        passes += 1;

        // early exit
        if (!swappedInPass) {
            done = true;
        } else {
            i += 1;
            j = 0;
            swappedInPass = false;
            if (i >= n - 1) done = true;
        }
    }

    return { arr, i, j, swappedInPass, comparisons, swaps, passes, done };
}

export default function BubbleSortSim() {
    const [size, setSize] = useState(12);
    const [speedMs, setSpeedMs] = useState(220);
    const [running, setRunning] = useState(false);
    const [m, setM] = useState<Model>(() => initModel(12));

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const n = m.arr.length;
    const comparedA = m.done ? -1 : m.j;
    const comparedB = m.done ? -1 : m.j + 1;
    const sortedFrom = n - m.i;

    const maxVal = useMemo(() => Math.max(...m.arr, 1), [m.arr]);

    const reset = (newSize = size) => {
        setRunning(false);
        setM(initModel(newSize));
    };

    const step = () => setM((prev) => stepModel(prev));

    useEffect(() => {
        if (!running) {
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = null;
            return;
        }

        timerRef.current = setInterval(() => {
            setM((prev) => stepModel(prev));
        }, speedMs);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [running, speedMs]);

    // auto-stop when done
    useEffect(() => {
        if (m.done) setRunning(false);
    }, [m.done]);

    return (
        <Card
            title="Bubble Sort"
            subtitle="Play/step the algorithm. Track comparisons, swaps, passes. Includes early-exit."
            right={
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setRunning((x) => !x)} disabled={m.done}>
                        {running ? "Pause" : "Play"}
                    </Button>
                    <Button variant="secondary" onClick={() => reset()}>
                        Reset
                    </Button>
                </div>
            }
        >
            <div className="grid gap-4 md:grid-cols-[1fr_360px]">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex h-72 items-end gap-2">
                        {m.arr.map((v, idx) => {
                            const isCompared = idx === comparedA || idx === comparedB;
                            const isSorted = idx >= sortedFrom;
                            const height = Math.round((v / maxVal) * 100) * 2;

                            const color = isCompared
                                ? "bg-amber-400"
                                : isSorted
                                    ? "bg-emerald-400"
                                    : "bg-sky-500";

                            return (
                                <div key={idx} className="flex-1">
                                    <div className={`w-full rounded-xl ${color}`} style={{ height }} title={String(v)} />
                                    <div className="mt-1 text-center text-xs text-slate-600">{v}</div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-700">
                        <span>
                            Comparing: <b>{m.done ? "—" : `${comparedA} & ${comparedB}`}</b>
                        </span>
                        <span className="text-slate-400">|</span>
                        <span>
                            Passes: <b>{m.passes}</b>
                        </span>
                        <span className="text-slate-400">|</span>
                        <span>
                            Done: <b>{m.done ? "Yes" : "No"}</b>
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <MiniHint>
                        <div className="font-semibold text-slate-900">How it works</div>
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                            <li>Compare neighbors and swap if out of order.</li>
                            <li>After each pass, the largest value moves to the end.</li>
                            <li>If a full pass has no swaps, sorting stops early.</li>
                        </ul>
                    </MiniHint>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="text-sm font-semibold text-slate-900">Controls</div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <Button variant="secondary" onClick={step} disabled={m.done}>
                                Step
                            </Button>
                            <Button variant="secondary" onClick={() => reset(size)}>
                                Randomize
                            </Button>
                        </div>

                        <div className="mt-3 text-sm">
                            Speed: <b>{speedMs}ms</b>
                            <input
                                className="mt-1 w-full"
                                type="range"
                                min={60}
                                max={800}
                                step={10}
                                value={speedMs}
                                onChange={(e) => setSpeedMs(parseInt(e.target.value, 10))}
                            />
                        </div>

                        <div className="mt-3 text-sm">
                            Size: <b>{size}</b>
                            <input
                                className="mt-1 w-full"
                                type="range"
                                min={5}
                                max={24}
                                value={size}
                                onChange={(e) => {
                                    const newSize = parseInt(e.target.value, 10);
                                    setSize(newSize);
                                    reset(newSize);
                                }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-3">
                            <div className="text-xs text-slate-500">Comparisons</div>
                            <div className="mt-1 text-sm font-semibold">{m.comparisons}</div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-3">
                            <div className="text-xs text-slate-500">Swaps</div>
                            <div className="mt-1 text-sm font-semibold">{m.swaps}</div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-3">
                            <div className="text-xs text-slate-500">Passes</div>
                            <div className="mt-1 text-sm font-semibold">{m.passes}</div>
                        </div>
                    </div>

                    <MiniHint>
                        <div className="font-semibold text-slate-900">Complexity</div>
                        <div className="mt-2 space-y-1">
                            <div>Worst-case time: <b>O(n²)</b></div>
                            <div>Extra space: <b>O(1)</b></div>
                            <div>Stable: <b>Yes</b></div>
                        </div>
                    </MiniHint>
                </div>
            </div>
        </Card>
    );
}