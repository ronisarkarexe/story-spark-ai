import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

const policySections = [
  {
    id: "1",
    title: "Information We Collect",
    data: "We collect personal information like name, email address, and usage data (IP, browser, etc.) to provide and improve our services.",
  },
  {
    id: "2",
    title: "How We Use Your Information",
    points: [
      "To provide and maintain our services",
      "Improve user experience and service quality",
      "Send important updates or support emails",
    ],
  },
  {
    id: "3",
    title: "Your Rights",
    data: "You have the right to request access, correction, or deletion of your personal data at any time by contacting us.",
  },
  {
    id: "4",
    title: "Contact Information",
    data: "For any privacy-related questions, please contact us at",
    contact: "hello@algobuddy.in",
  },
];

export const metadata = {
  title: "Privacy Policy | AlgoBuddy",
  description: "Privacy policy for AlgoBuddy's interactive DSA learning platform.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[var(--udemy-dark-bg)]">
      <Navbar />
      <main className="container-app section-app">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 text-3xl font-bold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
            Privacy Policy
          </h1>
          <p className="mb-8 text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
            Your privacy is important to us. This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you visit our website or use our services.
          </p>
          <div className="space-y-6">
            {policySections.map((item) => (
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
