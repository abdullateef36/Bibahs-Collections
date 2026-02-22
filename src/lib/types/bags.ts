import { Timestamp } from "firebase/firestore";

export interface Bag {
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
    compartments: string;
    strap?: string;
    care?: string;
  };
  images: string[];
  unitsInStock: number;
  condition: "new" | "refurbished" | "used";
  featured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BagFormData {
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
    compartments: string;
    strap?: string;
    care?: string;
  };
  images: string[];
  unitsInStock: number;
  condition: "new" | "refurbished" | "used";
  featured: boolean;
}

export const BAG_CATEGORIES = [
  "Handbags",
  "Tote Bags",
  "Crossbody",
  "Clutch",
  "Backpacks",
  "Shoulder Bags",
  "Mini Bags",
  "Travel Bags",
  "Wallets",
] as const;

export const BAG_BRANDS = [
  "Louis Vuitton",
  "Gucci",
  "Prada",
  "Fendi",
  "Coach",
  "Michael Kors",
  "Burberry",
  "Dior",
  "Balenciaga",
  "Bottega Veneta",
] as const;

export const BAG_SIZES = ["Mini", "Small", "Medium", "Large", "Oversized"] as const;

export const BAG_MATERIALS = [
  "Leather",
  "Vegan Leather",
  "Canvas",
  "Suede",
  "Nylon",
  "Raffia",
  "Denim",
] as const;

export const BAG_STYLES = ["Structured", "Slouchy", "Box", "Bucket", "Satchel", "Hobo"] as const;

export const BAG_COMPARTMENTS = ["Single", "Dual", "Triple", "Multi-Compartment"] as const;
