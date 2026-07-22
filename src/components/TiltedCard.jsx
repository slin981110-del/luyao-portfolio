import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import "./TiltedCard.css";

const cardSpring = {
  damping: 28,
  stiffness: 130,
  mass: 1.15,
};

const captionSpring = {
  damping: 30,
  stiffness: 350,
  mass: 1,
};

export function TiltedCard({
  children,
  captionText = "",
  rotateAmplitude = 9,
  scaleOnHover = 1.045,
  showTooltip = false,
}) {
  const cardRef = useRef(null);
  const lastYRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), cardSpring);
  const rotateY = useSpring(useMotionValue(0), cardSpring);
  const scale = useSpring(1, cardSpring);
  const captionOpacity = useSpring(0, cardSpring);
  const captionRotate = useSpring(0, captionSpring);

  const resetCard = () => {
    captionOpacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    captionRotate.set(0);
    lastYRef.current = 0;
  };

  const handlePointerMove = (event) => {
    const card = cardRef.current;
    if (!card || prefersReducedMotion) return;

    const rect = card.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;

    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
    pointerX.set(event.clientX - rect.left);
    pointerY.set(event.clientY - rect.top);
    captionRotate.set(-(offsetY - lastYRef.current) * 0.45);
    lastYRef.current = offsetY;
  };

  const handlePointerEnter = () => {
    if (prefersReducedMotion) return;
    scale.set(scaleOnHover);
    captionOpacity.set(1);
  };

  return (
    <figure
      ref={cardRef}
      className="tilted-card-figure"
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={resetCard}
      onPointerCancel={resetCard}
    >
      <motion.div className="tilted-card-inner" style={{ rotateX, rotateY, scale }}>
        {children}
      </motion.div>

      {showTooltip && captionText ? (
        <motion.figcaption
          className="tilted-card-caption"
          style={{
            x: pointerX,
            y: pointerY,
            opacity: captionOpacity,
            rotate: captionRotate,
          }}
        >
          {captionText}
        </motion.figcaption>
      ) : null}
    </figure>
  );
}
