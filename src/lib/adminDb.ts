import {
  collection, doc, setDoc, deleteDoc, getDocs,
  writeBatch, serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import {
  DEFAULT_SETTINGS, DEFAULT_PROJECTS, DEFAULT_SKILLS, DEFAULT_FEATURES,
} from './defaults';
import type { SiteSettings, Project, SkillCard, FeatureCard } from './types';

function stripId<T extends object>(item: T): Omit<T, 'id'> {
  const copy = { ...(item as Record<string, unknown>) };
  delete copy.id;
  return copy as Omit<T, 'id'>;
}

export async function saveSettings(settings: SiteSettings) {
  if (!db) throw new Error('Firebase غير مهيأ');
  await setDoc(doc(db, 'settings', 'site'), stripId(settings), { merge: true });
}

export async function saveItem(
  collectionName: 'projects' | 'skills' | 'features',
  item: Project | SkillCard | FeatureCard,
) {
  if (!db) throw new Error('Firebase غير مهيأ');
  const payload = { ...stripId(item), updatedAt: serverTimestamp() };
  if (item.id) {
    await setDoc(doc(db, collectionName, item.id), payload, { merge: true });
  } else {
    const newId = crypto.randomUUID();
    await setDoc(doc(db, collectionName, newId), { ...payload, createdAt: serverTimestamp() });
    return newId;
  }
  return item.id;
}

export async function deleteItem(
  collectionName: 'projects' | 'skills' | 'features',
  id: string,
) {
  if (!db) throw new Error('Firebase غير مهيأ');
  await deleteDoc(doc(db, collectionName, id));
}

export async function reorderItems(
  collectionName: 'projects' | 'skills' | 'features',
  ids: string[],
) {
  const firestore = db;
  if (!firestore) throw new Error('Firebase غير مهيأ');
  const batch = writeBatch(firestore);
  ids.forEach((id, index) => {
    batch.update(doc(firestore, collectionName, id), { order: index + 1 });
  });
  await batch.commit();
}

export async function uploadImage(file: File, folder = 'site'): Promise<string> {
  if (!storage) throw new Error('Firebase Storage غير مهيأ');
  const path = `${folder}/${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function seedDefaults() {
  if (!db) throw new Error('Firebase غير مهيأ');
  await saveSettings(DEFAULT_SETTINGS as SiteSettings);

  const batch = writeBatch(db);
  for (const p of DEFAULT_PROJECTS) {
    batch.set(doc(db, 'projects', p.id), stripId(p));
  }
  for (const s of DEFAULT_SKILLS) {
    batch.set(doc(db, 'skills', s.id), stripId(s));
  }
  for (const f of DEFAULT_FEATURES) {
    batch.set(doc(db, 'features', f.id), stripId(f));
  }
  await batch.commit();
}

export async function isCollectionEmpty(collectionName: string): Promise<boolean> {
  if (!db) return true;
  const snap = await getDocs(collection(db, collectionName));
  return snap.empty;
}
