import { Timestamp } from "firebase/firestore";

export interface Clothing {
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
    fit: string;
    gender?: string;
    care?: string;
  };
  images: string[];
  unitsInStock: number;
  condition: "new" | "refurbished" | "used";
  featured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ClothingFormData {
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
    fit: string;
    gender?: string;
    care?: string;
  };
  images: string[];
  unitsInStock: number;
  condition: "new" | "refurbished" | "used";
  featured: boolean;
}

export const CLOTHING_CATEGORIES = [
  "T-Shirts",
  "Shirts",
  "Hoodies",
  "Sweatshirts",
  "Jackets",
  "Dresses",
  "Skirts",
  "Jeans",
  "Pants",
  "Shorts",
  "Activewear",
  "Traditional",
  "Accessories",
] as const;

export const CLOTHING_BRANDS = [
  "Nike",
  "Adidas",
  "Puma",
  "Under Armour",
  "New Balance",
  "Zara",
  "H&M",
  "Uniqlo",
  "Gucci",
  "Louis Vuitton",
  "Prada",
  "Balenciaga",
  "Levi's",
] as const;

export const CLOTHING_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "One Size",
] as const;

export const CLOTHING_FITS = [
  "Slim",
  "Regular",
  "Relaxed",
  "Oversized",
  "Tailored",
  "Athletic",
  "Straight",
] as const;
