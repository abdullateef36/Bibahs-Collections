"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { bagService } from "@/lib/services/bagService";
import { Bag, BagFormData } from "@/lib/types/bags";
import BagForm from "@/components/Bags/BagForm";
import BagCard from "@/components/Bags/BagCard";
import { useBags } from "@/hooks/useBags";
import { Plus, Loader2 } from "lucide-react";

export default function BagsPage() {
  const { isAdmin } = useUser();
  const { bags, loading, error, refresh } = useBags(48);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Bag | null>(null);

  const handleCreate = async (data: BagFormData) => {
    try {
      await bagService.createBag(data);
      setShowForm(false);
      refresh();
    } catch (err) {
      console.error("Error creating item:", err);
      alert("Failed to create item. Please try again.");
    }
  };

  const handleUpdate = async (data: BagFormData) => {
    if (!editingItem) return;

    try {
      await bagService.updateBag(editingItem.id, data);
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
      await bagService.deleteBag(id);
      refresh();
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete item. Please try again.");
    }
  };

  const handleEdit = (item: Bag) => {
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
        <div className="absolute inset-0 bg-linear-to-br from-[#FF9B9B]/10 via-transparent to-[#FFB8B8]/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">
                Bibah&apos;s Collections
              </p>
              <h1 className="font-heading text-4xl sm:text-5xl text-white mt-2">Bags</h1>
              <p className="font-body text-white/60 mt-3 max-w-xl">
                Signature silhouettes crafted to elevate day-to-night styling.
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF9B9B] text-[#1A1A1A] font-semibold hover:bg-[#FFB8B8] transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Bag
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading && bags.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#FF9B9B]" />
            <p className="text-white/60 mt-4">Loading bags...</p>
          </div>
        )}

        {error && (
          <div className="bg-[#FF9B9B]/10 border border-[#FF9B9B]/30 text-[#FF9B9B] px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && bags.length === 0 && !error && (
          <div className="border border-white/10 rounded-2xl p-12 text-center bg-white/5">
            <p className="text-white/70 text-lg font-semibold">No bags yet</p>
            <p className="text-white/50 mt-2">Add your first bag to get started.</p>
          </div>
        )}

        {bags.length > 0 && (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {bags.map((item) => (
              <BagCard
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
        <BagForm
          item={editingItem}
          onSubmit={editingItem ? handleUpdate : handleCreate}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
}
