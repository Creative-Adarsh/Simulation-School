"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, Button, MiniHint } from "../components/ui";
import { setupHiDPICanvas } from "./canvas-utils";

export default function CircularMotionSim() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [radius, setRadius] = useState(130); // px
    const [omega, setOmega] = useState(1.4); // rad/s
    const [showVectors, setShowVectors] = useState(true);
    const [trace, setTrace] = useState(true);
    const [running, setRunning] = useState(true);

    // store trace points (in component state would rerender too much; use ref)
    const traceRef = useRef<{ x: number; y: number }[]>([]);
    const t0Ref = useRef<number>(performance.now());
    const pausedAtRef = useRef<number | null>(null);

    const speed = useMemo(() => omega * radius, [omega, radius]);
    const centripetalA = useMemo(() => omega * omega * radius, [omega, radius]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let raf = 0;

        const arrow = (x1: number, y1: number, x2: number, y2: number, color: string) => {
            const head = 10;
            const dx = x2 - x1;
            const dy = y2 - y1;
            const ang = Math.atan2(dy, dx);

            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - head * Math.cos(ang - Math.PI / 6), y2 - head * Math.sin(ang - Math.PI / 6));
            ctx.lineTo(x2 - head * Math.cos(ang + Math.PI / 6), y2 - head * Math.sin(ang + Math.PI / 6));
            ctx.closePath();
            ctx.fill();
        };

        const render = () => {
            const now = performance.now();

            const { w, h } = setupHiDPICanvas(canvas, ctx);
            const cx = w / 2;
            const cy = h / 2;

            // time handling for pause/resume
            let t = (now - t0Ref.current) / 1000;
            if (!running) {
                if (pausedAtRef.current === null) pausedAtRef.current = now;
                t = (pausedAtRef.current - t0Ref.current) / 1000;
            } else {
                if (pausedAtRef.current !== null) {
                    // shift start time so animation continues smoothly
                    t0Ref.current += now - pausedAtRef.current;
                    pausedAtRef.current = null;
                    t = (now - t0Ref.current) / 1000;
                }
            }

            const theta = omega * t;

            // clear
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, w, h);

            // orbit
            ctx.strokeStyle = "#94a3b8";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.stroke();

            // point
            const x = cx + radius * Math.cos(theta);
            const y = cy + radius * Math.sin(theta);

            if (trace) {
                const pts = traceRef.current;
                pts.push({ x, y });
                if (pts.length > 450) pts.shift();

                ctx.strokeStyle = "rgba(37, 99, 235, 0.25)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let i = 0; i < pts.length; i++) {
                    const p = pts[i];
                    if (i === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                }
                ctx.stroke();
            }

            // center
            ctx.fillStyle = "#0f172a";
            ctx.beginPath();
            ctx.arc(cx, cy, 4, 0, Math.PI * 2);
            ctx.fill();

            // object
            ctx.fillStyle = "#2563eb";
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.fill();

            if (showVectors) {
                // velocity tangent direction
                const tx = -Math.sin(theta);
                const ty = Math.cos(theta);
                arrow(x, y, x + tx * 80, y + ty * 80, "#16a34a");

                // acceleration toward center
                const ax = cx - x;
                const ay = cy - y;
                const len = Math.sqrt(ax * ax + ay * ay) || 1;
                arrow(x, y, x + (ax / len) * 80, y + (ay / len) * 80, "#dc2626");
            }

            // legend
            ctx.fillStyle = "#0f172a";
            ctx.font = "13px system-ui";
            ctx.fillText("Green = velocity (tangent)", 14, 20);
            ctx.fillText("Red = centripetal acceleration (inward)", 14, 38);

            raf = requestAnimationFrame(render);
        };

        raf = requestAnimationFrame(render);
        return () => cancelAnimationFrame(raf);
    }, [radius, omega, showVectors, trace, running]);

    return (
        <Card
            title="Circular Motion"
            subtitle="Clear vectors + trace + play/pause. Designed for quick understanding."
            right={
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setRunning((x) => !x)}>
                        {running ? "Pause" : "Play"}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            traceRef.current = [];
                            t0Ref.current = performance.now();
                        }}
                    >
                        Reset
                    </Button>
                </div>
            }
        >
            <div className="grid gap-4 md:grid-cols-[1fr_340px]">
                <div className="rounded-2xl border border-slate-200 bg-white p-2">
                    <canvas ref={canvasRef} className="h-110 w-full rounded-xl" />
                </div>

                <div className="space-y-4">
                    <MiniHint>
                        <div className="font-semibold text-slate-900">Core idea</div>
                        <div className="mt-1">
                            Speed can be constant, but direction changes → that’s why acceleration exists.
                        </div>
                    </MiniHint>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="text-sm font-semibold text-slate-900">Controls</div>

                        <div className="mt-3 text-sm text-slate-700">
                            Radius: <b>{radius}px</b>
                            <input
                                className="mt-1 w-full"
                                type="range"
                                min={60}
                                max={180}
                                value={radius}
                                onChange={(e) => setRadius(parseInt(e.target.value, 10))}
                            />
                        </div>

                        <div className="mt-3 text-sm text-slate-700">
                            Angular speed (ω): <b>{omega.toFixed(2)}</b> rad/s
                            <input
                                className="mt-1 w-full"
                                type="range"
                                min={0.2}
                                max={4}
                                step={0.05}
                                value={omega}
                                onChange={(e) => setOmega(parseFloat(e.target.value))}
                            />
                        </div>

                        <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                            <input type="checkbox" checked={showVectors} onChange={(e) => setShowVectors(e.target.checked)} />
                            Show vectors
                        </label>

                        <label className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                            <input type="checkbox" checked={trace} onChange={(e) => setTrace(e.target.checked)} />
                            Show trace
                        </label>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
                        <div className="font-semibold text-slate-900">Quick facts</div>
                        <div className="mt-2">
                            <div>
                                <code>v = ωr</code> → (scaled) v ≈ <b>{speed.toFixed(1)}</b>
                            </div>
                            <div className="mt-1">
                                <code>a = ω²r</code> → (scaled) a ≈ <b>{centripetalA.toFixed(1)}</b>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}