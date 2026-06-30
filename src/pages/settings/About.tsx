import { PageHeader } from "../../components/layout/PageHeader";
import { BackButton } from "../../components/layout/BackButton";
import { ExternalLink, HelpingHand, MapPin, Phone, ShieldCheck, Scale } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { brandInstagramUrl, brandLocations, brandLogoUrl, brandName, brandWhatsappNumber } from "../../data/brand";

export default function About() {
  const { pushToast } = useToast();

  const handleDocumentClick = (doc: string) => {
    pushToast(`Displaying ${doc} disclosure... 📃`);
  };

  return (
    <div className="flex-grow flex flex-col bg-white animate-fade-up-enter min-h-screen pb-10">
      <PageHeader title={`About ${brandName}`} left={<BackButton />} />

      <div className="p-5 space-y-6 text-left">
        {/* Core Vision Block */}
        <div className="flex flex-col items-center text-center py-6 select-none border-b border-gray3/30 select-none">
          <img
            src={brandLogoUrl}
            alt={`${brandName} Logo`}
            className="w-20 h-20 object-contain mb-3"
            referrerPolicy="no-referrer"
          />
          <div className="font-display font-black text-[30px] tracking-tight uppercase text-blue">
            {brandName}
          </div>
          <p className="font-sans text-xs text-gray2 leading-tight mt-1.5 font-semibold">
            Premium fashion storefront &middot; Version 2.4.0
          </p>
        </div>

        <p className="font-sans text-[13.5px] leading-relaxed text-[#555] mx-1">
          {brandName} is a premium fashion catalog curated for modern tastemakers. We stock dresses, two-pieces, shoes, Accessories, and Casuals with a polished in-store and online experience built for everyday style.
        </p>

        <div className="space-y-3 rounded-[24px] border border-[#f0f0f0] bg-[#fbfbfb] p-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4.5 w-4.5 text-blue" />
            <span className="font-display text-[14px] font-bold text-dark">Store locations</span>
          </div>
          <div className="space-y-2 pl-6">
            {brandLocations.map((location) => (
              <div key={location.label} className="text-sm leading-6 text-[#555]">
                <span className="font-bold text-dark">{location.label}:</span> {location.address}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pl-6 pt-1">
            <a
              href={`https://wa.me/${brandWhatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-blue px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              WhatsApp {brandWhatsappNumber}
            </a>
            <a
              href={brandInstagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-dark"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Instagram
            </a>
          </div>
        </div>

        {/* Legal disclosures list links */}
        <div className="space-y-3.5 pt-2">
          {/* Terms */}
          <div
            onClick={() => handleDocumentClick("Terms of Service")}
            className="flex items-center gap-3.5 p-4 rounded-std border border-[#f0f0f0] cursor-pointer hover:bg-gray/40 select-none"
          >
            <Scale className="w-5 h-5 text-blue" />
            <div>
              <span className="font-display font-bold text-[14px] text-dark">Terms of Service</span>
              <p className="font-sans text-[10.5px] text-gray2 leading-none mt-0.5">Updated June 2026</p>
            </div>
          </div>

          {/* Privacy */}
          <div
            onClick={() => handleDocumentClick("Privacy Policy")}
            className="flex items-center gap-3.5 p-4 rounded-std border border-[#f0f0f0] cursor-pointer hover:bg-gray/40 select-none"
          >
            <ShieldCheck className="w-5 h-5 text-blue" />
            <div>
              <span className="font-display font-bold text-[14px] text-dark font-extrabold">Privacy & Cookies Policy</span>
              <p className="font-sans text-[10.5px] text-gray2 leading-none mt-0.5">Updated March 2026</p>
            </div>
          </div>

          {/* Help center */}
          <div
            onClick={() => handleDocumentClick("User Licenses")}
            className="flex items-center gap-3.5 p-4 rounded-std border border-[#f0f0f0] cursor-pointer hover:bg-gray/40 select-none"
          >
            <HelpingHand className="w-5 h-5 text-blue" />
            <div>
              <span className="font-display font-bold text-[14px] text-dark">Supplier Fair-Trade Licenses</span>
              <p className="font-sans text-[10.5px] text-gray2 leading-none mt-0.5">Updated May 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
