"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { clothingService } from "@/lib/services/clothingService";
import { Clothing, ClothingFormData } from "@/lib/types/clothing";
import ClothingForm from "@/components/Clothing/ClothingForm";
import ClothingCard from "@/components/Clothing/ClothingCard";
import { useClothing } from "@/hooks/useClothing";
import { Plus, Loader2 } from "lucide-react";

export default function ClothingPage() {
  const { isAdmin } = useUser();
  const { clothing, loading, error, refresh } = useClothing(48);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Clothing | null>(null);

  const handleCreate = async (data: ClothingFormData) => {
    try {
      await clothingService.createClothing(data);
      setShowForm(false);
      refresh();
    } catch (err) {
      console.error("Error creating item:", err);
      alert("Failed to create item. Please try again.");
    }
  };

  const handleUpdate = async (data: ClothingFormData) => {
    if (!editingItem) return;

    try {
      await clothingService.updateClothing(editingItem.id, data);
      setShowForm(false);
      setEditingItem(null);
      refresh();
    } catch (err) {
      console.error("Error updating item:", err);
      alert("Failed to update item. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      await clothingService.deleteClothing(id);
      refresh();
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete item. Please try again.");
    }
  };

  const handleEdit = (item: Clothing) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] pt-24 sm:pt-28 lg:pt-32">
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-linear-to-br from-[#FF9B9B]/10 via-transparent to-[#FFB8B8]/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">Bibah&apos;s Collections</p>
              <h1 className="font-heading text-4xl sm:text-5xl text-white mt-2">Clothing</h1>
              <p className="font-body text-white/60 mt-3 max-w-xl">
                Curated pieces crafted for bold, elegant, and everyday statements.
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF9B9B] text-[#1A1A1A] font-semibold hover:bg-[#FFB8B8] transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Clothing
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading && clothing.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#FF9B9B]" />
            <p className="text-white/60 mt-4">Loading clothing...</p>
          </div>
        )}

        {error && (
          <div className="bg-[#FF9B9B]/10 border border-[#FF9B9B]/30 text-[#FF9B9B] px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && clothing.length === 0 && !error && (
          <div className="border border-white/10 rounded-2xl p-12 text-center bg-white/5">
            <p className="text-white/70 text-lg font-semibold">No clothing items yet</p>
            <p className="text-white/50 mt-2">Add your first collection to get started.</p>
          </div>
        )}

        {clothing.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
            {clothing.map((item) => (
              <ClothingCard
                key={item.id}
                item={item}
                isAdmin={isAdmin}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && isAdmin && (
        <ClothingForm
          item={editingItem}
          onSubmit={editingItem ? handleUpdate : handleCreate}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
}
