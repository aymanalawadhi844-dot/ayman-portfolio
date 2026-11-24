import {
  createContext, useContext, useEffect, useState, useCallback,
  type ReactNode,
} from 'react';
import {
  doc, getDoc, collection, getDocs, query, orderBy,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import {
  DEFAULT_SETTINGS, DEFAULT_PROJECTS, DEFAULT_SKILLS, DEFAULT_FEATURES,
} from '@/lib/defaults';
import type { SiteSettings, Project, SkillCard, FeatureCard } from '@/lib/types';

interface SiteData {
  settings: SiteSettings;
  projects: Project[];
  skills: SkillCard[];
  features: FeatureCard[];
  loading: boolean;
  firebaseReady: boolean;
  refresh: () => Promise<void>;
}

const Ctx = createContext<SiteData>({
  settings: DEFAULT_SETTINGS,
  projects: DEFAULT_PROJECTS,
  skills: DEFAULT_SKILLS,
  features: DEFAULT_FEATURES,
  loading: true,
  firebaseReady: false,
  refresh: async () => {},
});

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [skills, setSkills] = useState<SkillCard[]>(DEFAULT_SKILLS);
  const [features, setFeatures] = useState<FeatureCard[]>(DEFAULT_FEATURES);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!db || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    try {
      const [settingsSnap, projectsSnap, skillsSnap, featuresSnap] =
        await Promise.all([
          getDoc(doc(db, 'settings', 'site')),
          getDocs(query(collection(db, 'projects'), orderBy('order'))),
          getDocs(query(collection(db, 'skills'), orderBy('order'))),
          getDocs(query(collection(db, 'features'), orderBy('order'))),
        ]);

      if (settingsSnap.exists()) {
        setSettings({ ...DEFAULT_SETTINGS, ...settingsSnap.data() } as SiteSettings);
      }
      if (!projectsSnap.empty) {
        setProjects(projectsSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Project));
      }
      if (!skillsSnap.empty) {
        setSkills(skillsSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as SkillCard));
      }
      if (!featuresSnap.empty) {
        setFeatures(featuresSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as FeatureCard));
      }
    } catch (err) {
      console.error('Failed to load site data from Firebase:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <Ctx.Provider
      value={{
        settings, projects, skills, features,
        loading,
        firebaseReady: isFirebaseConfigured,
        refresh,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useSiteData() {
  return useContext(Ctx);
}
