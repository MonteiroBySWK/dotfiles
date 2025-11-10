"use client";

import { useEffect } from "react";
import NESRenderer from "./render";

const TouchPage = () => {
  const enableFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      landscapeOrientation();
      return;
    }
    //@ts-expect-error
    if (elem.webkitRequestFullscreen) {
      //@ts-expect-error
      elem.webkitRequestFullscreen(); // Para Safari
      landscapeOrientation();
      return;
    }

    console.warn("Fullscreen API não suportada neste navegador.");
  };

  const landscapeOrientation = () => {
    if ("orientation" in screen) {
      //@ts-expect-error
      screen.orientation.lock("landscape").catch((err) => {
        console.warn("Não foi possível bloquear a orientação:", err);
      });
    } else {
      console.warn("Screen Orientation API não suportada.");
    }
  };

  useEffect(() => {
    document.addEventListener("click", enableFullScreen);

    return () => {
      document.removeEventListener("click", enableFullScreen);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      <NESRenderer />
    </div>
  );
};

export default TouchPage;
