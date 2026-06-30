import { brandWhatsappUrl } from "../../data/brand";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={brandWhatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="whatsapp-float fixed right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] md:bottom-6 z-[110] group"
    >
      <span className="whatsapp-float__glow" aria-hidden="true" />
      <span className="whatsapp-float__ring" aria-hidden="true" />
      <span className="whatsapp-float__core">
        <img
          src="https://i.ibb.co/jZ480vfJ/default-whatsapp-solid-green-color-logo-icon-vector-47504721-ezremove-removebg-preview.png"
          alt=""
          className="whatsapp-float__icon"
          referrerPolicy="no-referrer"
        />
      </span>
    </a>
  );
}
