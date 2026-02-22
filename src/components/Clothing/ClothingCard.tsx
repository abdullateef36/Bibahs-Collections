"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { notify } = useNotification();
  const router = useRouter();
  const isUnavailable = item.unitsInStock <= 0;
  const inWishlist = isInWishlist(item.id);

  const handleCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      notify("Log in to add to wishlist", "error");
      return;
    }
    if (inWishlist) {
      await removeFromWishlist(item.id);
      notify(`Removed from wishlist`);
    } else {
      await addToWishlist({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.images?.[0] || "",
        type: "clothing",
      });
      notify(`Added ${item.name} to wishlist`, "success");
    }
  };

  const handleAdminEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(item);
  };

  const handleAdminDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(item.id);
  };

  return (
    <motion.div
      onClick={() => router.push(`/clothing/${item.id}`)}
      className="group bg-[#1A1A1A] border border-white/10 rounded-2xl overflow-hidden shadow-lg shadow-black/20 hover:shadow-black/40 hover:border-white/20 transition-all duration-300 cursor-pointer"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image */}
      <div className="relative aspect-4/5 bg-black/20 overflow-hidden">
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
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#FF9B9B] text-[#1A1A1A] text-[10px] font-bold tracking-wide">
            Featured
          </span>
        )}

        {item.originalPrice && item.originalPrice > item.price && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-semibold">
            -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
          </span>
        )}

        {/* Wishlist icon overlay */}
        <button
          onClick={handleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 transition-all duration-200 hover:bg-black/70"
        >
          <Heart
            className={`w-4 h-4 transition-all duration-200 ${
              inWishlist
                ? "fill-[#FF9B9B] text-[#FF9B9B] drop-shadow-[0_0_6px_rgba(255,155,155,0.8)]"
                : "text-white/70"
            }`}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-[10px] font-semibold text-[#FFB8B8] uppercase tracking-wider truncate">
            {item.brand}
          </span>
          <span className="text-[10px] text-white/40 shrink-0">{item.specifications.size}</span>
        </div>

        <h3 className="font-heading text-base text-white tracking-wide uppercase line-clamp-1">
          {item.name}
        </h3>

        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-sm font-semibold text-[#FF9B9B]">
            ₦{formatNaira(item.price)}
          </span>
          {item.originalPrice && item.originalPrice > item.price && (
            <span className="text-xs text-white/40 line-through">
              ₦{formatNaira(item.originalPrice)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleCart}
            disabled={isUnavailable}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-[#FF9B9B] text-[#1A1A1A] hover:bg-[#FFB8B8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
            {isUnavailable ? "Out of stock" : "Add to cart"}
          </button>

          {isAdmin && (
            <>
              <button
                onClick={handleAdminEdit}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Edit"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleAdminDelete}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}