"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "حدث خطأ، حاول مجدداً");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#1A3C66] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/images/hrdf-logo.png"
            alt="صندوق تنمية الموارد البشرية"
            width={180}
            height={80}
            className="object-contain"
            priority
          />
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            منصة تتبع الحملة الإبداعية
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#224D83] transition"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#224D83] hover:bg-[#1A3C66] text-white font-semibold py-3 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "جارٍ تسجيل الدخول…" : "تسجيل الدخول"}
          </button>
        </form>

        <p className="text-xs text-muted-foreground text-center">
          © 2026 Seet Marketing Solutions
        </p>
      </div>
    </main>
  );
}
