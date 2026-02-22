import { Timestamp } from "firebase/firestore";

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  specifications: {
    size: string;
    concentration: string;
    scentFamily: string;
    topNotes: string;
    middleNotes: string;
    baseNotes: string;
    longevity?: string;
  };
  images: string[];
  unitsInStock: number;
  condition: "new" | "refurbished" | "used";
  featured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PerfumeFormData {
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  specifications: {
    size: string;
    concentration: string;
    scentFamily: string;
    topNotes: string;
    middleNotes: string;
    baseNotes: string;
    longevity?: string;
  };
  images: string[];
  unitsInStock: number;
  condition: "new" | "refurbished" | "used";
  featured: boolean;
}

export const PERFUME_CATEGORIES = [
  "Women",
  "Men",
  "Unisex",
  "Niche",
  "Gift Sets",
  "Body Mists",
  "Travel Size",
] as const;

export const PERFUME_BRANDS = [
  "Chanel",
  "Dior",
  "Yves Saint Laurent",
  "Gucci",
  "Tom Ford",
  "Armani",
  "Jo Malone",
  "Creed",
  "Maison Francis Kurkdjian",
  "Dolce & Gabbana",
] as const;

export const PERFUME_SIZES = ["30ml", "50ml", "75ml", "100ml", "150ml", "200ml"] as const;

export const PERFUME_CONCENTRATIONS = ["EDT", "EDP", "Parfum", "Extrait", "Cologne"] as const;

export const PERFUME_SCENT_FAMILIES = [
  "Floral",
  "Woody",
  "Oriental",
  "Fresh",
  "Gourmand",
  "Citrus",
  "Chypre",
  "Aromatic",
] as const;
