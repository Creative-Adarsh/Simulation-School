export default function SimulateLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen">
            <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/75 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <a href="/" className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-slate-900" />
                        <div className="leading-tight">
                            <div className="text-sm font-semibold">SimSchool</div>
                            <div className="text-xs text-slate-600">Simulations</div>
                        </div>
                    </a>
                    <a href="/" className="text-sm text-slate-700 hover:text-slate-900">Home</a>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
        </div>
    );
}