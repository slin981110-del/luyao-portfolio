# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Approved direction

- Full page: the first result from the six-option Gallery Spine ideation set (`design/reference/selected-gallery-spine.png`).
- Use a persistent desktop vertical index, left-aligned `LUYAO PORTFOLIO`, outlined `L.Y`, silver strand field, portrait-led profile, full-width timeline, three-poster row, and editorial contact footer.
- Keep the site white-dominant, sans-serif, responsive, and smoothly animated.

## Latest visual feedback

- Rebuild the contact finale as a centered white editorial page: oversized `THANKS`, one restrained Chinese supporting line, and two equal copyable contact rows for WeChat `yao731792534` and email `731792534@qq.com`. Use the supplied `已复制.png` as a 1.5-second fade-out confirmation, and preserve the existing footer / `返回顶部` row unchanged.
- Keep the profile software-logo row visually unchanged while using a restrained Dock proximity effect: about 14% maximum magnification within an 85px pointer range.
- On desktop, move the experience section upward by 93px, align its content shell to the profile section's 1540px maximum width, and keep the bottom spacing compact; leave the existing mobile layout unchanged.

- Use a unified portfolio title system: `视频 / VIDEO` and `长图 / LONG IMAGE` use the same two-line hierarchy with a restrained second-line indent; the poster heading reads `海报/POSTER` on one line with the English portion at half the Chinese size.

- Show the supplied longform drag-hint artwork 50px to the left of the Stack on first view, without a looping motion effect; fade it out over 420ms as soon as the Stack advances by click, keyboard, or drag, then remove it permanently.

- The longform phone artwork may bleed only beneath the opaque black bezel: it must cover the transparent screen opening without extending beyond the phone's outer frame.
- Keep the three longform slice shadows at 25% opacity with a compact 21px blur radius.
- Longform Stack cards use a rounded white container that extends 20px beyond the original visual bounds.

- Do not use a silk-line field in the long-form section. Present every image from `D:\作品文件夹\长图` as one full-layout Stack card: phone preview on the left, three consecutive staggered slices on the right, and a 25%-opacity shadow on each right-hand slice. One click or one drag advances exactly one project.

- Keep the work-experience timeline and selected-works poster row that the user approved.
- Recompose the hero, personal profile, education/tools metadata, and contact area to match Gallery Spine.
- Keep the vertical navigation rail visible throughout the desktop page; replace any invented biography details with facts the user has already supplied.
- At wide desktop widths, use an approximately 133px hero inset instead of the narrower 1240px shell.
- Use `LY.` for the outlined hero monogram and position it farther inward from the right edge on wide screens.
- Keep the profile portrait compact at approximately 358px wide on desktop while allowing it to remain fluid on smaller screens.
- In the work-experience timeline, start horizontal separators at the content column so they never cross the vertical timeline. Keep a clear gap around each blue node, and extend the final vertical segment down to the bottom of its accompanying description.
- For upcoming revisions, prioritize the desktop experience only. Preserve the existing mobile implementation, but do not proactively redesign, adapt, or QA mobile layouts unless the user explicitly asks for mobile work again.
- Keep a desktop-first white, scroll-driven archive interlude between work experience and selected works. Reuse the real portfolio posters in a scattered sticky gallery and scale cards as they enter and leave. Do not include a `VIEW` outro button or overlay.
- Give all 11 archive video cards a restrained React Bits-style 3D cursor tilt with spring return, while preserving the scroll-driven scaling and click-to-play modal with audio.
- Keep `04 作品` as a toggleable desktop rail category menu with `视频 / 海报 / 长图 / AI`. The `视频` item links to `#archive`, and the archive section keeps both `04 作品` and `视频` highlighted.
- Label the existing poster gallery `手机海报`; keep its rail category label as `海报`.
- Place a white long-form showcase directly after `手机海报`: supplied phone frame on the left, three staggered right-hand windows showing consecutive slices of the same long image, and link the `长图` rail category to `#longform`.
- Label the archive section `视频作品 / VIDEO` and the static image gallery `平面作品`; keep the second archive title line smaller and indented farther right.
