"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";

const formatNaira = (amount: number): string =>
  amount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

export default function WishlistPage() {
  const { user } = useUser();
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

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
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white"
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
          <div className="grid md:grid-cols-2 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl"
              >
                <div className="relative w-28 h-32 rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                  <Image
                    src={item.image || "/logo.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-lg font-semibold">{item.name}</p>
                    <p className="text-sm text-white/50">₦{formatNaira(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <button
                      onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, type: "clothing" })}
                      className="flex-1 px-3 py-2 text-sm rounded-full border border-white/20 hover:border-white/40 transition-colors"
                    >
                      <ShoppingCart className="inline-block mr-2" size={16} />
                      Add to cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="px-3 py-2 rounded-full border border-white/20 hover:border-white/40 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
