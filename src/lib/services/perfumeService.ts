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
import { Perfume, PerfumeFormData } from "@/lib/types/perfumes";

const PERFUME_COLLECTION = "perfumes";

export const perfumeService = {
  async createPerfume(data: PerfumeFormData): Promise<string> {
    if (!db) throw new Error("Database not initialized");

    const docRef = await addDoc(collection(db, PERFUME_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  },

  async updatePerfume(id: string, data: Partial<PerfumeFormData>): Promise<void> {
    if (!db) throw new Error("Database not initialized");

    const itemRef = doc(db, PERFUME_COLLECTION, id);
    await updateDoc(itemRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deletePerfume(id: string): Promise<void> {
    if (!db) throw new Error("Database not initialized");

    const itemRef = doc(db, PERFUME_COLLECTION, id);
    await deleteDoc(itemRef);
  },

  async getPerfume(id: string): Promise<Perfume | null> {
    if (!db) throw new Error("Database not initialized");

    const itemRef = doc(db, PERFUME_COLLECTION, id);
    const snap = await getDoc(itemRef);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    } as Perfume;
  },

  async getPerfumes(
    pageSize: number = 12,
    lastDoc?: DocumentSnapshot
  ): Promise<{ perfumes: Perfume[]; lastDoc: DocumentSnapshot | null }> {
    if (!db) throw new Error("Database not initialized");

    let q = query(
      collection(db, PERFUME_COLLECTION),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const perfumes = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Perfume[];

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

    return { perfumes, lastDoc: lastVisible };
  },

  async getPerfumesByCategory(category: string): Promise<Perfume[]> {
    if (!db) throw new Error("Database not initialized");

    const q = query(
      collection(db, PERFUME_COLLECTION),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as Perfume[];
  },
};
