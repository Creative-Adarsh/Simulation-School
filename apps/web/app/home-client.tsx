"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/app/simulate/components/ui";

type Template = {
    id: string;
    title: string;
    subject: string;
    keywords: string[];
};

function norm(s: string) {
    return s.toLowerCase().trim();
}

export default function HomeClient({ templates }: { templates: Template[] }) {
    const router = useRouter();
    const [q, setQ] = useState("");

    function openPrompt() {
        const p = q.trim();
        if (!p) return;
        router.push(`/simulate?topic=${encodeURIComponent(p)}`);
    }

    function openSim(simId: string) {
        router.push(`/simulate?sim=${encodeURIComponent(simId)}`);
    }

    const scored = useMemo(() => {
        const t = norm(q);
        return templates.map((tpl) => {
            if (!t) return { tpl, score: 0 };
            const hay = norm(tpl.title + " " + tpl.keywords.join(" "));
            const score =
                hay.includes(t) ? 10 : tpl.keywords.some((k) => norm(k).includes(t) || t.includes(norm(k))) ? 6 : 0;
            return { tpl, score };
        });
    }, [q, templates]);

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "48px 16px",
            backgroundColor: "#f8fafc"
        }}>
            {/* Title - Centered in the middle */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
                <h1 style={{ 
                    fontSize: "48px", 
                    fontWeight: "700", 
                    marginBottom: 8,
                    color: "#0f172a",
                    letterSpacing: "-0.02em"
                }}>
                    SimSchool
                </h1>
                <p style={{ 
                    fontSize: "18px", 
                    color: "#64748b",
                    margin: 0
                }}>
                    Interactive simulations for learning
                </p>
            </div>

            {/* Search bar - Fully working */}
            <div style={{ 
                width: "100%", 
                maxWidth: "600px", 
                marginBottom: 48 
            }}>
                <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: 12,
                    backgroundColor: "white",
                    padding: 16,
                    borderRadius: 16,
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
                }}>
                    <Input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search: pendulum, shm, projectile, linked list, bubble sort..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") openPrompt();
                        }}
                        style={{ 
                            fontSize: "16px", 
                            padding: "12px 16px",
                            height: "48px"
                        }}
                    />
                    <Button 
                        onClick={openPrompt} 
                        style={{ 
                            width: "100%",
                            height: "48px",
                            fontSize: "16px",
                            backgroundColor: "#0f172a",
                            color: "white"
                        }}
                    >
                        Search Simulation
                    </Button>
                </div>
            </div>

            {/* Simulation Cards - Grid Layout */}
            <div style={{ 
                width: "100%", 
                maxWidth: "1200px" 
            }}>
                <h2 style={{ 
                    fontSize: "24px", 
                    fontWeight: "600", 
                    marginBottom: 24, 
                    color: "#0f172a",
                    textAlign: "center"
                }}>
                    Available Simulations
                </h2>
                
                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
                    gap: 20 
                }}>
                    {scored.map(({ tpl, score }) => {
                        const highlighted = score > 0 && q.trim().length > 0;

                        return (
                            <button
                                key={tpl.id}
                                onClick={() => openSim(tpl.id)}
                                style={{
                                    textAlign: "left",
                                    borderWidth: 1,
                                    borderColor: highlighted ? "#0ea5e9" : "#e2e8f0",
                                    borderStyle: "solid",
                                    backgroundColor: "#fff",
                                    padding: 20,
                                    borderRadius: 12,
                                    width: "100%",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    boxShadow: highlighted 
                                        ? "0 4px 12px rgba(14, 165, 233, 0.15)" 
                                        : "0 1px 3px rgba(0, 0, 0, 0.08)"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.12)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = highlighted 
                                        ? "0 4px 12px rgba(14, 165, 233, 0.15)" 
                                        : "0 1px 3px rgba(0, 0, 0, 0.08)";
                                }}
                            >
                                <div style={{ 
                                    display: "flex", 
                                    justifyContent: "space-between", 
                                    alignItems: "flex-start", 
                                    gap: 12,
                                    marginBottom: 12
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ 
                                            fontSize: 18, 
                                            fontWeight: "600", 
                                            color: "#0f172a",
                                            marginBottom: 4
                                        }}>
                                            {tpl.title}
                                        </div>
                                        <div style={{ 
                                            fontSize: 14, 
                                            color: "#64748b" 
                                        }}>
                                            {tpl.subject}
                                        </div>
                                    </div>

                                    <span style={{ 
                                        borderWidth: 1, 
                                        borderColor: "#e2e8f0", 
                                        backgroundColor: "#f8fafc", 
                                        padding: "6px 12px", 
                                        fontSize: 13, 
                                        color: "#334155", 
                                        borderRadius: 9999,
                                        fontWeight: "500"
                                    }}>
                                        Open →
                                    </span>
                                </div>

                                <div style={{ 
                                    marginTop: 12, 
                                    display: "flex", 
                                    flexWrap: "wrap", 
                                    gap: 6 
                                }}>
                                    {tpl.keywords.slice(0, 4).map((k) => (
                                        <span
                                            key={k}
                                            style={{ 
                                                borderWidth: 1, 
                                                borderColor: "#e2e8f0", 
                                                backgroundColor: "#f8fafc", 
                                                padding: "4px 10px", 
                                                fontSize: 12, 
                                                color: "#475569", 
                                                borderRadius: 9999 
                                            }}
                                        >
                                            {k}
                                        </span>
                                    ))}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
