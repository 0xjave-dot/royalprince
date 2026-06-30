import { useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Calendar, Lock, Loader2, Upload } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackButton } from "../../components/layout/BackButton";
import { useSettings } from "../../context/SettingsContext";
import { useToast } from "../../context/ToastContext";
import { updateUserDoc } from "../../lib/firestore";
import { auth } from "../../lib/firebase";
import { updateProfile } from "firebase/auth";

export default function EditProfile() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const { userProfile, setUserProfile, firebaseUser } = useSettings();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [dob, setDob] = useState(userProfile.dob);
  const [gender, setGender] = useState(userProfile.gender);
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl || firebaseUser?.photoURL || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name || !email || !phone) {
      pushToast("Name, email and phone are required!");
      return;
    }

    setSaving(true);
    try {
      if (firebaseUser) {
        await updateUserDoc(firebaseUser.uid, { name, email, phone, dob, gender, avatarUrl });
      }

      setUserProfile({ name, email, phone, dob, gender, avatarUrl });

      if (auth.currentUser) {
        try {
          await updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: avatarUrl || null,
          });
        } catch (profileErr) {
          console.warn("Auth profile sync failed:", profileErr);
          pushToast("Profile saved. Auth sync will retry later.");
          navigate(-1);
          return;
        }
      }

      pushToast("Profile updated successfully.");
      navigate(-1);
    } catch (err) {
      console.error(err);
      pushToast("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (n: string) => {
    if (!n) return "?";
    return n
      .split(" ")
      .map((item) => item[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      pushToast("Please choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (result) {
        setAvatarUrl(result);
        pushToast("Avatar selected. Save changes to keep it.");
      }
    };
    reader.onerror = () => pushToast("Could not read that image.");
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-up-enter min-h-screen pb-10">
      <PageHeader
        title="Edit Profile"
        left={<BackButton />}
        right={
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-[13px] font-display font-bold text-blue hover:underline cursor-pointer focus:outline-none disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
          </button>
        }
      />

      <div className="p-5 space-y-6 overflow-y-auto">
        <div className="flex flex-col items-center py-4 select-none">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-[90px] h-[90px] rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-[90px] h-[90px] rounded-full bg-gradient-to-br from-blue to-pink text-white font-display font-bold text-3xl flex items-center justify-center border-2 border-white shadow-md">
              {getInitials(name)}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] font-display font-semibold text-blue hover:underline"
          >
            <Upload className="w-3.5 h-3.5" />
            Change Photo
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4 text-left">
          <div className="input-wrap">
            <label className="input-label font-display font-semibold text-xs text-dark mb-1.5 block">Full Name</label>
            <div className="relative">
              <input
                className="input-field w-full h-[52px] bg-gray rounded-[12px] px-10 font-sans text-sm outline-none border border-transparent focus:border-blue/20"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray2" />
            </div>
          </div>

          <div className="input-wrap">
            <label className="input-label font-display font-semibold text-xs text-dark mb-1.5 block">Email Address</label>
            <div className="relative">
              <input
                className="input-field w-full h-[52px] bg-gray rounded-[12px] px-10 font-sans text-sm outline-none border border-transparent focus:border-blue/20"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray2" />
            </div>
          </div>

          <div className="input-wrap">
            <label className="input-label font-display font-semibold text-xs text-dark mb-1.5 block">Phone Number</label>
            <div className="relative">
              <input
                className="input-field w-full h-[52px] bg-gray rounded-[12px] px-10 font-sans text-sm outline-none border border-transparent focus:border-blue/20"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray2" />
            </div>
          </div>

          <div className="input-wrap">
            <label className="input-label font-display font-semibold text-xs text-dark mb-1.5 block">Date of Birth</label>
            <div className="relative">
              <input
                className="input-field w-full h-[52px] bg-gray rounded-[12px] px-10 font-sans text-sm outline-none border border-transparent focus:border-blue/20"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray2" />
            </div>
          </div>

          <div className="input-wrap">
            <label className="input-label font-display font-semibold text-xs text-dark mb-1.5 block">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="input-field w-full h-[52px] bg-gray rounded-[12px] px-4 font-sans text-sm outline-none border border-transparent focus:border-blue/20 cursor-pointer"
            >
              <option value="">Prefer not to say</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </form>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary w-full h-14 rounded-std bg-blue text-white font-display font-bold text-sm tracking-wide mt-6 focus:outline-none flex items-center justify-center cursor-pointer disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
