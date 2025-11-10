import { useEffect, useState } from "react";

export default function TextWriting({
  text,
  size
}: { text: string; size: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index >= text.length) clearInterval(interval);
    }, 2); // velocidade da "digitação" (ms)

    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className={`font-mono ${size}`}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </p>
  );
}
