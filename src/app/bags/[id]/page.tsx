"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { bagService } from "@/lib/services/bagService";
import { Bag } from "@/lib/types/bags";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useNotification } from "@/context/NotificationContext";
import { useUser } from "@/context/UserContext";
import { ArrowLeft, Loader2, ShoppingCart, Heart } from "lucide-react";

const formatNaira = (amount: number): string =>
  amount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

export default function BagDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { notify } = useNotification();

  const [item, setItem] = useState<Bag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  const id = params.id as string;
  const inWishlist = item ? isInWishlist(item.id) : false;
  const isUnavailable = item ? item.unitsInStock <= 0 : false;

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await bagService.getBag(id);
        if (data) {
          setItem(data);
        } else {
          setError("Item not found");
        }
      } catch (err) {
        console.error("Error loading item:", err);
        setError("Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  const handleCart = async () => {
    if (!item) return;
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
      type: "bags",
    });
    notify(`Added ${item.name} to cart`, "success");
  };

  const handleWishlist = async () => {
    if (!item) return;
    if (!user) {
      notify("Log in to add to wishlist", "error");
      return;
    }
    if (inWishlist) {
      await removeFromWishlist(item.id);
      notify("Removed from wishlist");
    } else {
      await addToWishlist({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.images?.[0] || "",
        type: "bags",
      });
      notify(`Added ${item.name} to wishlist`, "success");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF9B9B] mx-auto mb-4" />
          <p className="text-white/60">Loading item...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/80 text-lg font-semibold mb-4">
            {error || "Item not found"}
          </p>
          <button
            onClick={() => router.push("/bags")}
            className="px-6 py-3 rounded-full bg-[#FF9B9B] text-[#1A1A1A] font-semibold"
          >
            Back to Bags
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-[#0F0F0F] pt-24 sm:pt-28 lg:pt-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Link
          href="/bags"
          className="inline-flex items-center gap-2 text-white/60 hover:text-[#FF9B9B] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Bags
        </Link>

        <motion.div
          className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-4">
            <div className="relative aspect-4/5 rounded-2xl overflow-hidden border border-white/10 bg-white/5">
              {item.images?.[activeImage] ? (
                <Image
                  src={item.images[activeImage]}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-white/40">
                  No image
                </div>
              )}
            </div>

            {item.images && item.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {item.images.map((img, index) => (
                  <button
                    key={img}
                    onClick={() => setActiveImage(index)}
                    className={`relative shrink-0 w-20 h-24 rounded-lg overflow-hidden border transition-colors ${
                      activeImage === index
                        ? "border-[#FF9B9B]"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <Image src={img} alt={`${item.name} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">{item.brand}</p>
              <h1 className="font-heading text-4xl text-white mt-2">{item.name}</h1>
              <p className="text-white/50 mt-1">{item.category}</p>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-[#FF9B9B]">
                ₦{formatNaira(item.price)}
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-lg text-white/40 line-through">
                  ₦{formatNaira(item.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-white/70 leading-relaxed">{item.description}</p>

            <p
              className={`text-sm font-semibold ${
                isUnavailable ? "text-red-400" : "text-emerald-400"
              }`}
            >
              {isUnavailable ? "Out of stock" : `${item.unitsInStock} in stock`}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCart}
                disabled={isUnavailable}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#FF9B9B] text-[#1A1A1A] font-semibold hover:bg-[#FFB8B8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {isUnavailable ? "Out of stock" : "Add to Cart"}
              </button>

              <button
                onClick={handleWishlist}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                className="p-3.5 rounded-full border border-white/20 hover:border-[#FF9B9B] transition-all duration-200"
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-200 ${
                    inWishlist
                      ? "fill-[#FF9B9B] text-[#FF9B9B] drop-shadow-[0_0_8px_rgba(255,155,155,0.8)]"
                      : "text-white/70"
                  }`}
                />
              </button>
            </div>

            <div className="border border-white/10 rounded-2xl p-5 bg-white/5">
              <h2 className="text-lg font-semibold text-white mb-4">Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/70">
                <div className="flex justify-between gap-3">
                  <span className="text-white/50">Size</span>
                  <span>{item.specifications.size}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-white/50">Material</span>
                  <span>{item.specifications.material}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-white/50">Style</span>
                  <span>{item.specifications.style}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-white/50">Compartments</span>
                  <span>{item.specifications.compartments}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-white/50">Color</span>
                  <span>{item.specifications.color}</span>
                </div>
                {item.specifications.strap && (
                  <div className="flex justify-between gap-3">
                    <span className="text-white/50">Strap</span>
                    <span>{item.specifications.strap}</span>
                  </div>
                )}
                {item.specifications.care && (
                  <div className="flex justify-between gap-3">
                    <span className="text-white/50">Care</span>
                    <span>{item.specifications.care}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
