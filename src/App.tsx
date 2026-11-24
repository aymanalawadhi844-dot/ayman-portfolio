import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AdminApp from '@/admin/AdminApp';
import { SiteDataProvider } from '@/context/SiteDataContext';

function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(() => window.location.hash.startsWith('#/admin'));
  useEffect(() => {
    const onHash = () => setIsAdmin(window.location.hash.startsWith('#/admin'));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return isAdmin;
}

function Site() {
  return (
    <div className="min-h-screen bg-ink-950 text-ink-200 antialiased">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const isAdmin = useIsAdmin();

  if (isAdmin) return <AdminApp />;

  return (
    <SiteDataProvider>
      <Site />
    </SiteDataProvider>
  );
}
