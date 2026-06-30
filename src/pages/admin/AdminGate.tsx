import { useEffect, useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, ShieldCheck } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { useToast } from "../../context/ToastContext";
import AdminPanel from "./AdminPanel";
import { brandName } from "../../data/brand";

const ADMIN_PANEL_PASSWORD = "Fabadmin26!";
const ADMIN_UNLOCK_KEY = "royal-prince-admin-unlocked";

export default function AdminGate() {
  const { user, loading: authLoading } = useAuth();
  const { pushToast } = useToast();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [unlocked, setUnlocked] = useState(() => window.sessionStorage.getItem(ADMIN_UNLOCK_KEY) === "1");

  useEffect(() => {
    if (!user) {
      setUnlocked(false);
      window.sessionStorage.removeItem(ADMIN_UNLOCK_KEY);
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090909] text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (unlocked) {
    return <AdminPanel />;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password.trim()) {
      pushToast("Enter the admin password.");
      return;
    }

    setSaving(true);
    try {
      if (password === ADMIN_PANEL_PASSWORD) {
        window.sessionStorage.setItem(ADMIN_UNLOCK_KEY, "1");
        setUnlocked(true);
        setPassword("");
      pushToast("Admin access unlocked.");
      } else {
        pushToast("Incorrect admin password.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,87,144,0.18)_0%,_rgba(9,9,9,0)_42%),linear-gradient(180deg,#090909_0%,#111111_100%)] px-4 py-4 text-white sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[720px] flex-col justify-center">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mb-4 inline-flex self-start items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 font-display text-[13px] font-bold text-white shadow-[0_10px_25px_rgba(0,0,0,0.18)] backdrop-blur-sm transition hover:bg-white/[0.1]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
          <span>Back</span>
        </button>

        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.05] shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="grid gap-0 md:grid-cols-[1fr_1.05fr]">
            <div className="relative hidden min-h-[520px] flex-col justify-between overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,87,144,0.22)_0%,_rgba(17,17,17,1)_72%)] p-8 md:flex">
              <div className="absolute -left-14 top-8 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute right-0 top-0 h-44 w-44 translate-x-1/3 -translate-y-1/3 rounded-full bg-[#8fe3c0]/10 blur-3xl" />
              <div className="relative space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white/70">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#8fe3c0]" />
                  Admin only
                </div>
                <div className="max-w-[24rem] space-y-3">
                  <h1 className="font-display text-[42px] font-black leading-[0.94] tracking-tight text-white">
                    Enter the admin password.
                  </h1>
                  <p className="max-w-[22rem] text-sm leading-6 text-white/68">
                    Signed-in users still need the local admin passcode before they can open the {brandName} catalog control room.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/42">Access</p>
                  <p className="mt-2 font-display text-[18px] font-black leading-tight text-white">
                    Password gate first, then Firestore rules.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/42">Session</p>
                  <p className="mt-2 font-display text-[18px] font-black leading-tight text-white">
                    Unlocks stay only for this browser session.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 md:p-8 lg:p-10">
              <div className="space-y-3 md:hidden">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white/70">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#8fe3c0]" />
                  Admin only
                </div>
                <div>
                  <h2 className="font-display text-[30px] font-black tracking-tight text-white">
                    Enter the admin password.
                  </h2>
                  <p className="mt-1 max-w-[320px] text-sm leading-6 text-white/65">
                    Signed-in users still need the local admin passcode before they can open the {brandName} catalog control room.
                  </p>
                </div>
              </div>

              <div className="mb-6 mt-6 hidden md:block">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Admin access</p>
                <h2 className="mt-2 font-display text-[28px] font-black tracking-tight text-white">
                  Password required to continue.
                </h2>
                <p className="mt-2 max-w-[32rem] text-sm leading-6 text-white/66">
                  This screen sits on top of the normal Firebase login so the admin panel needs both a signed-in account and the correct passcode.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4 md:mt-0">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.24em] text-white/50">
                    Admin password
                  </span>
                  <div className="relative">
                    <input
                      className="h-[52px] w-full rounded-[14px] border border-white/10 bg-white/[0.06] px-10 pr-12 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#ff5790]/40 focus:bg-white/[0.08]"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                    />
                    <Lock className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-white/45" />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/45 transition hover:text-white"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-[56px] w-full items-center justify-center rounded-[16px] bg-white text-[15px] font-black uppercase tracking-[0.18em] text-[#111] shadow-[0_20px_45px_rgba(255,255,255,0.08)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Unlock admin panel"}
                </button>

                <p className="pt-2 text-center text-[13px] text-white/55">
                  If you are not an admin, go back to the main storefront or sign in with a regular account.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
