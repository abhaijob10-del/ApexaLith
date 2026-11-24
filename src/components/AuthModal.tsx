import React, { useState } from "react";
import { api } from "../services/api";
import type { UserRole } from "../types";

export function LoginForm({
  admin = false,
  onSuccess,
}: {
  admin?: boolean;
  onSuccess: (user: any) => void;
}) {
  const [phone, setPhone] = useState(""),
    [sent, setSent] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setBusy(true);
    setError("");
    try {
      if (admin) await api("/admin/login", "POST", data);
      else if (!sent) {
        await api("/otp/request", "POST", { phone });
        setSent(true);
        return;
      } else await api("/otp/verify", "POST", { phone, code: data.code });
      onSuccess((await api("/session")).user);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="apx-form">
      <h1>{admin ? "Administrator sign in" : "Sign in with your mobile"}</h1>
      {admin ? (
        <>
          <label>
            Email
            <input required type="email" name="email" autoComplete="username" />
          </label>
          <label>
            Password
            <input
              required
              type="password"
              name="password"
              autoComplete="current-password"
            />
          </label>
          <label>
            Authenticator code (if enabled)
            <input
              name="mfa"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
            />
          </label>
        </>
      ) : (
        <>
          <label>
            Indian mobile number
            <input
              required
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              readOnly={sent}
              placeholder="+91"
            />
          </label>
          {sent && (
            <>
              <label>
                Six-digit code
                <input
                  required
                  name="code"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                />
              </label>
              <button type="button" onClick={() => setSent(false)}>
                Change number or request another code
              </button>
            </>
          )}
        </>
      )}
      {error && <p role="alert">{error}</p>}
      <button disabled={busy}>
        {busy
          ? "Please wait�"
          : admin
            ? "Sign in"
            : sent
              ? "Verify code"
              : "Request code"}
      </button>
    </form>
  );
}
export function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole, tab?: string, user?: any) => void;
  isDarkMode: boolean;
}) {
  return isOpen ? (
    <div role="dialog" aria-modal="true" aria-label="Customer sign in">
      <button onClick={onClose}>Close</button>
      <LoginForm
        onSuccess={(user) => {
          onLoginSuccess(user.role, "home", user);
          onClose();
        }}
      />
    </div>
  ) : null;
}
