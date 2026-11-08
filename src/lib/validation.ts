import { z } from "zod";

// ---------- Sanitization Helpers ----------

export function sanitizeText(input: string, maxLen = 300): string {
  if (!input || typeof input !== "string") return "";
  return input
    .trim()
    .slice(0, maxLen)
    .replace(/[<>]/g, ""); // Basic XSS prevention against angle bracket injection
}

export function sanitizePhone(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input.replace(/\D/g, "").slice(0, 15);
}

export function sanitizeInstagramHandle(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .trim()
    .replace(/^@/, "")
    .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
    .replace(/\/$/, "")
    .replace(/[^a-zA-Z0-9._]/g, "")
    .slice(0, 30);
}

// ---------- Zod Validation Schemas (OWASP input validation) ----------

export const WorkInputSchema = z.object({
  title: z
    .string()
    .min(2, "عنوان العمل يجب ألا يقل عن حرفين")
    .max(100, "عنوان العمل يجب ألا يتجاوز 100 حرف")
    .transform((val) => sanitizeText(val, 100)),
  clinic_name: z
    .string()
    .max(100, "اسم العيادة يجب ألا يتجاوز 100 حرف")
    .optional()
    .default("")
    .transform((val) => sanitizeText(val ?? "", 100)),
  service_id: z
    .string()
    .uuid("معرف الخدمة غير صالح")
    .nullable()
    .optional()
    .or(z.literal("").transform(() => null)),
  sort_order: z.coerce
    .number()
    .int("الترتيب يجب أن يكون عدداً صحيحاً")
    .min(0, "الترتيب يجب ألا يقل عن 0")
    .max(9999, "قيمة الترتيب كبيرة جداً")
    .default(0),
  is_published: z.boolean().default(true),
});

export type WorkInput = z.infer<typeof WorkInputSchema>;

export const ServiceInputSchema = z.object({
  title: z
    .string()
    .min(2, "اسم الخدمة يجب ألا يقل عن حرفين")
    .max(80, "اسم الخدمة يجب ألا يتجاوز 80 حرفاً")
    .transform((val) => sanitizeText(val, 80)),
  description: z
    .string()
    .max(500, "وصف الخدمة يجب ألا يتجاوز 500 حرف")
    .optional()
    .default("")
    .transform((val) => sanitizeText(val ?? "", 500)),
  sort_order: z.coerce
    .number()
    .int("الترتيب يجب أن يكون عدداً صحيحاً")
    .min(0, "الترتيب يجب ألا يقل عن 0")
    .max(9999, "قيمة الترتيب كبيرة جداً")
    .default(0),
  is_active: z.boolean().default(true),
});

export type ServiceInput = z.infer<typeof ServiceInputSchema>;

export const SettingsInputSchema = z.object({
  whatsapp: z
    .string()
    .transform(sanitizePhone)
    .refine((val) => !val || (val.length >= 10 && val.length <= 15), {
      message: "رقم واتساب غير صحيح (اكتبه بالصيغة الدولية 10-15 رقماً)",
    }),
  instagram: z
    .string()
    .optional()
    .default("")
    .transform(sanitizeInstagramHandle),
  email: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: "صيغة البريد الإلكتروني غير صحيحة",
    }),
});

export type SettingsInput = z.infer<typeof SettingsInputSchema>;

// ---------- File Upload Security (OWASP A03 / Unrestricted File Upload) ----------

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export function validateImageFile(file: File): { ok: boolean; error?: string } {
  if (!file) {
    return { ok: false, error: "لم يتم اختيار ملف." };
  }

  // 1. Size check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { ok: false, error: "حجم الصورة يتجاوز الحد الأقصى المسموح (8 ميجابايت)." };
  }

  // 2. MIME type check
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as typeof ALLOWED_IMAGE_MIME_TYPES[number])) {
    return {
      ok: false,
      error: "نوع الملف غير مدعوم. الصيغ المدعومة هي JPG و PNG و WebP و AVIF فقط.",
    };
  }

  // 3. Extension check (prevent disguised dangerous files e.g. file.php.jpg or file.exe)
  const ext = file.name.split(".").pop()?.toLowerCase();
  const safeExtensions = ["jpg", "jpeg", "png", "webp", "avif"];
  if (!ext || !safeExtensions.includes(ext)) {
    return { ok: false, error: "امتداد الملف غير صالح أو خطير." };
  }

  return { ok: true };
}

/**
 * Generate a cryptographically safe storage path that ignores user client filename
 * to prevent directory traversal / file overwriting.
 */
export function generateSafeStoragePath(file: File): string {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const safeExt = ["jpg", "jpeg", "png", "webp", "avif"].includes(ext) ? ext : "jpg";
  const timestamp = Date.now();
  const randomStr = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID().replace(/-/g, "").slice(0, 16)
    : Math.random().toString(36).slice(2, 10);
  return `works/${timestamp}-${randomStr}.${safeExt}`;
}

