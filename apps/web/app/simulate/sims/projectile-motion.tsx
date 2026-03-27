"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, MiniHint } from "../components/ui";
import { setupHiDPICanvas } from "./canvas-utils";

export default function ProjectileMotionSim() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [speed, setSpeed] = useState(20); // m/s (scaled)
    const [angleDeg, setAngleDeg] = useState(45);
    const [g, setG] = useState(9.8);
    const [showPath, setShowPath] = useState(true);
    const [showVelocity, setShowVelocity] = useState(true);

    const [running, setRunning] = useState(true);
    const t0Ref = useRef<number>(performance.now());
    const pausedAtRef = useRef<number | null>(null);

    const angle = useMemo(() => (angleDeg * Math.PI) / 180, [angleDeg]);
    const vx = useMemo(() => speed * Math.cos(angle), [speed, angle]);
    const vy = useMemo(() => speed * Math.sin(angle), [speed, angle]);

    const timeOfFlight = useMemo(() => Math.max((2 * vy) / g, 0.1), [vy, g]);
    const range = useMemo(() => vx * timeOfFlight, [vx, timeOfFlight]);
    const maxHeight = useMemo(() => (vy * vy) / (2 * g), [vy, g]);

    const resetThrow = () => {
        t0Ref.current = performance.now();
        pausedAtRef.current = null;
    };

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

            // pause/resume time
            let t = (now - t0Ref.current) / 1000;
            if (!running) {
                if (pausedAtRef.current === null) pausedAtRef.current = now;
                t = (pausedAtRef.current - t0Ref.current) / 1000;
            } else {
                if (pausedAtRef.current !== null) {
                    t0Ref.current += now - pausedAtRef.current;
                    pausedAtRef.current = null;
                    t = (now - t0Ref.current) / 1000;
                }
            }

            // loop throw
            t = t % timeOfFlight;

            // scale
            const pxPerM = 12;
            const originX = 56;
            const groundY = h - 54;

            // physics
            const x = vx * t;
            const y = vy * t - 0.5 * g * t * t;

            const px = originX + x * pxPerM;
            const py = groundY - y * pxPerM;

            // background
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, w, h);

            // ground + axes
            ctx.strokeStyle = "#e2e8f0";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, groundY);
            ctx.lineTo(w, groundY);
            ctx.stroke();

            ctx.strokeStyle = "#eef2f7";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(originX, 18);
            ctx.lineTo(originX, groundY);
            ctx.moveTo(originX, groundY);
            ctx.lineTo(w - 18, groundY);
            ctx.stroke();

            // path
            if (showPath) {
                ctx.strokeStyle = "rgba(37, 99, 235, 0.25)";
                ctx.lineWidth = 3;
                ctx.beginPath();
                const steps = 90;
                for (let k = 0; k <= steps; k++) {
                    const tt = (timeOfFlight * k) / steps;
                    const xx = vx * tt;
                    const yy = vy * tt - 0.5 * g * tt * tt;
                    const pxx = originX + xx * pxPerM;
                    const pyy = groundY - yy * pxPerM;
                    if (k === 0) ctx.moveTo(pxx, pyy);
                    else ctx.lineTo(pxx, pyy);
                }
                ctx.stroke();
            }

            // projectile
            ctx.fillStyle = "#2563eb";
            ctx.beginPath();
            ctx.arc(px, py, 10, 0, Math.PI * 2);
            ctx.fill();

            // velocity arrow
            if (showVelocity) {
                const vyNow = vy - g * t;
                const scale = 4; // visual
                arrow(px, py, px + vx * scale, py - vyNow * scale, "#16a34a");
            }

            // labels
            ctx.fillStyle = "#0f172a";
            ctx.font = "13px system-ui";
            ctx.fillText(`t = ${t.toFixed(2)} s`, 14, 22);
            ctx.fillText(`x ≈ ${x.toFixed(1)} m`, 14, 40);
            ctx.fillText(`y ≈ ${Math.max(0, y).toFixed(1)} m`, 14, 58);

            raf = requestAnimationFrame(render);
        };

        raf = requestAnimationFrame(render);
        return () => cancelAnimationFrame(raf);
    }, [vx, vy, g, timeOfFlight, running, showPath, showVelocity]);

    return (
        <Card
            title="Projectile Motion"
            subtitle="Play/pause the throw, change angle/speed/gravity, and see range + height."
            right={
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setRunning((x) => !x)}>
                        {running ? "Pause" : "Play"}
                    </Button>
                    <Button variant="secondary" onClick={resetThrow}>
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
                            <li>Horizontal motion keeps going (almost) steadily.</li>
                            <li>Vertical motion goes up, then gravity pulls it down.</li>
                            <li>Together it makes a curved (parabolic) path.</li>
                        </ul>
                    </MiniHint>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="text-sm font-semibold text-slate-900">Controls</div>

                        <div className="mt-3 text-sm text-slate-700">
                            Speed: <b>{speed}</b> m/s
                            <input className="mt-1 w-full" type="range" min={5} max={35} value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} />
                        </div>

                        <div className="mt-3 text-sm text-slate-700">
                            Angle: <b>{angleDeg}°</b>
                            <input className="mt-1 w-full" type="range" min={5} max={85} value={angleDeg} onChange={(e) => setAngleDeg(parseFloat(e.target.value))} />
                        </div>

                        <div className="mt-3 text-sm text-slate-700">
                            Gravity g: <b>{g.toFixed(1)}</b>
                            <input className="mt-1 w-full" type="range" min={1} max={20} step={0.1} value={g} onChange={(e) => setG(parseFloat(e.target.value))} />
                        </div>

                        <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                            <input type="checkbox" checked={showPath} onChange={(e) => setShowPath(e.target.checked)} />
                            Show full path
                        </label>
                        <label className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                            <input type="checkbox" checked={showVelocity} onChange={(e) => setShowVelocity(e.target.checked)} />
                            Show velocity arrow
                        </label>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-3">
                            <div className="text-xs text-slate-500">Time</div>
                            <div className="mt-1 text-sm font-semibold">{timeOfFlight.toFixed(2)} s</div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-3">
                            <div className="text-xs text-slate-500">Range</div>
                            <div className="mt-1 text-sm font-semibold">{range.toFixed(1)} m</div>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-3">
                            <div className="text-xs text-slate-500">Max height</div>
                            <div className="mt-1 text-sm font-semibold">{maxHeight.toFixed(1)} m</div>
                        </div>
                    </div>

                    <MiniHint>
                        <div className="font-semibold text-slate-900">Key formulas (ideal, no air)</div>
                        <div className="mt-2 space-y-1">
                            <div><code>vx = v cosθ</code> and <code>vy = v sinθ</code></div>
                            <div><code>T = 2vy/g</code>, <code>R = vx·T</code>, <code>H = vy²/(2g)</code></div>
                        </div>
                    </MiniHint>
                </div>
            </div>
        </Card>
    );
}