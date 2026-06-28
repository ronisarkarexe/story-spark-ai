import {
  Mail,
  User,
  FileText,
  Pencil,
  Clock3,
  Globe,
  Github,
  MessageCircle,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section className="relative overflow-hidden bg-[#070B1B] py-24 text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#3b82f620,transparent_45%),radial-gradient(circle_at_bottom_right,#9333ea20,transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] items-start">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
              Contact StorySparkAI
            </span>

            <h1 className="mt-6 text-6xl font-black leading-tight">
              Let's Build
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                Something Amazing
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">
              Whether you have an idea, feedback, collaboration proposal, or
              simply want to say hello, we'd love to hear from you.
            </p>

            {/* Cards */}
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              <InfoCard
                icon={<Clock3 />}
                title="Response Time"
                value="Within 24 Hours"
              />

              <InfoCard
                icon={<Globe />}
                title="Community"
                value="Worldwide Creators"
              />
            </div>

            {/* Contact Details */}
            <div className="mt-10 space-y-4">
              <ContactCard
                icon={<Mail size={22} />}
                title="Email"
                subtitle="support@storyspark.ai"
              />

              <ContactCard
                icon={<Github size={22} />}
                title="GitHub"
                subtitle="Contribute to StorySparkAI"
              />

              <ContactCard
                icon={<MessageCircle size={22} />}
                title="Community"
                subtitle="Join our Discord discussions"
              />
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[36px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl"
          >
            <h2 className="mb-8 text-3xl font-bold">
              Send us a message
            </h2>

            <form className="space-y-5">
              <Input icon={<User size={20} />} placeholder="Full Name" />

              <Input icon={<Mail size={20} />} placeholder="Email Address" />

              <Input icon={<FileText size={20} />} placeholder="Subject" />

              <div className="relative">
                <Pencil className="absolute left-5 top-5 text-purple-400" />

                <textarea
                  rows={5}
                  placeholder="Your message..."
                  className="w-full rounded-2xl border border-white/10 bg-[#111827]/80 py-5 pl-14 pr-5 text-white placeholder:text-slate-500 outline-none focus:border-purple-500"
                />
              </div>

              <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-4 text-lg font-semibold transition hover:scale-[1.02]">
                <Send size={18} />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-5 text-purple-400">{icon}</div>

      <p className="text-slate-400">{title}</p>

      <h3 className="mt-2 text-xl font-bold">{value}</h3>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-purple-500/50">
      <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400">
        {icon}
      </div>

      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

function Input({
  icon,
  placeholder,
}: {
  icon: React.ReactNode;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-purple-400">
        {icon}
      </div>

      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-[#111827]/80 py-5 pl-14 pr-5 text-white placeholder:text-slate-500 outline-none focus:border-purple-500"
      />
    </div>
  );
}