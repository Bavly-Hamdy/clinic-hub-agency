import { sanitizePhone } from "./validation";

export function waLink(number: string, text: string): string {
  const digits = sanitizePhone(number);
  const msg = encodeURIComponent(text.trim());
  return digits ? `https://wa.me/${digits}?text=${msg}` : `https://wa.me/?text=${msg}`;
}
