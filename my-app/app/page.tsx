"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Briefcase,
  School,
  Users,
  ArrowRight,
  CheckCircle,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="text-5xl font-semibold tracking-tight text-slate-900">
              A smarter way for schools and teachers to connect
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              A verified hiring platform where schools post authentic jobs and
              teachers apply with confidence — no spam, no noise.
            </p>

            <div className="mt-10 flex justify-center gap-4">
              <button
                onClick={() => router.push("/login")}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-3 text-base font-medium text-white shadow-sm transition hover:bg-slate-800"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => router.push("/login")}
                className="rounded-xl border border-slate-300 bg-white px-8 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Browse opportunities
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-14 md:grid-cols-3">
          <Stat label="Verified Schools" value="300+" />
          <Stat label="Active Teachers" value="2,000+" />
          <Stat label="Successful Hires" value="1,200+" />
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-center text-3xl font-semibold text-slate-900">
          Built for both sides of hiring
        </h2>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          <HowCard
            icon={School}
            title="For Schools"
            points={[
              "Post jobs after admin verification",
              "Review applications in one dashboard",
              "Shortlist or reject with clarity",
            ]}
          />

          <HowCard
            icon={Users}
            title="For Teachers"
            points={[
              "Apply only to verified schools",
              "Credits-based applications reduce spam",
              "Track application status transparently",
            ]}
          />
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-semibold text-slate-900">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-center text-slate-600">
            Pay only when you apply. No subscriptions.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <PricingCard credits={5} price="₹50" />
            <PricingCard featured credits={10} price="₹90" />
            <PricingCard credits={20} price="₹160" />
          </div>
        </div>
      </section>

      {/* ================= WHY US ================= */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-3">
          <ValueCard
            icon={ShieldCheck}
            title="Approval-based onboarding"
            desc="Every school and teacher is reviewed to maintain trust."
          />
          <ValueCard
            icon={CreditCard}
            title="Credit-based system"
            desc="Prevents spam and encourages serious applications."
          />
          <ValueCard
            icon={Briefcase}
            title="Hiring-focused design"
            desc="Built only for education hiring — nothing generic."
          />
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold text-slate-900">
            Start hiring or applying with confidence
          </h2>
          <p className="mt-4 text-slate-600">
            Join a platform designed for clarity, trust, and real outcomes.
          </p>

          <button
            onClick={() => router.push("/login")}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-10 py-3 text-base font-medium text-white hover:bg-slate-800"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="font-semibold text-slate-900">EduHire</h3>
            <p className="mt-3 text-sm text-slate-600">
              A verified hiring platform for schools and teachers.
            </p>
          </div>

          <FooterCol
            title="For Schools"
            links={["Post jobs", "Manage applications", "Hire teachers"]}
          />
          <FooterCol
            title="For Teachers"
            links={["Browse jobs", "Buy credits", "Track applications"]}
          />
          <FooterCol
            title="Legal"
            links={["Privacy policy", "Terms of service", "Support"]}
          />
        </div>

        <div className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} EduHire. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{label}</p>
    </div>
  );
}

function HowCard({
  icon: Icon,
  title,
  points,
}: {
  icon: React.ElementType;
  title: string;
  points: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8">
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-slate-800" />
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>

      <ul className="mt-6 space-y-3">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
            <CheckCircle className="mt-0.5 h-4 w-4 text-slate-700" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PricingCard({
  credits,
  price,
  featured,
}: {
  credits: number;
  price: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-8 ${
        featured
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white"
      }`}
    >
      <h3 className="text-lg font-semibold">
        {credits} Credits
      </h3>
      <p className="mt-4 text-3xl font-semibold">{price}</p>
      <p className="mt-2 text-sm opacity-80">
        Apply to {credits} jobs
      </p>
    </div>
  );
}

function ValueCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8">
      <Icon className="h-6 w-6 text-slate-800" />
      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </div>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: string[];
}) {
  return (
    <div>
      <h4 className="font-semibold text-slate-900">{title}</h4>
      <ul className="mt-4 space-y-2 text-sm text-slate-600">
        {links.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  );
}
