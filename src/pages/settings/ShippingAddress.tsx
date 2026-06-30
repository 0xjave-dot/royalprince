import { useEffect, useState } from "react";
import { Check, Plus, Edit3, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { BackButton } from "../../components/layout/BackButton";
import { useToast } from "../../context/ToastContext";
import { useSettings } from "../../context/SettingsContext";
import { getUserAccountDoc, setUserAddresses } from "../../lib/userAccount";
import type { ShippingAddress } from "../../lib/userAccount";

export interface AddressItem {
  id: string;
  name: string;
  tag: string;
  street: string;
  cityStateCountry: string;
  isDefault: boolean;
}

export default function ShippingAddress() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const { firebaseUser } = useSettings();
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadAddresses = async () => {
      if (!firebaseUser) {
        if (active) {
          setAddresses([]);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await getUserAccountDoc(firebaseUser.uid);
        if (active) {
          setAddresses((data.shippingAddresses?.items ?? []) as AddressItem[]);
        }
      } catch (error) {
        console.error(error);
        if (active) {
          setAddresses([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    void loadAddresses();

    return () => {
      active = false;
    };
  }, [firebaseUser]);

  const handleSetDefault = async (id: string) => {
    const next = addresses.map((address) => ({
      ...address,
      isDefault: address.id === id,
    }));

    setAddresses(next);
    if (firebaseUser) {
      await setUserAddresses(firebaseUser.uid, next as ShippingAddress[]);
      pushToast("Saved default address");
    }
  };

  if (!firebaseUser) {
    return (
      <div className="flex-grow flex flex-col bg-white animate-fade-up-enter min-h-screen pb-10">
        <PageHeader title="Shipping Address" left={<BackButton />} />
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-gray flex items-center justify-center">
            <LogIn className="w-10 h-10 text-gray2" />
          </div>
          <div>
            <h2 className="font-display font-bold text-[20px] text-dark mb-1">Sign in required</h2>
            <p className="font-sans text-[13px] text-gray2 leading-relaxed max-w-[260px]">
              Saved shipping addresses live in your Firestore profile, so you need to be signed in to manage them.
            </p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="w-full max-w-[260px] h-[52px] bg-blue text-white font-display font-bold text-[15px] rounded-std shadow-std active:scale-[0.98] transition-transform cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col bg-white animate-fade-up-enter min-h-screen pb-10">
      <PageHeader title="Shipping Address" left={<BackButton />} />

      <div className="p-5 space-y-4">
        {loading ? (
          <div className="rounded-std bg-gray p-4 text-sm text-gray2 font-sans">
            Loading saved addresses...
          </div>
        ) : addresses.length === 0 ? (
          <div className="rounded-std bg-gray p-5 text-center text-sm text-gray2 font-sans">
            No saved shipping addresses yet.
          </div>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => void handleSetDefault(addr.id)}
              className={`bg-white rounded-std p-4.5 border-2 shadow-subtle flex items-start gap-3.5 cursor-pointer relative transition-all ${
                addr.isDefault ? "border-blue" : "border-gray/50 hover:border-gray2"
              }`}
            >
              <div
                className={`w-[20px] h-[20px] rounded-full flex items-center justify-center border-2 flex-shrink-0 mt-0.5 ${
                  addr.isDefault ? "border-blue bg-blue text-white" : "border-gray3 bg-white"
                }`}
              >
                {addr.isDefault && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>

              <div className="flex-grow text-left select-none">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-[14.5px] text-dark">
                    {addr.tag} Address
                  </span>
                  {addr.isDefault && (
                    <span className="bg-blue-light/50 text-blue font-display text-[9px] font-extrabold px-1.5 py-0.5 rounded-[4px] uppercase">
                      Default
                    </span>
                  )}
                </div>
                <div className="font-sans text-xs text-dark mt-1 font-semibold">{addr.name}</div>
                <p className="font-sans text-xs text-gray2 leading-relaxed mt-0.5">
                  {addr.street}
                  <br />
                  {addr.cityStateCountry}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/settings/shipping-address/edit?id=${addr.id}`);
                }}
                className="p-1.5 hover:bg-gray rounded-full text-dark hover:text-blue active:scale-95 transition-all focus:outline-none cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}

        <button
          onClick={() => navigate("/settings/shipping-address/edit")}
          className="btn-outline w-full h-[52px] border-blue text-blue font-display font-bold text-sm rounded-std mt-4 hover:bg-blue-light/10 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" strokeWidth={2.5} /> Add New Address
        </button>
      </div>
    </div>
  );
}
