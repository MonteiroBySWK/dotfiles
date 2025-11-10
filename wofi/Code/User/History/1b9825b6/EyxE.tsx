"use client";

import { useMounted } from "@/hooks/useMounted";
import { useCategoryRotation } from "@/hooks/useCategoryRotation";
import { TheraLogo } from "./TheraLogo";
import { Separator } from "./Separator";
import { CategoryText } from "./CategoryText";
import { Tagline } from "./Tagline";

export default function HeroTitle() {
  const mounted = useMounted();
  const categoryRotation = useCategoryRotation();

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none px-4">
      <div
        className={`text-center transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h1 className="flex flex-row items-center justify-center gap-2 sm:gap-4 transition-all duration-700 ease-in-out">
          <TheraLogo mounted={mounted} />

          <div className="flex flex-row items-center gap-2 sm:gap-4">
            <Separator />
            <CategoryText {...categoryRotation} />
          </div>
        </h1>

        {/* <Tagline mounted={mounted} /> */}
      </div>
    </div>
  );
}
