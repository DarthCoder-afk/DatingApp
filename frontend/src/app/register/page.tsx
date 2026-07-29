"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Camera, Check, ChevronDown, Mail, UserRound, X } from "lucide-react";
import AuthShell from "@/src/components/auth/AuthShell";
import PasswordField from "@/src/components/auth/PasswordField";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

function friendlyRegisterError(error: unknown) {
  if (error instanceof TypeError) return "We couldn’t reach HeartLink. Check your connection and try again.";
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("exist") || message.includes("email")) return "We couldn’t create an account with those details. Check them and try again.";
  return "We couldn’t create your account right now. Please try again.";
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", age: "", gender: "", bio: "", email: "", password: "" });
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const passwordChecks = useMemo(() => [
    ["8+ characters", formData.password.length >= 8],
    ["Uppercase", /[A-Z]/.test(formData.password)],
    ["Lowercase", /[a-z]/.test(formData.password)],
    ["Number", /\d/.test(formData.password)],
    ["Symbol", /[\W_]/.test(formData.password)],
  ] as const, [formData.password]);

  const change = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextPhoto = event.target.files?.[0] || null;
    if (preview) URL.revokeObjectURL(preview);
    setPhoto(nextPhoto);
    setPreview(nextPhoto ? URL.createObjectURL(nextPhoto) : null);
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;
    setError("");
    const weakPassword = !passwordPattern.test(formData.password);
    setPasswordError(weakPassword);
    if (weakPassword) {
      const message = "Choose a password that meets every requirement below.";
      setError(message);
      toast.error(message);
      document.getElementById("register-password")?.focus();
      return;
    }
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (photo) data.append("photo", photo);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auths/register`, { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      localStorage.setItem("token", result.token);
      toast.success("Your account is ready.");
      setTimeout(() => { window.location.href = "/home"; }, 1500);
    } catch (caught) {
      const message = friendlyRegisterError(caught);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell mode="register" eyebrow="Join HeartLink" title="Create your account." support="Start with a thoughtful introduction, then discover people at your own pace.">
      <form onSubmit={handleRegister} className="auth-form auth-register-form">
        <div className="auth-field">
          <label htmlFor="name">Full name</label>
          <div className="auth-input-wrap">
            <UserRound aria-hidden="true" size={17} />
            <input id="name" name="name" value={formData.name} onChange={change} autoComplete="name" placeholder="Your name" required />
          </div>
        </div>
        <div className="auth-field-row">
          <div className="auth-field">
            <label htmlFor="age">Age</label>
            <div className="auth-input-wrap auth-input-plain">
              <input id="age" name="age" type="number" min="18" inputMode="numeric" value={formData.age} onChange={change} placeholder="18+" required />
            </div>
          </div>
          <div className="auth-field">
            <label htmlFor="gender">Gender</label>
            <div className="auth-input-wrap auth-input-plain auth-select-wrap">
              <select id="gender" name="gender" value={formData.gender} onChange={change} required>
                <option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
              </select>
              <ChevronDown aria-hidden="true" size={17} />
            </div>
          </div>
        </div>
        <div className="auth-field">
          <label htmlFor="bio">Short bio <span>Optional</span></label>
          <div className="auth-input-wrap auth-input-plain auth-textarea-wrap">
            <textarea id="bio" name="bio" value={formData.bio} onChange={change} rows={2} placeholder="A little about what makes you, you." />
          </div>
        </div>
        <div className="auth-field">
          <label htmlFor="email">Email address</label>
          <div className="auth-input-wrap">
            <Mail aria-hidden="true" size={17} />
            <input id="email" name="email" type="email" inputMode="email" autoComplete="email" value={formData.email} onChange={change} placeholder="you@example.com" required />
          </div>
        </div>
        <PasswordField id="register-password" value={formData.password} onChange={(password) => { setFormData((current) => ({ ...current, password })); setPasswordError(false); }} autoComplete="new-password" placeholder="Create a strong password" invalid={passwordError} describedBy="password-rules" />
        <ul id="password-rules" className="auth-password-rules" aria-label="Password requirements">
          {passwordChecks.map(([label, valid]) => <li key={label} className={valid ? "valid" : ""}>{valid ? <Check size={12} /> : <span />}{label}</li>)}
        </ul>
        <div className="auth-field">
          <label>Profile photo <span>Optional</span></label>
          <div className="auth-upload">
            {preview ? <Image src={preview} alt="Selected profile preview" width={46} height={46} unoptimized /> : <span className="auth-upload-placeholder"><Camera size={18} /></span>}
            <div><strong>{photo ? photo.name : "Add a clear profile photo"}</strong><small>JPG, PNG, or WEBP</small></div>
            <label htmlFor="photo-upload">{photo ? "Change" : "Choose"}</label>
            <input id="photo-upload" type="file" name="photo" accept="image/*" onChange={handlePhotoChange} />
            {photo && <button type="button" onClick={() => { if (preview) URL.revokeObjectURL(preview); setPhoto(null); setPreview(null); }} aria-label="Remove selected photo"><X size={16} /></button>}
          </div>
        </div>
        {error && <p id="register-error" className="auth-error" role="alert" aria-live="polite"><span>!</span>{error}</p>}
        <button type="submit" disabled={loading} className="auth-submit">
          {loading && <span className="auth-spinner" aria-hidden="true" />}
          {loading ? "Creating account…" : "Create account"}
        </button>
        <p className="auth-switch">Already have an account? <Link href="/login">Sign in</Link></p>
        <p className="auth-privacy">You control what appears on your profile and can update it later.</p>
      </form>
    </AuthShell>
  );
}
