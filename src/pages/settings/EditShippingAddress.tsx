import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapPin, User, Home, Building2 } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackButton } from "../../components/layout/BackButton";
import { useToast } from "../../context/ToastContext";
import { useSettings } from "../../context/SettingsContext";
import { getUserAccountDoc, setUserAddresses } from "../../lib/userAccount";
import type { ShippingAddress } from "../../lib/userAccount";
import { AddressItem } from "./ShippingAddress";

export default function EditShippingAddress() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const { firebaseUser } = useSettings();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id") || "";

  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [tag, setTag] = useState("Home");
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [cityStateCountry, setCityStateCountry] = useState("");

  useEffect(() => {
    let active = true;

    const loadAddresses = async () => {
      if (!firebaseUser) {
        if (active) {
          setAddresses([]);
        }
        return;
      }

      try {
        const data = await getUserAccountDoc(firebaseUser.uid);
        if (!active) return;

        const items = (data.shippingAddresses?.items ?? []) as AddressItem[];
        setAddresses(items);

        if (editId && items.length > 0) {
          const existing = items.find((a) => a.id === editId);
          if (existing) {
            setTag(existing.tag);
            setName(existing.name);
            setStreet(existing.street);
            setCityStateCountry(existing.cityStateCountry);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    void loadAddresses();

    return () => {
      active = false;
    };
  }, [editId, firebaseUser]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    if (!firebaseUser) {
      pushToast("Please sign in to save addresses");
      return;
    }

    if (!name.trim() || !street.trim() || !cityStateCountry.trim()) {
      pushToast("All address details are required!");
      return;
    }

    try {
      let nextAddresses: AddressItem[];

      if (editId) {
        nextAddresses = addresses.map((address) =>
          address.id === editId
            ? { ...address, tag, name, street, cityStateCountry }
            : address
        );
        pushToast("Address saved");
      } else {
        const newAddress: AddressItem = {
          id: `addr-${Date.now()}`,
          name,
          tag,
          street,
          cityStateCountry,
          isDefault: addresses.length === 0,
        };
        nextAddresses = [...addresses, newAddress];
        pushToast("Address saved");
      }

      setAddresses(nextAddresses);
      await setUserAddresses(firebaseUser.uid, nextAddresses as ShippingAddress[]);
      navigate("/settings/shipping-address");
    } catch (error) {
      console.error(error);
      pushToast("Failed to save address");
    }
  };

  return (
    <div className="flex-grow flex flex-col bg-white animate-fade-up-enter min-h-screen pb-10">
      <PageHeader title={editId ? "Edit Address" : "Add Address"} left={<BackButton />} />

      <form onSubmit={handleSave} className="p-5 space-y-6 flex-1 flex flex-col justify-between">
        <div className="space-y-5 text-left">
          <div>
            <label className="input-label font-display font-semibold text-xs text-dark mb-2.5 block select-none">
              Address Label / Tag
            </label>
            <div className="flex gap-3">
              {[
                { label: "Home", icon: <Home className="w-4 h-4" /> },
                { label: "Office", icon: <Building2 className="w-4 h-4" /> },
                { label: "Other", icon: <MapPin className="w-4 h-4" /> },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setTag(item.label)}
                  className={`flex-grow border-1.5 rounded-std py-3 font-display text-[12.5px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    tag === item.label
                      ? "border-blue bg-blue-light/50 text-blue font-extrabold shadow-sm"
                      : "border-gray3 text-[#666] bg-white hover:bg-gray"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="input-wrap">
            <label className="input-label font-display font-semibold text-xs text-dark mb-1.5 block">
              Recipient Name
            </label>
            <div className="relative">
              <input
                className="input-field w-full h-[52px] bg-gray rounded-[12px] px-10 font-sans text-sm outline-none border border-transparent focus:border-blue/20"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray2" />
            </div>
          </div>

          <div className="input-wrap">
            <label className="input-label font-display font-semibold text-xs text-dark mb-1.5 block">
              Street Address
            </label>
            <div className="relative">
              <input
                className="input-field w-full h-[52px] bg-gray rounded-[12px] px-10 font-sans text-sm outline-none border border-transparent focus:border-blue/20"
                type="text"
                placeholder="Street address"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray2" />
            </div>
          </div>

          <div className="input-wrap">
            <label className="input-label font-display font-semibold text-xs text-dark mb-1.5 block">
              City, State, Country, ZIP
            </label>
            <textarea
              className="input-field w-full min-h-[64px] bg-gray rounded-[12px] p-4 font-sans text-sm outline-none border border-transparent focus:border-blue/20 resize-none leading-relaxed"
              placeholder="City, state, country, ZIP"
              value={cityStateCountry}
              onChange={(e) => setCityStateCountry(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="btn-primary w-full h-[58px] bg-blue text-white rounded-std text-[15px] font-display font-extrabold shadow-std active:scale-[0.98] transition-transform flex items-center justify-center cursor-pointer focus:outline-none"
          >
            Save Address Location
          </button>
        </div>
      </form>
    </div>
  );
}
