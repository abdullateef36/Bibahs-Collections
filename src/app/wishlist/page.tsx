"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useNotification } from "@/context/NotificationContext";

const formatNaira = (amount: number): string =>
  amount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

export default function WishlistPage() {
  const { user } = useUser();
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { notify } = useNotification();

  const handleAddToCart = async (item: typeof wishlist[number]) => {
    await addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      type: "clothing",
    });
    notify(`Added ${item.name} to cart`, "success");
  };

  const handleRemove = async (item: typeof wishlist[number]) => {
    await removeFromWishlist(item.id);
    notify(`Removed ${item.name} from wishlist`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4">
        <div className="text-center border border-white/10 rounded-2xl p-10 bg-white/5 max-w-md">
          <h1 className="text-3xl font-heading text-white mb-3">Log in to save favorites</h1>
          <p className="text-white/70 mb-6">
            Sign in to add clothing to your wishlist and revisit them easily.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-[#FF9B9B] text-[#1A1A1A] rounded-full font-semibold transition-colors hover:bg-[#FFB8B8]"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-[#0F0F0F] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <span className="text-sm uppercase tracking-[0.4em] text-white/40">
            Wishlist • {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
          </span>
        </div>

        <h1 className="font-heading text-4xl">Favorites</h1>

        {loading && wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border border-white/10 rounded-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF9B9B] mb-3" />
            <p className="text-white/60">Loading wishlist...</p>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="border border-white/10 rounded-2xl p-10 text-center bg-white/5">
            <p className="text-white/60 mb-4">No favorites yet.</p>
            <Link
              href="/clothing"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 text-sm font-semibold hover:border-[#FF9B9B] transition-all"
            >
              Explore clothing
            </Link>
          </div>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-colors"
              >
                <div className="relative w-28 h-32 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                  <Image
                    src={item.image || "/logo.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <p className="text-lg font-semibold truncate">{item.name}</p>
                    <p className="text-sm text-[#FF9B9B] font-semibold mt-0.5">
                      ₦{formatNaira(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-full bg-[#FF9B9B] text-[#1A1A1A] hover:bg-[#FFB8B8] transition-colors"
                    >
                      <ShoppingCart size={15} />
                      Add to cart
                    </button>
                    <button
                      onClick={() => handleRemove(item)}
                      className="p-2 rounded-full border border-white/20 text-white/50 hover:border-[#FF9B9B] hover:text-[#FF9B9B] transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}