"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Completing sign in...");

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setMessage("Database sync is not configured.");
      return;
    }

    const timeout = window.setTimeout(() => {
      setMessage("Sign in is taking longer than expected. Please return to Manage Fonts and try again.");
    }, 8000);

    supabase.auth.getSession().then(({ data, error }) => {
      window.clearTimeout(timeout);

      if (error || !data.session) {
        setMessage(error?.message ?? "The sign-in link could not be completed.");
        return;
      }

      router.replace("/custom-fonts");
    });

    return () => window.clearTimeout(timeout);
  }, [router]);

  return (
    <section className="page-stack">
      <div className="empty-preview">
        <div>
          <span className="eyebrow">Font sync</span>
          <h1>{message}</h1>
          <p className="status-text">You can return to Manage Fonts once sign-in finishes.</p>
          <Link className="button primary" href="/custom-fonts">
            Manage Fonts
          </Link>
        </div>
      </div>
    </section>
  );
}
