"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useNotification } from "@/context/NotificationContext";
import { useUser } from "@/context/UserContext";
import { Clothing } from "@/lib/types/clothing";
import { Trash2, Edit, ShoppingCart, Heart } from "lucide-react";

interface ClothingCardProps {
  item: Clothing;
  isAdmin?: boolean;
  onEdit?: (item: Clothing) => void;
  onDelete?: (id: string) => void;
}

const formatNaira = (amount: number): string => {
  return amount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export default function ClothingCard({ item, isAdmin = false, onEdit, onDelete }: ClothingCardProps) {
  const { user } = useUser();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { notify } = useNotification();
  const isUnavailable = item.unitsInStock <= 0;

  const handleCart = async () => {
    if (!user) {
      notify("Log in to add to cart", "error");
      return;
    }
    if (isUnavailable) {
      notify("Item is out of stock", "error");
      return;
    }
    await addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.images?.[0] || "",
      type: "clothing",
    });
    notify(`Added ${item.name} to cart`, "success");
  };

  const handleWishlist = async () => {
    if (!user) {
      notify("Log in to add to wishlist", "error");
      return;
    }
    if (isInWishlist(item.id)) {
      notify("Already in wishlist");
      return;
    }
    await addToWishlist({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.images?.[0] || "",
      type: "clothing",
    });
    notify(`Added ${item.name} to wishlist`, "success");
  };
  return (
    <div className="group bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden shadow-lg shadow-black/20 hover:shadow-black/40 transition-all duration-300">
      <div className="relative aspect-[4/5] bg-black/20 overflow-hidden">
        {item.images?.[0] ? (
          <Image
            src={item.images[0]}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/40 text-sm">
            No image
          </div>
        )}

        {item.featured && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FF9B9B] text-[#1A1A1A] text-xs font-bold tracking-wide">
            Featured
          </span>
        )}

        {item.originalPrice && item.originalPrice > item.price && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-semibold">
            Save {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-[#FFB8B8] uppercase tracking-wider">
            {item.brand}
          </span>
          <span className="text-xs text-white/50">{item.category}</span>
        </div>

        <h3 className="font-heading text-xl text-white tracking-wide uppercase line-clamp-1">
          {item.name}
        </h3>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-[#FF9B9B]">
            ₦{formatNaira(item.price)}
          </span>
          {item.originalPrice && item.originalPrice > item.price && (
            <span className="text-sm text-white/40 line-through">
              ₦{formatNaira(item.originalPrice)}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-white/50">
          <span>{item.specifications.size}</span>
          <span className="uppercase tracking-wider">{item.specifications.color}</span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <motion.div
            className="flex-1 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={handleCart}
              disabled={isUnavailable}
              className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg bg-[#FF9B9B] text-[#1A1A1A] hover:bg-[#FFB8B8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to cart
            </button>
            <button
              onClick={handleWishlist}
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-white/20 text-xs font-semibold text-white hover:border-white/40 transition-colors"
            >
              <Heart className="w-3.5 h-3.5" />
              Wishlist
            </button>
          </motion.div>

          <Link
            href={`/clothing/${item.id}`}
            className="flex-1 text-center text-sm font-semibold px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            View
          </Link>

          {isAdmin && (
            <>
              <button
                onClick={() => onEdit?.(item)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete?.(item.id)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
