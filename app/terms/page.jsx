import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

const termsSections = [
  {
    id: "1",
    title: "Acceptance of Terms",
    data: "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.",
  },
  {
    id: "2",
    title: "Use License",
    points: [
      "Permission is granted to temporarily use the materials on this website for personal, non-commercial transitory viewing only",
      "This is the grant of a license, not a transfer of title",
      "You may not modify or copy the materials, use them for any commercial purpose, or remove any copyright or proprietary notations",
    ],
  },
  {
    id: "3",
    title: "User Responsibilities",
    points: [
      "Provide accurate and complete information when required",
      "Maintain the confidentiality of your account credentials",
      "Notify us immediately of any unauthorized use of your account",
      "Use the service in compliance with all applicable laws and regulations",
    ],
  },
  {
    id: "4",
    title: "Intellectual Property",
    data: "All content, features, and functionality on this website, including but not limited to text, graphics, logos, and software, are the exclusive property of the company and are protected by international copyright, trademark, and other intellectual property laws.",
  },
  {
    id: "5",
    title: "Limitation of Liability",
    data: "In no event shall the company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.",
  },
  {
    id: "6",
    title: "Governing Law",
    data: "These Terms shall be governed and construed in accordance with the laws of the applicable jurisdiction, without regard to its conflict of law provisions.",
  },
  {
    id: "7",
    title: "Changes to Terms",
    data: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.",
  },
  {
    id: "8",
    title: "Contact Information",
    data: "If you have any questions about these Terms, please contact us at",
    contact: "hello@algobuddy.in",
  },
];

export const metadata = {
  title: "Terms of Service | AlgoBuddy",
  description: "Terms and conditions for using AlgoBuddy's interactive DSA learning platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[var(--udemy-dark-bg)]">
      <Navbar />
      <main className="container-app section-app">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 text-3xl font-bold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
            Terms of Service
          </h1>
          <p className="mb-8 text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
            Please read these terms and conditions carefully before using our website and services.
            Your access to and use of the service is conditioned on your acceptance of and compliance
            with these terms.
          </p>
          <div className="space-y-6">
            {termsSections.map((item) => (
              <div
                key={item.id}
                className="card-surface p-6"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-sm font-semibold text-[var(--color-primary)]">
                    {item.id}
                  </span>
                  <h2 className="text-lg font-semibold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
                    {item.title}
                  </h2>
                </div>
                {item.points && (
                  <ul className="mb-3 space-y-2 pl-9">
                    {item.points.map((point, i) => (
                      <li
                        key={i}
                        className="list-disc text-[var(--color-primary)] marker:text-[var(--color-primary)]"
                      >
                        <span className="text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {item.data && (
                  <p className="text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
                    {item.data}
                  </p>
                )}
                {item.contact && (
                  <p className="mt-1 font-medium text-[var(--color-primary)]">
                    {item.contact}
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
            Last updated: May 19, 2026
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
