import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

const dockSpring = { mass: 0.12, stiffness: 180, damping: 16 };
const baseScale = 1;
const magnifiedScale = 1.14;
const proximity = 85;

function SoftwareDockItem({ logo, mouseX }) {
  const itemRef = useRef(null);
  const pointerDistance = useTransform(mouseX, (pointerX) => {
    const rect = itemRef.current?.getBoundingClientRect();
    if (!rect) return proximity;
    return pointerX - rect.left - rect.width / 2;
  });
  const targetScale = useTransform(
    pointerDistance,
    [-proximity, 0, proximity],
    [baseScale, magnifiedScale, baseScale],
  );
  const scale = useSpring(targetScale, dockSpring);

  return (
    <motion.li
      ref={itemRef}
      className="software-dock-item"
      style={{ scale, transformOrigin: "center bottom" }}
      title={logo.name}
    >
      <img src={logo.src} alt={logo.name} loading="lazy" decoding="async" />
    </motion.li>
  );
}

export function SoftwareDock({ logos }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <ul
      className="software-logos software-dock"
      aria-label="专业软件与设计工具"
      onPointerMove={(event) => mouseX.set(event.clientX)}
      onPointerLeave={() => mouseX.set(Infinity)}
    >
      {logos.map((logo) => (
        <SoftwareDockItem key={logo.name} logo={logo} mouseX={mouseX} />
      ))}
    </ul>
  );
}
