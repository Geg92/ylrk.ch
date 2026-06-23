import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'de' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const DE = {
  // Navbar
  'nav.leistungen': 'Leistungen',
  'nav.ablauf': 'Ablauf',
  'nav.faq': 'FAQ',
  'nav.offerte': 'Offerte anfordern',
  'nav.langLabel': 'Sprache / Language:',

  // Hero
  'hero.trustBadge': 'Über 200 Fahrzeuge beschriftet · Schweizweit im Einsatz',
  'hero.headingLine1': 'Ihr Fahrzeug.',
  'hero.headingLine2': 'Ihr Logo.',
  'hero.headingLine3': 'Morgen auf der Strasse.',
  'hero.professionell': 'Professionelle ',
  'hero.serviceSubtitle': 'für KMUs in der ganzen Schweiz. Maximale Sichtbarkeit, schnelle Umsetzung.',
  'hero.services': 'Unsere Leistungen',
  'hero.badge': 'Schweizer Präzision & Qualität',
  'hero.titlePart1': 'Vollendete Werbetechnik',
  'hero.titlePart2': '& Veredelung',
  'hero.description': 'Wir machen Ihre Vision auf Strassen und Schaufenstern unübersehbar. Schnell, transparent und in höchster Schweizer Ausführungsqualität.',
  'hero.cta': 'Jetzt Offerte berechnen',
  'hero.experience': 'Jahre Erfahrung in Reinach BL',
  'hero.preview': 'Live-Vorschau',
  'hero.customAction': 'Eigene Folierungs-Action',
  'hero.customDesc': 'Ihr hochgeladenes Video wird direkt auf Ihrer Webseite präsentiert.',
  'hero.workInProgress': 'WORK IN PROGRESS PLACEHOLDER',
  'hero.teslaWrap': 'TESLA MODEL Y VOLLFOLIERUNG',
  'hero.dropTitle': 'Ihr Video hier einfügen',
  'hero.dropDesc': 'Ziehen Sie das eben hochgeladene Folierungsvideo (.mp4 / .mov) einfach direkt in diesen Bereich oder klicken Sie hier.',
  'hero.dropFooterTitle': 'Flottenbeschriftungen & Folien',
  'hero.dropFooterDesc': 'Präsentieren Sie Ihre Arbeit als lebendige Live-Action',
  'hero.dropFooterBtn': 'Video wählen',

  // Experience Stats
  'stats.years': 'Jahre Erfahrung',
  'stats.cars': 'Fahrzeuge foliert',
  'stats.customers': 'Zufriedene Kunden',

  // Services
  'services.title': 'Was wir',
  'services.titleHighlight': 'machen',
  'services.subtitle': 'Wir bringen Ihre Marke dorthin, wo sie gesehen wird. Hochwertige Materialien und präzise Verarbeitung für den perfekten ersten Eindruck.',
  'services.specs': 'Spezifikationen',
  'services.cta': 'Offerte anfordern',
  'services.carTitle': 'Fahrzeugbeschriftung',
  'services.carDesc': 'Vom einzelnen Handwerker-Auto bis zur kompletten Flotte. Auffällig, langlebig, waschanlagenfest.',
  'services.carSpecs': ['3M / Avery Dennison Folien', 'UV-Schutzlaminat', 'Rückstandslos entfernbar'],
  'services.storeTitle': 'Schaufenster',
  'services.storeDesc': 'Sichtschutz, Aktions-Kleber oder das permanente Logo. Wir machen Ihr Schaufenster zum Verkäufer.',
  'services.storeSpecs': ['Milchglas / Glasdekor', 'Konturschnitt PVC', 'Innen- & Aussenmontage'],
  'services.boardTitle': 'Werbetafeln',
  'services.boardDesc': 'Bauschilder, Firmenschilder, Wegweiser. Robuste Materialien für den Innen- und Aussenbereich.',
  'services.boardSpecs': ['Alu-Dibond 3-4mm', 'Acrylglas (Plexiglas)', 'Wetter- & Kratzfest'],
  'services.textileTitle': 'Textildruck',
  'services.textileDesc': 'Arbeitsbekleidung, die wirkt. Flexdruck oder Stick für T-Shirts, Pullover und Jacken.',
  'services.textileSpecs': ['Hochwertige Textilien', 'Oeko-Tex Standard 100', 'Bis 60°C waschbar'],

  // Cost Calculator
  'calc.quickQuote': '24 - 48h Quick Quote Offerte',
  'calc.title': 'Kosten',
  'calc.titleHighlight': 'rechner',
  'calc.subtitle': 'Berechnen Sie in Sekunden einen Richtpreis für Ihr Projekt. Für ein exaktes Angebot kontaktieren Sie uns gerne direkt.',
  'calc.step1': 'Kategorie',
  'calc.step2': 'Umfang',
  'calc.step3': 'Kalkulation',
  'calc.catTitle': '1. Kategorie wählen',
  'calc.intensityTitle': '2. Umfang / Komplexität',
  'calc.priceTitle': 'Geschätzter Richtpreis*',
  'calc.chooseAll': 'Bitte alle Optionen wählen',
  'calc.note': '*Hinweis: Dieser Preisrechner dient nur einer ersten Orientierung. Der finale Preis hängt von Faktoren wie der Komplexität des Designs, der gewählten Folienqualität und der tatsächlichen Fläche ab.',
  'calc.cats': {
    'small': 'Kleinwagen',
    'medium': 'Kombi / Limousine',
    'large': 'Transporter / Bus',
    'window': 'Schaufenster',
    'textile': 'Textil',
  },
  'calc.ints': {
    'subtle': 'Dezent / Einfach',
    'medium': 'Mittel / Teilflächig',
    'full': 'Komplex / Vollflächig',
  },

  // Process
  'proc.title': 'In 3 Schritten zur',
  'proc.titleHighlight': 'präsenz',
  'proc.subtitle': 'Unser Prozess ist auf Geschwindigkeit und Qualität optimiert. Keine bösen Überraschungen, klares Design, saubere Montage.',
  'proc.steps': [
    {
      number: '01',
      title: 'Anfrage',
      description: 'Beschreiben Sie Ihr Projekt über unser Formular. Wir melden uns innert 24 Stunden mit einem Richtpreis.'
    },
    {
      number: '02',
      title: 'Visualisierung',
      description: 'Wir erstellen einen ersten Entwurf auf Ihrem Fahrzeugmodell oder Schaufenster. So wissen Sie genau, wie das Resultat aussieht.'
    },
    {
      number: '03',
      title: 'Montage',
      description: 'Termingerechte und präzise Folierung bei uns in Reinach oder direkt bei Ihnen schweizweit vor Ort.'
    }
  ],

  // FAQ
  'faq.title': 'Häufige',
  'faq.titleHighlight': 'Fragen',
  'faq.items': [
    {
      question: "Wie lange dauert eine Beschriftung / Folierung?",
      answer: "Das hängt vom Umfang ab. Eine Teilfolierung oder Schaufensterbeschriftung dauert in der Regel einen halben bis ganzen Tag. Wir planen die Standzeit so gering wie möglich, damit Sie schnell wieder einsatzbereit sind."
    },
    {
      question: "Welche Materialien werden für Schaufenster und Fahrzeuge verwendet?",
      answer: "Wir arbeiten ausschliesslich mit Premium-Folien von namhaften Herstellern. Für Schaufenster bieten wir auch Milchglasfolien, Lochfensterfolien und UV-beständige Digitaldrucke an."
    },
    {
      question: "Arbeiten Sie schweizweit und muss ich zu Ihnen kommen?",
      answer: "Wir sind schweizweit im Einsatz! Für Fahrzeugfolierungen können Sie entweder zu uns kommen, wo wir optimale Bedingungen haben, oder wir kommen für die Montage direkt zu Ihnen in die ganze Schweiz (sofern eine geeignete Halle mit ca. 20 Grad vorhanden ist). Schaufenster- und Gebäudebeschriftungen führen wir ohnehin bei Ihnen vor Ort in der ganzen Schweiz aus."
    },
    {
      question: "Können auch Textilien bei Ihnen bedruckt werden?",
      answer: "Ja, wir bieten auch Textilveredelung an. Egal ob für Firmenbekleidung, Vereine oder Events – wir beraten Sie gerne zur passenden Druckmethode."
    },
    {
      question: "Wie reinige ich folierte Flächen?",
      answer: "Die Reinigung ist nach 2 Wochen problemlos möglich (bei Autos auch in der Textil-Waschanlage). Vermeiden Sie Heisswachs und spritzen Sie nicht aus nächster Nähe (min. 50cm Abstand) mit dem Hochdruckreiniger auf die Folienkanten."
    }
  ],

  // Testimonials
  'testi.title': 'Das sagen',
  'testi.titleHighlight': 'unsere Kunden',
  'testi.subtitle': 'Vertrauen muss man sich verdienen. Wir sind stolz auf das positive Feedback und die langjährigen Partnerschaften mit unseren Kunden aus der ganzen Schweiz.',
  'testi.kunden': [
    {
      name: 'Kunde',
      company: 'H-THERM GmbH',
      text: 'Unser Schaufenster sieht jetzt genauso aus, wie wir uns das vorgestellt haben. Super mitgedacht und auch kurzfristig noch Anpassungen vorgenommen.'
    },
    {
      name: 'Kunde',
      company: 'HAGEX HAUSHALTSGERÄTE',
      text: 'Die Fahrzeugbeschriftung für unsere neue Flotte wurde perfekt umgesetzt. Sehr professionell, schnell und in Top-Qualität. Kann ich nur weiterempfehlen!'
    },
    {
      name: 'Kunde',
      company: 'Auto Station Sempach',
      text: 'Wir haben T-Shirts für unser Team bedrucken lassen. Die Qualität des Drucks und der Textilien ist hervorragend. Super Service und schnelle Abwicklung!'
    }
  ],

  // InquiryForm
  'form.title': 'Offerte',
  'form.titleHighlight': 'anfordern',
  'form.subtitle': 'Beantworten Sie ein paar kurze Fragen, und wir melden uns innert 24 Stunden.',
  'form.successTitle': 'Anfrage gesendet',
  'form.successMessage': 'Vielen Dank. Wir schauen uns die Details an und melden uns innert 24 Stunden bei Ihnen.',
  'form.newRequest': 'Neue Anfrage starten',
  'form.step1Title': 'Was möchten Sie beschriften lassen?',
  'form.types': {
    'Fahrzeug': 'Fahrzeug',
    'Schaufenster': 'Schaufenster',
    'Werbetafel': 'Werbetafel',
    'Textil': 'Textil',
  },
  'form.next': 'Weiter',
  'form.prev': 'Zurück',
  'form.step2Title': 'Beschreiben Sie Ihre Wünsche (z.B. Modell, Grösse, Farben)',
  'form.step2Placeholder': 'z.B. Tesla Model Y Teilfolierung in mattem Weiss mit Logo auf den Türen...',
  'form.step3Title': 'Kontaktdaten',
  'form.name': 'Name / Ansprechpartner',
  'form.email': 'E-Mail-Adresse',
  'form.phone': 'Telefonnummer (optional)',
  'form.company': 'Firma (optional)',
  'form.pref': 'Gewünschter Erstkontakt',
  'form.prefEmail': 'Per E-Mail',
  'form.prefPhone': 'Per Telefon',
  'form.submit': 'Offerte anfragen',
  'form.submitting': 'Wird gesendet...',

  // Footer & Contact & Others
  'footer.description': 'Ihr Partner für massgeschneiderte Fahrzeugbeschriftungen, Schaufensterfolierungen und innovative Werbetechnik in der Region Basel und schweizweit.',
  'footer.quickLinks': 'Schnellzugriff',
  'footer.contact': 'Kontakt',
  'footer.location': 'Standort',
  'footer.rights': 'Alle Rechte vorbehalten.',
  'footer.mapTitle': 'YLRK BESCHRIFTUNGEN ATELIER REINACH',
  'footer.phone': 'Telefon:',
  'footer.email': 'E-Mail:',

  'contact.toast': 'Wir antworten innert 24h!',
  'contact.btn': 'Offerte anfordern',

  'bot.header': 'YLRK KI-Assistent',
  'bot.welcome': 'Hallo! Ich bin der YLRK KI-Assistent. Wie kann ich Ihnen bei Ihrem Beschriftungsprojekt helfen?',
  'bot.placeholder': 'Schreiben Sie eine Nachricht...',
  'bot.agentOnline': 'Berater Online',

  'promo.instaTitle': 'UNSER REZENTER INSTAGRAM-FEED',
  'promo.instaDesc': 'Folgen Sie uns für tägliche Einblicke in unsere Projekte in Reinach und der ganzen Schweiz.',
  'promo.customUpload': 'Upload',
  'promo.customReset': 'Zurücksetzen'
};

const EN = {
  // Navbar
  'nav.leistungen': 'Services',
  'nav.ablauf': 'Process',
  'nav.faq': 'FAQ',
  'nav.offerte': 'Request Quote',
  'nav.langLabel': 'Language / Sprache:',

  // Hero
  'hero.trustBadge': 'Over 200 vehicles branded · Active Switzerland-wide',
  'hero.headingLine1': 'Your vehicle.',
  'hero.headingLine2': 'Your logo.',
  'hero.headingLine3': 'On the road tomorrow.',
  'hero.professionell': 'Professional ',
  'hero.serviceSubtitle': 'for SMBs across Switzerland. Maximum visibility, swift implementation.',
  'hero.services': 'Our Services',
  'hero.badge': 'Swiss Precision & Quality',
  'hero.titlePart1': 'Perfected Signage Technique',
  'hero.titlePart2': '& Wrapping Craft',
  'hero.description': 'We make your vision impossible to ignore on the streets and storefronts. Fast, transparent, and with the highest level of Swiss execution quality.',
  'hero.cta': 'Calculate Quote Now',
  'hero.experience': 'Years of Experience in Reinach BL',
  'hero.preview': 'Live Preview',
  'hero.customAction': 'Your Custom Wrap Action',
  'hero.customDesc': 'Your uploaded video will be presented directly in your showcase.',
  'hero.workInProgress': 'WORK IN PROGRESS PLACEHOLDER',
  'hero.teslaWrap': 'TESLA MODEL Y FULL WRAPPING',
  'hero.dropTitle': 'Drop your video here',
  'hero.dropDesc': 'Drag your freshly uploaded wrapping video (.mp4 / .mov) into this area, or click here.',
  'hero.dropFooterTitle': 'Fleet Signage & Wrap Films',
  'hero.dropFooterDesc': 'Present your wrapping work in interactive high-fidelity preview style',
  'hero.dropFooterBtn': 'Choose Video',

  // Experience Stats
  'stats.years': 'Years of Experience',
  'stats.cars': 'Vehicles Wrapped',
  'stats.customers': 'Satisfied Customers',

  // Services
  'services.title': 'What we',
  'services.titleHighlight': 'do',
  'services.subtitle': 'We place your brand exactly where it gets noticed. High-grade materials and micro-precision for a stellar first impression.',
  'services.specs': 'Specifications',
  'services.cta': 'Request Quote',
  'services.carTitle': 'Vehicle Wrapping',
  'services.carDesc': 'From a single handyman van up to full commercial corporate fleets. Catchy, durable, carwash-safe.',
  'services.carSpecs': ['3M / Avery Dennison Premium Films', 'UV Protective Overlaminate', 'Removable without any residue'],
  'services.storeTitle': 'Storefront Window Graphics',
  'services.storeDesc': 'Privacy frosting, promotion stickers, or permanent branding logos. We make your windows sell.',
  'services.storeSpecs': ['Frosted / Glass Etched Effect', 'Precision-contoured PVC', 'Indoor & Outdoor Installation'],
  'services.boardTitle': 'Signage Boards',
  'services.boardDesc': 'Construction signs, company nameplates, direction markers. Storm-proof outdoor options.',
  'services.boardSpecs': ['Aluminum Dibond 3-4mm', 'Polished Acrylic Glass (Plexiglas)', 'Weather, UV & Scratch Resistant'],
  'services.textileTitle': 'Apparel Printing',
  'services.textileDesc': 'Workwear that works. Heavy-duty flex printing or embroidery for T-shirts, hoodies, and jackets.',
  'services.textileSpecs': ['Premium Organic Fabrics', 'Oeko-Tex Standard 100 Certified', 'Washable up to 60°C (140°F)'],

  // Cost Calculator
  'calc.quickQuote': '24 - 48h Quick Quote Estimate',
  'calc.title': 'Cost',
  'calc.titleHighlight': 'calculator',
  'calc.subtitle': 'Estimate a realistic ballpark price for your custom project in seconds. Contact us directly for a comprehensive final offer.',
  'calc.step1': 'Category',
  'calc.step2': 'Scope',
  'calc.step3': 'Calculation',
  'calc.catTitle': '1. Choose Category',
  'calc.intensityTitle': '2. Scope / Complexity',
  'calc.priceTitle': 'Estimated Budget Price*',
  'calc.chooseAll': 'Please select all options above',
  'calc.note': '*Please note: This cost calculator provides an informative guideline. The actual final price depends on specific complexity of contours, selected film class, and actual area.',
  'calc.cats': {
    'small': 'Compact Car',
    'medium': 'Sedan / Station Wagon',
    'large': 'Utility Van / Minibus',
    'window': 'Shop Window',
    'textile': 'Apparel / Textile',
  },
  'calc.ints': {
    'subtle': 'Subtle / Simple Accent',
    'medium': 'Medium / Partial Wrap',
    'full': 'Complex / Full Coverage',
  },

  // Process
  'proc.title': 'Our simple 3-step',
  'proc.titleHighlight': 'process',
  'proc.subtitle': 'Our processing is fully streamlined for swift delivery and outstanding lifetime quality. Clean design, tidy assembly.',
  'proc.steps': [
    {
      number: '01',
      title: 'Inquiry',
      description: 'Describe your custom task via our simple intake form. We reply with an estimate within 24 hours.'
    },
    {
      number: '02',
      title: 'Visualization',
      description: 'We draft a precise digital overlay mockup on your specific car model or window. You know exactly what you get.'
    },
    {
      number: '03',
      title: 'Application',
      description: 'On-time and ultra-precise application at our atelier in Reinach or dynamic mobile service across Switzerland.'
    }
  ],

  // FAQ
  'faq.title': 'Frequently Asked',
  'faq.titleHighlight': 'Questions',
  'faq.items': [
    {
      question: "How long does the application process take?",
      answer: "It depends strongly on current scope. A partial wrapping or shop window decal usually takes 4 to 8 hours. We plan the downtime as short as possible to get your brand back on the street immediately."
    },
    {
      question: "Which film materials do you use for storefronts and autos?",
      answer: "We work exclusively with professional tier wrapping materials from top industry manufacturers. For windows, we also supply high-end frosted privacy sheetings, perforated high-visibility meshes, and UV-proof printings."
    },
    {
      question: "Do you operate across Switzerland or do I need to visit your shop?",
      answer: "We offer professional swiss-wide coverage! For vehicle wrapping, you can either visit our optimized facility in Reinach or we can perform the installation at your location across Switzerland (given an indoor garage heated to ~20°C is available). Storefront and branding signage is always installed directly at your swiss facility."
    },
    {
      question: "Can we order customized corporate apparel as well?",
      answer: "Absolutely, we specialize in heavy-use corporate clothing finishings. Whether company workwear, sports teams, or promo events – we find the optimal matching printing or embroidery technique."
    },
    {
      question: "How should I clean and maintain wrapped surfaces?",
      answer: "Cleaning is entirely safe after 2 weeks margin (for autos, this includes conveyor-style text textile carwashes). Please avoid hot spray wax programs and keep high-pressure jet wash nozzles at a safe distance (minimum 50cm) from film edges."
    }
  ],

  // Testimonials
  'testi.title': 'What our',
  'testi.titleHighlight': 'clients say',
  'testi.subtitle': 'Trust is something you must earn. We are proud of the positive feedback and durable partnerships with clients nationwide.',
  'testi.kunden': [
    {
      name: 'Client',
      company: 'H-THERM GmbH',
      text: 'Our storefront window looks exactly the way we imagined. Great feedback and prompt custom design adjustments were delivered with a smile.'
    },
    {
      name: 'Client',
      company: 'HAGEX APPLIANCES',
      text: 'The vehicle lettering for our commercial fleet was perfectly implemented. Very professional, fast, and top structural quality. Highly recommended!'
    },
    {
      name: 'Client',
      company: 'Auto Station Sempach',
      text: 'We had corporate clothing hoodies and shirts printed for our team. The print precision and textile touch is stellar. Fast processing!'
    }
  ],

  // InquiryForm
  'form.title': 'Request',
  'form.titleHighlight': 'Quote',
  'form.subtitle': 'Answer a few quick questions, and we will get back to you within 24 hours.',
  'form.successTitle': 'Inquiry Transmitted',
  'form.successMessage': 'Thank you! We are reviewing your specific details and will get back to you within 24 hours.',
  'form.newRequest': 'Start a new inquiry',
  'form.step1Title': 'What would you like to wrap or brand?',
  'form.types': {
    'Fahrzeug': 'Vehicle / Auto',
    'Schaufenster': 'Shop Window',
    'Werbetafel': 'Signage Board',
    'Textil': 'Custom Apparel',
  },
  'form.next': 'Next',
  'form.prev': 'Back',
  'form.step2Title': 'Describe your wishes (e.g. car model, dimensions, color tones)',
  'form.step2Placeholder': 'e.g. Tesla Model Y partial wrapping in satin finish white, featuring company logos on side doors...',
  'form.step3Title': 'Contact Information',
  'form.name': 'Your Name / Contact Person',
  'form.email': 'E-mail Address',
  'form.phone': 'Phone Number (optional)',
  'form.company': 'Company Name (optional)',
  'form.pref': 'Preferred Channel of Initial Contact',
  'form.prefEmail': 'Via E-mail',
  'form.prefPhone': 'Via Telephone Call',
  'form.submit': 'Request Custom Quote',
  'form.submitting': 'Sending Quote Request...',

  // Footer & Contact & Others
  'footer.description': 'Your reliable partner for professional fleet graphics, vehicle wrapping, storefront glass branding, and custom signages in the greater Basel region and across Switzerland.',
  'footer.quickLinks': 'Quick Links',
  'footer.contact': 'Contact Us',
  'footer.location': 'Our Atelier',
  'footer.rights': 'All rights reserved.',
  'footer.mapTitle': 'YLRK BESCHRIFTUNGEN ATELIER REINACH',
  'footer.phone': 'Phone:',
  'footer.email': 'E-mail:',

  'contact.toast': 'We reply within 24h!',
  'contact.btn': 'Get Free Quote',

  'bot.header': 'YLRK AI Assistant',
  'bot.welcome': 'Hello! I am your automated YLRK AI guide. How can I assist you with your wrapping or storefront graphics project today?',
  'bot.placeholder': 'Ask your question...',
  'bot.agentOnline': 'Support Online',

  'promo.instaTitle': 'OUR RECENT INSTAGRAM FEED',
  'promo.instaDesc': 'Follow us for daily behind-the-scenes insights into our operations in Reinach and swisswide.',
  'promo.customUpload': 'Upload',
  'promo.customReset': 'Reset'
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('ylrk_lang');
    return (saved === 'en' || saved === 'de') ? saved : 'de';
  });

  useEffect(() => {
    localStorage.setItem('ylrk_lang', language);
  }, [language]);

  const t = (key: string): any => {
    const dict = language === 'en' ? EN : DE;
    return (dict as any)[key] ?? (DE as any)[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
