import { useEffect } from 'react';
import { LanguageProvider } from './lib/LanguageContext';
import { ScrollProgress } from './components/ScrollProgress';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SocialProofBar } from './components/SocialProofBar';
import { TrustBadges } from './components/TrustBadges';
import { ExperienceStats } from './components/ExperienceStats';
import { Services } from './components/Services';
import { CostCalculator } from './components/CostCalculator';
import { Testimonials } from './components/Testimonials';
import { Process } from './components/Process';
import { FAQ } from './components/FAQ';
import { InstagramSection } from './components/InstagramSection';
import { InquiryForm } from './components/InquiryForm';
import { LocationMap } from './components/LocationMap';
import { Footer } from './components/Footer';
import { FloatingContact } from './components/FloatingContact';
import { MobileStickyCall } from './components/MobileStickyCall';
import { AIChatBot } from './components/AIChatBot';

const sectionMeta: Record<string, { title: string; description: string }> = {
  "home": { 
    title: "YLRK Beschriftungen | Premium Werbetechnik Schweizweit", 
    description: "Ihr Experte für professionelle Fahrzeugbeschriftungen, Schaufensterbeklebung und Werbetechnik in der ganzen Schweiz." 
  },
  "leistungen": { 
    title: "Unsere Leistungen | YLRK Beschriftungen", 
    description: "Entdecken Sie unsere massgeschneiderten Lösungen: Fahrzeugfolierung, Gebäudebeschriftung, Textildruck und mehr." 
  },
  "calculator": { 
    title: "Kostenrechner | YLRK Beschriftungen", 
    description: "Berechnen Sie transparent und schnell die Richtpreise für Ihre nächste Fahrzeugbeschriftung oder Folierung." 
  },
  "referenzen": { 
    title: "Kundenreferenzen | YLRK Beschriftungen", 
    description: "Sehen Sie, was unsere zufriedenen Kunden über unsere Arbeit im Bereich Werbetechnik und Beschriftungen sagen." 
  },
  "ablauf": { 
    title: "Unser Prozess | YLRK Beschriftungen", 
    description: "Von der Beratung über das Design bis zur fachgerechten Montage: So einfach funktioniert Ihr Projekt mit uns." 
  },
  "faq": { 
    title: "Häufige Fragen (FAQ) | YLRK Beschriftungen", 
    description: "Finden Sie Antworten auf oft gestellte Fragen rund um Haltbarkeit, Pflege und Ablauf bei unseren Beschriftungen." 
  },
  "offerte": { 
    title: "Kontakt & Offerte | YLRK Beschriftungen", 
    description: "Fordern Sie jetzt eine unverbindliche Offerte für Ihr Beschriftungsprojekt an. Wir beraten Sie gerne!" 
  },
};

export default function App() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible intersecting section
        let maxIntersectionRatio = 0;
        let activeSectionId: string | null = null;
        
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxIntersectionRatio) {
            maxIntersectionRatio = entry.intersectionRatio;
            activeSectionId = entry.target.id;
          }
        });

        if (activeSectionId && sectionMeta[activeSectionId]) {
          const meta = sectionMeta[activeSectionId];
          document.title = meta.title;
          
          let metaDescription = document.querySelector('meta[name="description"]');
          if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
          }
          metaDescription.setAttribute('content', meta.description);
        }
      },
      {
        root: null,
        rootMargin: '-10% 0px -40% 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      }
    );

    const sections = Object.keys(sectionMeta)
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
      observer.disconnect();
    };
  }, []);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-brand-bg text-brand-text selection:bg-brand-cyan selection:text-white pb-[72px] md:pb-0 relative">
        <ScrollProgress />
        <AnimatedBackground />
        <Navbar />
        <main>
          <Hero />
          <SocialProofBar />
          <TrustBadges />
          <ExperienceStats />
          <Services />
          <CostCalculator />
          <Testimonials />
          <Process />
          <FAQ />
          <InstagramSection />
          <InquiryForm />
          <LocationMap />
        </main>
        <Footer />
        <FloatingContact />
        <AIChatBot />
        <MobileStickyCall />
      </div>
    </LanguageProvider>
  );
}
