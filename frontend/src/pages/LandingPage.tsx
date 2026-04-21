import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  FileText,
  FolderTree,
  Package,
  RotateCcw,
  Shield,
  Users,
} from "lucide-react";
import BorrowlyLogo from "../assets/BorrowlyHorizontal.png";
import ButtonThemeSwitcher from "../components/ui/ButtonThemeSwitcher";
import DashboardDark from "../assets/dashboard-dark.png";
import DashboardLight from "../assets/dashboard-light.png";
import GithubDark from "../assets/github-dark.png";
import GithubLight from "../assets/github-light.png";
import { useTheme } from "../components/ui/theme-provider";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
      <nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm">
        <div className="max-w-6xl gap-3 mx-auto px-6 h-14 flex items-center justify-between">
          <a href="">
            <div className="flex items-center gap-2 text-primary">
              <img src={BorrowlyLogo} className="max-w-35" />
            </div>
          </a>
          <div className="pl-17 hidden md:flex items-center justify-between gap-6 text-sm text-zinc-500 dark:text-zinc-400">
            <a
              href="#features"
              className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              Features
            </a>
            <a
              href="#roles"
              className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              Roles
            </a>
            <a
              href="#how"
              className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              How it works
            </a>
          </div>

          <div className="flex items-center gap-2">
            <ButtonThemeSwitcher />
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm hidden sm:flex hover:cursor-pointer"
              >
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="sm"
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer"
              >
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-12 text-center">
        <Badge
          variant="outline"
          className="mb-6 text-xs font-medium text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 rounded-full px-3 py-1"
        >
          Item borrowing, made simple
        </Badge>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.08] max-w-3xl mx-auto mb-6">
          Everything you need to manage{" "}
          <span className="relative inline-block">
            <span className="relative z-10">borrowing</span>
            <span className="absolute bottom-1 left-0 right-0 h-3 bg-blue-100 dark:bg-blue-900/60 z-0 rounded" />
          </span>
        </h1>

        <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
          Whether you're managing lab equipment, tools, or media devices —
          Borrowly keeps track of every loan, return, and fine.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link to="/register">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm px-6 hover:cursor-pointer"
            >
              Start now
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
          <a href="#how">
            <Button
              size="lg"
              variant="outline"
              className="rounded-md text-sm px-6 border-zinc-200 dark:border-zinc-700 hover:cursor-pointer"
            >
              How it works
            </Button>
          </a>
        </div>
      </section>

      <section
        className="max-w-5xl mx-auto mb-25 rounded-sm overflow-hidden
  shadow-[0_2px_24px_-4px_rgb(0_0_0/0.08),0_4px_80px_8px_rgb(29_78_216/0.08)]
  dark:shadow-[0_0_0_1px_rgb(255_255_255/0.05),0_8px_16px_-4px_rgb(0_0_0/0.5),0_32px_64px_-8px_rgb(0_0_0/0.4),0_4px_120px_16px_rgb(29_78_216/0.25)]"
      >
        <img
          src={theme == "dark" ? DashboardDark : DashboardLight}
          className="w-full h-full"
        />
      </section>

      <Separator />

      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
            We take care of the hard parts
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-md mx-auto">
            You manage the items — Borrowly handles the tracking, approvals,
            returns, and fines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              ),
              bg: "bg-blue-50 dark:bg-blue-950",
              title: "Item catalog",
              desc: "Add, categorize, and track every borrowable item. Know what's available at any time.",
            },
            {
              icon: (
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              ),
              bg: "bg-purple-50 dark:bg-purple-950",
              title: "Borrow requests",
              desc: "Users submit requests. Officers approve or reject them with full visibility.",
            },
            {
              icon: (
                <RotateCcw className="w-5 h-5 text-green-600 dark:text-green-400" />
              ),
              bg: "bg-green-50 dark:bg-green-950",
              title: "Return & fines",
              desc: "Track returns and auto-calculate overdue fines so nothing slips through.",
            },
            {
              icon: (
                <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              ),
              bg: "bg-orange-50 dark:bg-orange-950",
              title: "User management",
              desc: "Manage borrowers and officers with role-based permissions built in.",
            },
            {
              icon: (
                <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              ),
              bg: "bg-teal-50 dark:bg-teal-950",
              title: "Activity log",
              desc: "Full audit trail of every action taken across the system — nothing is hidden.",
            },
            {
              icon: (
                <FolderTree className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              ),
              bg: "bg-pink-50 dark:bg-pink-950",
              title: "Categories",
              desc: "Organize items by category for faster browsing and reporting.",
            },
          ].map((feat) => (
            <div
              key={feat.title}
              className="border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 bg-secondary dark:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-xl ${feat.bg} flex items-center justify-center mb-4`}
              >
                {feat.icon}
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                {feat.title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      <section id="roles" className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge
              variant="outline"
              className="mb-4 text-xs font-medium text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 rounded-full px-3 py-1"
            >
              Role-based access
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4 leading-tight">
              Three roles,
              <br />
              one system
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed mb-6">
              Every user sees exactly what they need. Admins control everything,
              officers handle approvals, and borrowers manage their own loans.
            </p>
          </div>

          <div className="grid gap-3">
            {[
              {
                role: "Admin",
                icon: (
                  <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                ),
                bg: "bg-purple-50 dark:bg-purple-950",
                perms: [
                  "CRUD users, items, categories",
                  "Manage all borrows & returns",
                  "Activity log access",
                  "Full system control",
                ],
              },
              {
                role: "Officer",
                icon: (
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                ),
                bg: "bg-blue-50 dark:bg-blue-950",
                perms: [
                  "Approve borrow requests",
                  "Monitor returns & fines",
                  "Print reports",
                ],
              },
              {
                role: "Borrower",
                icon: (
                  <Package className="w-4 h-4 text-green-600 dark:text-green-400" />
                ),
                bg: "bg-green-50 dark:bg-green-950",
                perms: [
                  "Browse available items",
                  "Submit borrow requests",
                  "Return items",
                ],
              },
            ].map((r) => (
              <div
                key={r.role}
                className="border border-zinc-100 dark:border-zinc-800 rounded-xl p-4 bg-secondary dark:bg-zinc-900 flex gap-4"
              >
                <div
                  className={`w-9 h-9 rounded-lg ${r.bg} flex items-center justify-center shrink-0 mt-0.5`}
                >
                  {r.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                    {r.role}
                  </p>
                  <div className="flex flex-col gap-1">
                    {r.perms.map((p) => (
                      <div
                        key={p}
                        className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* ── How it works ── */}
      <section id="how" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
            How it works
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-sm mx-auto">
            Simple steps for every user in the system.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 relative">
          <div className="hidden sm:block absolute top-5 left-[calc(16.66%+8px)] right-[calc(16.66%+8px)] h-px bg-zinc-200 dark:bg-zinc-800 z-0" />
          {[
            {
              step: "01",
              title: "Register & log in",
              desc: "Users sign up and get assigned a role — admin, officer, or borrower.",
            },
            {
              step: "02",
              title: "Browse & request",
              desc: "Borrowers browse available items and submit a borrowing request.",
            },
            {
              step: "03",
              title: "Approve & return",
              desc: "Officers approve requests, track active loans, and confirm returns.",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="flex flex-col items-center text-center px-6 relative z-10"
            >
              <div className="w-10 h-10 rounded-full border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center justify-center mb-4">
                {s.step}
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
            Start your Borrowly system today
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-base mb-8 max-w-sm mx-auto">
            Get started in minutes.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm px-8 hover:cursor-pointer"
              >
                Start now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            © 2026 Borrowly. All rights reserved.
          </p>

          <div>
            <a
              className="flex items-center gap-1 hover:opacity-55 transition-all duration-300"
              target="_blank"
              href="https://www.github.com/LeleCodeDev/"
            >
              <img
                src={theme == "dark" ? GithubLight : GithubDark}
                className="max-w-8"
              />
              <p className="font-bold text-sm">LeleCodeDev</p>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
