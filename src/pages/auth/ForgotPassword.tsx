import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, KeyRound, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { auth } from "../../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useAuth } from "../../lib/auth";

export default function ForgotPassword() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

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

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      pushToast("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
      pushToast("Reset link sent. Check your inbox.");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/user-not-found") {
        pushToast("No account found with that email.");
      } else if (code === "auth/invalid-email") {
        pushToast("Please enter a valid email address.");
      } else {
        pushToast("Failed to send reset email. Try again.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fdfdfd_0%,_#f3f6fb_46%,_#eef2f7_100%)] px-4 py-5 sm:px-6 sm:py-8 text-dark animate-fade-up-enter">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-[540px] flex-col justify-center">
        <button
          onClick={() => navigate("/login")}
          className="mb-4 inline-flex items-center gap-1.5 self-start rounded-full border border-black/5 bg-white/80 px-3.5 py-2 font-display text-[13px] font-bold text-dark shadow-[0_10px_25px_rgba(0,0,0,0.04)] backdrop-blur-sm transition hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          <span>Back to sign in</span>
        </button>

        <div className="rounded-[28px] border border-black/5 bg-white/95 p-5 sm:p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="space-y-3 text-center">
            <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-light text-blue">
              {sent ? <CheckCircle2 className="w-10 h-10" /> : <KeyRound className="w-10 h-10" />}
            </div>
            <div>
              <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-blue-light px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-blue">
                <ShieldCheck className="w-3.5 h-3.5" />
                Password recovery
              </div>
              <h2 className="mt-3 font-display text-[30px] font-black tracking-tight text-dark">
                {sent ? "Email sent." : "Forgot your password?"}
              </h2>
              <p className="mx-auto mt-1 max-w-[360px] font-sans text-[13.5px] leading-relaxed text-gray2">
                {sent
                  ? `We’ve sent a reset link to ${email}. Open your inbox and follow the instructions to create a new password.`
                  : "Enter the email linked to your account and we’ll send you a secure reset link."}
              </p>
            </div>
          </div>

          {!sent ? (
            <form onSubmit={handleReset} className="mt-6 space-y-4">
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
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray2" />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex h-[56px] w-full items-center justify-center rounded-[16px] bg-blue font-display text-[15px] font-bold text-white shadow-std transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="mt-6 flex h-[56px] w-full items-center justify-center rounded-[16px] bg-blue font-display text-[15px] font-bold text-white shadow-std transition active:scale-[0.99]"
            >
              Back to Sign In
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mx-auto mt-5 block font-sans text-[13.5px] font-semibold text-blue hover:underline"
          >
            Return to login
          </button>
        </div>
      </div>
    </div>
  );
}
