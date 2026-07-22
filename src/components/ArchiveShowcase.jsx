import { useEffect, useRef, useState } from "react";
import { TiltedCard } from "./TiltedCard";

const archiveItems = [
  { src: "/assets/archive-videos-11/motion-01.mp4", alt: "动态作品 01", position: "one" },
  { src: "/assets/archive-videos-11/motion-02.mp4", alt: "动态作品 02", position: "two" },
  { src: "/assets/archive-videos-11/motion-03.mp4", alt: "动态作品 03", position: "three" },
  { src: "/assets/archive-videos-11/motion-04.mp4", alt: "动态作品 04", position: "four" },
  { src: "/assets/archive-videos-11/motion-05.mp4", alt: "动态作品 05", position: "five" },
  { src: "/assets/archive-videos-11/motion-06.mp4", alt: "动态作品 06", position: "six" },
  { src: "/assets/archive-videos-11/motion-07.mp4", alt: "动态作品 07", position: "seven" },
  { src: "/assets/archive-videos-11/motion-08.mp4", alt: "动态作品 08", position: "eight" },
  { src: "/assets/archive-videos-11/motion-09.mp4", alt: "动态作品 09", position: "nine" },
  { src: "/assets/archive-videos-11/motion-10.mp4", alt: "动态作品 10", position: "ten" },
  { src: "/assets/archive-videos-11/motion-11.mp4", alt: "动态作品 11", position: "eleven" },
];

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const isNearViewport = (video) => {
  const rect = video.getBoundingClientRect();
  const margin = window.innerHeight * 0.18;
  return rect.bottom >= -margin && rect.top <= window.innerHeight + margin;
};

export function ArchiveShowcase() {
  const sectionRef = useRef(null);
  const flowRef = useRef(null);
  const cardRefs = useRef([]);
  const videoRefs = useRef([]);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const section = sectionRef.current;
    const flow = flowRef.current;
    if (!section || !flow) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const render = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const rect = section.getBoundingClientRect();
      const range = Math.max(section.offsetHeight - viewportHeight, 1);
      const progress = reduced ? 0.46 : clamp(-rect.top / range);
      const travel = viewportHeight * 3.48;
      const offset = viewportHeight * 0.18 - progress * travel;

      flow.style.transform = `translate3d(0, ${offset}px, 0)`;
      section.style.setProperty("--archive-progress", progress.toFixed(4));
      const stageTop = flow.parentElement.getBoundingClientRect().top;

      cardRefs.current.forEach((card) => {
        if (!card) return;
        const cardTop = stageTop + card.offsetTop + offset;
        const cardBottom = cardTop + card.offsetHeight;
        const enter = clamp((viewportHeight - cardTop) / (viewportHeight * 0.58));
        const exit = clamp(cardBottom / (viewportHeight * 0.42));
        const scale = reduced ? 0.84 : Math.min(enter, exit);
        card.style.setProperty("--card-scale", scale.toFixed(4));
        card.style.setProperty("--card-opacity", clamp(scale * 1.35).toFixed(4));
      });
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting && !activeVideo) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      });
    }, { rootMargin: "18% 0px", threshold: 0.12 });

    videos.forEach((video) => observer.observe(video));
    return () => {
      observer.disconnect();
      videos.forEach((video) => video.pause());
    };
  }, [activeVideo]);

  useEffect(() => {
    if (!activeVideo) {
      videoRefs.current.filter(Boolean).forEach((video) => {
        if (isNearViewport(video)) video.play().catch(() => undefined);
      });
      return undefined;
    }

    document.body.classList.add("no-scroll");
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("no-scroll");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeVideo]);

  return (
    <>
      <section className="archive-interlude" id="archive" ref={sectionRef} aria-label="动态作品画廊">
        <div className="archive-stage">
          <header className="archive-stage-header" aria-hidden="true">
            <span>LUYAO / ARCHIVE</span>
            <span>SCROLL TO EXPLORE</span>
          </header>

          <div className="archive-flow" ref={flowRef}>
            {archiveItems.map((item, index) => (
              <button
                className={`archive-card archive-card--${item.position}`}
                key={`${item.position}-${item.src}`}
                ref={(element) => { cardRefs.current[index] = element; }}
                type="button"
                onClick={() => setActiveVideo(item)}
                aria-label={`播放 ${item.alt}`}
              >
                <TiltedCard
                  captionText={item.alt}
                  rotateAmplitude={9}
                  scaleOnHover={1.045}
                  showTooltip={false}
                >
                  <video
                    ref={(element) => { videoRefs.current[index] = element; }}
                    src={item.src}
                    aria-hidden="true"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <span className="archive-card-count">
                    {String(index + 1).padStart(2, "0")} / {String(archiveItems.length).padStart(2, "0")}
                  </span>
                </TiltedCard>
              </button>
            ))}
          </div>
          <div className="archive-progress" aria-hidden="true">
            <span>视频</span>
            <span>VIDEO</span>
          </div>
        </div>
      </section>

      {activeVideo ? (
        <div
          className="archive-video-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeVideo.alt} 播放器`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveVideo(null);
          }}
        >
          <div className="archive-video-dialog">
            <button
              className="archive-video-close"
              type="button"
              onClick={() => setActiveVideo(null)}
              autoFocus
              aria-label="关闭视频"
            >
              关闭 <span aria-hidden="true">×</span>
            </button>
            <video
              className="archive-video-player"
              src={activeVideo.src}
              controls
              autoPlay
              playsInline
              preload="auto"
            />
            <div className="archive-video-meta">
              <span>LUYAO / MOTION WORK</span>
              <strong>{activeVideo.alt}</strong>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
