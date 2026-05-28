
import { Link } from "react-router-dom";
import {
    Handshake,
    Sparkles,
    Smile,
    Ban,
    Lightbulb,
    FileText,
    ArrowLeft,
} from "lucide-react";

const Guidelines = () => {
    const rules = [
        {
            title: "Respect Everyone",
            description:
                "Treat all creators, contributors, and community members with kindness and professionalism.",
            icon: Handshake,
        },
        {
            title: "Share Original Content",
            description:
                "Post meaningful, authentic, and creative content that adds value to the community.",
            icon: Sparkles,
        },
        {
            title: "Maintain Positivity",
            description:
                "Encourage healthy discussions and create a welcoming environment for everyone.",
            icon: Smile,
        },
        {
            title: "Avoid Spam",
            description:
                "Do not post repetitive, misleading, or promotional content that disrupts the experience.",
            icon: Ban,
        },
        {
            title: "Support Collaboration",
            description:
                "Help others, provide constructive feedback, and contribute positively to projects.",
            icon: Lightbulb,
        },
        {
            title: "Follow Platform Policies",
            description:
                "Ensure your activities comply with the platform’s terms and community standards.",
            icon: FileText,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 text-slate-900 px-6 py-14 transition-colors duration-300 dark:from-[#0b1329] dark:to-[#111827] dark:text-white">
            <div className="max-w-6xl mx-auto">

                <div className="text-center mb-14">
                    <h1 className="text-5xl font-extrabold mb-5">
                        Community Guidelines
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 leading-8 max-w-3xl mx-auto dark:text-gray-300">
                        These guidelines help maintain a respectful, creative,
                        and collaborative environment for everyone in the community.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {rules.map((rule, index) => {
                        const Icon = rule.icon;

                        return (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 dark:bg-zinc-900 dark:border-zinc-800"
                            >
                                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30 mb-5">
                                    <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                                </div>

                                <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
                                    {rule.title}
                                </h2>

                                <p className="text-slate-600 leading-7 dark:text-gray-300">
                                    {rule.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-16 text-center">
                    <div className="bg-blue-50 border border-blue-200 rounded-3xl p-8 dark:bg-blue-950/20 dark:border-blue-900">
                        <h3 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400">
                            Together We Build a Better Community 🚀
                        </h3>

                        <p className="text-slate-600 max-w-2xl mx-auto leading-7 dark:text-gray-300">
                            By following these guidelines, you help create a
                            safe, inspiring, and collaborative environment for
                            all members of the platform.
                        </p>
                    </div>

                    <div className="mt-10">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-7 py-3 bg-blue-600 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition duration-300"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Guidelines;

