import { motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import "./Stack.css";

function CardRotate({ children, onSendToBack, sensitivity, isTop }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [9, -9]);
  const rotateY = useTransform(x, [-100, 100], [-9, 9]);

  const handleDragEnd = (_, info) => {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack();
      return;
    }
    x.set(0);
    y.set(0);
  };

  const handleKeyDown = (event) => {
    if (!isTop || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    onSendToBack();
  };

  return (
    <motion.div
      className="stack-card-rotate"
      style={{ x, y, rotateX, rotateY }}
      drag={isTop}
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.42}
      whileTap={isTop ? { cursor: "grabbing" } : undefined}
      onDragEnd={handleDragEnd}
      onKeyDown={handleKeyDown}
      role={isTop ? "button" : undefined}
      tabIndex={isTop ? 0 : -1}
      aria-label={isTop ? "切换到下一组长图作品" : undefined}
      aria-hidden={isTop ? undefined : "true"}
    >
      {children}
    </motion.div>
  );
}

export function Stack({
  randomRotation = false,
  sensitivity = 180,
  cards = [],
  animationConfig = { stiffness: 230, damping: 24 },
  sendToBackOnClick = true,
  onAdvance,
}) {
  const advanceLockRef = useRef(0);
  const [stack, setStack] = useState(() =>
    cards.map((content, index) => ({ id: index + 1, content })),
  );

  useEffect(() => {
    setStack(cards.map((content, index) => ({ id: index + 1, content })));
  }, [cards]);

  const sendToBack = (id) => {
    const now = Date.now();
    if (now - advanceLockRef.current < 420) return;
    advanceLockRef.current = now;
    onAdvance?.();
    setStack((current) => {
      const next = [...current];
      const index = next.findIndex((card) => card.id === id);
      if (index < 0) return current;
      const [card] = next.splice(index, 1);
      next.unshift(card);
      return next;
    });
  };

  return (
    <div className="stack-container">
      {stack.map((card, index) => {
        const depth = stack.length - index - 1;
        const randomRotate = randomRotation ? ((card.id * 7) % 9) - 4 : 0;
        const isTop = index === stack.length - 1;
        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            isTop={isTop}
          >
            <motion.div
              className="stack-card"
              onClick={() => isTop && sendToBackOnClick && sendToBack(card.id)}
              animate={{
                rotateZ: depth * 1.15 + randomRotate,
                scale: 1 - depth * 0.032,
                y: depth * 3,
                opacity: Math.max(0.28, 1 - depth * 0.14),
                zIndex: index + 1,
              }}
              initial={false}
              transition={{
                type: "spring",
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping,
              }}
            >
              {card.content}
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}
