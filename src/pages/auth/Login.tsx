import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { auth, googleProvider } from "../../lib/firebase";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../lib/auth";

export default function Login() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { pushToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo || "/";

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 rounded-full border-[3px] border-blue border-t-transparent animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      pushToast("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      pushToast("Welcome back!");
      navigate(returnTo, { replace: true });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;

      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        pushToast("Invalid email or password. Please try again.");
      } else if (code === "auth/too-many-requests") {
        pushToast("Too many attempts. Please try again later.");
      } else {
        pushToast("Sign-in failed. Please check your details.");
      }

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      pushToast("Signed in with Google.");
      navigate(returnTo, { replace: true });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;

      if (code === "auth/popup-blocked" || code === "auth/cancelled-popup-request") {
        pushToast("Please allow popups for Google sign-in.");
      } else if (code === "auth/popup-closed-by-user") {
        // User dismissed the popup, so we stay quiet.
      } else if (code === "auth/unauthorized-domain") {
        pushToast("Google sign-in is not allowed on this domain yet.");
      } else if (code === "auth/operation-not-allowed") {
        pushToast("Google sign-in is disabled in Firebase.");
      } else {
        pushToast("Google sign-in failed. Please try again.");
      }

      console.error(err);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fdfdfd_0%,_#f3f6fb_46%,_#eef2f7_100%)] px-4 py-5 text-dark animate-fade-up-enter sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-[1180px] flex-col justify-center">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-4 inline-flex self-start items-center gap-1.5 rounded-full border border-black/5 bg-white/80 px-3.5 py-2 font-display text-[13px] font-bold text-dark shadow-[0_10px_25px_rgba(0,0,0,0.04)] backdrop-blur-sm transition hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
          <span>Back home</span>
        </button>

        <div className="overflow-hidden rounded-[32px] border border-black/5 bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:grid md:grid-cols-[1fr_1.02fr]">
          <section className="relative hidden min-h-[640px] flex-col justify-between overflow-hidden bg-[radial-gradient(circle_at_top_left,_var(--color-blue-light)_0%,_#ffffff_58%)] p-8 text-dark md:flex lg:p-10">
            <div className="absolute -left-16 top-10 h-44 w-44 rounded-full bg-[color:var(--color-blue)]/10 blur-3xl" />
            <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-[color:var(--color-pink)]/10 blur-2xl" />
            <div className="absolute bottom-0 right-0 h-52 w-52 translate-x-1/3 translate-y-1/3 rounded-full bg-white/70 blur-3xl" />

            <div className="relative space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-dark shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure sign in
              </div>

              <div className="max-w-[24rem] space-y-3">
                <h2 className="font-display text-[44px] font-black leading-[0.94] tracking-tight text-dark xl:text-[48px]">
                  Welcome back.
                </h2>
                <p className="max-w-[22rem] font-sans text-[14px] leading-relaxed text-[#555]">
                  Sign in to keep your wishlist, checkout, and profile in sync across devices.
                </p>
              </div>
            </div>

            <div className="relative grid grid-cols-2 gap-4">
              <div className="rounded-[24px] bg-white p-4 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
                <p className="font-display text-[10px] font-black uppercase tracking-[0.22em] text-gray2">
                  Shopping
                </p>
                <p className="mt-2 font-display text-[18px] font-black leading-tight text-dark">
                  Save items, track orders, and pick up right where you left off.
                </p>
              </div>
              <div className="rounded-[24px] bg-white p-4 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
                <p className="font-display text-[10px] font-black uppercase tracking-[0.22em] text-gray2">
                  Fast checkout
                </p>
                <p className="mt-2 font-display text-[18px] font-black leading-tight text-dark">
                  Keep shipping details ready for a quicker buy.
                </p>
              </div>
            </div>
          </section>

          <section className="p-5 sm:p-6 md:p-8 lg:p-10">
            <div className="space-y-3 md:hidden">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-light px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-blue">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure sign in
              </div>
              <div>
                <h2 className="font-display text-[30px] font-black tracking-tight text-dark">
                  Welcome back.
                </h2>
                <p className="mt-1 max-w-[320px] font-sans text-[13.5px] leading-relaxed text-gray2">
                  Sign in to keep your wishlist, checkout, and profile in sync across devices.
                </p>
              </div>
            </div>

            <div className="mb-6 mt-6 hidden md:block">
              <p className="font-display text-xs font-black uppercase tracking-[0.24em] text-gray2">
                Sign in
              </p>
              <h1 className="mt-2 font-display text-[28px] font-black tracking-tight text-dark">
                Choose how you want to continue.
              </h1>
              <p className="mt-2 max-w-[32rem] font-sans text-[14px] leading-relaxed text-gray2">
                Use Google for the fastest login, or sign in with email and password.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="mt-6 space-y-4 md:mt-0">
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block font-display text-xs font-bold text-dark">
                    Email Address
                  </span>
                  <div className="relative">
                    <input
                      className="h-[52px] w-full rounded-[14px] border border-gray3 bg-[#fbfbfb] px-10 pr-4 font-sans text-sm outline-none transition focus:border-blue/30 focus:bg-white"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      inputMode="email"
                    />
                    <Mail className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray2" />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1.5 block font-display text-xs font-bold text-dark">
                    Password
                  </span>
                  <div className="relative">
                    <input
                      className="h-[52px] w-full rounded-[14px] border border-gray3 bg-[#fbfbfb] px-10 pr-12 font-sans text-sm outline-none transition focus:border-blue/30 focus:bg-white"
                      type={showPassword ? "text" : "password"}
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <Lock className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray2 transition hover:text-dark"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="font-display text-xs font-bold text-blue hover:underline"
                >
                  Forgot password?
                </button>
                <span className="font-sans text-[12px] text-gray2">We'll help you reset it.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-[56px] w-full items-center justify-center rounded-[16px] bg-blue font-display text-[15px] font-bold text-white shadow-std transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
              </button>

              <div className="flex items-center gap-4 py-1">
                <div className="h-px flex-1 bg-gray3" />
                <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gray2">
                  or continue with
                </span>
                <div className="h-px flex-1 bg-gray3" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="flex h-12 w-full items-center justify-center gap-2.5 rounded-[16px] border border-gray3 bg-white font-display text-[14px] font-bold text-dark transition hover:bg-gray/60 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {googleLoading ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <svg
                    className="h-4.5 w-4.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                Continue with Google
              </button>

              <p className="pt-2 text-center font-sans text-[13px] text-gray2">
                New here?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="font-bold text-blue hover:underline"
                >
                  Create an account
                </button>
              </p>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
