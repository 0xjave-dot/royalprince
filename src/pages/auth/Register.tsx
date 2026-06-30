import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Calendar, ArrowLeft, Loader2, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { auth } from "../../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { initUserDoc } from "../../lib/firestore";
import { useAuth } from "../../lib/auth";
import { brandName } from "../../data/brand";

export default function Register() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 rounded-full border-[3px] border-blue border-t-transparent animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) {
      pushToast("Please fill in all required fields");
      return;
    }
    if (password !== confirmPassword) {
      pushToast("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      pushToast("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await initUserDoc(cred.user.uid, { name, email, phone, dob, gender: "" });

      pushToast(`Account created! Welcome to ${brandName}`);
      navigate("/");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/email-already-in-use") {
        pushToast("An account with this email already exists.");
      } else if (code === "auth/invalid-email") {
        pushToast("Please enter a valid email address.");
      } else if (code === "auth/weak-password") {
        pushToast("Password is too weak. Use at least 6 characters.");
      } else {
        pushToast("Registration failed. Please try again.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fdfdfd_0%,_#f3f6fb_46%,_#eef2f7_100%)] px-4 py-5 sm:px-6 sm:py-8 text-dark animate-fade-up-enter">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-[560px] flex-col justify-center">
        <button
          onClick={() => navigate("/login")}
          className="mb-4 inline-flex items-center gap-1.5 self-start rounded-full border border-black/5 bg-white/80 px-3.5 py-2 font-display text-[13px] font-bold text-dark shadow-[0_10px_25px_rgba(0,0,0,0.04)] backdrop-blur-sm transition hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          <span>Back to sign in</span>
        </button>

        <div className="rounded-[28px] border border-black/5 bg-white/95 p-5 sm:p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-pink/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-pink">
              <ShieldCheck className="w-3.5 h-3.5" />
              Create your account
            </div>
            <div>
              <h2 className="font-display text-[30px] font-black tracking-tight text-dark">
                Join {brandName}.
              </h2>
              <p className="mt-1 max-w-[360px] font-sans text-[13.5px] leading-relaxed text-gray2">
                Set up your profile once and keep your shopping details, rewards, and orders in one place.
              </p>
            </div>
          </div>

          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block font-display text-xs font-bold text-dark">Full Name</span>
              <div className="relative">
                <input
                  className="w-full h-[52px] rounded-[14px] border border-gray3 bg-[#fbfbfb] px-10 pr-4 font-sans text-sm outline-none transition focus:border-blue/30 focus:bg-white"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray2" />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block font-display text-xs font-bold text-dark">Email Address</span>
              <div className="relative">
                <input
                  className="w-full h-[52px] rounded-[14px] border border-gray3 bg-[#fbfbfb] px-10 pr-4 font-sans text-sm outline-none transition focus:border-blue/30 focus:bg-white"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  inputMode="email"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray2" />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block font-display text-xs font-bold text-dark">Password</span>
              <div className="relative">
                <input
                  className="w-full h-[52px] rounded-[14px] border border-gray3 bg-[#fbfbfb] px-10 pr-12 font-sans text-sm outline-none transition focus:border-blue/30 focus:bg-white"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray2" />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray2 transition hover:text-dark"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block font-display text-xs font-bold text-dark">Confirm Password</span>
              <div className="relative">
                <input
                  className="w-full h-[52px] rounded-[14px] border border-gray3 bg-[#fbfbfb] px-10 pr-12 font-sans text-sm outline-none transition focus:border-blue/30 focus:bg-white"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray2" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray2 transition hover:text-dark"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block font-display text-xs font-bold text-dark">
                Phone Number <span className="font-normal text-gray2">(required for support)</span>
              </span>
              <div className="relative">
                <input
                  className="w-full h-[52px] rounded-[14px] border border-gray3 bg-[#fbfbfb] px-10 pr-4 font-sans text-sm outline-none transition focus:border-blue/30 focus:bg-white"
                  type="tel"
                  placeholder="+234 801 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  autoComplete="tel"
                />
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray2" />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block font-display text-xs font-bold text-dark">
                Date of Birth <span className="font-normal text-gray2">(optional)</span>
              </span>
              <div className="relative">
                <input
                  className="w-full h-[52px] rounded-[14px] border border-gray3 bg-[#fbfbfb] px-10 pr-4 font-sans text-sm outline-none transition focus:border-blue/30 focus:bg-white"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray2" />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-[56px] w-full items-center justify-center rounded-[16px] bg-blue font-display text-[15px] font-bold text-white shadow-std transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </button>

            <p className="pt-2 text-center font-sans text-[13px] text-gray2">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-bold text-blue hover:underline"
              >
                Sign in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
