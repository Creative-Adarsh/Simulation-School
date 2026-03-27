"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, MiniHint } from "../components/ui";

type Frame = {
    values: number[];
    curr: number | null; // index
    prev: number | null; // index
    highlight: number[]; // indices
    message: string;
};

function layoutPositions(n: number) {
    const startX = 70;
    const y = 90;
    const gap = 150;
    return Array.from({ length: n }, (_, i) => ({ x: startX + i * gap, y }));
}

function makeInsertFrames(values: number[], index: number, value: number): Frame[] {
    const frames: Frame[] = [];
    const n = values.length;

    if (index < 0 || index > n) {
        return [{ values, curr: null, prev: null, highlight: [], message: "Invalid index." }];
    }

    // traverse to (index-1)
    if (index === 0) {
        frames.push({
            values,
            curr: 0,
            prev: null,
            highlight: [0],
            message: "Insert at head: new node becomes the first node."
        });
        const next = values.slice();
        next.splice(0, 0, value);
        frames.push({
            values: next,
            curr: 0,
            prev: null,
            highlight: [0],
            message: "Pointer update: head now points to the new node."
        });
        return frames;
    }

    for (let k = 0; k < index; k++) {
        frames.push({
            values,
            curr: k,
            prev: k - 1 >= 0 ? k - 1 : null,
            highlight: [k],
            message: k === 0 ? "Start at head (curr)." : "Move curr to next node."
        });
    }

    frames.push({
        values,
        curr: index - 1,
        prev: index - 2,
        highlight: [index - 1],
        message: "We reached the node BEFORE the insert position (prev)."
    });

    frames.push({
        values,
        curr: index - 1,
        prev: index - 2,
        highlight: [index - 1],
        message: "Create new node. New node should point to prev.next."
    });

    const next = values.slice();
    next.splice(index, 0, value);

    frames.push({
        values: next,
        curr: index,
        prev: index - 1,
        highlight: [index - 1, index],
        message: "Pointer update: prev.next is set to the new node (list is updated)."
    });

    return frames;
}

function makeDeleteFrames(values: number[], index: number): Frame[] {
    const frames: Frame[] = [];
    const n = values.length;

    if (n === 0) return [{ values, curr: null, prev: null, highlight: [], message: "List is empty." }];
    if (index < 0 || index >= n) return [{ values, curr: null, prev: null, highlight: [], message: "Invalid index." }];

    if (index === 0) {
        frames.push({
            values,
            curr: 0,
            prev: null,
            highlight: [0],
            message: "Delete head: head moves to the next node."
        });
        const next = values.slice();
        next.splice(0, 1);
        frames.push({
            values: next,
            curr: 0,
            prev: null,
            highlight: [0],
            message: "Pointer update done: old head removed."
        });
        return frames;
    }

    for (let k = 0; k <= index; k++) {
        frames.push({
            values,
            curr: k,
            prev: k - 1,
            highlight: [k],
            message: k === 0 ? "Start at head." : "Move curr to next node."
        });
    }

    frames.push({
        values,
        curr: index,
        prev: index - 1,
        highlight: [index - 1, index],
        message: "We reached the node to delete (curr). Prev should skip curr."
    });

    const next = values.slice();
    next.splice(index, 1);

    frames.push({
        values: next,
        curr: Math.min(index, next.length - 1),
        prev: index - 1,
        highlight: [index - 1],
        message: "Pointer update: prev.next is changed to curr.next (node removed)."
    });

    return frames;
}

function makeSearchFrames(values: number[], target: number): Frame[] {
    const frames: Frame[] = [];
    for (let k = 0; k < values.length; k++) {
        frames.push({
            values,
            curr: k,
            prev: k - 1,
            highlight: [k],
            message: `Check node ${k}. Is value = ${target}?`
        });
        if (values[k] === target) {
            frames.push({
                values,
                curr: k,
                prev: k - 1,
                highlight: [k],
                message: `Found ${target} at index ${k}.`
            });
            return frames;
        }
    }
    frames.push({ values, curr: null, prev: null, highlight: [], message: `Not found: ${target}` });
    return frames;
}

export default function LinkedListSim() {
    const [baseValues, setBaseValues] = useState<number[]>([10, 20, 30, 40]);

    // operation playback
    const [frames, setFrames] = useState<Frame[] | null>(null);
    const [frameIndex, setFrameIndex] = useState(0);
    const [running, setRunning] = useState(false);
    const [speedMs, setSpeedMs] = useState(350);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // inputs
    const [insValue, setInsValue] = useState("99");
    const [insIndex, setInsIndex] = useState("2");

    const [delIndex, setDelIndex] = useState("1");

    const [findValue, setFindValue] = useState("30");

    const current = frames ? frames[frameIndex] : { values: baseValues, curr: null, prev: null, highlight: [], message: "Ready." };
    const values = current.values;

    const positions = useMemo(() => layoutPositions(values.length), [values.length]);

    const log = useMemo(() => {
        if (!frames) return ["Tip: Use Insert/Delete/Search, then Step or Play."];
        const start = Math.max(0, frameIndex - 5);
        return frames.slice(start, frameIndex + 1).map((f) => f.message);
    }, [frames, frameIndex]);

    const done = frames ? frameIndex >= frames.length - 1 : true;

    const stopAuto = () => {
        setRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
    };

    const nextStep = () => {
        if (!frames) return;
        if (frameIndex < frames.length - 1) {
            setFrameIndex((x) => x + 1);
        } else {
            // finalize
            setBaseValues(frames[frames.length - 1].values);
            setFrames(null);
            setFrameIndex(0);
            stopAuto();
        }
    };

    useEffect(() => {
        if (!running) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
            return;
        }
        intervalRef.current = setInterval(nextStep, speedMs);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [running, speedMs, frames, frameIndex]);

    const startFrames = (f: Frame[]) => {
        stopAuto();
        setFrames(f);
        setFrameIndex(0);
    };

    const resetAll = () => {
        stopAuto();
        setFrames(null);
        setFrameIndex(0);
        setBaseValues([10, 20, 30, 40]);
    };

    return (
        <Card
            title="Linked List (step-by-step)"
            subtitle="See traversal and pointer updates as messages + highlights."
            right={
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setRunning((x) => !x)} disabled={!frames}>
                        {running ? "Pause" : "Play"}
                    </Button>
                    <Button variant="secondary" onClick={nextStep} disabled={!frames}>
                        Step
                    </Button>
                    <Button variant="secondary" onClick={resetAll}>
                        Reset
                    </Button>
                </div>
            }
        >
            <div className="grid gap-4 md:grid-cols-[1fr_380px]">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <svg width="100%" viewBox={`0 0 ${Math.max(700, 70 + values.length * 150)} 240`} preserveAspectRatio="xMidYMid meet">
                        <text x={18} y={40} fontFamily="system-ui" fontSize="16" fill="#0f172a">
                            head
                        </text>

                        {positions.map((p, i) => {
                            const isHi = current.highlight.includes(i);
                            const isCurr = current.curr === i;
                            const isPrev = current.prev === i;

                            const stroke = isHi ? "#f59e0b" : "#4f46e5";
                            const fill = isHi ? "#fffbeb" : "#eef2ff";

                            return (
                                <g key={i}>
                                    {/* pointer labels */}
                                    {i === 0 && (
                                        <text x={p.x + 10} y={p.y - 18} fontFamily="system-ui" fontSize="12" fill="#0f172a">
                                            HEAD
                                        </text>
                                    )}
                                    {isPrev && (
                                        <text x={p.x + 10} y={p.y - 34} fontFamily="system-ui" fontSize="12" fill="#0f172a">
                                            prev
                                        </text>
                                    )}
                                    {isCurr && (
                                        <text x={p.x + 10} y={p.y - 50} fontFamily="system-ui" fontSize="12" fill="#0f172a">
                                            curr
                                        </text>
                                    )}

                                    <rect x={p.x} y={p.y} width={95} height={52} rx={12} fill={fill} stroke={stroke} strokeWidth={2} />
                                    <text x={p.x + 47.5} y={p.y + 33} textAnchor="middle" fontFamily="system-ui" fontSize="16" fill="#0f172a">
                                        {values[i]}
                                    </text>
                                </g>
                            );
                        })}

                        {/* arrows */}
                        {positions.map((p, i) => {
                            if (i === positions.length - 1) return null;
                            const p2 = positions[i + 1];
                            const x1 = p.x + 95;
                            const y1 = p.y + 26;
                            const x2 = p2.x;
                            const y2 = p2.y + 26;

                            return (
                                <g key={`a-${i}`}>
                                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0f172a" strokeWidth="2" />
                                    <polygon points={`${x2},${y2} ${x2 - 10},${y2 - 6} ${x2 - 10},${y2 + 6}`} fill="#0f172a" />
                                </g>
                            );
                        })}
                    </svg>

                    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                        <div className="font-semibold text-slate-900">Current step</div>
                        <div className="mt-1">{current.message}</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <MiniHint>
                        <div className="font-semibold text-slate-900">In simple words</div>
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                            <li>A linked list is nodes connected by “next” pointers.</li>
                            <li>To insert/delete, you don’t shift elements— you change links.</li>
                            <li>Traversal is step-by-step: head → next → next …</li>
                        </ul>
                    </MiniHint>

                    <div className="rounded-2xl border border-slate-200 bg-white p-3">
                        <div className="text-sm font-semibold text-slate-900">Operations</div>

                        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                            <div className="text-sm font-semibold text-slate-900">Insert</div>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                <label className="space-y-1">
                                    <div className="text-slate-600">Value</div>
                                    <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" value={insValue} onChange={(e) => setInsValue(e.target.value)} />
                                </label>
                                <label className="space-y-1">
                                    <div className="text-slate-600">Index</div>
                                    <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" value={insIndex} onChange={(e) => setInsIndex(e.target.value)} />
                                </label>
                            </div>
                            <div className="mt-2">
                                <Button
                                    variant="secondary"
                                    onClick={() => startFrames(makeInsertFrames(baseValues, Number(insIndex), Number(insValue)))}
                                >
                                    Prepare insert steps
                                </Button>
                            </div>
                        </div>

                        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                            <div className="text-sm font-semibold text-slate-900">Delete (by index)</div>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                <label className="space-y-1">
                                    <div className="text-slate-600">Index</div>
                                    <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" value={delIndex} onChange={(e) => setDelIndex(e.target.value)} />
                                </label>
                                <div />
                            </div>
                            <div className="mt-2">
                                <Button variant="secondary" onClick={() => startFrames(makeDeleteFrames(baseValues, Number(delIndex)))}>
                                    Prepare delete steps
                                </Button>
                            </div>
                        </div>

                        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                            <div className="text-sm font-semibold text-slate-900">Search</div>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                <label className="space-y-1">
                                    <div className="text-slate-600">Value</div>
                                    <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" value={findValue} onChange={(e) => setFindValue(e.target.value)} />
                                </label>
                                <div />
                            </div>
                            <div className="mt-2">
                                <Button variant="secondary" onClick={() => startFrames(makeSearchFrames(baseValues, Number(findValue)))}>
                                    Prepare search steps
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="text-sm font-semibold text-slate-900">Playback</div>
                        <div className="mt-3 text-sm">
                            Speed: <b>{speedMs}ms</b>
                            <input className="mt-1 w-full" type="range" min={120} max={900} step={10} value={speedMs} onChange={(e) => setSpeedMs(parseInt(e.target.value, 10))} />
                        </div>
                        <div className="mt-3 text-xs text-slate-600">
                            When you reach the last step, the list updates and the operation ends.
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-3">
                        <div className="text-sm font-semibold text-slate-900">Operation log</div>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                            {log.map((x, i) => (
                                <li key={i}>{x}</li>
                            ))}
                        </ul>
                    </div>

                    <MiniHint>
                        <div className="font-semibold text-slate-900">Time complexity (quick)</div>
                        <div className="mt-2 space-y-1">
                            <div>Traversal/search: <b>O(n)</b></div>
                            <div>Insert/delete: <b>O(1)</b> after reaching the position (but reaching is usually O(n))</div>
                        </div>
                    </MiniHint>
                </div>
            </div>
        </Card>
    );
}