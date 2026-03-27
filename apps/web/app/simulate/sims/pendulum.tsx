"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, MiniHint } from "../components/ui";
import { setupHiDPICanvas } from "./canvas-utils";

export default function PendulumSim() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [running, setRunning] = useState(true);
    const [lengthM, setLengthM] = useState(1.2); // meters (scaled)
    const [g, setG] = useState(9.8);
    const [damping, setDamping] = useState(0.03);
    const [theta0Deg, setTheta0Deg] = useState(35);
    const [showTrace, setShowTrace] = useState(true);

    const thetaRef = useRef(0);
    const omegaRef = useRef(0);
    const lastRef = useRef<number>(performance.now());
    const traceRef = useRef<{ x: number; y: number }[]>([]);

    const approxPeriod = useMemo(() => 2 * Math.PI * Math.sqrt(lengthM / g), [lengthM, g]);

    const reset = () => {
        thetaRef.current = (theta0Deg * Math.PI) / 180;
        omegaRef.current = 0;
        lastRef.current = performance.now();
        traceRef.current = [];
    };

    useEffect(() => {
        reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theta0Deg, lengthM, g, damping]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let raf = 0;

        const draw = () => {
            const now = performance.now();
            const { w, h } = setupHiDPICanvas(canvas, ctx);

            // physics update
            const dtRaw = (now - lastRef.current) / 1000;
            lastRef.current = now;

            // sub-stepping for stability
            const dt = Math.min(dtRaw, 0.04);
            const steps = Math.max(1, Math.floor(dt / 0.005));
            const hStep = dt / steps;

            if (running) {
                for (let s = 0; s < steps; s++) {
                    const theta = thetaRef.current;
                    const omega = omegaRef.current;

                    // Nonlinear pendulum with damping:
                    // theta'' = -(g/L) sin(theta) - c*theta'
                    const alpha = -(g / lengthM) * Math.sin(theta) - damping * omega;

                    const newOmega = omega + alpha * hStep;
                    const newTheta = theta + newOmega * hStep; // semi-implicit Euler

                    omegaRef.current = newOmega;
                    thetaRef.current = newTheta;
                }
            }

            // drawing
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, w, h);

            const anchorX = w / 2;
            const anchorY = 70;

            const Lpx = lengthM * 220; // scale meters to pixels
            const theta = thetaRef.current;

            const bobX = anchorX + Lpx * Math.sin(theta);
            const bobY = anchorY + Lpx * Math.cos(theta);

            if (showTrace) {
                traceRef.current.push({ x: bobX, y: bobY });
                if (traceRef.current.length > 500) traceRef.current.shift();

                ctx.strokeStyle = "rgba(37, 99, 235, 0.18)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                traceRef.current.forEach((p, i) => {
                    if (i === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                });
                ctx.stroke();
            }

            // support
            ctx.fillStyle = "#0f172a";
            ctx.beginPath();
            ctx.arc(anchorX, anchorY, 5, 0, Math.PI * 2);
            ctx.fill();

            // string
            ctx.strokeStyle = "#0f172a";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(anchorX, anchorY);
            ctx.lineTo(bobX, bobY);
            ctx.stroke();

            // bob
            ctx.fillStyle = "#2563eb";
            ctx.beginPath();
            ctx.arc(bobX, bobY, 14, 0, Math.PI * 2);
            ctx.fill();

            // text overlay
            ctx.fillStyle = "#0f172a";
            ctx.font = "13px system-ui";
            ctx.fillText(`θ ≈ ${(theta * 180 / Math.PI).toFixed(1)}°`, 14, 24);
            ctx.fillText(`T ≈ ${approxPeriod.toFixed(2)} s (small-angle approx)`, 14, 44);

            raf = requestAnimationFrame(draw);
        };

        raf = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(raf);
    }, [running, lengthM, g, damping, showTrace, approxPeriod]);

    return (
        <Card
            title="Pendulum"
            subtitle="Swing motion with damping + trace. Clean, interactive, and easy to understand."
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
                            <li>Gravity pulls the bob down, so it swings back toward the center.</li>
                            <li>It is fastest at the bottom and slowest at the ends.</li>
                            <li>Damping slowly reduces the swing size.</li>
                        </ul>
                    </MiniHint>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="text-sm font-semibold text-slate-900">Controls</div>

                        <div className="mt-3 text-sm text-slate-700">
                            Length (L): <b>{lengthM.toFixed(2)} m</b>
                            <input className="mt-1 w-full" type="range" min={0.5} max={2.5} step={0.05} value={lengthM}
                                onChange={(e) => setLengthM(parseFloat(e.target.value))} />
                        </div>

                        <div className="mt-3 text-sm text-slate-700">
                            Gravity (g): <b>{g.toFixed(1)}</b>
                            <input className="mt-1 w-full" type="range" min={1} max={20} step={0.1} value={g}
                                onChange={(e) => setG(parseFloat(e.target.value))} />
                        </div>

                        <div className="mt-3 text-sm text-slate-700">
                            Damping: <b>{damping.toFixed(2)}</b>
                            <input className="mt-1 w-full" type="range" min={0} max={0.15} step={0.01} value={damping}
                                onChange={(e) => setDamping(parseFloat(e.target.value))} />
                        </div>

                        <div className="mt-3 text-sm text-slate-700">
                            Start angle: <b>{theta0Deg}°</b>
                            <input className="mt-1 w-full" type="range" min={5} max={75} step={1} value={theta0Deg}
                                onChange={(e) => setTheta0Deg(parseFloat(e.target.value))} />
                        </div>

                        <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
                            <input type="checkbox" checked={showTrace} onChange={(e) => setShowTrace(e.target.checked)} />
                            Show trace
                        </label>
                    </div>

                    <MiniHint>
                        <div className="font-semibold text-slate-900">Key idea</div>
                        <div className="mt-2">
                            For small angles, the period is approximately: <code>T = 2π √(L/g)</code>.
                        </div>
                    </MiniHint>
                </div>
            </div>
        </Card>
    );
}