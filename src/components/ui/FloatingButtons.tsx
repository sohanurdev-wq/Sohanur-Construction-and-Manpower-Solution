import { COMPANY_DETAILS } from "@/constants";
import { MessageSquare, Phone } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${COMPANY_DETAILS.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      aria-label="Chat on WhatsApp"
    >
      <MessageSquare className="h-7 w-7" />
    </a>
  );
}

export function CallButton() {
  return (
    <a
      href={`tel:${COMPANY_DETAILS.phones[0]}`}
      className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-black shadow-lg transition-transform hover:scale-110 active:scale-95"
      aria-label="Call Us"
    >
      <Phone className="h-7 w-7" />
    </a>
  );
}
