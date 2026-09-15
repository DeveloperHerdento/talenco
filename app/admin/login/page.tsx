"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE, staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "Login failed.");
        setSubmitting(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-[#f6f7f9] px-4 py-10">
      <motion.form
        onSubmit={onSubmit}
        variants={cardVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-md rounded-2xl border border-[#ececec] bg-white p-10 shadow-sm"
      >
        <motion.div variants={itemVariants} className="mb-9">
          <Image src="/assets/logotype-talenco.svg" alt="TalenCo" width={186} height={50} priority className="h-12 w-auto" />
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-3xl font-extrabold text-black">
          Sign in
        </motion.h1>
        <motion.p variants={itemVariants} className="mt-2 mb-8 text-base text-black/50">
          Enter your password to access the admin workspace.
        </motion.p>

        <motion.label
          variants={itemVariants}
          className="mb-2 block text-xs font-semibold tracking-wide text-black/40 uppercase"
          htmlFor="password"
        >
          Password
        </motion.label>
        <motion.input
          variants={itemVariants}
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          placeholder="Enter your password"
          className="mb-4 w-full rounded-lg border border-[#e0e0e0] bg-[#f9fafb] px-4 py-3.5 text-base outline-none focus:border-brand-blue focus:bg-white"
        />

        <AnimatePresence initial={false} mode="wait">
          {error && (
            <motion.p
              key={error}
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="mb-4 text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          variants={itemVariants}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={submitting || !password}
          className="bg-brand-orange w-full rounded-lg py-3.5 text-base font-bold text-white disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </motion.button>

        <motion.div variants={itemVariants} className="mt-6 border-t border-[#ececec] pt-4 text-right text-xs text-black/40">
          Authorized access only
        </motion.div>
      </motion.form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-xs text-black/35"
      >
        © {new Date().getFullYear()} TalenCo. All rights reserved.
      </motion.p>
    </main>
  );
}
