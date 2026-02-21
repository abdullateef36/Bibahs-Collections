"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { clothingService } from "@/lib/services/clothingService";
import { Clothing } from "@/lib/types/clothing";
import { ArrowLeft, Loader2 } from "lucide-react";

const formatNaira = (amount: number): string => {
  return amount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export default function ClothingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<Clothing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  const id = params.id as string;

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await clothingService.getClothing(id);
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
            onClick={() => router.push("/clothing")}
            className="px-6 py-3 rounded-full bg-[#FF9B9B] text-[#1A1A1A] font-semibold"
          >
            Back to Clothing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] pt-24 sm:pt-28 lg:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/clothing"
          className="inline-flex items-center gap-2 text-white/60 hover:text-[#FF9B9B] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Clothing
        </Link>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-white/5">
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
              <div className="flex gap-2 overflow-x-auto">
                {item.images.map((img, index) => (
                  <button
                    key={img}
                    onClick={() => setActiveImage(index)}
                    className={`relative w-20 h-24 rounded-lg overflow-hidden border ${
                      activeImage === index ? "border-[#FF9B9B]" : "border-white/10"
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

            <div className="border border-white/10 rounded-2xl p-5 bg-white/5">
              <h2 className="text-lg font-semibold text-white mb-4">Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/70">
                <div className="flex justify-between gap-3">
                  <span className="text-white/50">Size</span>
                  <span>{item.specifications.size}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-white/50">Fit</span>
                  <span>{item.specifications.fit}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-white/50">Color</span>
                  <span>{item.specifications.color}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-white/50">Material</span>
                  <span>{item.specifications.material}</span>
                </div>
                {item.specifications.gender && (
                  <div className="flex justify-between gap-3">
                    <span className="text-white/50">Gender</span>
                    <span>{item.specifications.gender}</span>
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

            <div className="text-sm text-white/50">
              {item.unitsInStock > 0 ? `${item.unitsInStock} in stock` : "Out of stock"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
