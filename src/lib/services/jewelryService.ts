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
import { Jewelry, JewelryFormData } from "@/lib/types/jewelry";

const JEWELRY_COLLECTION = "jewelry";

export const jewelryService = {
  async createJewelry(data: JewelryFormData): Promise<string> {
    if (!db) throw new Error("Database not initialized");

    const docRef = await addDoc(collection(db, JEWELRY_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  },

  async updateJewelry(id: string, data: Partial<JewelryFormData>): Promise<void> {
    if (!db) throw new Error("Database not initialized");

    const itemRef = doc(db, JEWELRY_COLLECTION, id);
    await updateDoc(itemRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteJewelry(id: string): Promise<void> {
    if (!db) throw new Error("Database not initialized");

    const itemRef = doc(db, JEWELRY_COLLECTION, id);
    await deleteDoc(itemRef);
  },

  async getJewelry(id: string): Promise<Jewelry | null> {
    if (!db) throw new Error("Database not initialized");

    const itemRef = doc(db, JEWELRY_COLLECTION, id);
    const snap = await getDoc(itemRef);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    } as Jewelry;
  },

  async getJewelryItems(
    pageSize: number = 12,
    lastDoc?: DocumentSnapshot
  ): Promise<{ jewelry: Jewelry[]; lastDoc: DocumentSnapshot | null }> {
    if (!db) throw new Error("Database not initialized");

    let q = query(
      collection(db, JEWELRY_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const jewelry = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Jewelry[];

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

    return { jewelry, lastDoc: lastVisible };
  },

  async getJewelryByCategory(category: string): Promise<Jewelry[]> {
    if (!db) throw new Error("Database not initialized");

    const q = query(
      collection(db, JEWELRY_COLLECTION),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Jewelry[];
  },
};
