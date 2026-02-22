"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { jewelryService } from "@/lib/services/jewelryService";
import { Jewelry, JewelryFormData } from "@/lib/types/jewelry";
import JewelryForm from "@/components/Jewelry/JewelryForm";
import JewelryCard from "@/components/Jewelry/JewelryCard";
import { useJewelry } from "@/hooks/useJewelry";
import { Plus, Loader2 } from "lucide-react";

export default function JewelryPage() {
  const { isAdmin } = useUser();
  const { jewelry, loading, error, refresh } = useJewelry(48);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Jewelry | null>(null);

  const handleCreate = async (data: JewelryFormData) => {
    try {
      await jewelryService.createJewelry(data);
      setShowForm(false);
      refresh();
    } catch (err) {
      console.error("Error creating item:", err);
      alert("Failed to create item. Please try again.");
    }
  };

  const handleUpdate = async (data: JewelryFormData) => {
    if (!editingItem) return;

    try {
      await jewelryService.updateJewelry(editingItem.id, data);
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
      await jewelryService.deleteJewelry(id);
      refresh();
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete item. Please try again.");
    }
  };

  const handleEdit = (item: Jewelry) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <motion.div
        className="relative overflow-hidden border-b border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-[#FFD5B5]/10 via-transparent to-[#F6B8FF]/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">
                Bibah&apos;s Collections
              </p>
              <h1 className="font-heading text-4xl sm:text-5xl text-white mt-2">Jewelry</h1>
              <p className="font-body text-white/60 mt-3 max-w-xl">
                Timeless jewelry crafted with bold silhouettes, rare stones, and couture-level finishes.
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF9B9B] text-[#1A1A1A] font-semibold hover:bg-[#FFB8B8] transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Jewelry
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading && jewelry.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#F7C3FF]" />
            <p className="text-white/60 mt-4">Loading jewelry...</p>
          </div>
        )}

        {error && (
          <div className="bg-[#F7C3FF]/10 border border-[#F7C3FF]/30 text-[#F7C3FF] px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && jewelry.length === 0 && !error && (
          <div className="border border-white/10 rounded-2xl p-12 text-center bg-white/5">
            <p className="text-white/70 text-lg font-semibold">No jewelry items yet</p>
            <p className="text-white/50 mt-2">Add your first piece to start curating.</p>
          </div>
        )}

        {jewelry.length > 0 && (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {jewelry.map((item) => (
              <JewelryCard
                key={item.id}
                item={item}
                isAdmin={isAdmin}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </motion.div>
        )}
      </div>

      {showForm && isAdmin && (
        <JewelryForm
          item={editingItem}
          onSubmit={editingItem ? handleUpdate : handleCreate}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
}
