import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  BriefcaseIcon,
  EnvelopeSimpleIcon,
  GraduationCapIcon,
  MapPinIcon,
  ToolboxIcon,
} from "@phosphor-icons/react";
import { ArchiveShowcase } from "./components/ArchiveShowcase";
import { Stack } from "./components/Stack";
import { LineSidebar } from "./components/LineSidebar";
import { AICylinderShowcase } from "./components/AICylinderShowcase";
import { SoftwareDock } from "./components/SoftwareDock";

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const experiences = [
  {
    period: "2023.10 — 2025.05",
    company: "济南中奥广告传媒有限公司",
    role: "平面设计师 · 电商视觉",
    summary: "围绕运营策略与产品卖点，独立完成产品图、活动视觉及多类目电商素材；在大促与销售高峰期直接对接客户需求，快速输出定制化设计方案，兼顾品牌调性、用户体验与订单转化。",
  },
  {
    period: "2020.07 — 2023.06",
    company: "济南嘉合不锈钢制品有限公司",
    role: "产品方案设计 · 项目协同",
    summary: "依据客户需求提供定制化产品建议并完成设计深化，统筹供应链沟通、生产工期与品质把控，推动方案按时落地；持续维护客户关系与后期支持，促进长期合作与复购。",
  },
];

const works = Array.from({ length: 42 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  const extension = index === 30 ? "png" : "jpg";
  return {
    src: assetUrl(`/assets/works-gallery/work-${number}.${extension}`),
    title: `视觉作品 ${number}`,
    type: "品牌视觉 / 海报设计",
  };
});

const softwareLogos = [
  { src: assetUrl("/assets/software-logos/photoshop.png"), name: "Photoshop" },
  { src: assetUrl("/assets/software-logos/illustrator.png"), name: "Illustrator" },
  { src: assetUrl("/assets/software-logos/after-effects.png"), name: "After Effects" },
  { src: assetUrl("/assets/software-logos/chatgpt.png"), name: "ChatGPT" },
  { src: assetUrl("/assets/software-logos/midjourney.png"), name: "Midjourney" },
  { src: assetUrl("/assets/software-logos/jimeng.png"), name: "即梦" },
  { src: assetUrl("/assets/software-logos/capcut.png"), name: "剪映" },
  { src: assetUrl("/assets/software-logos/figma.png"), name: "Figma" },
];

const profileFacts = [
  {
    icon: GraduationCapIcon,
    label: "教育背景",
    primary: "潍坊职业学院",
    secondary: "数字媒体应用技术",
  },
  {
    icon: MapPinIcon,
    label: "工作地点",
    primary: "山东 · 济南",
    secondary: "可接受项目合作",
  },
  {
    icon: BriefcaseIcon,
    label: "设计方向",
    primary: "品牌视觉 · 电商设计",
    secondary: "印刷与视觉落地",
  },
  {
    icon: ToolboxIcon,
    label: "专业工具",
    primary: "PS · AI · AE · Figma",
    secondary: "AIGC 辅助设计",
  },
];

function StrandsCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    let time = 0;
    const pointer = { x: 0.72, y: 0.46, tx: 0.72, ty: 0.46 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = (event.clientX - rect.left) / rect.width;
      pointer.ty = (event.clientY - rect.top) / rect.height;
    };
    const draw = () => {
      pointer.x += (pointer.tx - pointer.x) * 0.035;
      pointer.y += (pointer.ty - pointer.y) * 0.035;
      time += reduced ? 0 : 0.008;
      context.clearRect(0, 0, width, height);
      const count = width < 720 ? 16 : 28;
      for (let strand = 0; strand < count; strand += 1) {
        const ratio = strand / Math.max(count - 1, 1);
        context.beginPath();
        for (let step = 0; step <= 80; step += 1) {
          const xRatio = step / 80;
          const x = xRatio * width;
          const envelope = Math.sin(xRatio * Math.PI);
          const flow = Math.sin(xRatio * 5.4 + time * 2.1 + ratio * 1.8);
          const cursorPull = (pointer.y - 0.5) * height * envelope * 0.2;
          const base = height * (0.45 + (ratio - 0.5) * 0.19);
          const y = base + flow * height * 0.058 * envelope + cursorPull;
          if (step === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        const blue = strand === Math.floor(count * 0.62);
        context.strokeStyle = blue ? "rgba(45,103,255,.34)" : `rgba(127,137,153,${0.055 + ratio * 0.05})`;
        context.lineWidth = blue ? 1 : 0.7;
        context.stroke();
      }
      frame = window.requestAnimationFrame(draw);
    };

    resize();
    canvas.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", resize);
    draw();
    return () => {
      window.cancelAnimationFrame(frame);
      canvas.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas className="strands" ref={canvasRef} aria-hidden="true" />;
}

function SideRail({ active }) {
  const [worksOpen, setWorksOpen] = useState(false);
  const links = [
    ["首页", "top"],
    ["个人", "resume"],
    ["经历", "experience"],
    ["作品", "works"],
    ["联系", "contact"],
  ];
  const activeIndex = links.findIndex(([, id]) =>
    id === "works"
      ? active === "works" || active === "archive" || active === "longform" || active === "ai"
      : active === id,
  );

  const handleItemClick = (index) => {
    const [, id] = links[index];
    if (id === "works") {
      setWorksOpen((value) => !value);
      return;
    }
    window.location.hash = id;
  };

  return (
    <aside className="side-rail" aria-label="页面导航">
      <a className="rail-brand" href="#top">LUYAO</a>
      <div className="rail-navigation">
        <LineSidebar
          items={links.map(([label]) => label)}
          accentColor="#2d67ff"
          textColor="#89909b"
          markerColor="#c3c8d1"
          proximityRadius={92}
          maxShift={8}
          markerLength={20}
          markerGap={5}
          tickScale={0.45}
          itemGap={20}
          fontSize={0.58}
          smoothing={120}
          activeIndex={activeIndex < 0 ? null : activeIndex}
          onItemClick={handleItemClick}
          className="portfolio-line-sidebar"
        />
        {worksOpen ? (
          <div className="rail-subnav" id="works-categories" aria-label="作品分类">
            <a className={active === "archive" ? "is-active" : ""} href="#archive">视频</a>
            <a className={active === "works" ? "is-active" : ""} href="#works">海报</a>
            <a className={active === "longform" ? "is-active" : ""} href="#longform">长图</a>
            <a className={active === "ai" ? "is-active" : ""} href="#ai">AI</a>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

function WorkCard({ item, onOpen }) {
  const ref = useRef(null);
  const onMove = (event) => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    element.style.setProperty("--rx", `${y * -3}deg`);
    element.style.setProperty("--ry", `${x * 3}deg`);
    element.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    element.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };
  return (
    <article className="work-card">
      <button
        ref={ref}
        className="work-visual"
        type="button"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={() => onOpen(item)}
        aria-label={`查看作品：${item.title}`}
      >
        <img src={item.src} alt={item.title} loading="lazy" decoding="async" />
        <span className="work-overlay"><strong>{item.title}</strong><small>{item.type}</small></span>
      </button>
    </article>
  );
}

const longformProjects = [
  { src: assetUrl("/assets/longform/longform-01.jpg"), title: "长图作品 01" },
  { src: assetUrl("/assets/longform/longform-02.jpg"), title: "长图作品 02" },
  { src: assetUrl("/assets/longform/longform-03.jpg"), title: "长图作品 03" },
  { src: assetUrl("/assets/longform/longform-04.jpg"), title: "长图作品 04" },
  { src: assetUrl("/assets/longform/longform-05.jpg"), title: "长图作品 05" },
  { src: assetUrl("/assets/longform/longform-06.jpg"), title: "长图作品 06" },
];

function LongformProject({ project }) {
  return (
    <div className="longform-layout">
      <figure className="longform-device">
        <div className="longform-device-screen">
          <img src={project.src} alt={`${project.title}顶部预览`} loading="lazy" decoding="async" />
        </div>
        <img
          className="longform-device-frame"
          src={assetUrl("/assets/longform/phone-frame.png")}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
      </figure>

      <div className="longform-slices" aria-label={`${project.title}连续内容预览`}>
        {[0, 1, 2].map((index) => (
          <figure className={`longform-slice longform-slice--${index + 1}`} key={index}>
            <img
              src={project.src}
              alt={index === 0 ? `${project.title}连续预览` : ""}
              aria-hidden={index > 0 ? "true" : undefined}
              loading="lazy"
              decoding="async"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}

function LongformShowcase() {
  const [showDragHint, setShowDragHint] = useState(true);
  const [isDragHintFading, setIsDragHintFading] = useState(false);
  const dragHintTimerRef = useRef(null);
  const cards = useMemo(
    () => [...longformProjects].reverse().map((project) => (
      <LongformProject project={project} key={project.src} />
    )),
    [],
  );

  useEffect(() => () => {
    if (dragHintTimerRef.current) window.clearTimeout(dragHintTimerRef.current);
  }, []);

  const hideDragHint = () => {
    if (!showDragHint || isDragHintFading) return;
    setIsDragHintFading(true);
    dragHintTimerRef.current = window.setTimeout(() => {
      setShowDragHint(false);
      dragHintTimerRef.current = null;
    }, 420);
  };

  return (
    <section className="longform section" id="longform" aria-labelledby="longform-title">
      <h2 className="longform-title" id="longform-title">
        <span>长图</span>
        <span>LONG IMAGE</span>
      </h2>
      <div className="section-shell longform-stack-shell">
        {showDragHint ? (
          <img
            className={`longform-drag-hint ${isDragHintFading ? "is-fading" : ""}`}
            src={assetUrl("/assets/longform/drag-hint.png")}
            alt=""
            aria-hidden="true"
          />
        ) : null}
        <Stack
          cards={cards}
          sensitivity={150}
          sendToBackOnClick
          onAdvance={hideDragHint}
          animationConfig={{ stiffness: 210, damping: 24 }}
        />
      </div>
    </section>
  );
}

function ContactSection() {
  const [copiedContact, setCopiedContact] = useState(null);
  const copyTimerRef = useRef(null);

  useEffect(() => () => window.clearTimeout(copyTimerRef.current), []);

  const copyContact = async (value) => {
    const fallback = document.createElement("textarea");
    fallback.value = value;
    fallback.setAttribute("readonly", "");
    fallback.style.position = "fixed";
    fallback.style.opacity = "0";
    document.body.appendChild(fallback);
    fallback.select();
    document.execCommand("copy");
    fallback.remove();

    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(value);
    } catch {}

    const headingRect = document.querySelector(".contact-thanks")?.getBoundingClientRect();
    const toastTop = headingRect ? headingRect.top - 40 : window.innerHeight / 2;
    const toastLeft = headingRect ? headingRect.left + headingRect.width / 2 : window.innerWidth / 2;

    window.clearTimeout(copyTimerRef.current);
    setCopiedContact({ value, toastTop, toastLeft, id: `${Date.now()}-${Math.random()}` });
    copyTimerRef.current = window.setTimeout(() => setCopiedContact(null), 1500);
  };

  return (
    <section className="contact section" id="contact" aria-labelledby="contact-title">
      <div className="section-shell contact-grid">
        <div className="contact-statement">
          <h2 id="contact-title" className="contact-thanks">THANKS</h2>
          <p className="contact-message">好的想法 值得被认真呈现 期待与你一起创造</p>
        </div>
        <div className="contact-details" aria-label="联系方式">
          <button type="button" className="contact-copy" onClick={() => copyContact("yao731792534")} aria-label="复制微信号 yao731792534">
            <img className="contact-wechat-icon" src={assetUrl("/assets/ui/wechat-contact.png")} alt="" aria-hidden="true" />
            <span>yao731792534</span>
            <ArrowRightIcon size={28} weight="light" aria-hidden="true" />
          </button>
          <button type="button" className="contact-copy" onClick={() => copyContact("731792534@qq.com")} aria-label="复制邮箱 731792534@qq.com">
            <EnvelopeSimpleIcon size={36} weight="regular" aria-hidden="true" />
            <span>731792534@qq.com</span>
            <ArrowRightIcon size={28} weight="light" aria-hidden="true" />
          </button>
        </div>
      </div>

      {copiedContact
        ? createPortal(
            <div
              key={copiedContact.id}
              className="copy-toast"
              role="status"
              aria-live="polite"
              aria-label={`${copiedContact.value} 已复制`}
              style={{
                "--copy-toast-top": `${copiedContact.toastTop}px`,
                "--copy-toast-left": `${copiedContact.toastLeft}px`,
              }}
            >
              <img src={assetUrl("/assets/ui/copied.png")} alt="已复制" />
            </div>,
            document.body,
          )
        : null}

      <footer className="footer section-shell">
        <span>© {new Date().getFullYear()} 路瑶 · 平面设计师</span>
        <a href="#top">返回顶部 ↑</a>
      </footer>
    </section>
  );
}

export function App() {
  const [active, setActive] = useState("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const [worksExpanded, setWorksExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const lightbox = lightboxIndex === null ? null : works[lightboxIndex];

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    let firstFrame = 0;
    let secondFrame = 0;
    const showHomepage = () => {
      const target = document.getElementById("top");
      if (!target) return;
      const previous = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      setActive("top");
      window.requestAnimationFrame(() => {
        target.querySelectorAll(".reveal").forEach((element) => {
          const rect = element.getBoundingClientRect();
          if (rect.top < window.innerHeight * 1.08 && rect.bottom > 0) element.classList.add("is-visible");
        });
        document.documentElement.style.scrollBehavior = previous;
      });
    };
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.search}#top`,
    );
    showHomepage();
    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(showHomepage);
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.1, rootMargin: "0px 0px -6%" },
    );
    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
    const sections = [...document.querySelectorAll("main > section[id]")];
    const updateActive = () => {
      const marker = window.scrollY + window.innerHeight * 0.38;
      const current = sections.reduce((match, section) => (section.offsetTop <= marker ? section : match), sections[0]);
      if (current?.id) setActive(current.id);
    };
    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", updateActive);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (lightboxIndex === null) return;
      if (event.key === "ArrowLeft") {
        setLightboxIndex((index) => (index - 1 + works.length) % works.length);
      }
      if (event.key === "ArrowRight") {
        setLightboxIndex((index) => (index + 1) % works.length);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.classList.toggle("no-scroll", Boolean(lightbox || menuOpen));
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox, lightboxIndex, menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <a className="skip-link" href="#resume">跳至主要内容</a>
      <SideRail active={active} />
      <header className="mobile-header">
        <a href="#top" onClick={closeMenu}>LUYAO</a>
        <button type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen}>
          {menuOpen ? "关闭" : "菜单"}
        </button>
      </header>
      <nav className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-label="移动端导航">
        <a href="#top" onClick={closeMenu}>首页</a>
        <a href="#resume" onClick={closeMenu}>个人简介</a>
        <a href="#experience" onClick={closeMenu}>工作经历</a>
        <a href="#works" onClick={closeMenu}>精选作品</a>
        <a href="#contact" onClick={closeMenu}>联系方式</a>
      </nav>

      <main>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <StrandsCanvas />
          <div className="hero-mark" aria-hidden="true">LY.</div>
          <div className="hero-copy">
            <h1 id="hero-title"><span>LUYAO</span><span>PORTFOLIO</span></h1>
            <p className="hero-role">平面设计师</p>
            <p className="hero-summary">平面设计的秩序与想象。<br />让信息被清晰感知，让美被认真对待。</p>
            <a className="explore-link" href="#resume">向下探索 <ArrowDownIcon size={14} aria-hidden="true" /></a>
          </div>
        </section>

        <section className="profile-section section" id="resume" aria-labelledby="profile-title">
          <div className="section-shell">
            <div className="profile-grid">
              <div className="profile-media reveal">
                <p className="eyebrow">02 / PROFILE</p>
                <figure className="profile-portrait">
                  <img src={assetUrl("/assets/profile/editorial-portrait.png")} alt="黑白编辑风格人物形象" />
                </figure>
              </div>
              <div className="profile-copy reveal">
                <h2 id="profile-title">路瑶</h2>
                <p className="profile-role">平面设计师</p>
                <strong>4 年设计经验</strong>
                <span className="accent-rule" aria-hidden="true" />
                <p>专注于品牌视觉、电商设计与印刷落地，将创意转化为清晰、有吸引力且能够真正执行的视觉方案。</p>
                <p>熟悉 Photoshop、Illustrator、After Effects 与 Figma，也持续将 ChatGPT、即梦、Nano Banana 等 AIGC 工具融入设计流程，关注动态图形与 3D 视觉的发展。</p>
                <SoftwareDock logos={softwareLogos} />
              </div>
            </div>
            <div className="facts-grid reveal" aria-label="个人信息概览">
              {profileFacts.map(({ icon: Icon, label, primary, secondary }) => (
                <article className="fact" key={label}>
                  <Icon size={24} weight="regular" aria-hidden="true" />
                  <div>
                    <span>{label}</span>
                    <strong>{primary}</strong>
                    <strong>{secondary}</strong>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="experience-section section" id="experience" aria-labelledby="experience-title">
          <div className="section-shell">
            <header className="section-heading reveal"><h2 id="experience-title">工作经历</h2></header>
            <div className="experience-list">
              {experiences.map((item) => (
                <article className="experience-entry reveal" key={item.company}>
                  <span className="timeline-node" aria-hidden="true" />
                  <div>
                    <h3>{item.company}</h3>
                    <strong>{item.role}</strong>
                    <p>{item.summary}</p>
                  </div>
                  <time>{item.period}</time>
                </article>
              ))}
            </div>
          </div>
        </section>

        <ArchiveShowcase />

        <section className="works section" id="works" aria-labelledby="works-title">
          <div className="section-shell">
            <header className="section-heading reveal">
              <h2 id="works-title"><span>海报</span><span className="works-title-en">/POSTER</span></h2>
            </header>
            <div className="works-grid" id="works-gallery">
              {works.slice(0, 9).map((item, index) => (
                <WorkCard item={item} onOpen={() => setLightboxIndex(index)} key={item.src} />
              ))}
            </div>
            {!worksExpanded ? (
              <button
                className="works-expand"
                type="button"
                onClick={() => setWorksExpanded(true)}
                aria-expanded="false"
                aria-controls="works-gallery-extra"
              >
                <span>展开</span>
                <CaretDownIcon size={27} weight="light" aria-hidden="true" />
              </button>
            ) : null}
            {worksExpanded ? (
              <div className="works-grid works-grid--expanded" id="works-gallery-extra">
                {works.slice(9).map((item, index) => (
                  <WorkCard item={item} onOpen={() => setLightboxIndex(index + 9)} key={item.src} />
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <LongformShowcase />

        <AICylinderShowcase />

        <ContactSection />
      </main>

      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={lightbox.title} onMouseDown={(event) => { if (event.target === event.currentTarget) setLightboxIndex(null); }}>
          <button type="button" className="lightbox-close" onClick={() => setLightboxIndex(null)}>关闭</button>
          <button
            type="button"
            className="lightbox-nav lightbox-nav--previous"
            onClick={() => setLightboxIndex((index) => (index - 1 + works.length) % works.length)}
            aria-label="上一张作品"
          >
            <CaretLeftIcon size={34} weight="light" aria-hidden="true" />
          </button>
          <figure>
            <img src={lightbox.src} alt={lightbox.title} />
            <figcaption>
              <strong>{lightbox.title}</strong>
              <span>{String(lightboxIndex + 1).padStart(2, "0")} / {String(works.length).padStart(2, "0")}</span>
            </figcaption>
          </figure>
          <button
            type="button"
            className="lightbox-nav lightbox-nav--next"
            onClick={() => setLightboxIndex((index) => (index + 1) % works.length)}
            aria-label="下一张作品"
          >
            <CaretRightIcon size={34} weight="light" aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  );
}
