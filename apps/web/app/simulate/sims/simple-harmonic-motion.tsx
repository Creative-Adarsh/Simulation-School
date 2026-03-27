"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, MiniHint } from "../components/ui";
import { setupHiDPICanvas } from "./canvas-utils";

export default function SHMSim() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [running, setRunning] = useState(true);
    const [m, setM] = useState(1.0);
    const [k, setK] = useState(8.0);
    const [damping, setDamping] = useState(0.08);
    const [x0, setX0] = useState(0.8);
    const [showGraph, setShowGraph] = useState(true);

    const xRef = useRef(0);
    const vRef = useRef(0);
    const lastRef = useRef<number>(performance.now());
    const historyRef = useRef<number[]>([]);

    const omega = useMemo(() => Math.sqrt(k / m), [k, m]);
    const period = useMemo(() => (2 * Math.PI) / omega, [omega]);

    const reset = () => {
        xRef.current = x0;
        vRef.current = 0;
        lastRef.current = performance.now();
        historyRef.current = [];
    };

    useEffect(() => {
        reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [m, k, damping, x0]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let raf = 0;

        const render = () => {
            const now = performance.now();
            const { w, h } = setupHiDPICanvas(canvas, ctx);

            // update
            const dtRaw = (now - lastRef.current) / 1000;
            lastRef.current = now;

            const dt = Math.min(dtRaw, 0.04);
            const steps = Math.max(1, Math.floor(dt / 0.005));
            const hStep = dt / steps;

            if (running) {
                for (let s = 0; s < steps; s++) {
                    const x = xRef.current;
                    const v = vRef.current;

                    // x'' = -(k/m)x - c v
                    const a = -(k / m) * x - damping * v;

                    const newV = v + a * hStep;
                    const newX = x + newV * hStep;

                    vRef.current = newV;
                    xRef.current = newX;
                }
            }

            const x = xRef.current;

            // history for graph
            if (showGraph) {
                historyRef.current.push(x);
                if (historyRef.current.length > 260) historyRef.current.shift();
            }

            // draw
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, w, h);

            const midY = h * 0.55;
            const leftWallX = 80;
            const eqX = w * 0.55;

            // convert x (meters-ish) to pixels
            const scale = 140;
            const massX = eqX + x * scale;

            // ground line
            ctx.strokeStyle = "#e2e8f0";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(20, midY + 55);
            ctx.lineTo(w - 20, midY + 55);
            ctx.stroke();

            // wall
            ctx.fillStyle = "#0f172a";
            ctx.fillRect(leftWallX - 14, midY - 30, 10, 100);

            // spring (simple zigzag)
            const springStartX = leftWallX;
            const springEndX = massX - 40;
            const coils = 9;
            const amp = 14;
            ctx.strokeStyle = "#0f172a";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(springStartX, midY);

            for (let i = 1; i < coils; i++) {
                const t = i / coils;
                const xx = springStartX + (springEndX - springStartX) * t;
                const yy = midY + (i % 2 === 0 ? -amp : amp);
                ctx.lineTo(xx, yy);
            }
            ctx.lineTo(springEndX, midY);
            ctx.stroke();

            // equilibrium marker
            ctx.strokeStyle = "rgba(2, 132, 199, 0.45)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(eqX, midY - 55);
            ctx.lineTo(eqX, midY + 75);
            ctx.stroke();

            // mass
            ctx.fillStyle = "#2563eb";
            ctx.beginPath();
            ctx.roundRect(massX - 40, midY - 30, 80, 60, 14);
            ctx.fill();

            // text
            ctx.fillStyle = "#0f172a";
            ctx.font = "13px system-ui";
            ctx.fillText(`x ≈ ${x.toFixed(2)}`, 14, 24);
            ctx.fillText(`T ≈ ${period.toFixed(2)} s`, 14, 44);

            // graph
            if (showGraph) {
                const gx = 16;
                const gy = 70;
                const gw = 260;
                const gh = 110;

                ctx.fillStyle = "rgba(248, 250, 252, 0.95)";
                ctx.strokeStyle = "#e2e8f0";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.roundRect(gx, gy, gw, gh, 12);
                ctx.fill();
                ctx.stroke();

                const hist = historyRef.current;
                const maxAbs = Math.max(0.8, ...hist.map((v) => Math.abs(v)));

                ctx.strokeStyle = "#2563eb";
                ctx.lineWidth = 2;
                ctx.beginPath();
                hist.forEach((v, i) => {
                    const xx = gx + (i / Math.max(1, hist.length - 1)) * gw;
                    const yy = gy + gh / 2 - (v / maxAbs) * (gh * 0.42);
                    if (i === 0) ctx.moveTo(xx, yy);
                    else ctx.lineTo(xx, yy);
                });
                ctx.stroke();

                ctx.fillStyle = "#0f172a";
                ctx.font = "12px system-ui";
                ctx.fillText("x(t)", gx + 10, gy + 18);
            }

            raf = requestAnimationFrame(render);
        };

        raf = requestAnimationFrame(render);
        return () => cancelAnimationFrame(raf);
    }, [running, m, k, damping, x0, showGraph, period]);

    return (
        <Card
            title="Simple Harmonic Motion (Mass–Spring)"
            subtitle="Modern SHM simulation with damping + period + displacement graph."
            right={
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setRunning((x) => !x)}>
                        {running ? "Pause" : "Play"}
                    </Button>
                    <Button variant="secondary" onClick={reset}>
                        Reset
                    </Button>
                </div>
            }
        >
            <div className="grid gap-4 md:grid-cols-[1fr_360px]">
                <div className="rounded-2xl border border-slate-200 bg-white p-2">
                    <canvas ref={canvasRef} className="h-115 w-full rounded-xl" />
                </div>

                <div className="space-y-4">
                    <MiniHint>
                        <div className="font-semibold text-slate-900">In simple words</div>
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                            <li>The spring pulls the mass back toward the middle (equilibrium).</li>
                            <li>Fastest at the center, slowest at the ends.</li>
                            <li>Damping makes the motion slowly die out.</li>
                        </ul>
                    </MiniHint>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="text-sm font-semibold text-slate-900">Controls</div>

                        <div className="mt-3 text-sm">
                            Mass (m): <b>{m.toFixed(2)}</b>
                            <input className="mt-1 w-full" type="range" min={0.4} max={3.0} step={0.05} value={m}
                                onChange={(e) => setM(parseFloat(e.target.value))} />
                        </div>

                        <div className="mt-3 text-sm">
                            Spring constant (k): <b>{k.toFixed(1)}</b>
                            <input className="mt-1 w-full" type="range" min={2} max={20} step={0.2} value={k}
                                onChange={(e) => setK(parseFloat(e.target.value))} />
                        </div>

                        <div className="mt-3 text-sm">
                            Damping: <b>{damping.toFixed(2)}</b>
                            <input className="mt-1 w-full" type="range" min={0} max={0.25} step={0.01} value={damping}
                                onChange={(e) => setDamping(parseFloat(e.target.value))} />
                        </div>

                        <div className="mt-3 text-sm">
                            Start displacement (x₀): <b>{x0.toFixed(2)}</b>
                            <input className="mt-1 w-full" type="range" min={-1.2} max={1.2} step={0.05} value={x0}
                                onChange={(e) => setX0(parseFloat(e.target.value))} />
                        </div>

                        <label className="mt-3 flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={showGraph} onChange={(e) => setShowGraph(e.target.checked)} />
                            Show x(t) graph
                        </label>
                    </div>

                    <MiniHint>
                        <div className="font-semibold text-slate-900">Key formulas (ideal)</div>
                        <div className="mt-2 space-y-1">
                            <div><code>x'' + (k/m)x = 0</code></div>
                            <div><code>ω = √(k/m)</code>, <code>T = 2π/ω</code></div>
                        </div>
                    </MiniHint>
                </div>
            </div>
        </Card>
    );
}