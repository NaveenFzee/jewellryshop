export type MetalType = "gold" | "silver";
export type MakingChargeType = "percentage" | "fixed";
export type Gender = "men" | "women" | "kids" | "unisex";
export type EnquiryStatus = "new" | "contacted" | "in_progress" | "converted" | "closed";

export interface Category {
  id: string;
  name: string;
  slug: string;
  metal_type: MetalType;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  banner_image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  is_primary: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  collection_id: string | null;
  metal_type: MetalType;
  purity: string;
  gross_weight: number;
  net_weight: number;
  stone_weight: number;
  stone_charge: number;
  making_charge_type: MakingChargeType;
  making_charge_value: number;
  gst_percentage: number;
  gender: Gender | null;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_bridal: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_images?: ProductImage[];
  categories?: Pick<Category, "id" | "name" | "slug"> | null;
}

export interface Offer {
  id: string;
  title: string;
  description: string | null;
  banner_image_url: string | null;
  discount_text: string | null;
  terms_conditions: string | null;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

export interface GoldRateRow {
  id: string;
  rate_24k: number;
  rate_22k: number;
  rate_20k: number;
  rate_18k: number;
  unit: string;
  source: string;
  effective_at: string;
}

export interface SilverRateRow {
  id: string;
  rate: number;
  unit: string;
  source: string;
  effective_at: string;
}

export interface GoldRatesResponse {
  gold_24k: number;
  gold_22k: number;
  gold_20k: number;
  gold_18k: number;
  silver: number;
  currency: "INR";
  gold_unit: string;
  silver_unit: string;
  updated_at: string;
  previous?: {
    gold_24k: number;
    gold_22k: number;
    gold_20k: number;
    gold_18k: number;
    silver: number;
  };
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_name: string | null;
  display_order: number;
  is_active: boolean;
}

export interface Enquiry {
  id: string;
  customer_id: string | null;
  product_id: string | null;
  name: string;
  phone: string;
  whatsapp: string | null;
  message: string | null;
  status: EnquiryStatus;
  created_at: string;
}

export interface CustomJewelleryRequest {
  id: string;
  name: string;
  phone: string;
  whatsapp: string | null;
  jewellery_type: string | null;
  requirement: string | null;
  budget_range: string | null;
  reference_image_url: string | null;
  status: EnquiryStatus;
  created_at: string;
}
