import { useState, useEffect } from 'react';

const EmojiLoader = () => {
  const emojis = ['🍎', '🥑', '🥕', '🥖', '🧀', '🍇', '🍗', '🥛', '🧻', '🧴']; // Add more emojis if needed
  const [currentEmoji, setCurrentEmoji] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEmoji((prevEmoji) => (prevEmoji + 1) % emojis.length);
    }, 150); // Adjust speed if needed

    return () => clearInterval(interval);
  }, [emojis.length]);

  return (
    <div className="flex items-center justify-center h-5/6 flex-col">
      <span className="text-2xl transition-opacity duration-500 opacity-1 animate-fade-in-out animate-bounce">
        {emojis[currentEmoji]}
      </span>
      Ladataan...
    </div>
  );
};

export default EmojiLoader;
