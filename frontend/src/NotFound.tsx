import { useNavigate } from "react-router-dom";
import {
    Home,
    ArrowLeft,
    AlertTriangle,
    BookOpen,
    Brain,
    Database,
    FileCode,
} from "lucide-react";

export default function NotFound() {
    const navigate = useNavigate();

    const floatingIcons = [
        { Icon: BookOpen, top: "15%", left: "12%" },
        { Icon: Brain, top: "25%", right: "15%" },
        { Icon: Database, bottom: "20%", left: "18%" },
        { Icon: FileCode, bottom: "15%", right: "12%" },
    ];

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-6">

            {/* Starfield */}
            <div className="absolute inset-0">
                {[...Array(60)].map((_, i) => (
                    <span
                        key={i}
                        className="absolute h-1 w-1 rounded-full bg-white/70 animate-pulse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${2 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            {/* Ambient Glow */}
            <div className="absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[140px]" />
            <div className="absolute -right-32 bottom-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/15 blur-[140px]" />

            {/* Floating Icons */}
            {floatingIcons.map(({ Icon, ...position }, idx) => (
                <div
                    key={idx}
                    className="absolute animate-bounce text-cyan-400/20"
                    style={{
                        ...position,
                        animationDuration: `${5 + idx}s`,
                    }}
                >
                    <Icon size={42} />
                </div>
            ))}

            {/* Portal */}
            <div className="absolute flex items-center justify-center">
                <div className="absolute h-[500px] w-[500px] rounded-full border border-cyan-500/20 animate-spin [animation-duration:25s]" />
                <div className="absolute h-[420px] w-[420px] rounded-full border border-purple-500/20 animate-spin [animation-direction:reverse] [animation-duration:18s]" />
                <div className="absolute h-[340px] w-[340px] rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/20 to-purple-500/10 blur-3xl" />
            </div>

            {/* Main Content */}
            <section className="relative z-10 max-w-3xl text-center">
                <div className="rounded-[40px] border border-white/10 bg-white/[0.03] p-10 md:p-16 backdrop-blur-2xl shadow-[0_0_80px_rgba(59,130,246,0.15)]">

                    {/* Badge */}
                    <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.25em] text-red-400">
                        <AlertTriangle size={14} />
                        Resource Not Found
                    </div>

                    {/* 404 */}
                    <div className="relative mb-6">
                        <h1 className="relative text-[clamp(7rem,20vw,14rem)] font-black leading-none tracking-tighter select-none">
                            <span className="absolute left-0 top-0 translate-x-1 text-cyan-200/25 blur-sm">
                                404
                            </span>

                            <span className="absolute left-0 top-0 -translate-x-1 text-pink-200/10 blur-md">
                                404
                            </span>

                            <span className="relative bg-gradient-to-b from-white via-slate-100 to-slate-400/70 bg-clip-text text-transparent">
                                404
                            </span>
                        </h1>
                    </div>

                    {/* Heading */}
                    <h2 className="mb-5 text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
                        Transmission Lost
                    </h2>

                    <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-400">
                        You've drifted outside the learning universe.
                        The resource you're searching for seems to have vanished into another dimension.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">

                        {/* Go Home */}
                        <button
                            onClick={() => navigate("/")}
                            className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]"
                        >
                            <Home size={18} className="transition-transform group-hover:-translate-y-1" />
                            Return Home
                        </button>

                        {/* Go Back */}
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-bold text-slate-300 transition-all hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-white"
                        >
                            <ArrowLeft size={18} />
                            Go Back
                        </button>

                    </div>
                </div>
            </section>

            {/* Grid Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(circle_at_center,#000_50%,transparent_100%)]" />
        </main>
    );
}