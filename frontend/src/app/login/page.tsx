"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";
import { apiRequest } from "../../lib/api";
import AuthShell from "@/src/components/auth/AuthShell";
import PasswordField from "@/src/components/auth/PasswordField";

function friendlyLoginError(error: unknown) {
  if (error instanceof TypeError) return "We couldn’t reach HeartLink. Check your connection and try again.";
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("network") || message.includes("fetch")) return "We couldn’t reach HeartLink. Check your connection and try again.";
  return "The email or password you entered is incorrect.";
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const response = await apiRequest("auths/login", "POST", { email, password });
      localStorage.setItem("token", response.token);
      toast.success("Welcome back.");
      setTimeout(() => { window.location.href = "/home"; }, 1500);
    } catch (caught) {
      const message = friendlyLoginError(caught);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell mode="login" eyebrow="Welcome back" title="Continue where you left off." support="Your conversations and connections are ready when you are.">
      <form onSubmit={handleLogin} className="auth-form" noValidate={false}>
        <div className="auth-field">
          <label htmlFor="email">Email address</label>
          <div className="auth-input-wrap">
            <Mail aria-hidden="true" size={17} />
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              aria-invalid={Boolean(error) || undefined}
              aria-describedby={error ? "login-error" : undefined}
              required
            />
          </div>
        </div>
        <PasswordField id="password" value={password} onChange={setPassword} autoComplete="current-password" invalid={Boolean(error)} describedBy={error ? "login-error" : undefined} />
        {error && <p id="login-error" className="auth-error" role="alert" aria-live="polite"><span>!</span>{error}</p>}
        <button type="submit" disabled={loading} className="auth-submit">
          {loading && <span className="auth-spinner" aria-hidden="true" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="auth-switch">New to HeartLink? <Link href="/register">Create an account</Link></p>
        <p className="auth-privacy">Your login details are used only to access your HeartLink account.</p>
      </form>
    </AuthShell>
  );
}
