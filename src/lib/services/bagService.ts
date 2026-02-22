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
import { Bag, BagFormData } from "@/lib/types/bags";

const BAG_COLLECTION = "bags";

export const bagService = {
  async createBag(data: BagFormData): Promise<string> {
    if (!db) throw new Error("Database not initialized");

    const docRef = await addDoc(collection(db, BAG_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  },

  async updateBag(id: string, data: Partial<BagFormData>): Promise<void> {
    if (!db) throw new Error("Database not initialized");

    const itemRef = doc(db, BAG_COLLECTION, id);
    await updateDoc(itemRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteBag(id: string): Promise<void> {
    if (!db) throw new Error("Database not initialized");

    const itemRef = doc(db, BAG_COLLECTION, id);
    const snap = await getDoc(itemRef);
    if (snap.exists()) {
      const data = snap.data() as Bag;
      await deleteImagesFromCloudinary(data.images || []);
    }
    await deleteDoc(itemRef);
  },

  async getBag(id: string): Promise<Bag | null> {
    if (!db) throw new Error("Database not initialized");

    const itemRef = doc(db, BAG_COLLECTION, id);
    const snap = await getDoc(itemRef);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    } as Bag;
  },

  async getBags(
    pageSize: number = 12,
    lastDoc?: DocumentSnapshot
  ): Promise<{ bags: Bag[]; lastDoc: DocumentSnapshot | null }> {
    if (!db) throw new Error("Database not initialized");

    let q = query(
      collection(db, BAG_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const bags = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Bag[];

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

    return { bags, lastDoc: lastVisible };
  },

  async getBagsByCategory(category: string): Promise<Bag[]> {
    if (!db) throw new Error("Database not initialized");

    const q = query(
      collection(db, BAG_COLLECTION),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Bag[];
  },
};
