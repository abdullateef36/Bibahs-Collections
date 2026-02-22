"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@/context/UserContext";
import { clothingService } from "@/lib/services/clothingService";
import { jewelryService } from "@/lib/services/jewelryService";
import { bagService } from "@/lib/services/bagService";
import { shoeService } from "@/lib/services/shoeService";
import { perfumeService } from "@/lib/services/perfumeService";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  type: "clothing" | "jewelry" | "bags" | "shoes" | "perfumes";
  available: boolean;
  addedAt: number;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  wishlistCount: number;
  addToWishlist: (item: Omit<WishlistItem, "available" | "addedAt">) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    const loadWishlist = async () => {
      try {
        setLoading(true);
        const wishlistCol = collection(db, "users", user.uid, "wishlist");
        const snapshot = await getDocs(wishlistCol);
        const items: WishlistItem[] = [];

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          try {
            if (data.type === "clothing") {
              const clothing = await clothingService.getClothing(data.id);
              if (clothing) {
                items.push({
                  id: clothing.id,
                  name: clothing.name,
                  price: clothing.price,
                  image: clothing.images?.[0] || "",
                  type: "clothing",
                  available: true,
                  addedAt: data.addedAt || Date.now(),
                });
                continue;
              }
            }

            if (data.type === "jewelry") {
              const jewelry = await jewelryService.getJewelry(data.id);
              if (jewelry) {
                items.push({
                  id: jewelry.id,
                  name: jewelry.name,
                  price: jewelry.price,
                  image: jewelry.images?.[0] || "",
                  type: "jewelry",
                  available: true,
                  addedAt: data.addedAt || Date.now(),
                });
                continue;
              }
            }

            if (data.type === "bags") {
              const bag = await bagService.getBag(data.id);
              if (bag) {
                items.push({
                  id: bag.id,
                  name: bag.name,
                  price: bag.price,
                  image: bag.images?.[0] || "",
                  type: "bags",
                  available: true,
                  addedAt: data.addedAt || Date.now(),
                });
                continue;
              }
            }

            if (data.type === "shoes") {
              const shoe = await shoeService.getShoe(data.id);
              if (shoe) {
                items.push({
                  id: shoe.id,
                  name: shoe.name,
                  price: shoe.price,
                  image: shoe.images?.[0] || "",
                  type: "shoes",
                  available: true,
                  addedAt: data.addedAt || Date.now(),
                });
                continue;
              }
            }

            if (data.type === "perfumes") {
              const perfume = await perfumeService.getPerfume(data.id);
              if (perfume) {
                items.push({
                  id: perfume.id,
                  name: perfume.name,
                  price: perfume.price,
                  image: perfume.images?.[0] || "",
                  type: "perfumes",
                  available: true,
                  addedAt: data.addedAt || Date.now(),
                });
                continue;
              }
            }
          } catch (error) {
            console.error("Error loading wishlist item:", error);
          }

          items.push({
            id: data.id,
            name: data.name,
            price: data.price,
            image: data.image,
            type: (data.type as WishlistItem["type"]) || "clothing",
            available: false,
            addedAt: data.addedAt || Date.now(),
          });
        }

        setWishlist(items);
      } catch (error) {
        console.error("Error loading wishlist:", error);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [user]);

  const syncWishlistToFirestore = async (newWishlist: WishlistItem[]) => {
    if (!user) return;

    try {
      const wishlistCol = collection(db, "users", user.uid, "wishlist");
      const snapshot = await getDocs(wishlistCol);
      const batch = writeBatch(db);

      snapshot.docs.forEach((docSnap) => batch.delete(docSnap.ref));
      newWishlist.forEach((item) => {
        const itemRef = doc(wishlistCol);
        batch.set(itemRef, item);
      });

      await batch.commit();
    } catch (error) {
      console.error("Error syncing wishlist:", error);
    }
  };

  const addToWishlist = async (item: Omit<WishlistItem, "available" | "addedAt">) => {
    if (!user) {
      alert("Please log in to add items to your wishlist.");
      return;
    }

    if (wishlist.some((w) => w.id === item.id)) return;

    const newWishlist = [
      ...wishlist,
      { ...item, available: true, addedAt: Date.now() },
    ];

    setWishlist(newWishlist);
    await syncWishlistToFirestore(newWishlist);
  };

  const removeFromWishlist = async (id: string) => {
    const newWishlist = wishlist.filter((item) => item.id !== id);
    setWishlist(newWishlist);
    await syncWishlistToFirestore(newWishlist);
  };

  const isInWishlist = (id: string) => wishlist.some((item) => item.id === id);

  const clearWishlist = async () => {
    setWishlist([]);
    await syncWishlistToFirestore([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
