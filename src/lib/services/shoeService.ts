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
import { deleteImagesFromCloudinary } from "@/lib/cloudinary";
import { Shoe, ShoeFormData } from "@/lib/types/shoes";

const SHOE_COLLECTION = "shoes";

export const shoeService = {
  async createShoe(data: ShoeFormData): Promise<string> {
    if (!db) throw new Error("Database not initialized");

    const docRef = await addDoc(collection(db, SHOE_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  },

  async updateShoe(id: string, data: Partial<ShoeFormData>): Promise<void> {
    if (!db) throw new Error("Database not initialized");

    const itemRef = doc(db, SHOE_COLLECTION, id);
    await updateDoc(itemRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteShoe(id: string): Promise<void> {
    if (!db) throw new Error("Database not initialized");

    const itemRef = doc(db, SHOE_COLLECTION, id);
    const snap = await getDoc(itemRef);
    if (snap.exists()) {
      const data = snap.data() as Shoe;
      await deleteImagesFromCloudinary(data.images || []);
    }
    await deleteDoc(itemRef);
  },

  async getShoe(id: string): Promise<Shoe | null> {
    if (!db) throw new Error("Database not initialized");

    const itemRef = doc(db, SHOE_COLLECTION, id);
    const snap = await getDoc(itemRef);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    } as Shoe;
  },

  async getShoes(
    pageSize: number = 12,
    lastDoc?: DocumentSnapshot
  ): Promise<{ shoes: Shoe[]; lastDoc: DocumentSnapshot | null }> {
    if (!db) throw new Error("Database not initialized");

    let q = query(
      collection(db, SHOE_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const shoes = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Shoe[];

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

    return { shoes, lastDoc: lastVisible };
  },

  async getShoesByCategory(category: string): Promise<Shoe[]> {
    if (!db) throw new Error("Database not initialized");

    const q = query(
      collection(db, SHOE_COLLECTION),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Shoe[];
  },
};
