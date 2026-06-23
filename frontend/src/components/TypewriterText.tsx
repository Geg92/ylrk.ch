import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TypewriterTextProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
}

export function TypewriterText({ 
  words, 
  typingSpeed = 100, 
  deletingSpeed = 50, 
  delayBetweenWords = 2000 
}: TypewriterTextProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const tick = () => {
      const fullWord = words[currentWordIndex];

      if (isDeleting) {
        setCurrentText((prev) => prev.substring(0, prev.length - 1));
      } else {
        setCurrentText((prev) => fullWord.substring(0, prev.length + 1));
      }

      let typeSpeed = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && currentText === fullWord) {
        typeSpeed = delayBetweenWords;
        setIsDeleting(true);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        typeSpeed = 500; // Small pause before typing next word
      }

      timeout = setTimeout(tick, typeSpeed);
    };

    timeout = setTimeout(tick, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, delayBetweenWords]);

  return (
    <span className="inline-flex items-center text-brand-cyan font-bold">
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="inline-block w-[2px] h-[1em] bg-brand-cyan ml-[2px]"
      />
    </span>
  );
}
