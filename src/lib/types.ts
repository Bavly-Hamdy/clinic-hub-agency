export type Service = {
  id: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
};

export type Work = {
  id: string;
  title: string;
  clinic_name: string;
  service_id: string | null;
  image_url: string;
  image_path: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

export type Settings = {
  id: number;
  whatsapp: string;
  instagram: string;
  email: string;
};
