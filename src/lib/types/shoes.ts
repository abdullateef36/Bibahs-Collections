import { Timestamp } from "firebase/firestore";

export interface Shoe {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  specifications: {
    size: string;
    color: string;
    material: string;
    style: string;
    sole: string;
    closure?: string;
    care?: string;
  };
  images: string[];
  unitsInStock: number;
  condition: "new" | "refurbished" | "used";
  featured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ShoeFormData {
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  specifications: {
    size: string;
    color: string;
    material: string;
    style: string;
    sole: string;
    closure?: string;
    care?: string;
  };
  images: string[];
  unitsInStock: number;
  condition: "new" | "refurbished" | "used";
  featured: boolean;
}

export const SHOE_CATEGORIES = [
  "Sneakers",
  "Heels",
  "Flats",
  "Boots",
  "Sandals",
  "Loafers",
  "Slides",
  "Mules",
  "Platforms",
] as const;

export const SHOE_BRANDS = [
  "Nike",
  "Adidas",
  "Puma",
  "New Balance",
  "Gucci",
  "Prada",
  "Jimmy Choo",
  "Christian Louboutin",
  "Balenciaga",
  "Aldo",
  "Steve Madden",
  "Zara",
  "Louis Vuitton",
  "Dior",
  "Burberry",
] as const;

export const SHOE_SIZES = [
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
] as const;

export const SHOE_MATERIALS = [
  "Leather",
  "Suede",
  "Canvas",
  "Mesh",
  "Synthetic",
  "Patent Leather",
  "Nubuck",
  "Textile",
] as const;

export const SHOE_STYLES = [
  "Athletic",
  "Casual",
  "Formal",
  "Streetwear",
  "Luxury",
  "Minimal",
  "Classic",
  "Statement",
] as const;

export const SHOE_SOLES = ["Rubber", "Leather", "EVA", "Crepe", "PU", "TPU"] as const;
