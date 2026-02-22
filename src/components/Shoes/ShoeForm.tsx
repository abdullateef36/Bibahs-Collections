"use client";

import { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  Shoe,
  ShoeFormData,
  SHOE_BRANDS,
  SHOE_CATEGORIES,
  SHOE_MATERIALS,
  SHOE_SIZES,
  SHOE_SOLES,
  SHOE_STYLES,
} from "@/lib/types/shoes";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface ShoeFormProps {
  item?: Shoe | null;
  onSubmit: (data: ShoeFormData) => Promise<void>;
  onCancel: () => void;
}

export default function ShoeForm({ item, onSubmit, onCancel }: ShoeFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fieldClass =
    "w-full px-4 py-3 border border-white/20 rounded-lg focus:border-[#FF9B9B] focus:ring-4 focus:ring-[#FF9B9B]/20 outline-none text-white bg-white/10 placeholder:text-white/50 caret-white appearance-none transition duration-150";
  const optionClass = "bg-[#0F0F0F] text-white/90";
  const [formData, setFormData] = useState<ShoeFormData>({
    name: "",
    brand: "",
    category: "",
    price: 0,
    originalPrice: 0,
    description: "",
    specifications: {
      size: "",
      color: "",
      material: "",
      style: "",
      sole: "",
      closure: "",
      care: "",
    },
    images: [],
    unitsInStock: 0,
    condition: "new",
    featured: false,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        brand: item.brand,
        category: item.category,
        price: item.price,
        originalPrice: item.originalPrice || 0,
        description: item.description,
        specifications: item.specifications,
        images: item.images,
        unitsInStock: item.unitsInStock,
        condition: item.condition,
        featured: item.featured,
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await uploadToCloudinary(file);
        newUrls.push(result.secure_url);
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newUrls],
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/10 shadow-2xl w-full max-w-4xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="font-heading text-2xl text-white tracking-wider">
            {item ? "Edit Shoe" : "Add New Shoe"}
          </h2>
          <button onClick={onCancel} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-6 h-6 text-white/70" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">
                Shoe Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nova Runner"
                className={fieldClass}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">Brand *</label>
              <input
                type="text"
                list="shoe-brand-options"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Select or type a brand"
                className={fieldClass}
                required
              />
              <datalist id="shoe-brand-options">
                {SHOE_BRANDS.map((brand) => (
                  <option key={brand} value={brand} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={fieldClass}
                required
              >
                <option value="" className={optionClass}>
                  Select Category
                </option>
                {SHOE_CATEGORIES.map((category) => (
                  <option key={category} value={category} className={optionClass}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">
                Condition *
              </label>
              <select
                value={formData.condition}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    condition: e.target.value as "new" | "refurbished" | "used",
                  })
                }
                className={fieldClass}
                required
              >
                <option value="new" className={optionClass}>
                  New
                </option>
                <option value="refurbished" className={optionClass}>
                  Refurbished
                </option>
                <option value="used" className={optionClass}>
                  Used
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">
                Price (₦) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="65000"
                className={fieldClass}
                required
                min="0"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">
                Original Price (₦)
              </label>
              <input
                type="number"
                value={formData.originalPrice || ""}
                onChange={(e) =>
                  setFormData({ ...formData, originalPrice: Number(e.target.value) || undefined })
                }
                placeholder="82000"
                className={fieldClass}
                min="0"
                step="1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white/80 mb-2">
                Units in Stock *
              </label>
              <input
                type="number"
                value={formData.unitsInStock}
                onChange={(e) =>
                  setFormData({ ...formData, unitsInStock: Number(e.target.value) })
                }
                placeholder="18"
                className={fieldClass}
                required
                min="0"
              />
            </div>

            <div className="flex items-center pt-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 text-[#FF9B9B] border-white/20 rounded focus:ring-[#FF9B9B]"
                />
                <span className="text-sm font-semibold text-white/80">Featured Item</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the shoe..."
              className={fieldClass}
              rows={4}
              required
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Size *
                </label>
                <select
                  value={formData.specifications.size}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, size: e.target.value },
                    })
                  }
                  className={fieldClass}
                  required
                >
                  <option value="" className={optionClass}>
                    Select Size
                  </option>
                  {SHOE_SIZES.map((size) => (
                    <option key={size} value={size} className={optionClass}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Material *
                </label>
                <select
                  value={formData.specifications.material}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, material: e.target.value },
                    })
                  }
                  className={fieldClass}
                  required
                >
                  <option value="" className={optionClass}>
                    Select Material
                  </option>
                  {SHOE_MATERIALS.map((material) => (
                    <option key={material} value={material} className={optionClass}>
                      {material}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Style *
                </label>
                <select
                  value={formData.specifications.style}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, style: e.target.value },
                    })
                  }
                  className={fieldClass}
                  required
                >
                  <option value="" className={optionClass}>
                    Select Style
                  </option>
                  {SHOE_STYLES.map((style) => (
                    <option key={style} value={style} className={optionClass}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Sole *
                </label>
                <select
                  value={formData.specifications.sole}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, sole: e.target.value },
                    })
                  }
                  className={fieldClass}
                  required
                >
                  <option value="" className={optionClass}>
                    Select Sole
                  </option>
                  {SHOE_SOLES.map((sole) => (
                    <option key={sole} value={sole} className={optionClass}>
                      {sole}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Color *
                </label>
                <input
                  type="text"
                  value={formData.specifications.color}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, color: e.target.value },
                    })
                  }
                  placeholder="Black"
                  className={fieldClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Closure
                </label>
                <input
                  type="text"
                  value={formData.specifications.closure || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, closure: e.target.value },
                    })
                  }
                  placeholder="Lace-up"
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Care
                </label>
                <input
                  type="text"
                  value={formData.specifications.care || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, care: e.target.value },
                    })
                  }
                  placeholder="Wipe with soft cloth"
                  className={fieldClass}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">
              Product Images
            </label>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-white/20 rounded-lg hover:border-[#FF9B9B] transition-colors bg-white/5">
                  {uploadingImages ? (
                    <div className="flex items-center gap-2 text-white/70">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-white/70">
                      <Upload className="w-5 h-5" />
                      <span>Click to upload images</span>
                    </div>
                  )}
                </div>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {formData.images.map((img, index) => (
                    <div key={img} className="relative rounded-lg overflow-hidden border border-white/10">
                      <div className="relative h-28">
                        <Image src={img} alt={`Upload ${index + 1}`} fill className="object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="w-full py-2 text-xs font-semibold text-white/80 hover:text-white bg-black/50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {formData.images.length === 0 && (
                <p className="text-sm text-white/50 text-center py-4">No images uploaded yet.</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-white/20 text-white/80 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-linear-to-r from-[#FF9B9B] to-[#FFB8B8] text-[#1A1A1A] rounded-lg font-semibold hover:from-[#FFB8B8] hover:to-[#FF9B9B] transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : item ? "Update Item" : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
