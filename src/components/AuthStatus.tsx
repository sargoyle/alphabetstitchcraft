"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabaseClient";

type AuthState = {
  email: string | null;
  loading: boolean;
  notice: string;
};

function withTimeout<T>(promise: Promise<T>, message: string, timeoutMs = 6000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_resolve, reject) => {
      window.setTimeout(() => reject(new Error(message)), timeoutMs);
    })
  ]);
}

export function AuthStatus() {
  const [auth, setAuth] = useState<AuthState>({ email: null, loading: true, notice: "" });
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const configured = isSupabaseConfigured();

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setAuth({
        email: null,
        loading: false,
        notice: "Database sync is not configured yet."
      });
      return;
    }

    withTimeout(supabase.auth.getSession(), "Could not reach Supabase. Refresh the page and try again.").then(
      ({ data }) => {
        setAuth({ email: data.session?.user.email ?? null, loading: false, notice: "" });
      },
      (error) => {
        setAuth({
          email: null,
          loading: false,
          notice: error instanceof Error ? error.message : "Could not check Supabase sign-in."
        });
      }
    );

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth({ email: session?.user.email ?? null, loading: false, notice: "" });
    });

    return () => subscription.unsubscribe();
  }, []);

  async function sendMagicLink() {
    const supabase = getSupabaseClient();
    const email = emailInput.trim();
    if (!supabase || !email) return;

    setAuth((current) => ({ ...current, loading: true, notice: "" }));
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    setAuth((current) => ({
      ...current,
      loading: false,
      notice: error ? error.message : "Check your email for the sign-in link."
    }));
  }

  async function createAccount() {
    const supabase = getSupabaseClient();
    const email = emailInput.trim();
    const password = passwordInput.trim();
    if (!supabase || !email || !password) return;

    setAuth((current) => ({ ...current, loading: true, notice: "" }));
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    setAuth({
      email: data.session?.user.email ?? null,
      loading: false,
      notice: error
        ? error.message
        : data.session
          ? "Account created. You are signed in."
          : "Account created. If this does not sign you in, Supabase email confirmation is still enabled."
    });
  }

  async function signInWithPassword() {
    const supabase = getSupabaseClient();
    const email = emailInput.trim();
    const password = passwordInput.trim();
    if (!supabase || !email || !password) return;

    setAuth((current) => ({ ...current, loading: true, notice: "" }));
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setAuth({
      email: data.session?.user.email ?? null,
      loading: false,
      notice: error ? error.message : ""
    });
  }

  async function signOut() {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  if (!configured) {
    return null;
  }

  if (auth.loading) {
    return <p className="sync-status">Checking database sync...</p>;
  }

  if (auth.email) {
    return (
      <div className="auth-panel">
        <span>Syncing as {auth.email}</span>
        <button className="button ghost compact-button" type="button" onClick={signOut}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="auth-panel">
      <div className="auth-fields">
        <label>
          Email
          <input
            type="email"
            value={emailInput}
            onChange={(event) => setEmailInput(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={passwordInput}
            onChange={(event) => setPasswordInput(event.target.value)}
            placeholder="Choose a password"
            autoComplete="current-password"
          />
        </label>
      </div>
      <button className="button primary compact-button" type="button" onClick={signInWithPassword}>
        Sign in
      </button>
      <button className="button secondary compact-button" type="button" onClick={createAccount}>
        Create account
      </button>
      <button className="button secondary compact-button" type="button" onClick={sendMagicLink}>
        Email link
      </button>
      {auth.notice ? <span className="status-text">{auth.notice}</span> : null}
    </div>
  );
}
