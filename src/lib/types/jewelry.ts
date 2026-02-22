import { Timestamp } from "firebase/firestore";

export interface Jewelry {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  specifications: {
    metal: string;
    gemstone: string;
    size: string;
    color: string;
    finish: string;
    care?: string;
  };
  images: string[];
  unitsInStock: number;
  condition: "new" | "refurbished" | "used";
  featured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface JewelryFormData {
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  specifications: {
    metal: string;
    gemstone: string;
    size: string;
    color: string;
    finish: string;
    care?: string;
  };
  images: string[];
  unitsInStock: number;
  condition: "new" | "refurbished" | "used";
  featured: boolean;
}

export const JEWELRY_CATEGORIES = [
  "Necklaces",
  "Chains",
  "Bracelets",
  "Earrings",
  "Rings",
  "Watches",
  "Anklets",
  "Brooches",
  "Sets",
] as const;

export const JEWELRY_BRANDS = [
  "Cartier",
  "Tiffany & Co.",
  "Bulgari",
  "Pandora",
  "Swarovski",
  "David Yurman",
  "Chopard",
  "Gucci",
  "Rolex",
  "Van Cleef & Arpels",
] as const;

export const JEWELRY_METALS = ["Gold", "Sterling Silver", "Rose Gold", "Platinum", "Stainless Steel", "Brass"] as const;

export const JEWELRY_GEMSTONES = [
  "Diamond",
  "Pearl",
  "Emerald",
  "Sapphire",
  "Ruby",
  "Amethyst",
  "Topaz",
  "Opal",
  "Citrine",
  "No Gemstone",
] as const;

export const JEWELRY_SIZES = ["Adjustable", "6", "6.5", "7", "7.5", "8", "One Size"] as const;

export const JEWELRY_FINISHES = ["Polished", "Matte", "Hammered", "Brushed", "Textured", "Enamel"] as const;
