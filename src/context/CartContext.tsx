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

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  type: "clothing" | "jewelry" | "bags" | "shoes" | "perfumes";
  available: boolean;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  availableCartCount: number;
  availableCartTotal: number;
  addToCart: (item: Omit<CartItem, "quantity" | "available">) => Promise<void>;
  updateQuantity: (id: string, delta: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCart([]);
      setLoading(false);
      return;
    }

    const loadCart = async () => {
      try {
        setLoading(true);
        const cartCol = collection(db, "users", user.uid, "cart");
        const snapshot = await getDocs(cartCol);
        const items: CartItem[] = [];

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
                  quantity: data.quantity,
                  type: "clothing",
                  available: true,
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
                  quantity: data.quantity,
                  type: "jewelry",
                  available: true,
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
                  quantity: data.quantity,
                  type: "bags",
                  available: true,
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
                  quantity: data.quantity,
                  type: "shoes",
                  available: true,
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
                  quantity: data.quantity,
                  type: "perfumes",
                  available: true,
                });
                continue;
              }
            }
          } catch (error) {
            console.error("Error fetching cart item:", error);
          }

          items.push({
            id: data.id,
            name: data.name,
            price: data.price,
            image: data.image,
            quantity: data.quantity,
            type: (data.type as CartItem["type"]) || "clothing",
            available: false,
          });
        }

        setCart(items);
      } catch (error) {
        console.error("Error loading cart:", error);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  const syncCartToFirestore = async (newCart: CartItem[]) => {
    if (!user) return;

    try {
      const cartCol = collection(db, "users", user.uid, "cart");
      const snapshot = await getDocs(cartCol);
      const batch = writeBatch(db);

      snapshot.docs.forEach((docSnap) => batch.delete(docSnap.ref));
      newCart.forEach((item) => {
        const itemRef = doc(cartCol);
        batch.set(itemRef, item);
      });

      await batch.commit();
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  };

  const addToCart = async (item: Omit<CartItem, "quantity" | "available">) => {
    if (!user) {
      alert("Please log in to add items to your cart.");
      return;
    }

    const existing = cart.find((c) => c.id === item.id);
    const newCart = existing
      ? cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      : [...cart, { ...item, quantity: 1, available: true }];

    setCart(newCart);
    await syncCartToFirestore(newCart);
  };

  const updateQuantity = async (id: string, delta: number) => {
    const newCart = cart
      .map((c) => (c.id === id ? { ...c, quantity: c.quantity + delta } : c))
      .filter((c) => c.quantity > 0);

    setCart(newCart);
    await syncCartToFirestore(newCart);
  };

  const removeFromCart = async (id: string) => {
    const newCart = cart.filter((c) => c.id !== id);
    setCart(newCart);
    await syncCartToFirestore(newCart);
  };

  const clearCart = async () => {
    setCart([]);
    await syncCartToFirestore([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const availableCartCount = cart.filter((item) => item.available).reduce((sum, item) => sum + item.quantity, 0);
  const availableCartTotal = cart.filter((item) => item.available).reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        availableCartCount,
        availableCartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
