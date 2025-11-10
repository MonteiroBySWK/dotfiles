import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { type DataType } from "../types/skillsTypes";

const RADIUS = 160;

const data: DataType = {
  keys: Object.keys(dataSkills),
  skills: dataSkills,
};

const AreaItem = ({
  name,
  iconArr,
}: {
  name: string;
  iconArr: DataSkillItemType[];
}) => {
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showItems, setShowItems] = useState(false);

  const angles = iconArr.map((_, i) => (360 / iconArr.length) * i);
  const positions = angles.map((angle) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: RADIUS * Math.cos(rad),
      y: RADIUS * Math.sin(rad),
    };
  });

  useEffect(() => {
    const localAngles = [...angles];
    const speed = 0.5;

    const update = () => {
      if (!showItems) return;

      localAngles.forEach((angle, i) => {
        localAngles[i] = (angle + speed) % 360;

        const rad = (localAngles[i] * Math.PI) / 180;
        const x = RADIUS * Math.cos(rad);
        const y = RADIUS * Math.sin(rad);

        gsap.set(iconRefs.current[i], {
          x,
          y,
        });
      });
    };

    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, [angles, showItems]);

  useEffect(() => {
    if (showItems) {
      requestAnimationFrame(() => {
        iconArr.forEach((_, i) => {
          const el = iconRefs.current[i];
          if (!el) return;

          const { x, y } = positions[i];

          gsap.fromTo(
            el,
            { x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.6 },
            {
              x,
              y,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: "power3.out",
            }
          );
        });
      });
    }
  }, [showItems, iconArr, positions]);

  const handleMouseEnter = () => {
    // iconArr.forEach((_, i) => {
    //   const el = iconRefs.current[i];
    //   const { x, y } = positions[i];
    // });

    setShowItems(true);
  };

  const handleMouseLeave = () => {
    iconArr.forEach((_, i) => {
      const el = iconRefs.current[i];
      gsap.to(el, {
        x: 0,
        y: 0,
        opacity: 0,
        rotate: 0,
        scale: 0.6,
        duration: 0.4,
        ease: "power2.inOut",
      });
    });

    setTimeout(() => setShowItems(false), 300);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className=" border border-dashed border-border hover:border-primary flex flex-col justify-center items-center rounded-full size-80 group relative"
    >
      <h1 className="text-2xl font-semibold px-2 text-center">{name}</h1>

      {showItems &&
        iconArr.map((e, i) => {
          return (
            <div
              key={`${e.name}-${i}`}
              id={`${e.name}-${i}`}
              ref={(el) => {
                iconRefs.current[i] = el;
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="flex w-fit items-center justify-center text-white hover:scale-110 transition">
                {e.icon}
              </div>
            </div>
          );
        })}
    </div>
  );
};

const GrandArea = ({ data }: { data: DataType }) => {
  const elems = data.keys.map((item, i) => {
    return (
      <div key={i} className=" border border-dashed border-border flex flex-col justify-center rounded-full size-80 group relative">
        <AreaItem name={item} iconArr={data.skills[item]} />
      </div>
    );
  });

  return <div className="flex gap-x-10 gap-y-10">{elems}</div>;
};

export default function Skills() {
  return (
    <section
      className="h-screen flex flex-col justify-center items-center text-primary overflow-x-hidden"
      id="skills"
    >
      <h1 className="text-primary font-extrabold text-5xl mb-10">Skills</h1>
      <GrandArea data={data} />
    </section>
  );
}
