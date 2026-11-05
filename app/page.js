"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  animate,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  Globe2,
  HeartPulse,
  Megaphone,
  Menu,
  Package,
  Plane,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  MessageCircle,
  ArrowUp,
  Mail,
  Phone,
  Send,
  TrendingUp,
  Truck,
  BadgeCheck,
  CalendarCheck,
  Star,
  Building2,
  Calculator,
  ChevronDown,
  Clock,
  MapPin,
  Plus,
  Users,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Shared config & animation helpers                                          */
/* -------------------------------------------------------------------------- */

const EASE = [0.22, 1, 0.36, 1];

const NAV_LINKS = [
  { label: "Services", href: "#services", hasMenu: true },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Calculator", href: "#calculator", badge: "Save 70%" },
  { label: "Why Us", href: "#why-us" },
  { label: "Network", href: "#network", badge: "13+" },
  { label: "FAQ", href: "#faq" },
];

const NAV_SERVICES = [
  {
    title: "Medical Tourism",
    desc: "End-to-end patient travel, clinic matching & 24/7 concierge.",
    icon: Plane,
    tag: "Popular",
    href: "#services",
  },
  {
    title: "Medical Consulting",
    desc: "Global growth strategy & accreditation for clinics.",
    icon: BarChart3,
    tag: "+34% Growth",
    href: "#services",
  },
  {
    title: "Healthcare Marketing",
    desc: "Compliant international patient acquisition campaigns.",
    icon: Megaphone,
    tag: "+248% ROI",
    href: "#services",
  },
  {
    title: "Medical Procurement",
    desc: "Certified equipment & supplies sourced worldwide.",
    icon: Package,
    tag: "Direct",
    href: "#services",
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const viewport = { once: true, amount: 0.25 };

/** Scroll-reveal wrapper: fades + slides in from a direction. */
function Reveal({ children, className = "", delay = 0, x = 0, y = 40 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, light = false }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] ${
        light ? "text-sea-300" : "text-sea-700"
      }`}
    >
      <span className="h-px w-6 bg-current" />
      {children}
    </span>
  );
}

/** Primary / secondary button with hover scale + glow. */
function Button({ children, href = "#", variant = "primary", icon = true }) {
  const styles = {
    primary:
      "bg-ark-900 text-white shadow-lg shadow-ark-900/25 hover:bg-ark-800 hover:shadow-sea-500/40",
    secondary:
      "bg-white text-ark-900 ring-1 ring-slate-200 hover:ring-sea-600 hover:text-sea-700",
    light:
      "bg-white text-sea-800 hover:bg-sea-50 hover:shadow-white/30 shadow-lg shadow-black/10",
  };
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${styles[variant]}`}
    >
      {variant !== "secondary" && (
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-1/3 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-[320%]"
        />
      )}
      <span className="relative">{children}</span>
      {icon && (
        <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </motion.a>
  );
}

/* -------------------------------------------------------------------------- */
/*  Navbar (floating morphing glass island + mega-menu + scroll progress)      */
/* -------------------------------------------------------------------------- */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 32);

      const ids = [
        "services",
        "how-it-works",
        "calculator",
        "why-us",
        "network",
        "faq",
        "contact",
      ];
      const y = window.scrollY + 260;
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) {
          current = `#${id}`;
        }
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onNavMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--nx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--ny", `${e.clientY - r.top}px`);
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
    >
      <motion.div
        onMouseMove={onNavMove}
        animate={{
          maxWidth: scrolled ? 1160 : 1280,
        }}
        transition={{ duration: 0.55, ease: EASE }}
        className={`pointer-events-auto relative mx-auto rounded-3xl transition-all duration-500 [--nx:50%] [--ny:50%] ${
          scrolled
            ? "border border-sea-200/70 bg-white/80 shadow-[0_16px_48px_-12px_rgba(12,38,65,0.18)] backdrop-blur-2xl"
            : "border border-slate-200/70 bg-white/65 shadow-[0_8px_30px_rgba(12,38,65,0.06)] backdrop-blur-xl"
        }`}
      >
        {/* Cursor-following ambient border/surface glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl opacity-80"
        >
          <div className="absolute inset-0 [background:radial-gradient(280px_circle_at_var(--nx)_var(--ny),rgba(86,139,141,0.16),transparent_70%)]" />
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sea-400/60 to-transparent" />
        </div>

        <nav
          aria-label="Primary"
          className={`relative flex items-center justify-between gap-3 px-4 transition-all duration-500 sm:px-6 ${
            scrolled ? "py-2.5" : "py-3.5"
          }`}
        >
          <Logo compact={scrolled} />

          {/* Center desktop pill navigation */}
          <div
            onMouseLeave={() => {
              setHovered(null);
              setServicesOpen(false);
            }}
            className="relative hidden shrink-0 items-center rounded-full border border-slate-200/70 bg-slate-100/70 p-1 shadow-inner shadow-slate-900/5 backdrop-blur-md lg:flex"
          >
            <ul className="flex items-center gap-0.5">
              {NAV_LINKS.map((l) => {
                const isCurrent = activeSection === l.href;
                const isHighlighted =
                  hovered === l.href || (hovered === null && isCurrent);
                return (
                  <li
                    key={l.href}
                    onMouseEnter={() => {
                      setHovered(l.href);
                      setServicesOpen(Boolean(l.hasMenu));
                    }}
                    className="relative shrink-0"
                  >
                    <a
                      href={l.href}
                      className={`relative z-10 flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors duration-300 xl:px-4 xl:text-[13px] ${
                        isHighlighted
                          ? "text-ark-950"
                          : "text-slate-600 hover:text-ark-900"
                      }`}
                    >
                      {isHighlighted && (
                        <motion.span
                          layoutId="nav-pill"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 32,
                          }}
                          className="absolute inset-0 -z-10 rounded-full border border-sea-200/80 bg-white shadow-sm shadow-sea-900/10"
                        />
                      )}

                      {isCurrent && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sea-500 shadow-[0_0_8px_#568b8d]" />
                      )}

                      <span className="whitespace-nowrap">{l.label}</span>

                      {l.badge && (
                        <span className=" shrink-0 whitespace-nowrap rounded-full bg-sea-500/15 px-2 py-0.5 text-[10px] font-bold leading-none text-sea-700">
                          {l.badge}
                        </span>
                      )}

                      {l.hasMenu && (
                        <ChevronDown
                          className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-300 ${
                            servicesOpen ? "rotate-180 text-sea-600" : ""
                          }`}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Services Mega-Popover */}
            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  className="absolute left-1/2 top-full w-[540px] -translate-x-1/2 pt-3"
                >
                  <div className="overflow-hidden rounded-3xl border border-sea-200/80 bg-white/95 p-3 shadow-[0_24px_60px_-15px_rgba(12,38,65,0.22)] backdrop-blur-2xl">
                    <div className="grid grid-cols-2 gap-2">
                      {NAV_SERVICES.map((s) => {
                        const Icon = s.icon;
                        return (
                          <a
                            key={s.title}
                            href={s.href}
                            onClick={() => setServicesOpen(false)}
                            className="group flex items-start gap-3 rounded-2xl p-3 transition-all duration-300 hover:bg-sea-50/90"
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ark-900 text-sea-300 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-sea-600 group-hover:text-white">
                              <Icon className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs font-bold text-ark-900 group-hover:text-sea-800">
                                  {s.title}
                                </p>
                                <span className="rounded-full bg-sea-100/80 px-2 py-0.5 text-[10px] font-semibold text-sea-700">
                                  {s.tag}
                                </span>
                              </div>
                              <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                                {s.desc}
                              </p>
                            </div>
                          </a>
                        );
                      })}
                    </div>

                    <div className="mt-2 flex items-center justify-between rounded-2xl bg-gradient-to-r from-ark-950 via-ark-900 to-sea-900 px-4 py-2.5 text-xs text-white">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sea-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-sea-400" />
                        </span>
                        <span className="font-medium text-sea-100">
                          24/7 Patient & Clinic Concierge
                        </span>
                      </div>
                      <a
                        href="#contact"
                        onClick={() => setServicesOpen(false)}
                        className="inline-flex items-center gap-1 font-semibold text-sea-300 transition-colors hover:text-white"
                      >
                        Book free call
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right actions: Live concierge badge + glowing CTA + mobile toggle */}
          <div className="flex shrink-0 items-center gap-2.5">
            <a
              href="#contact"
              className="hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-sea-200/80 bg-sea-50/70 px-3 py-1.5 text-[11px] font-semibold text-sea-800 transition-all hover:border-sea-300 hover:bg-sea-100/80 xl:inline-flex"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sea-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sea-600" />
              </span>
              <span className="whitespace-nowrap">24/7 Live</span>
            </a>

            <div className="hidden shrink-0 sm:block">
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="group relative inline-flex shrink-0 items-center gap-2 whitespace-nowrap overflow-hidden rounded-full bg-ark-950 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-ark-950/20 transition-all hover:bg-ark-900 hover:shadow-sea-500/30 sm:px-5 sm:py-2.5"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-1/3 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-sea-300/40 to-transparent transition-transform duration-700 group-hover:translate-x-[340%]"
                />
                <Sparkles className="relative h-3.5 w-3.5 shrink-0 text-sea-300 transition-transform duration-300 group-hover:rotate-12" />
                <span className="relative whitespace-nowrap">Get Started</span>
                <ArrowRight className="relative h-3.5 w-3.5 shrink-0 text-sea-300 transition-transform duration-300 group-hover:translate-x-0.5" />
              </motion.a>
            </div>

            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white/80 text-ark-900 shadow-sm transition-colors hover:border-sea-300 hover:bg-sea-50 lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <X className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Menu className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* Smooth scroll progress bar along bottom edge */}
        <motion.div
          aria-hidden
          style={{ scaleX }}
          className={`pointer-events-none absolute inset-x-6 bottom-0 h-[2px] origin-left rounded-full bg-gradient-to-r from-sea-600 via-sea-400 to-ark-700 transition-opacity duration-300 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Mobile drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: EASE }}
              className="overflow-hidden border-t border-slate-200/60 lg:hidden"
            >
              <div className="space-y-4 px-4 pb-5 pt-4">
                <div className="grid grid-cols-2 gap-2">
                  {NAV_SERVICES.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.title}
                        href={s.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 rounded-2xl border border-slate-200/70 bg-white/80 p-2.5 text-left shadow-xs transition-colors hover:border-sea-300 hover:bg-sea-50/60"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-ark-900 text-sea-300">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-ark-900">
                            {s.title}
                          </p>
                          <p className="text-[10px] font-medium text-sea-600">
                            {s.tag}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-1">
                  {NAV_LINKS.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-ark-900 transition-colors hover:bg-sea-50"
                    >
                      <span>{l.label}</span>
                      <ArrowUpRight className="h-4 w-4 text-sea-600" />
                    </a>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3 rounded-2xl bg-ark-950 p-3 text-white">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="h-2 w-2 rounded-full bg-sea-400 shadow-[0_0_8px_#72a6a8]" />
                    <span className="font-medium text-sea-100">
                      24/7 Global Concierge
                    </span>
                  </div>
                  <a
                    href="#contact"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-sea-500 px-3.5 py-1.5 text-xs font-bold text-ark-950"
                  >
                    Get Started
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.header>
  );
}

function Logo({ light = false, compact = false }) {
  return (
    <a
      href="#"
      aria-label="ArkMED home"
      className="group flex shrink-0 items-center gap-2.5 whitespace-nowrap"
    >
      <span className="relative flex shrink-0 items-center justify-center">
        <span
          aria-hidden
          className="absolute -inset-1 rounded-full bg-sea-400/0 blur-md transition-colors duration-300 group-hover:bg-sea-400/25"
        />
        <Image
          src={light ? "/logo-mark-light.png" : "/logo-mark.png"}
          alt=""
          width={700}
          height={477}
          priority
          className={`relative w-auto transition-all duration-300 group-hover:scale-105 ${
            compact ? "h-8" : "h-9"
          }`}
        />
      </span>
      <div className="flex flex-col whitespace-nowrap">
        <span
          className={`whitespace-nowrap text-xl font-extrabold leading-none tracking-tight ${
            light ? "text-white" : "text-ark-900"
          }`}
        >
          Ark<span className={light ? "text-sea-300" : "text-sea-500"}>MED</span>
        </span>
        <span
          className={`mt-0.5 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 ${
            light ? "text-sea-200/70" : "text-slate-400"
          } ${compact ? "hidden sm:block" : "block"}`}
        >
          Global Health
        </span>
      </div>
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

const ROTATING_WORDS = ["Healthcare", "Medicine", "Wellness", "Care"];

const JOURNEY = [
  { n: "01", label: "Consultation", icon: CalendarCheck },
  { n: "02", label: "Travel & Stay", icon: Plane },
  { n: "03", label: "Treatment", icon: HeartPulse },
];

const HERO_STATS = [
  { to: 40, suffix: "+", label: "Countries" },
  { to: 225, suffix: "+", label: "Partner clinics" },
  { to: 40, suffix: "k", label: "Patients guided" },
];

/** Animated number that counts up when scrolled into view */
function CountUp({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 2,
      delay: 1,
      ease: EASE,
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

/** Headline word that blurs + rises in */
const wordIn = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE },
  },
};

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % ROTATING_WORDS.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-flex overflow-hidden pb-2 align-bottom">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={ROTATING_WORDS[i]}
          initial={{ y: "100%", opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.55, ease: EASE }}
          className="bg-gradient-to-r from-ark-800 via-sea-600 to-sea-400 bg-clip-text text-transparent"
        >
          {ROTATING_WORDS[i]}
        </motion.span>
      </AnimatePresence>
      <span className="bg-gradient-to-r from-sea-400 to-sea-300 bg-clip-text text-transparent">.</span>
    </span>
  );
}

function FloatingChip({ icon: Icon, title, sub, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.6 + delay, type: "spring", stiffness: 200, damping: 16 }}
      className={`absolute z-20 hidden lg:block ${className}`}
    >
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5 + delay * 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-xl shadow-sea-900/10 backdrop-blur-xl"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sea-600 text-white">
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-left">
          <span className="block text-xs font-bold text-ark-900">{title}</span>
          <span className="block text-[11px] text-slate-500">{sub}</span>
        </span>
      </motion.div>
    </motion.div>
  );
}

/** Dashboard mockup with mouse-driven 3D tilt and a live journey tracker */
function HeroDashboard() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 4), 2400);
    return () => clearInterval(t);
  }, []);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 120, damping: 18 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const progress = Math.round((step / 3) * 100);

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative mx-auto mt-16 max-w-5xl px-6 [perspective:1400px]"
    >
      <FloatingChip icon={BadgeCheck} title="Visa approved" sub="Within 48 hours" className="-left-2 top-16 xl:-left-10" />
      <FloatingChip icon={Star} title="4.9 / 5 rating" sub="From 12k+ patients" className="-right-2 top-40 xl:-right-10" delay={0.4} />
      <FloatingChip icon={Plane} title="Flight booked" sub="Istanbul → Dubai" className="bottom-24 left-4 xl:-left-4" delay={0.8} />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, y: 90, rotateX: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.8 }}
        className="relative"
      >
        {/* Glow under the dashboard */}
        <div
          aria-hidden
          className="absolute -inset-x-10 -bottom-10 top-20 -z-10 rounded-[3rem] bg-gradient-to-b from-sea-400/30 to-sea-300/0 blur-3xl"
        />

        <div className="overflow-hidden rounded-t-3xl border border-slate-700/60 bg-ark-900 p-2 shadow-2xl shadow-sea-900/30 sm:p-3">
          <div className="flex items-center gap-1.5 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-sea-400" />
            <span className="ml-3 text-[11px] text-slate-400">Ark Med · Patient Connect</span>
            <span className="ml-auto flex items-center gap-1.5 text-[11px] text-sea-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sea-400/70" />
                <span className="relative h-2 w-2 rounded-full bg-sea-400" />
              </span>
              Live
            </span>
          </div>

          <div className="grid gap-4 rounded-2xl bg-slate-50 p-4 sm:p-6 md:grid-cols-[1.6fr_1fr]">
            <div>
              <h3 className="text-lg font-bold text-ark-900">Your journey. All connected.</h3>
              <p className="mt-1 text-sm text-slate-500">
                From first consultation to recovery, every step in one place.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {JOURNEY.map((s, i) => {
                  const done = step > i;
                  const active = step === i;
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={s.n}
                      animate={{ y: active ? -6 : 0, scale: active ? 1.03 : 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`relative overflow-hidden rounded-xl border p-4 transition-colors duration-500 ${
                        active
                          ? "border-sea-500 bg-sea-50 shadow-lg shadow-sea-500/20"
                          : done
                          ? "border-sea-200 bg-white"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sea-700">{s.n}</span>
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-500 ${
                            done ? "bg-sea-600 text-white" : active ? "bg-sea-100 text-sea-700" : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-ark-900">{s.label}</p>
                      <p className={`text-xs ${active ? "font-medium text-sea-700" : "text-slate-500"}`}>
                        {done ? "Completed" : active ? "In progress…" : "Upcoming"}
                      </p>
                      {active && (
                        <motion.span
                          layoutId="hero-step-bar"
                          className="absolute inset-x-0 bottom-0 h-0.5 bg-sea-500"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-ark-800 to-sea-600 p-5 text-white">
              <motion.div
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-dashed border-white/25"
              />
              <Globe2 className="relative h-6 w-6 text-sea-100" />
              <p className="relative mt-3 text-sm font-semibold">A world of care, closer to you.</p>
              <p className="relative mt-1 text-xs text-sea-50/80">
                Vetted hospitals, transparent pricing, and 24/7 concierge support.
              </p>
              <div className="relative mt-4 flex items-center justify-between text-[11px] text-sea-50">
                <span>Journey progress</span>
                <span className="font-bold tabular-nums">{progress}%</span>
              </div>
              <div className="relative mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/20">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.9, ease: EASE }}
                  className="h-full rounded-full bg-white shadow-[0_0_12px_#fff]"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const blobY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative overflow-hidden bg-white pt-32 [--mx:50%] [--my:30%]"
    >
      {/* Aurora background */}
      <motion.div style={{ y: blobY }} aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ x: [0, 60, -30, 0], y: [0, 30, -20, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-20 top-0 h-[460px] w-[460px] rounded-full bg-sea-300/40 blur-[110px]"
        />
        <motion.div
          animate={{ x: [0, -70, 30, 0], y: [0, 40, -10, 0], scale: [1, 0.9, 1.2, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-24 top-10 h-[500px] w-[500px] rounded-full bg-sea-300/40 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 40, -40, 0], scale: [1, 1.2, 1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/3 top-48 h-[380px] w-[380px] rounded-full bg-sea-200/40 blur-[100px]"
        />
      </motion.div>

      {/* Grid + cursor spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(#0f172a14_1px,transparent_1px),linear-gradient(90deg,#0f172a14_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_30%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden sm:block [background:radial-gradient(420px_circle_at_var(--mx)_var(--my),rgba(86,139,141,0.14),transparent_70%)]"
      />

      <motion.div
        style={{ y: textY }}
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex max-w-4xl flex-col items-center px-6 text-center"
      >
        {/* Badge with shimmer */}
        <motion.span
          variants={fadeUp}
          className="relative mb-6 inline-flex items-center gap-2 overflow-hidden rounded-full border border-sea-200 bg-white/70 px-4 py-1.5 text-xs font-semibold text-sea-800 shadow-sm backdrop-blur"
        >
          <motion.span
            aria-hidden
            animate={{ x: ["-120%", "320%"] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
            className="absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-sea-300/50 to-transparent"
          />
          <Sparkles className="relative h-3.5 w-3.5" />
          <span className="relative">Global Healthcare Opportunities</span>
        </motion.span>

        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-ark-900 sm:text-6xl lg:text-7xl">
          <motion.span variants={stagger} className="flex flex-wrap justify-center gap-x-3 sm:gap-x-4">
            {["Bridging", "Borders", "in"].map((w) => (
              <motion.span key={w} variants={wordIn} className="inline-block">
                {w}
              </motion.span>
            ))}
          </motion.span>
          <motion.span
            variants={wordIn}
            className="mt-1 flex flex-wrap justify-center gap-x-3 sm:gap-x-4"
          >
            <span>Global</span>
            <RotatingWord />
          </motion.span>
        </h1>

        <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-base text-slate-600 sm:text-lg">
          Connecting patients, optimizing clinics, and streamlining medical
          procurement worldwide, all through one trusted partner.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
          <span className="relative">
            <motion.span
              aria-hidden
              animate={{ scale: [1, 1.25, 1.25], opacity: [0.5, 0, 0] }}
              transition={{ duration: 2.4, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-sea-500"
            />
            <Button href="#services">Explore Services</Button>
          </span>
          <Button href="#contact" variant="secondary" icon={false}>
            Partner With Us
          </Button>
        </motion.div>

        {/* Count-up stats */}
        <motion.dl
          variants={fadeUp}
          className="mt-12 grid w-full max-w-lg grid-cols-3 divide-x divide-slate-200"
        >
          {HERO_STATS.map((s) => (
            <div key={s.label} className="flex flex-col px-2">
              <dt className="order-2 text-[11px] text-slate-500 sm:text-xs">{s.label}</dt>
              <dd className="text-2xl font-extrabold tabular-nums text-ark-900 sm:text-3xl">
                <CountUp to={s.to} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      <HeroDashboard />
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bento services                                                             */
/* -------------------------------------------------------------------------- */

/** Card whose border + surface light up under the cursor */
function SpotlightCard({ className = "", innerClassName = "", children, delay = 0 }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <motion.article
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={viewport}
      transition={{ duration: 0.9, ease: EASE, delay }}
      whileHover={{ y: -8 }}
      className={`group relative rounded-3xl bg-slate-200/80 p-px shadow-sm transition-shadow duration-500 [--x:50%] [--y:50%] hover:shadow-2xl hover:shadow-sea-900/20 ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(360px_circle_at_var(--x)_var(--y),#568b8d,transparent_65%)]"
      />
      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-[calc(1.5rem-1px)] p-6 sm:p-8 ${innerClassName}`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(280px_circle_at_var(--x)_var(--y),rgba(86,139,141,0.14),transparent_70%)]"
        />
        {children}
      </div>
    </motion.article>
  );
}

function CardHead({ index, icon: Icon, dark = false }) {
  return (
    <div className="relative mb-5 flex items-center justify-between">
      <span
        className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 ${
          dark
            ? "bg-sea-400/15 text-sea-300 ring-1 ring-sea-400/30"
            : "bg-sea-50 text-sea-700 ring-1 ring-sea-100"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span
        className={`text-xs font-bold tracking-widest ${
          dark ? "text-white/30" : "text-slate-300"
        }`}
      >
        {index}
      </span>
    </div>
  );
}

function LearnMore({ dark = false }) {
  return (
    <span
      className={`relative mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold ${
        dark ? "text-sea-300" : "text-sea-700"
      }`}
    >
      Learn more
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
    </span>
  );
}

/** Animated flight path with a moving plane */
function RouteVisual() {
  const d = "M30 105 Q 150 -15 270 85";
  const pin = { transformBox: "fill-box", transformOrigin: "center" };
  return (
    <svg viewBox="0 0 300 130" className="relative my-6 h-32 w-full" fill="none" aria-hidden>
      <motion.path
        d={d}
        stroke="#72a6a8"
        strokeWidth="1.5"
        strokeDasharray="4 5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={viewport}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }}
      />
      {[[30, 105, "Your city"], [270, 85, "Top clinic"]].map(([x, y, t]) => (
        <g key={t}>
          <circle cx={x} cy={y} r="6" fill="#72a6a8" className="animate-ping" style={pin} opacity="0.5" />
          <circle cx={x} cy={y} r="4.5" fill="#72a6a8" />
          <text x={x} y={y + 18} textAnchor="middle" fontSize="9" fill="#94a3b8">
            {t}
          </text>
        </g>
      ))}
      <path d="M-9 -5 L9 0 L-9 5 L-5 0Z" fill="#fff">
        <animateMotion dur="4.5s" repeatCount="indefinite" rotate="auto" path={d} />
      </path>
    </svg>
  );
}

const BARS = [30, 45, 38, 62, 55, 88];

function Sparkline() {
  return (
    <svg viewBox="0 0 150 50" className="relative mt-5 h-16 w-full" fill="none" aria-hidden>
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#568b8d" stopOpacity="0.35" />
          <stop offset="1" stopColor="#568b8d" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d="M0 42 C 20 40, 28 22, 48 26 S 80 12, 100 16 S 130 5, 150 3 L150 50 L0 50Z"
        fill="url(#spark)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewport}
        transition={{ delay: 1, duration: 1 }}
      />
      <motion.path
        d="M0 42 C 20 40, 28 22, 48 26 S 80 12, 100 16 S 130 5, 150 3"
        stroke="#447174"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={viewport}
        transition={{ duration: 1.8, ease: "easeInOut", delay: 0.3 }}
      />
    </svg>
  );
}

function ShipmentTrack() {
  return (
    <div className="relative mt-5">
      <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
        <span>Warehouse</span>
        <span>Hospital</span>
      </div>
      <div className="relative mt-2 h-1.5 rounded-full bg-slate-200">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "68%" }}
          viewport={viewport}
          transition={{ duration: 1.6, ease: EASE, delay: 0.4 }}
          className="h-full rounded-full bg-gradient-to-r from-sea-500 to-sea-400"
        />
        <motion.span
          initial={{ left: 0 }}
          whileInView={{ left: "68%" }}
          viewport={viewport}
          transition={{ duration: 1.6, ease: EASE, delay: 0.4 }}
          className="absolute -top-3 -translate-x-1/2 rounded-full bg-sea-600 p-1.5 text-white shadow-lg shadow-sea-600/40"
        >
          <Truck className="h-3.5 w-3.5" />
        </motion.span>
      </div>
      <p className="mt-3 text-[11px] text-slate-500">
        Order #A-2041 · <span className="font-semibold text-sea-700">In transit</span>
      </p>
    </div>
  );
}

const CHAT = [
  { from: "user", text: "I need a knee replacement. Where can I go?" },
  { from: "bot", text: "Matched you with 3 top orthopedic hospitals. Est. savings: 58%." },
  { from: "user", text: "Can you arrange my travel too?" },
  { from: "bot", text: "Flights, visa & hotel are booked. See you Monday ✈️" },
];

const SAVINGS = [
  { label: "Dental", pct: 65 },
  { label: "Hair transplant", pct: 70 },
  { label: "Cardiac care", pct: 55 },
  { label: "Eye surgery", pct: 60 },
];

/** Looping fake concierge chat: messages arrive one by one with typing dots */
function ConciergeChat() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setTimeout(
      () => setStep((s) => (s > CHAT.length + 1 ? 0 : s + 1)),
      step > CHAT.length ? 3200 : 1700
    );
    return () => clearTimeout(t);
  }, [step]);

  const shown = CHAT.slice(0, Math.min(step, CHAT.length));
  const typing = step < CHAT.length && CHAT[step].from === "bot";

  return (
    <div className="flex min-h-[17rem] flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-sea-500/20 text-sea-300">
          <MessageCircle className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-ark-900 bg-sea-400" />
        </span>
        <div className="text-left">
          <p className="text-xs font-bold text-white">Ark Med Concierge</p>
          <p className="text-[11px] text-sea-300">Online · replies in ~3 min</p>
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col justify-end gap-2 overflow-hidden">
        <AnimatePresence initial={false}>
          {shown.map((m, i) => (
            <motion.p
              key={i}
              layout
              initial={{ opacity: 0, y: 14, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 26 }}
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-left text-xs leading-relaxed ${
                m.from === "user"
                  ? "self-end rounded-br-sm bg-sea-500 text-ark-950"
                  : "self-start rounded-bl-sm bg-white/10 text-slate-100"
              }`}
            >
              {m.text}
            </motion.p>
          ))}
          {typing && (
            <motion.div
              key="typing"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-fit gap-1 self-start rounded-2xl rounded-bl-sm bg-white/10 px-3.5 py-3"
            >
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }}
                  className="h-1.5 w-1.5 rounded-full bg-slate-300"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Savings comparison bars + service highlights */
function SavingsPanel() {
  return (
    <div className="flex min-h-[17rem] flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-white">Typical savings abroad</p>
        <span className="rounded-full bg-sea-400/15 px-2 py-0.5 text-[10px] font-semibold text-sea-300">
          vs. home country
        </span>
      </div>

      <ul className="mt-4 flex flex-1 flex-col justify-between gap-3">
        {SAVINGS.map((s, i) => (
          <li key={s.label}>
            <div className="mb-1.5 flex justify-between text-[11px]">
              <span className="text-slate-300">{s.label}</span>
              <span className="font-bold tabular-nums text-sea-300">-{s.pct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${s.pct}%` }}
                viewport={viewport}
                transition={{ duration: 1.3, ease: EASE, delay: 0.5 + i * 0.15 }}
                className="relative h-full rounded-full bg-gradient-to-r from-sea-500 to-sea-300"
              >
                <motion.span
                  aria-hidden
                  animate={{ x: ["-100%", "400%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.5, delay: i * 0.3 }}
                  className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                />
              </motion.div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-center">
        {[
          ["24/7", "Support"],
          ["12", "Languages"],
          ["3 min", "Avg. reply"],
        ].map(([v, l]) => (
          <div key={l}>
            <p className="text-sm font-extrabold text-white">{v}</p>
            <p className="text-[10px] text-slate-400">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TourismExtras() {
  return (
    <div className="relative mt-6 grid flex-1 gap-4 md:grid-cols-2">
      <ConciergeChat />
      <SavingsPanel />
    </div>
  );
}

function BentoServices() {
  return (
    <section id="services" className="relative overflow-hidden bg-slate-50 py-28">
      <div
        aria-hidden
        className="absolute inset-0 opacity-60 [background-image:radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-sea-200/40 blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <Eyebrow>Our Services</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ark-900 sm:text-5xl">
              One partner. A world of
              <br className="hidden sm:block" />{" "}
              <span className="bg-gradient-to-r from-ark-800 to-sea-500 bg-clip-text text-transparent">
                possibilities.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="max-w-sm text-slate-600">
            Four pillars that cover every stage of international healthcare,
            from patient to procurement.
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* 01 Medical Tourism: dark hero card, spans 2 cols x 2 rows */}
          <SpotlightCard
            className="md:col-span-2 md:row-span-2"
            innerClassName="bg-gradient-to-br from-ark-950 via-ark-900 to-sea-900 text-white"
          >
            <div
              aria-hidden
              className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sea-500/20 blur-3xl"
            />
            <CardHead index="01" icon={Plane} dark />
            <h3 className="relative text-2xl font-extrabold sm:text-4xl">Medical Tourism</h3>
            <p className="relative mt-3 max-w-md text-slate-300">
              Seamless global patient care and travel, from clinic matching to
              visas, stays, and recovery.
            </p>
            <RouteVisual />
            <ul className="relative grid gap-3 sm:grid-cols-3">
              {[
                "Hospital & specialist matching",
                "Travel, visa & stay concierge",
                "Post-treatment follow-up",
              ].map((t, i) => (
                <motion.li
                  key={t}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewport}
                  transition={{ delay: 0.5 + i * 0.12, duration: 0.6, ease: EASE }}
                  className="flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs font-medium text-slate-100 backdrop-blur transition-colors hover:border-sea-400/40 hover:bg-white/10"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sea-400/20 text-sea-300">
                    <Check className="h-3 w-3" />
                  </span>
                  {t}
                </motion.li>
              ))}
            </ul>
            <TourismExtras />
            <LearnMore dark />
          </SpotlightCard>

          {/* 02 Consulting */}
          <SpotlightCard delay={0.1} innerClassName="bg-white">
            <CardHead index="02" icon={BarChart3} />
            <div className="relative flex items-end justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-ark-900">Medical Consulting</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Strategy that helps clinics grow and operate globally.
                </p>
              </div>
              <div className="flex h-24 shrink-0 items-end gap-1.5">
                {BARS.map((h, i) => (
                  <motion.span
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={viewport}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.8, ease: EASE }}
                    className="w-3 rounded-t-md bg-gradient-to-t from-sea-700 to-sea-400 transition-all duration-300 group-hover:brightness-110"
                  />
                ))}
              </div>
            </div>
            <span className="relative mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-sea-50 px-2.5 py-1 text-xs font-bold text-sea-700">
              <TrendingUp className="h-3.5 w-3.5" /> +34% avg. clinic growth
            </span>
            <LearnMore />
          </SpotlightCard>

          {/* 03 + 04 */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-1">
            <SpotlightCard delay={0.2} innerClassName="bg-sea-50">
              <CardHead index="03" icon={Megaphone} />
              <div className="relative flex items-start justify-between">
                <h3 className="text-lg font-bold text-ark-900">Healthcare Marketing</h3>
                <span className="rounded-full bg-sea-600 px-2 py-0.5 text-[11px] font-bold text-white">
                  +248%
                </span>
              </div>
              <p className="relative mt-2 text-sm text-slate-600">
                Reach international patients with trusted, compliant campaigns.
              </p>
              <Sparkline />
              <LearnMore />
            </SpotlightCard>

            <SpotlightCard delay={0.3} innerClassName="bg-white">
              <CardHead index="04" icon={Package} />
              <h3 className="relative text-lg font-bold text-ark-900">Medical Procurement</h3>
              <p className="relative mt-2 text-sm text-slate-600">
                Certified equipment and supplies, sourced and delivered.
              </p>
              <ShipmentTrack />
              <LearnMore />
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Marquee divider                                                            */
/* -------------------------------------------------------------------------- */

const MARQUEE_ITEMS = [
  "Medical Tourism",
  "Medical Consulting",
  "Healthcare Marketing",
  "Medical Procurement",
  "Global Network",
  "24/7 Concierge",
];

function Marquee() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-ark-900 via-sea-800 to-sea-600 py-4 text-white">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        className="flex w-max gap-10 whitespace-nowrap"
      >
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-10 text-sm font-semibold uppercase tracking-[0.25em]"
          >
            {t}
            <Sparkles className="h-4 w-4 text-sea-200" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Value proposition (alternating Z-pattern)                                  */
/* -------------------------------------------------------------------------- */

const VALUE_ROWS = [
  {
    eyebrow: "Why Ark Med",
    title: "Trusted International Connections",
    body: "We build lasting relationships with accredited hospitals, specialists, and partners worldwide so every patient and provider is matched with confidence.",
    bullets: ["Accredited hospitals only", "Transparent, upfront pricing", "One dedicated coordinator"],
    cta: "Meet our network",
    icon: ShieldCheck,
    stat: { value: "98%", label: "Patient satisfaction" },
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    alt: "Glass globe on a modern clinic desk",
  },
  {
    eyebrow: "Our Impact",
    title: "Sustainable Healthcare Opportunities",
    body: "Our approach strengthens local healthcare systems while expanding access, creating long-term value for clinics, communities, and patients alike.",
    bullets: ["Capacity building for clinics", "Ethical, compliant partnerships", "Long-term growth programs"],
    cta: "See how we work",
    icon: HeartPulse,
    stat: { value: "225+", label: "Clinics empowered" },
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    alt: "Doctors reviewing a tablet together",
  },
];

/** Image that reveals with a wipe and drifts slower than the page */
function ParallaxImage({ src, alt }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);
  return (
    <div ref={ref} className="relative">
      <motion.div
        initial={false}
        animate={{ clipPath: inView ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
        transition={{ duration: 1.3, ease: EASE }}
        className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-sea-100 shadow-2xl shadow-ark-900/20"
      >
        <motion.img
          src={src}
          alt={alt}
          style={{ y, scale: 1.2 }}
          whileHover={{ scale: 1.28 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-sea-900/30 via-transparent to-transparent" />
      </motion.div>
    </div>
  );
}

function ValueRow({ row, reverse, index }) {
  const Icon = row.icon;
  return (
    <div className="grid items-center gap-14 md:grid-cols-2 md:gap-20">
      {/* Visual */}
      <Reveal x={reverse ? 80 : -80} y={0} className={reverse ? "md:order-2" : ""}>
        <div className="relative">
          <div
            aria-hidden
            className={`absolute -inset-3 -z-10 rounded-[2.25rem] bg-gradient-to-br from-sea-300/60 to-sea-100 ${
              reverse ? "-rotate-3" : "rotate-3"
            }`}
          />
          <ParallaxImage src={row.image} alt={row.alt} />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute -bottom-6 ${
              reverse ? "-left-3 sm:-left-8" : "-right-3 sm:-right-8"
            }`}
          >
            <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-5 py-4 shadow-xl shadow-sea-900/10 backdrop-blur-xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sea-600 text-white">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-2xl font-extrabold leading-none text-ark-900">
                  {row.stat.value}
                </span>
                <span className="text-xs text-slate-500">{row.stat.label}</span>
              </span>
            </div>
          </motion.div>
        </div>
      </Reveal>

      {/* Copy */}
      <Reveal x={reverse ? -80 : 80} y={0} delay={0.1} className={reverse ? "md:order-1" : ""}>
        <span className="block text-7xl font-black leading-none text-transparent [-webkit-text-stroke:1.5px_#98c2c4]">
          0{index + 1}
        </span>
        <div className="mt-4">
          <Eyebrow>{row.eyebrow}</Eyebrow>
        </div>
        <h3 className="mt-4 text-3xl font-extrabold tracking-tight text-ark-900 sm:text-4xl">
          {row.title}
        </h3>
        <p className="mt-4 max-w-lg text-slate-600">{row.body}</p>
        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mt-6 space-y-3"
        >
          {row.bullets.map((b) => (
            <motion.li
              key={b}
              variants={fadeUp}
              className="flex items-center gap-3 text-sm font-medium text-ark-800"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sea-100 text-sea-700">
                <Check className="h-3.5 w-3.5" />
              </span>
              {b}
            </motion.li>
          ))}
        </motion.ul>
        <div className="mt-8">
          <Button href="#network" variant="secondary">
            {row.cta}
          </Button>
        </div>
      </Reveal>
    </div>
  );
}

function ValueProp() {
  return (
    <section id="why-us" className="relative isolate overflow-hidden bg-white py-28">
      <div
        aria-hidden
        className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-sea-100/70 blur-[110px]"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-32 px-6">
        {VALUE_ROWS.map((row, i) => (
          <ValueRow key={row.title} row={row} reverse={i % 2 === 1} index={i} />
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Global reach                                                               */
/* -------------------------------------------------------------------------- */

const PARTNERS = ["VITALIS", "medixa", "AUREA HEALTH", "cardiclinic", "NOVACARE"];

/* Map projection: equirectangular, lat 80 → -60 mapped onto a 1000×500 box */
const MAP_W = 1000;
const MAP_H = 500;
const project = (lon, lat) => [
  ((lon + 180) / 360) * MAP_W,
  ((80 - lat) / 140) * MAP_H,
];

/* Rough continent outlines [lon, lat] used to build the dotted world map */
const LAND = [
  // North America
  [[-168,66],[-160,71],[-140,70],[-120,70],[-95,72],[-80,73],[-62,66],[-55,52],[-66,45],[-76,38],[-81,30],[-80,25],[-83,29],[-90,29],[-97,26],[-97,20],[-87,21],[-83,15],[-79,9],[-85,10],[-92,15],[-105,20],[-110,24],[-115,30],[-118,34],[-124,40],[-124,48],[-135,58],[-150,60],[-165,60]],
  // Greenland
  [[-73,78],[-60,82],[-30,83],[-20,75],[-22,70],[-40,62],[-50,64],[-58,75]],
  // South America
  [[-80,9],[-72,12],[-62,10],[-50,0],[-35,-6],[-39,-15],[-48,-26],[-58,-37],[-65,-42],[-68,-52],[-72,-54],[-75,-47],[-73,-37],[-71,-20],[-76,-14],[-81,-5],[-80,0]],
  // Eurasia
  [[-10,36],[-9,43],[-2,44],[-5,48],[2,51],[8,54],[10,58],[5,62],[15,69],[28,71],[45,68],[60,70],[80,73],[105,77],[130,72],[160,70],[180,68],[180,65],[170,60],[160,55],[155,58],[142,59],[135,54],[140,48],[130,42],[126,37],[122,40],[121,31],[117,24],[108,21],[106,10],[100,13],[103,2],[98,8],[97,17],[92,22],[88,22],[80,15],[77,8],[73,18],[67,25],[62,25],[57,26],[56,24],[59,22],[52,16],[43,13],[39,21],[35,28],[34,31],[36,36],[28,36],[26,40],[24,37],[22,37],[19,42],[13,45],[16,41],[12,42],[8,44],[3,43],[-1,38],[-6,36]],
  // Africa
  [[-17,21],[-10,30],[-6,36],[10,37],[11,33],[20,31],[32,31],[35,28],[39,21],[43,12],[51,12],[48,5],[40,-3],[40,-15],[35,-24],[32,-29],[20,-35],[18,-32],[12,-17],[13,-6],[9,4],[-8,4],[-13,8],[-17,15]],
  // Madagascar, Australia, UK, Japan, Indonesia
  [[44,-17],[50,-15],[48,-25],[44,-24]],
  [[114,-22],[122,-18],[130,-12],[137,-12],[142,-11],[146,-19],[153,-26],[150,-37],[141,-38],[135,-34],[129,-32],[115,-34]],
  [[-5,50],[1,51],[0,53],[-3,58],[-6,58],[-3,54]],
  [[130,31],[135,34],[141,38],[142,44],[140,41],[136,36],[131,34]],
  [[95,5],[106,-6],[104,-5],[98,0]],
  [[109,1],[117,7],[119,1],[116,-4],[110,-3]],
  [[131,-1],[141,-3],[150,-10],[141,-9],[135,-4]],
];

function inPolygon(lon, lat, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/** One SVG path made of tiny round dots → fast even with thousands of points */
function buildLandDots(step = 2.3) {
  let d = "";
  for (let lat = 78; lat > -58; lat -= step) {
    for (let lon = -178; lon < 180; lon += step) {
      if (LAND.some((p) => inPolygon(lon, lat, p))) {
        const [x, y] = project(lon, lat);
        d += `M${x.toFixed(1)} ${y.toFixed(1)}h0`;
      }
    }
  }
  return d;
}

const LOCATIONS = [
  { id: "tr", country: "Türkiye", flag: "🇹🇷", city: "Istanbul", lon: 29, lat: 41, partners: 48, focus: "Global HQ · Medical Tourism hub", hub: true },
  { id: "us", country: "United States", flag: "🇺🇸", city: "New York", lon: -74, lat: 40.7, partners: 22, focus: "Consulting & Procurement" },
  { id: "br", country: "Brazil", flag: "🇧🇷", city: "São Paulo", lon: -46.6, lat: -23.5, partners: 11, focus: "Patient referrals" },
  { id: "gb", country: "United Kingdom", flag: "🇬🇧", city: "London", lon: -0.1, lat: 51.5, partners: 19, focus: "Healthcare marketing" },
  { id: "de", country: "Germany", flag: "🇩🇪", city: "Berlin", lon: 13.4, lat: 52.5, partners: 17, focus: "Medical equipment sourcing" },
  { id: "eg", country: "Egypt", flag: "🇪🇬", city: "Cairo", lon: 31.2, lat: 30, partners: 9, focus: "Regional clinic network" },
  { id: "ng", country: "Nigeria", flag: "🇳🇬", city: "Lagos", lon: 3.4, lat: 6.5, partners: 8, focus: "Patient travel programs" },
  { id: "za", country: "South Africa", flag: "🇿🇦", city: "Johannesburg", lon: 28, lat: -26, partners: 10, focus: "Hospital partnerships" },
  { id: "ae", country: "UAE", flag: "🇦🇪", city: "Dubai", lon: 55.3, lat: 25.2, partners: 21, focus: "Gulf patient concierge" },
  { id: "in", country: "India", flag: "🇮🇳", city: "Mumbai", lon: 72.8, lat: 19, partners: 26, focus: "Specialist treatment centers" },
  { id: "sg", country: "Singapore", flag: "🇸🇬", city: "Singapore", lon: 103.8, lat: 1.3, partners: 13, focus: "Asia-Pacific consulting" },
  { id: "kr", country: "South Korea", flag: "🇰🇷", city: "Seoul", lon: 127, lat: 37.5, partners: 14, focus: "Aesthetic & oncology care" },
  { id: "au", country: "Australia", flag: "🇦🇺", city: "Sydney", lon: 151.2, lat: -33.9, partners: 7, focus: "Procurement & logistics" },
].map((l) => {
  const [x, y] = project(l.lon, l.lat);
  return { ...l, x, y, px: (x / MAP_W) * 100, py: (y / MAP_H) * 100 };
});

const HUB = LOCATIONS.find((l) => l.hub);

/** Curved connection from the hub to a location */
function arcPath(a, b) {
  const mx = (a.x + b.x) / 2;
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const my = Math.min(a.y, b.y) - dist * 0.28;
  return `M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`;
}

const REACH_STATS = [
  { icon: Globe2, value: "13", label: "Countries" },
  { icon: Building2, value: "225+", label: "Partner clinics" },
  { icon: Users, value: "40k", label: "Patients guided" },
];

function LocationCard({ loc, compact = false }) {
  return (
    <div
      className={`rounded-2xl border border-sea-400/30 bg-ark-950/80 p-4 text-left shadow-2xl shadow-sea-500/20 backdrop-blur-xl ${
        compact ? "w-full" : "w-60"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl leading-none">{loc.flag}</span>
        <div>
          <p className="text-sm font-bold text-white">{loc.country}</p>
          <p className="flex items-center gap-1 text-xs text-slate-400">
            <MapPin className="h-3 w-3 text-sea-400" />
            {loc.city}
          </p>
        </div>
        {loc.hub && (
          <span className="ml-auto rounded-full bg-sea-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sea-300">
            Hub
          </span>
        )}
      </div>
      <p className="mt-3 text-xs text-slate-300">{loc.focus}</p>
      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
        <span className="text-slate-400">Partner clinics</span>
        <span className="font-bold text-sea-300">{loc.partners}</span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, loc.partners * 2)}%` }}
          transition={{ duration: 0.8, ease: EASE }}
          className="h-full rounded-full bg-gradient-to-r from-sea-500 to-sea-300"
        />
      </div>
    </div>
  );
}

function WorldMap() {
  const [active, setActive] = useState(null);
  const landDots = useMemo(() => buildLandDots(), []);
  const activeLoc = LOCATIONS.find((l) => l.id === active);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div className="mt-12">
      <div
        onMouseMove={onMove}
        onMouseLeave={() => setActive(null)}
        className="relative mx-auto aspect-[2/1] max-w-5xl [--mx:50%] [--my:50%]"
      >
        {/* Cursor spotlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden opacity-70 sm:block [background:radial-gradient(260px_circle_at_var(--mx)_var(--my),rgba(114,166,168,0.16),transparent_70%)]"
        />

        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="absolute inset-0 h-full w-full"
          fill="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="arc" x1="0" x2="1">
              <stop offset="0" stopColor="#72a6a8" stopOpacity="0.1" />
              <stop offset="0.5" stopColor="#98c2c4" />
              <stop offset="1" stopColor="#72a6a8" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Dotted continents */}
          <motion.path
            d={landDots}
            stroke="#3f6f72"
            strokeWidth="3.2"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.85 }}
            viewport={viewport}
            transition={{ duration: 1.6 }}
          />

          {/* Connection arcs */}
          {LOCATIONS.filter((l) => !l.hub).map((l, i) => {
            const d = arcPath(HUB, l);
            const on = active === l.id;
            return (
              <g key={l.id}>
                <motion.path
                  d={d}
                  stroke={on ? "#98c2c4" : "url(#arc)"}
                  strokeWidth={on ? 2.2 : 1}
                  strokeDasharray={on ? "0" : "3 5"}
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={viewport}
                  transition={{ duration: 1.8, delay: 0.4 + i * 0.12, ease: "easeInOut" }}
                  style={{ filter: on ? "drop-shadow(0 0 6px #72a6a8)" : "none" }}
                />
                <circle r="2.4" fill="#c0dbdb">
                  <animateMotion
                    dur={`${3.5 + (i % 4) * 0.7}s`}
                    begin={`${i * 0.4}s`}
                    repeatCount="indefinite"
                    path={d}
                  />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Interactive markers */}
        {LOCATIONS.map((l, i) => {
          const isActive = active === l.id;
          const below = l.py < 40;
          const alignX =
            l.px < 22 ? "left-0" : l.px > 78 ? "right-0" : "left-1/2 -translate-x-1/2";
          return (
            <div
              key={l.id}
              style={{ left: `${l.px}%`, top: `${l.py}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 ${
                isActive ? "z-30" : "z-10"
              }`}
            >
              <motion.button
                type="button"
                aria-label={`${l.country}, ${l.city}`}
                aria-expanded={isActive}
                onMouseEnter={() => setActive(l.id)}
                onFocus={() => setActive(l.id)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(isActive ? null : l.id)}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={viewport}
                transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.5 }}
                className="group relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full outline-none"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sea-400/40" />
                <span
                  className={`absolute h-5 w-5 rounded-full border transition-all duration-300 ${
                    isActive
                      ? "scale-125 border-sea-300"
                      : "border-sea-400/30 group-hover:border-sea-300"
                  }`}
                />
                <span
                  className={`relative block rounded-full bg-sea-400 shadow-[0_0_16px_#72a6a8] ${
                    l.hub ? "h-3.5 w-3.5 bg-sea-200" : "h-2.5 w-2.5"
                  }`}
                />
              </motion.button>

              {/* Tooltip (tablet/desktop) */}
              <AnimatePresence>
                {isActive && (
                  <div
                    className={`pointer-events-none absolute z-40 hidden sm:block ${alignX} ${
                      below ? "top-full pt-3" : "bottom-full pb-3"
                    }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: below ? -10 : 10, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.12 } }}
                      transition={{ type: "spring", stiffness: 380, damping: 26 }}
                    >
                      <LocationCard loc={l} />
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Mobile detail card */}
      <div className="mx-auto mt-4 min-h-[8rem] max-w-sm sm:hidden">
        <AnimatePresence mode="wait">
          {activeLoc ? (
            <motion.div
              key={activeLoc.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <LocationCard loc={activeLoc} compact />
            </motion.div>
          ) : (
            <p className="pt-8 text-sm text-slate-500">Tap a dot or country to explore.</p>
          )}
        </AnimatePresence>
      </div>

      {/* Country chips (synced with dots) */}
      <ul className="mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-2">
        {LOCATIONS.map((l) => (
          <li key={l.id}>
            <button
              type="button"
              onMouseEnter={() => setActive(l.id)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(active === l.id ? null : l.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                active === l.id
                  ? "scale-105 border-sea-400 bg-sea-400/15 text-sea-200 shadow-[0_0_20px_rgba(114,166,168,0.3)]"
                  : "border-white/10 bg-white/5 text-slate-400 hover:border-sea-400/50 hover:text-white"
              }`}
            >
              <span>{l.flag}</span>
              {l.country}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GlobalReach() {
  return (
    <section
      id="network"
      className="relative overflow-hidden bg-ark-950 py-24 text-white"
    >
      {/* Ambient background */}
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-96 w-[700px] -translate-x-1/2 rounded-full bg-sea-500/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <Eyebrow light>Global Reach</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            A Truly Global{" "}
            <span className="bg-gradient-to-r from-sea-300 to-sea-200 bg-clip-text text-transparent">
              Healthcare Network.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Connecting hospitals, clinics, and patients across continents with
            one unified standard of care.
          </p>
        </Reveal>

        {/* Stat pills */}
        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-3"
        >
          {REACH_STATS.map(({ icon: Icon, value, label }) => (
            <motion.li
              key={label}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 backdrop-blur transition-colors hover:border-sea-400/40"
            >
              <Icon className="mx-auto h-4 w-4 text-sea-400" />
              <p className="mt-2 text-xl font-bold sm:text-2xl">{value}</p>
              <p className="text-[11px] text-slate-400 sm:text-xs">{label}</p>
            </motion.li>
          ))}
        </motion.ul>

        <WorldMap />

        {/* Partners */}
        <Reveal delay={0.1} className="mt-16">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Trusted by leading healthcare partners
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {PARTNERS.map((p) => (
              <motion.li
                key={p}
                whileHover={{ scale: 1.1, color: "#98c2c4" }}
                className="flex cursor-default items-center gap-2 text-lg font-semibold text-slate-400"
              >
                <Stethoscope className="h-4 w-4" />
                {p}
              </motion.li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  How It Works (Dual-Mode Scrollytelling Timeline: Patient vs. Clinic)      */
/* -------------------------------------------------------------------------- */

const TIMELINE_DATA = {
  patient: {
    badge: "Patient Concierge Journey",
    headline: "From first question to full recovery.",
    sub: "Every medical, travel, and hospitality detail orchestrated by your personal care team.",
    metric: { value: "48 hrs", label: "Average time to receive 3 hospital treatment plans" },
    steps: [
      {
        step: "01",
        title: "Free Medical Board Review",
        duration: "Day 1 · Within 24h",
        icon: Stethoscope,
        summary:
          "Upload your scans or medical history securely. Our specialist board matches you with the top 3 JCI-accredited hospitals.",
        deliverables: [
          "3 itemized hospital treatment quotes",
          "Direct video call with lead surgeon",
          "Transparent zero-hidden-fee guarantee",
        ],
        previewStat: "100% Free",
        previewSub: "No commitment required",
      },
      {
        step: "02",
        title: "VIP Travel, Visa & 5-Star Stay",
        duration: "Days 2–4 · Concierge",
        icon: Plane,
        summary:
          "Our travel desk books your flights, fast-tracks medical visas, and reserves recovery-friendly 5-star partner hotels.",
        deliverables: [
          "Priority medical visa documentation",
          "Private airport & clinic chauffeur",
          "Dedicated 24/7 native-speaking host",
        ],
        previewStat: "Door-to-Door",
        previewSub: "All logistics handled",
      },
      {
        step: "03",
        title: "World-Class Treatment",
        duration: "Arrival · Procedure",
        icon: HeartPulse,
        summary:
          "Skip every waiting list. Arrive at your hospital with your bedside interpreter and coordinator already waiting for you.",
        deliverables: [
          "Zero waiting-room delays",
          "Daily family & doctor status briefings",
          "International medical insurance cover",
        ],
        previewStat: "99.4%",
        previewSub: "Clinical success benchmark",
      },
      {
        step: "04",
        title: "Recovery & 12-Month Aftercare",
        duration: "Post-Op · Home",
        icon: ShieldCheck,
        summary:
          "Recover comfortably before flying home, with continuous remote check-ins and local physician handoff.",
        deliverables: [
          "Fit-to-fly medical clearance",
          "Translated medical records & prescriptions",
          "12-month scheduled video follow-ups",
        ],
        previewStat: "12 Months",
        previewSub: "Continuous follow-up care",
      },
    ],
  },
  clinic: {
    badge: "Clinic & Hospital Growth Engine",
    headline: "Scale your hospital across borders.",
    sub: "Turnkey patient acquisition, international accreditation, and direct medical procurement.",
    metric: { value: "+248%", label: "Average increase in qualified international patient volume" },
    steps: [
      {
        step: "01",
        title: "Clinical Audit & Global Positioning",
        duration: "Phase 1 · Weeks 1–2",
        icon: BadgeCheck,
        summary:
          "We benchmark your specialties, streamline international patient workflows, and align pricing for high-demand corridors.",
        deliverables: [
          "50-point international readiness audit",
          "JCI & ISO compliance roadmap",
          "High-margin procedure packaging",
        ],
        previewStat: "Top 4%",
        previewSub: "Accredited partner tier",
      },
      {
        step: "02",
        title: "Multilingual Acquisition Launch",
        duration: "Phase 2 · Weeks 3–4",
        icon: Megaphone,
        summary:
          "Launch compliant, high-intent patient campaigns across 13+ countries backed by our 12-language triage center.",
        deliverables: [
          "Localized landing funnels in 12 languages",
          "Pre-qualified patient lead triage",
          "Real-time CRM & ROI attribution dashboard",
        ],
        previewStat: "3.8× ROI",
        previewSub: "On international marketing",
      },
      {
        step: "03",
        title: "Certified Equipment Procurement",
        duration: "Phase 3 · Ongoing",
        icon: Package,
        summary:
          "Upgrade surgical and diagnostic capacity with direct-from-OEM medical equipment and customs-cleared logistics.",
        deliverables: [
          "Direct OEM pricing on imaging & robotics",
          "Cold-chain & customs clearance",
          "Biomedical installation & warranty",
        ],
        previewStat: "-28% Cost",
        previewSub: "On certified medical supply",
      },
      {
        step: "04",
        title: "Predictable Global Patient Flow",
        duration: "Phase 4 · Scale",
        icon: TrendingUp,
        summary:
          "Receive pre-screened, travel-ready international patients every week while ArkMED handles logistics and aftercare.",
        deliverables: [
          "End-to-end patient travel management",
          "Automated cross-border billing & escrow",
          "Quarterly executive growth reviews",
        ],
        previewStat: "+34% YoY",
        previewSub: "Average clinic revenue lift",
      },
    ],
  },
};

function HowItWorks() {
  const [mode, setMode] = useState("patient");
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);

  const data = TIMELINE_DATA[mode];
  const current = data.steps[activeStep];
  const CurrentIcon = current.icon;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setActiveStep((s) => (s + 1) % 4);
    }, 4500);
    return () => clearInterval(t);
  }, [paused, mode]);

  const switchMode = (next) => {
    setMode(next);
    setActiveStep(0);
  };

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-white py-28"
    >
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-16 h-96 w-[800px] -translate-x-1/2 rounded-full bg-sea-100/70 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <Eyebrow>How It Works</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ark-900 sm:text-5xl">
              Two pathways.{" "}
              <span className="bg-gradient-to-r from-ark-800 via-sea-600 to-sea-400 bg-clip-text text-transparent">
                Zero friction.
              </span>
            </h2>
          </Reveal>

          {/* Dual-Mode Segmented Switcher */}
          <Reveal delay={0.1}>
            <div
              role="tablist"
              aria-label="Select journey pathway"
              className="inline-flex rounded-full border border-slate-200/90 bg-slate-100/90 p-1.5 shadow-inner"
            >
              {[
                { id: "patient", label: "For Patients", icon: HeartPulse },
                { id: "clinic", label: "For Clinics & Hospitals", icon: Building2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = mode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => switchMode(tab.id)}
                    className={`relative flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-colors sm:text-sm ${
                      active ? "text-white" : "text-slate-600 hover:text-ark-900"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="pathway-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="absolute inset-0 rounded-full bg-ark-950 shadow-lg shadow-ark-950/25"
                      />
                    )}
                    <Icon className={`relative h-4 w-4 ${active ? "text-sea-300" : "text-sea-600"}`} />
                    <span className="relative">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Main interactive grid */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-stretch"
        >
          {/* Left: 4-step interactive rail */}
          <div className="flex flex-col justify-between gap-3">
            {data.steps.map((s, idx) => {
              const Icon = s.icon;
              const isSelected = activeStep === idx;
              const isDone = activeStep > idx;
              return (
                <motion.button
                  key={`${mode}-${s.step}`}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.07, duration: 0.45, ease: EASE }}
                  className={`group relative cursor-pointer overflow-hidden rounded-3xl border p-5 text-left transition-all duration-300 sm:p-6 ${
                    isSelected
                      ? "border-sea-400 bg-gradient-to-r from-sea-50/90 via-white to-white shadow-xl shadow-sea-900/10"
                      : "border-slate-200/80 bg-white hover:border-sea-200 hover:bg-slate-50/60"
                  }`}
                >
                  {/* Animated progress bar when active */}
                  {isSelected && !paused && (
                    <motion.span
                      key={`bar-${mode}-${idx}`}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4.5, ease: "linear" }}
                      className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-sea-600 via-sea-400 to-ark-800"
                    />
                  )}

                  <div className="flex items-start gap-4">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold transition-all duration-300 ${
                        isSelected
                          ? "bg-ark-950 text-sea-300 shadow-md shadow-ark-950/20"
                          : isDone
                          ? "bg-sea-600 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-sea-100 group-hover:text-sea-700"
                      }`}
                    >
                      {isDone ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-widest text-sea-600">
                          Step {s.step}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                          <Clock className="h-3 w-3 text-sea-600" />
                          {s.duration}
                        </span>
                      </div>

                      <h3 className="mt-1.5 text-lg font-extrabold text-ark-900 sm:text-xl">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        {s.summary}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Right: Live showcase card */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-br from-ark-950 via-ark-900 to-sea-950 p-7 text-white shadow-2xl shadow-ark-950/25 sm:p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sea-400/20 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-sea-500/15 blur-3xl"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={`${mode}-${current.step}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="relative flex flex-1 flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-sea-400/30 bg-sea-400/10 px-3.5 py-1 text-xs font-semibold text-sea-200">
                      <Sparkles className="h-3.5 w-3.5 text-sea-300" />
                      {data.badge}
                    </span>
                    <span className="font-mono text-xs font-bold text-sea-300/80">
                      {current.step} / 04
                    </span>
                  </div>

                  <div className="mt-7 flex items-center gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sea-400/30 bg-white/10 text-sea-300 shadow-inner">
                      <CurrentIcon className="h-7 w-7" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-sea-300">
                        {current.duration}
                      </p>
                      <h3 className="mt-0.5 text-2xl font-extrabold tracking-tight sm:text-3xl">
                        {current.title}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-slate-300">
                    {current.summary}
                  </p>

                  {/* Deliverables list */}
                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                    <p className="text-xs font-bold uppercase tracking-wider text-sea-300">
                      Included in this stage
                    </p>
                    <ul className="mt-3.5 space-y-2.5">
                      {current.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-3 text-sm font-medium text-slate-100"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sea-400/20 text-sea-300">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom metric + CTA bar */}
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                  <div>
                    <p className="text-3xl font-extrabold tracking-tight text-white">
                      {current.previewStat}
                    </p>
                    <p className="text-xs text-sea-300">{current.previewSub}</p>
                  </div>

                  <Button href="#contact" variant="light">
                    {mode === "patient" ? "Start My Free Review" : "Partner Your Clinic"}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Interactive Treatment Cost & Savings Calculator                            */
/* -------------------------------------------------------------------------- */

const PROCEDURES = [
  {
    id: "dental",
    name: "Full Dental Restoration",
    sub: "20 Zirconia Crowns / Veneers + Implants",
    icon: Sparkles,
    stay: "5 Nights · Istanbul or Antalya",
    homeCost: 16500,
    arkCost: 4900,
    vipAddon: 850,
    warranty: "Lifetime Implant Warranty",
  },
  {
    id: "hair",
    name: "Sapphire FUE / DHI Hair",
    sub: "Maximum Grafts + PRP + Post-Op Kit",
    icon: Users,
    stay: "3 Nights · Istanbul VIP Clinic",
    homeCost: 11800,
    arkCost: 2950,
    vipAddon: 550,
    warranty: "Certified Graft Guarantee",
  },
  {
    id: "ortho",
    name: "Total Knee or Hip Replacement",
    sub: "Robotic-Assisted Surgery + Inpatient Rehab",
    icon: HeartPulse,
    stay: "7 Nights · JCI Hospital Suite",
    homeCost: 34000,
    arkCost: 11200,
    vipAddon: 1400,
    warranty: "FDA/CE Approved Prosthetics",
  },
  {
    id: "cardiac",
    name: "Cardiac Bypass / Valve Care",
    sub: "Minimally Invasive + ICU + Telemetry",
    icon: Stethoscope,
    stay: "10 Nights · Accredited Heart Center",
    homeCost: 68000,
    arkCost: 21500,
    vipAddon: 2100,
    warranty: "Board-Certified Cardiac Team",
  },
  {
    id: "ivf",
    name: "IVF & Fertility Package",
    sub: "Full Cycle + ICSI + Embryo Lab",
    icon: CalendarCheck,
    stay: "14 Nights · Boutique Recovery Stay",
    homeCost: 19500,
    arkCost: 5800,
    vipAddon: 1200,
    warranty: "High-Success Embryology Lab",
  },
  {
    id: "eye",
    name: "Femto-LASIK / Lens Surgery",
    sub: "Both Eyes · Blade-Free Laser Vision",
    icon: ShieldCheck,
    stay: "2 Nights · Fast-Track Recovery",
    homeCost: 5400,
    arkCost: 1750,
    vipAddon: 450,
    warranty: "20/20 Vision Care Protocol",
  },
];

const REGIONS = [
  { id: "us", label: "United States", flag: "🇺🇸", symbol: "$", mult: 1.0, rate: 1.0 },
  { id: "uk", label: "United Kingdom", flag: "🇬🇧", symbol: "£", mult: 0.78, rate: 0.79 },
  { id: "eu", label: "Europe (EU)", flag: "🇪🇺", symbol: "€", mult: 0.82, rate: 0.92 },
  { id: "ae", label: "GCC / UAE", flag: "🇦🇪", symbol: "$", mult: 0.88, rate: 1.0 },
];

function CostCalculator() {
  const [procId, setProcId] = useState("dental");
  const [regionId, setRegionId] = useState("us");
  const [includeVip, setIncludeVip] = useState(true);

  const proc = PROCEDURES.find((p) => p.id === procId) || PROCEDURES[0];
  const reg = REGIONS.find((r) => r.id === regionId) || REGIONS[0];

  const localCost = Math.round((proc.homeCost * reg.mult * reg.rate) / 50) * 50;
  const arkPackage =
    Math.round(((proc.arkCost + (includeVip ? proc.vipAddon : 0)) * reg.rate) / 50) * 50;
  const saved = Math.max(0, localCost - arkPackage);
  const pct = Math.round((saved / localCost) * 100);
  const arkWidth = Math.max(18, Math.round((arkPackage / localCost) * 100));

  const fmt = (n) => `${reg.symbol}${n.toLocaleString("en-US")}`;

  return (
    <section
      id="calculator"
      className="relative overflow-hidden bg-slate-50 py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-20 h-96 w-96 rounded-full bg-sea-200/50 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-ark-200/40 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <Eyebrow>Interactive Estimator</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ark-900 sm:text-5xl">
              World-class care.{" "}
              <span className="bg-gradient-to-r from-ark-800 to-sea-500 bg-clip-text text-transparent">
                A fraction of the cost.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="max-w-md text-sm text-slate-600">
            Compare typical private healthcare prices in your region against
            ArkMED’s JCI-accredited all-inclusive packages.
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_1fr]">
          {/* Left Controls */}
          <div className="flex flex-col justify-between rounded-[2rem] border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
            <div>
              {/* Step 1: Region selector */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  1. Compare against your region
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {REGIONS.map((r) => {
                    const active = r.id === regionId;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRegionId(r.id)}
                        className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                          active
                            ? "border-ark-900 bg-ark-900 text-white shadow-sm"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-sea-300 hover:text-ark-900"
                        }`}
                      >
                        <span>{r.flag}</span>
                        <span>{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Procedure grid */}
              <div className="mt-7">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  2. Select medical procedure
                </label>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {PROCEDURES.map((p) => {
                    const Icon = p.icon;
                    const active = p.id === procId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setProcId(p.id)}
                        className={`group flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                          active
                            ? "border-sea-500 bg-sea-50/70 shadow-md shadow-sea-900/5 ring-1 ring-sea-500"
                            : "border-slate-200/80 bg-white hover:border-sea-300 hover:bg-slate-50/70"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                            active
                              ? "bg-ark-950 text-sea-300"
                              : "bg-slate-100 text-slate-600 group-hover:bg-sea-100 group-hover:text-sea-700"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-ark-900 sm:text-sm">
                            {p.name}
                          </p>
                          <p className="mt-0.5 truncate text-[11px] text-slate-500">
                            {p.sub}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: VIP Concierge Toggle */}
            <div className="mt-7 flex items-center justify-between gap-4 rounded-2xl border border-sea-200/80 bg-gradient-to-r from-sea-50/90 to-white p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sea-600 text-white shadow-sm">
                  <Plane className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-bold text-ark-900 sm:text-sm">
                    Include 5-Star Hotel, VIP Chauffeur & Interpreter
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {proc.stay} · Full airport-to-clinic concierge package
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={includeVip}
                onClick={() => setIncludeVip((v) => !v)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 ${
                  includeVip ? "bg-sea-600" : "bg-slate-300"
                }`}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow-md ${
                    includeVip ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Right Live Breakdown Card */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-ark-950 p-7 text-white shadow-2xl shadow-ark-950/25 sm:p-9">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sea-500/20 blur-3xl"
            />

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sea-200">
                  <Calculator className="h-3.5 w-3.5 text-sea-300" />
                  Estimated Savings Breakdown
                </span>
                <span className="rounded-full bg-sea-400/20 px-3 py-1 text-xs font-extrabold text-sea-300">
                  Save {pct}%
                </span>
              </div>

              {/* Big Savings Counter */}
              <div className="mt-6 flex items-baseline gap-3">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={`${procId}-${regionId}-${includeVip}`}
                    initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="bg-gradient-to-r from-white via-sea-100 to-sea-300 bg-clip-text text-4xl font-black tracking-tight text-transparent tabular-nums sm:text-6xl"
                  >
                    {fmt(saved)}
                  </motion.span>
                </AnimatePresence>
                <span className="text-xs font-semibold uppercase tracking-wider text-sea-300">
                  estimated savings
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                For <span className="font-semibold text-white">{proc.name}</span>{" "}
                compared to private clinics in {reg.label}.
              </p>

              {/* Visual Bar Comparison */}
              <div className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span>{reg.flag}</span> Typical {reg.label} Private Cost
                    </span>
                    <span className="font-bold tabular-nums text-slate-300 line-through decoration-red-400/80">
                      {fmt(localCost)}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-full rounded-full bg-slate-600/70" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-bold text-white">
                      <Sparkles className="h-3.5 w-3.5 text-sea-300" />
                      ArkMED Accredited Package
                    </span>
                    <span className="text-base font-extrabold tabular-nums text-sea-300">
                      {fmt(arkPackage)}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      animate={{ width: `${arkWidth}%` }}
                      transition={{ duration: 0.65, ease: EASE }}
                      className="relative h-full rounded-full bg-gradient-to-r from-sea-500 to-sea-300 shadow-[0_0_16px_#72a6a8]"
                    />
                  </div>
                </div>
              </div>

              {/* Included highlights */}
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "JCI-Accredited Hospital",
                  proc.warranty,
                  includeVip ? proc.stay : "Procedure Only",
                  "12-Mo Remote Follow-Up",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-200"
                  >
                    <Check className="h-3 w-3 text-sea-300" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] text-slate-400">
                *Exact quote confirmed after free specialist review.
              </p>
              <Button href="#contact" variant="light">
                Lock In This Estimate
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Smart FAQ + Instant AI/Concierge Triage                                    */
/* -------------------------------------------------------------------------- */

const FAQ_CATEGORIES = [
  "All",
  "Visas & Travel",
  "Pricing & Safety",
  "Clinic Partners",
  "Procurement",
];

const FAQS = [
  {
    q: "How does ArkMED vet and select partner hospitals?",
    a: "Only the top 4% of applicants pass our 50-point clinical audit. Every partner hospital holds JCI or ISO accreditation, board-certified specialist surgeons, English-speaking care teams, and verified international outcome records.",
    cat: "Pricing & Safety",
  },
  {
    q: "Are flights, 5-star hotels, and medical visas included?",
    a: "Yes. Our concierge desk handles priority medical visa sponsorship, private airport-to-hospital chauffeur transfers, 5-star recovery-friendly hotel stays, and a 24/7 bedside interpreter in 12+ languages.",
    cat: "Visas & Travel",
  },
  {
    q: "How are your treatment prices 50–70% lower without compromising quality?",
    a: "Lower clinical operating costs, favorable exchange rates, and our high-volume direct agreements with flagship hospitals in Türkiye, Europe, and Asia allow us to pass institutional savings directly to patients—using the exact same FDA/CE-certified implants and technology.",
    cat: "Pricing & Safety",
  },
  {
    q: "What happens after I fly back home?",
    a: "Your care continues for 12 months after returning home. You receive translated medical records, fit-to-fly clearance, scheduled video follow-ups with your surgeon, and local physician coordination.",
    cat: "Visas & Travel",
  },
  {
    q: "How can our clinic or hospital join the ArkMED network?",
    a: "We partner with accredited clinics looking to scale international patient volume or upgrade equipment. After a 2-week clinical audit, we launch multilingual patient acquisition campaigns and manage all cross-border travel and triage.",
    cat: "Clinic Partners",
  },
  {
    q: "Can hospitals source certified medical equipment through ArkMED?",
    a: "Yes. Our Medical Procurement division sources diagnostic imaging, surgical robotics, ICU monitors, and certified consumables directly from global OEMs with turnkey customs clearance and biomedical warranty support.",
    cat: "Procurement",
  },
];

const QUICK_PROMPTS = [
  {
    q: "How fast do I get a quote?",
    a: "Within 24–48 hours! Upload your medical records or X-rays and you'll receive 3 itemized treatment plans from JCI-accredited hospitals, plus a free video call with the lead surgeon.",
  },
  {
    q: "Can I bring a companion?",
    a: "Absolutely! All our 5-star hotel packages and private VIP airport/clinic transfers accommodate a companion or family member at zero extra concierge fee.",
  },
  {
    q: "How do clinics partner with you?",
    a: "Clinics apply for our 50-point accreditation review. Once approved, we deploy localized marketing across 13+ countries and send pre-screened, travel-ready patients directly to your team.",
  },
  {
    q: "Do you ship medical equipment globally?",
    a: "Yes—we procure CE/FDA-certified equipment directly from manufacturers and deliver door-to-hospital across EMEA, APAC, and the Americas with full warranty.",
  },
];

function SmartFAQ() {
  const [cat, setCat] = useState("All");
  const [openIdx, setOpenIdx] = useState(0);
  const [promptIdx, setPromptIdx] = useState(0);
  const [customQuery, setCustomQuery] = useState("");
  const [customReply, setCustomReply] = useState(null);

  const filtered =
    cat === "All" ? FAQS : FAQS.filter((f) => f.cat === cat);

  const onAsk = (e) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    setCustomReply({
      q: customQuery.trim(),
      a: "Our medical coordinator team has logged your question. Click 'Connect with Coordinator' below to receive a personalized answer and treatment breakdown within 15 minutes.",
    });
    setCustomQuery("");
  };

  const activeTriage = customReply || QUICK_PROMPTS[promptIdx];

  return (
    <section id="faq" className="relative overflow-hidden bg-slate-50 py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 h-96 w-96 rounded-full bg-sea-200/40 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <Eyebrow>Smart Triage & FAQ</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ark-900 sm:text-5xl">
               Every answer,{" "}
              <span className="bg-gradient-to-r from-ark-800 to-sea-500 bg-clip-text text-transparent">
                instantly clear.
              </span>
            </h2>
          </Reveal>

          {/* Category filter pills */}
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-1.5">
              {FAQ_CATEGORIES.map((c) => {
                const active = cat === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCat(c);
                      setOpenIdx(0);
                    }}
                    className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? "bg-ark-950 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-sea-300 hover:text-ark-900"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.35fr] lg:items-start">
          {/* Left: Instant AI / Concierge Triage Box */}
          <Reveal className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-ark-950 via-ark-900 to-sea-950 p-7 text-white shadow-2xl shadow-ark-950/20 sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sea-400/20 blur-3xl"
            />

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-sea-500/20 text-sea-300">
                  <MessageCircle className="h-5 w-5" />
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-ark-950 bg-sea-400" />
                </span>
                <div>
                  <p className="text-sm font-bold">Instant Concierge Triage</p>
                  <p className="text-[11px] text-sea-300">
                    12 Languages · Avg. human reply ~3 min
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-sea-400/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sea-300">
                Live
              </span>
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tap a quick question
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((p, idx) => {
                const active = !customReply && promptIdx === idx;
                return (
                  <button
                    key={p.q}
                    type="button"
                    onClick={() => {
                      setCustomReply(null);
                      setPromptIdx(idx);
                    }}
                    className={`cursor-pointer rounded-full border px-3 py-1.5 text-left text-xs font-medium transition-all ${
                      active
                        ? "border-sea-400 bg-sea-400/20 text-white shadow-sm"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-sea-400/40 hover:text-white"
                    }`}
                  >
                    {p.q}
                  </button>
                );
              })}
            </div>

            {/* Active Answer Bubble */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTriage.q}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="mt-5 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur"
              >
                <p className="text-xs font-bold text-sea-300">
                  “{activeTriage.q}”
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-200 sm:text-sm">
                  {activeTriage.a}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Ask custom prompt */}
            <form onSubmit={onAsk} className="mt-5 flex gap-2">
              <input
                type="text"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Ask anything about treatment, travel, or clinics..."
                className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white outline-none placeholder:text-slate-400 focus:border-sea-400"
              />
              <button
                type="submit"
                aria-label="Send question"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-sea-500 text-ark-950 transition-transform hover:scale-105 hover:bg-sea-400"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
              <span className="text-slate-400">Need a custom medical review?</span>
              <a
                href="#contact"
                className="inline-flex items-center gap-1 font-bold text-sea-300 hover:text-white"
              >
                Connect with Coordinator
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </Reveal>

          {/* Right: Accordion */}
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {filtered.map((item, idx) => {
                const isOpen = openIdx === idx;
                return (
                  <motion.div
                    key={item.q}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className={`overflow-hidden rounded-3xl border transition-colors ${
                      isOpen
                        ? "border-sea-400 bg-white shadow-lg shadow-sea-900/5"
                        : "border-slate-200/90 bg-white/80 hover:border-sea-200"
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold transition-colors ${
                            isOpen
                              ? "bg-ark-950 text-sea-300"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          0{idx + 1}
                        </span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-sea-600">
                            {item.cat}
                          </span>
                          <h3 className="text-sm font-bold text-ark-900 sm:text-base">
                            {item.q}
                          </h3>
                        </div>
                      </div>

                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                          isOpen
                            ? "rotate-45 border-ark-950 bg-ark-950 text-white"
                            : "border-slate-200 text-slate-500"
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="border-t border-slate-100 px-6 pb-6 pt-4 text-sm leading-relaxed text-slate-600">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  CTA + Footer                                                               */
/* -------------------------------------------------------------------------- */

function CTA() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <section id="contact" className="bg-white px-6 py-28">
      <Reveal className="relative mx-auto max-w-5xl">
        {/* Animated gradient border */}
        <div className="relative overflow-hidden rounded-[2.25rem] p-px">
          <motion.div
            aria-hidden
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 [background:conic-gradient(from_0deg,transparent_0_70%,#72a6a8_85%,transparent_100%)]"
          />
          <div className="relative overflow-hidden rounded-[calc(2.25rem-1px)] bg-ark-950 px-6 py-20 text-center sm:px-16">
            {/* Aurora */}
            <motion.div
              aria-hidden
              animate={{ x: [0, 50, -30, 0], y: [0, -20, 20, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-20 -top-24 h-80 w-80 rounded-full bg-sea-500/30 blur-[100px]"
            />
            <motion.div
              aria-hidden
              animate={{ x: [0, -60, 30, 0], y: [0, 30, -20, 0], scale: [1, 0.9, 1.15, 1] }}
              transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-sea-400/25 blur-[100px]"
            />
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
            />

            <div className="relative">
              <Eyebrow light>Get Started</Eyebrow>
              <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                Ready to transform your{" "}
                <span className="bg-gradient-to-r from-sea-300 to-sea-200 bg-clip-text text-transparent">
                  healthcare journey?
                </span>
              </h2>
              <p className="mx-auto mt-5 max-w-md text-slate-400">
                Let&apos;s talk about how Ark Med can connect you to the care,
                clients, and capabilities you need.
              </p>

              <form
                onSubmit={onSubmit}
                className="mx-auto mt-10 flex max-w-md flex-col gap-3 rounded-[1.75rem] border border-white/10 bg-white/5 p-2 backdrop-blur-xl focus-within:border-sea-400/60 sm:flex-row sm:rounded-full"
              >
                <label htmlFor="cta-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="cta-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@clinic.com"
                  className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-sea-500 px-6 py-3 text-sm font-semibold text-ark-950 shadow-lg shadow-sea-500/30 transition-colors hover:bg-sea-400"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-1/3 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-[320%]"
                  />
                  <span className="relative">
                    {sent ? "We'll be in touch!" : "Schedule a Consultation"}
                  </span>
                  {sent ? (
                    <Check className="relative h-4 w-4" />
                  ) : (
                    <Send className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  )}
                </motion.button>
              </form>

              <p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-sea-400" />
                No spam. Reply within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

const FOOTER_COLS = [
  { title: "Services", links: ["Medical Tourism", "Consulting", "Marketing", "Procurement"] },
  { title: "Company", links: ["About", "Network", "Careers", "Contact"] },
  { title: "Resources", links: ["Blog", "Case Studies", "FAQ", "Support"] },
];

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ark-950 text-slate-400">
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-sea-400/60 to-transparent"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-40 w-[600px] -translate-x-1/2 rounded-full bg-sea-500/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-10 pt-20 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <Reveal>
          <Image
            src="/logo-full-light.png"
            alt="ArkMED Global Health and Travel"
            width={900}
            height={812}
            className="h-36 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm">
            Bridging borders to make world-class healthcare accessible to
            everyone.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              [Mail, "hello@arkmed.com"],
              [Phone, "+90 000 000 00 00"],
              [MapPin, "Istanbul, Türkiye"],
            ].map(([Icon, t]) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-sea-400">
                  <Icon className="h-4 w-4" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>

        {FOOTER_COLS.map((c, i) => (
          <Reveal key={c.title} delay={0.1 + i * 0.08}>
            <nav aria-label={c.title}>
              <h4 className="text-sm font-semibold text-white">{c.title}</h4>
              <ul className="mt-5 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="group inline-flex items-center gap-1 text-sm transition-colors hover:text-sea-300"
                    >
                      <span className="h-px w-0 bg-sea-400 transition-all duration-300 group-hover:w-3" />
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        ))}
      </div>

      {/* Giant outlined wordmark */}
      <div
        aria-hidden
        className="pointer-events-none relative select-none overflow-hidden text-center text-[22vw] font-black leading-[0.8] tracking-tighter text-transparent [-webkit-text-stroke:1.5px_rgba(114,166,168,0.18)] [mask-image:linear-gradient(to_bottom,black_30%,transparent)] sm:text-[15vw]"
      >
        ARKMED
      </div>

      <div className="relative border-t border-white/10 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-xs sm:flex-row">
          <p>© 2026 Ark Med Global Health and Travel. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="transition-colors hover:text-sea-300">Privacy</a>
            <a href="#" className="transition-colors hover:text-sea-300">Terms</a>
            <motion.a
              href="#"
              aria-label="Back to top"
              whileHover={{ y: -4, scale: 1.1 }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sea-300 transition-colors hover:border-sea-400/60"
            >
              <ArrowUp className="h-4 w-4" />
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function Page() {
  return (
    <main className="overflow-x-clip bg-white font-sans antialiased">
      <Navbar />
      <Hero />
      <BentoServices />
      <Marquee />
      <HowItWorks />
      <CostCalculator />
      <ValueProp />
      <GlobalReach />
      <SmartFAQ />
      <CTA />
      <Footer />
    </main>
  );
}
