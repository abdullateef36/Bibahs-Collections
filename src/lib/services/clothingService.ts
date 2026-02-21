import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  serverTimestamp,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Clothing, ClothingFormData } from "@/lib/types/clothing";

const CLOTHING_COLLECTION = "clothing";

export const clothingService = {
  async createClothing(data: ClothingFormData): Promise<string> {
    if (!db) throw new Error("Database not initialized");

    const docRef = await addDoc(collection(db, CLOTHING_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  },

  async updateClothing(id: string, data: Partial<ClothingFormData>): Promise<void> {
    if (!db) throw new Error("Database not initialized");

    const clothingRef = doc(db, CLOTHING_COLLECTION, id);
    await updateDoc(clothingRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteClothing(id: string): Promise<void> {
    if (!db) throw new Error("Database not initialized");

    const clothingRef = doc(db, CLOTHING_COLLECTION, id);
    await deleteDoc(clothingRef);
  },

  async getClothing(id: string): Promise<Clothing | null> {
    if (!db) throw new Error("Database not initialized");

    const clothingRef = doc(db, CLOTHING_COLLECTION, id);
    const clothingSnap = await getDoc(clothingRef);

    if (!clothingSnap.exists()) return null;

    return {
      id: clothingSnap.id,
      ...clothingSnap.data(),
    } as Clothing;
  },

  async getClothingItems(
    pageSize: number = 12,
    lastDoc?: DocumentSnapshot
  ): Promise<{ clothing: Clothing[]; lastDoc: DocumentSnapshot | null }> {
    if (!db) throw new Error("Database not initialized");

    let q = query(
      collection(db, CLOTHING_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const clothing = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Clothing[];

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

    return { clothing, lastDoc: lastVisible };
  },

  async getClothingByCategory(category: string): Promise<Clothing[]> {
    if (!db) throw new Error("Database not initialized");

    const q = query(
      collection(db, CLOTHING_COLLECTION),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Clothing[];
  },
};
