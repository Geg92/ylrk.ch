export function LocationMap() {
  return (
    <a 
      href="https://maps.google.com/?q=Aaraustrasse+29,+5734+Reinach+AG"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full h-[300px] overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 border-t border-black/5 relative group cursor-pointer"
    >
      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"></div>
      <iframe
        className="pointer-events-none"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src="https://maps.google.com/maps?q=Aaraustrasse%2029,%205734%20Reinach%20AG&t=&z=13&ie=UTF8&iwloc=&output=embed"
      ></iframe>
    </a>
  );
}

