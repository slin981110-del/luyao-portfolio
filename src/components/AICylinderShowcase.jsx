import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CaretDownIcon, CaretLeftIcon, CaretRightIcon, CaretUpIcon, XIcon } from "@phosphor-icons/react";
import "./AICylinderShowcase.css";

const AI_ITEMS = [
  { src: "/assets/ai-gallery/ai-01.jpg", title: "AI 视觉作品 01", fit: "cover", ratio: 3792 / 1279 },
  { src: "/assets/ai-gallery/ai-02.jpg", title: "AI 视觉作品 02", fit: "cover", ratio: 3792 / 1279 },
  { src: "/assets/ai-gallery/ai-03.jpg", title: "AI 视觉作品 03", fit: "cover", ratio: 1921 / 785 },
  { src: "/assets/ai-gallery/ai-04.jpg", title: "AI 视觉作品 04", fit: "cover", ratio: 1921 / 936 },
  { src: "/assets/ai-gallery/ai-05.jpg", title: "AI 视觉作品 05", fit: "cover", ratio: 1920 / 825 },
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const AUTO_PROGRESS_PER_MS = 0.000075;
const DRAG_SWITCH_THRESHOLD = 6;
const wrapOffset = (value, count) => {
  const half = count / 2;
  let wrapped = value;
  while (wrapped > half) wrapped -= count;
  while (wrapped < -half) wrapped += count;
  return wrapped;
};

export function AICylinderShowcase() {
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const visualRefs = useRef([]);
  const frameRef = useRef(0);
  const progressRef = useRef(0);
  const buttonTransitionRef = useRef(null);
  const pausedRef = useRef(false);
  const visibleRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const stageHeightRef = useRef(720);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const tiltRefs = useRef([]);
  const hoveredCardRef = useRef(null);
  const dragRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const resizeObserver = new ResizeObserver(([entry]) => {
      stageHeightRef.current = entry.contentRect.height;
    });
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    }, { threshold: 0.04 });
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      reducedMotionRef.current = motionQuery.matches;
    };

    resizeObserver.observe(stage);
    visibilityObserver.observe(stage);
    updateMotionPreference();
    motionQuery.addEventListener?.("change", updateMotionPreference);

    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      motionQuery.removeEventListener?.("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    let previousTime = performance.now();

    const render = (time) => {
      const delta = clamp(time - previousTime, 0, 32);
      previousTime = time;

      if (visibleRef.current) {
        const pointer = pointerRef.current;
        pointer.x += (pointer.targetX - pointer.x) * 0.075;
        pointer.y += (pointer.targetY - pointer.y) * 0.075;

        if (buttonTransitionRef.current !== null) {
          const transition = buttonTransitionRef.current;
          const elapsed = clamp(time - transition.startTime, 0, transition.duration);
          const transitionProgress = elapsed / transition.duration;
          const easedProgress = transitionProgress < 0.5
            ? 4 * transitionProgress ** 3
            : 1 - ((-2 * transitionProgress + 2) ** 3) / 2;
          progressRef.current = transition.from
            + (transition.to - transition.from) * easedProgress
            + elapsed * AUTO_PROGRESS_PER_MS;
          if (transitionProgress >= 1) {
            progressRef.current = transition.to + transition.duration * AUTO_PROGRESS_PER_MS;
            buttonTransitionRef.current = null;
          }
        } else if (!pausedRef.current && !reducedMotionRef.current) {
          progressRef.current += delta * AUTO_PROGRESS_PER_MS;
        }

        const roundedProgress = Math.round(progressRef.current);
        const virtualProgress = progressRef.current;
        const nextActiveIndex = ((roundedProgress % AI_ITEMS.length) + AI_ITEMS.length) % AI_ITEMS.length;
        setActiveIndex((current) => (current === nextActiveIndex ? current : nextActiveIndex));

        const radius = clamp(stageHeightRef.current * 0.68, 380, 620);

        AI_ITEMS.forEach((_, index) => {
          const card = cardRefs.current[index];
          const visual = visualRefs.current[index];
          if (!card || !visual) return;

          const offset = wrapOffset(index - virtualProgress, AI_ITEMS.length);
          const absoluteOffset = Math.abs(offset);
          const angle = offset * 43 * (Math.PI / 180);
          const tilt = tiltRefs.current[index] ?? { x: 0, y: 0 };
          tiltRefs.current[index] = tilt;
          const isHovered = hoveredCardRef.current === index;
          const hoverTiltStrength = clamp(1 - absoluteOffset * 0.18, 0.55, 1);
          const targetTiltX = isHovered ? pointer.x * hoverTiltStrength : 0;
          const targetTiltY = isHovered ? pointer.y * hoverTiltStrength : 0;
          const tiltEase = isHovered ? 0.18 : 0.045;
          tilt.x += (targetTiltX - tilt.x) * tiltEase;
          tilt.y += (targetTiltY - tilt.y) * tiltEase;
          const x = 0;
          const z = Math.cos(angle) * radius - radius + 230;
          const y = Math.sin(angle) * radius;
          const rotateX = angle * (180 / Math.PI) * 0.82 - tilt.y * 5.5;
          const rotateY = tilt.x * 8;
          const opacity = clamp(1 - Math.max(0, absoluteOffset - 0.5) * 0.2, 0.34, 1);

          card.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
          card.style.zIndex = String(Math.round(1000 - absoluteOffset * 100));
          card.style.opacity = opacity.toFixed(3);
          card.style.pointerEvents = absoluteOffset > 2.45 ? "none" : "auto";
          visual.style.filter = "blur(0px) saturate(1)";
          visual.style.transform = `scale(${(1 - absoluteOffset * 0.035).toFixed(3)})`;
        });
      }

      frameRef.current = window.requestAnimationFrame(render);
    };

    frameRef.current = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(frameRef.current);
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setLightboxIndex((current) => (current - 1 + AI_ITEMS.length) % AI_ITEMS.length);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setLightboxIndex((current) => (current + 1) % AI_ITEMS.length);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex]);

  const setPointerTarget = (event) => {
    const stage = stageRef.current;
    if (!stage || reducedMotionRef.current) return;
    const rect = stage.getBoundingClientRect();
    pointerRef.current.targetX = clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
    pointerRef.current.targetY = clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1);
  };

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;
    pausedRef.current = true;
    buttonTransitionRef.current = null;
    dragRef.current = {
      startY: event.clientY,
      lastY: event.clientY,
      startProgress: progressRef.current,
      moved: false,
    };
    stageRef.current?.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (hoveredCardRef.current === null) {
      pointerRef.current.targetX = 0;
      pointerRef.current.targetY = 0;
    } else {
      setPointerTarget(event);
    }
    const drag = dragRef.current;
    if (!drag) return;
    const deltaY = event.clientY - drag.lastY;
    drag.lastY = event.clientY;
    drag.moved = drag.moved || Math.abs(event.clientY - drag.startY) > 5;
    progressRef.current -= deltaY / 560;
  };

  const settleAfterDrag = (drag = null) => {
    const dragDistance = drag ? drag.lastY - drag.startY : 0;
    const switchDirection = Math.abs(dragDistance) >= DRAG_SWITCH_THRESHOLD
      ? (dragDistance < 0 ? 1 : -1)
      : 0;
    const destination = switchDirection === 0
      ? Math.round(progressRef.current)
      : Math.round(drag.startProgress) + switchDirection;

    pausedRef.current = false;
    buttonTransitionRef.current = {
      from: progressRef.current,
      to: destination,
      startTime: performance.now(),
      duration: 900,
    };
  };

  const finishDrag = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    suppressClickRef.current = drag.moved;
    dragRef.current = null;
    settleAfterDrag(drag);
    stageRef.current?.releasePointerCapture?.(event.pointerId);
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  const moveBy = (amount) => {
    const activeTransition = buttonTransitionRef.current;
    const destination = (activeTransition?.to ?? Math.round(progressRef.current)) + amount;
    buttonTransitionRef.current = {
      from: progressRef.current,
      to: destination,
      startTime: performance.now(),
      duration: 1560,
    };
  };

  const openLightbox = (index) => {
    if (suppressClickRef.current) return;
    setLightboxIndex(index);
  };

  const changeLightboxImage = (amount) => {
    setLightboxIndex((current) => (current + amount + AI_ITEMS.length) % AI_ITEMS.length);
  };

  return (
    <>
    <section className="ai-showcase section" id="ai" aria-labelledby="ai-showcase-title">
      <h2 className="ai-showcase-title" id="ai-showcase-title">
        <span>AI</span>
        <span>/AIGC VISUAL</span>
      </h2>

      <div
        className="ai-cylinder-stage"
        ref={stageRef}
        onPointerLeave={() => {
          pausedRef.current = false;
          hoveredCardRef.current = null;
          pointerRef.current.targetX = 0;
          pointerRef.current.targetY = 0;
          if (dragRef.current) {
            const drag = dragRef.current;
            dragRef.current = null;
            settleAfterDrag(drag);
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        aria-label="AI 图片纵向 3D 圆柱轮播，可上下拖动或使用上下按钮切换"
      >
        <div className="ai-cylinder-viewport">
          {AI_ITEMS.map((item, index) => (
            <button
              className="ai-cylinder-card"
              type="button"
              key={`${item.src}-${index}`}
              style={{ "--ai-card-ratio": item.ratio }}
              ref={(element) => { cardRefs.current[index] = element; }}
              onClick={() => openLightbox(index)}
              onPointerEnter={() => { hoveredCardRef.current = index; }}
              onPointerLeave={() => {
                if (hoveredCardRef.current === index) hoveredCardRef.current = null;
                pointerRef.current.targetX = 0;
                pointerRef.current.targetY = 0;
              }}
              aria-label={`放大查看${item.title}`}
            >
              <span
                className="ai-cylinder-card-visual"
                ref={(element) => { visualRefs.current[index] = element; }}
              >
                <span className="ai-cylinder-depth ai-cylinder-depth--back" aria-hidden="true" />
                <span className="ai-cylinder-depth ai-cylinder-depth--middle" aria-hidden="true" />
                <span className={`ai-cylinder-face ai-cylinder-face--${item.fit}`}>
                  <img src={item.src} alt={item.title} loading="lazy" decoding="async" />
                </span>
              </span>
            </button>
          ))}
        </div>

        <button className="ai-cylinder-control ai-cylinder-control--previous" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); moveBy(-1); }} aria-label="上一张 AI 作品">
          <CaretUpIcon size={24} weight="light" aria-hidden="true" />
        </button>
        <button className="ai-cylinder-control ai-cylinder-control--next" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); moveBy(1); }} aria-label="下一张 AI 作品">
          <CaretDownIcon size={24} weight="light" aria-hidden="true" />
        </button>

        <div className="ai-cylinder-counter" aria-live="polite">
          {String(activeIndex + 1).padStart(2, "0")} / {String(AI_ITEMS.length).padStart(2, "0")}
        </div>
      </div>
    </section>
    {lightboxIndex !== null && typeof document !== "undefined"
      ? createPortal(
        <div className="ai-lightbox" role="dialog" aria-modal="true" aria-label="AI 作品大图查看" onClick={() => setLightboxIndex(null)}>
          <button className="ai-lightbox-close" type="button" onClick={() => setLightboxIndex(null)} aria-label="关闭大图">
            <XIcon size={24} weight="light" aria-hidden="true" />
          </button>
          <button className="ai-lightbox-nav ai-lightbox-nav--previous" type="button" onClick={(event) => { event.stopPropagation(); changeLightboxImage(-1); }} aria-label="查看上一张图片">
            <CaretLeftIcon size={30} weight="light" aria-hidden="true" />
          </button>
          <figure className="ai-lightbox-figure" onClick={(event) => event.stopPropagation()}>
            <img src={AI_ITEMS[lightboxIndex].src} alt={AI_ITEMS[lightboxIndex].title} />
            <figcaption>{String(lightboxIndex + 1).padStart(2, "0")} / {String(AI_ITEMS.length).padStart(2, "0")}</figcaption>
          </figure>
          <button className="ai-lightbox-nav ai-lightbox-nav--next" type="button" onClick={(event) => { event.stopPropagation(); changeLightboxImage(1); }} aria-label="查看下一张图片">
            <CaretRightIcon size={30} weight="light" aria-hidden="true" />
          </button>
        </div>,
        document.body,
      )
      : null}
    </>
  );
}
