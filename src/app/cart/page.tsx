"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useNotification } from "@/context/NotificationContext";

const formatNaira = (amount: number): string =>
  amount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const TYPE_LABELS: Record<string, string> = {
  clothing: "Clothing",
  jewelry: "Jewelry",
  bags: "Bags",
  shoes: "Shoes",
  perfumes: "Perfumes",
};

export default function CartPage() {
  const { user } = useUser();
  const { cart, cartTotal, updateQuantity, removeFromCart, loading } = useCart();
  const { notify } = useNotification();

  const handleRemove = async (id: string, name: string) => {
    await removeFromCart(id);
    notify(`Removed ${name} from cart`);
  };

  const handleQuantity = async (id: string, delta: number) => {
    await updateQuantity(id, delta);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-4">
        <div className="text-center border border-white/10 rounded-2xl p-10 bg-white/5 max-w-md">
          <h1 className="text-3xl font-heading text-white mb-3">Log in to view your cart</h1>
          <p className="text-white/70 mb-6">
            You need an account to save favorites and checkout.
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
      className="min-h-screen bg-[#0F0F0F] text-white overflow-hidden"
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
            Cart • {cart.length} {cart.length === 1 ? "item" : "items"}
          </span>
        </div>

        <h1 className="font-heading text-4xl">Your Cart</h1>

        {loading && cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border border-white/10 rounded-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF9B9B] mb-3" />
            <p className="text-white/60">Loading saved items...</p>
          </div>
        ) : cart.length === 0 ? (
          <div className="border border-white/10 rounded-2xl p-10 text-center bg-white/5">
            <p className="text-white/60 mb-4">No items in your cart yet.</p>
            <Link
              href="/clothing"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 text-sm font-semibold hover:border-[#FF9B9B] transition-all"
            >
              Browse clothing
            </Link>
          </div>
        ) : (
          <motion.div
            className="grid lg:grid-cols-[1fr_320px] gap-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                      <Image
                        src={item.image || "/logo.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-lg leading-tight truncate">{item.name}</p>
                      <p className="text-xs uppercase tracking-wide text-white/50 mt-0.5">
                        {TYPE_LABELS[item.type] ?? item.type ?? "Item"}
                      </p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.id, item.name)}
                          className="text-white/40 hover:text-[#FF9B9B] transition-colors shrink-0 mt-0.5"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-white/60 mt-2">
                        {item.available ? "In stock" : "Unavailable"}
                      </p>
                      <div className="mt-3 flex items-center gap-3 text-sm">
                        <button
                          onClick={() => handleQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-full border border-white/20 text-white/80 hover:border-[#FF9B9B] hover:text-[#FF9B9B] transition-colors flex items-center justify-center disabled:opacity-40"
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-semibold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-full border border-white/20 text-white/80 hover:border-[#FF9B9B] hover:text-[#FF9B9B] transition-colors flex items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-base font-semibold border-t border-white/10 pt-3">
                    <span className="text-white/60 text-sm">₦{formatNaira(item.price)} × {item.quantity}</span>
                    <span className="text-[#FF9B9B]">₦{formatNaira(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>

            <motion.div
              className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 h-fit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-heading text-2xl text-white">Order Summary</h2>
              <div className="flex justify-between text-sm text-white/60">
                <span>Subtotal ({cart.length} {cart.length === 1 ? "item" : "items"})</span>
                <span>₦{formatNaira(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-white/60">
                <span>Shipping</span>
                <span className="text-white/40">Calculated at checkout</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-semibold text-white">
                <span>Total</span>
                <span className="text-[#FF9B9B]">₦{formatNaira(cartTotal)}</span>
              </div>
              <button
                disabled
                className="w-full px-4 py-3 rounded-full text-sm font-semibold uppercase tracking-widest bg-[#FF9B9B]/30 text-white/40 cursor-not-allowed"
              >
                Checkout (coming soon)
              </button>
              <Link
                href="/clothing"
                className="block text-center text-xs text-white/40 hover:text-white transition-colors"
              >
                Continue Shopping
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
