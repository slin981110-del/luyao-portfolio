# Design QA — Contact finale

- source visual truth: `C:\Users\GYSTUDIO\AppData\Local\Temp\codex-clipboard-dbec4d2c-4482-452d-b8ef-98f43a00ab1a.png`
- implementation URL: `http://127.0.0.1:4173/#contact`
- implementation screenshot: `C:\Users\GYSTUDIO\AppData\Local\Temp\luyao-contact-final-v2.png`
- normalized comparison: `C:\Users\GYSTUDIO\AppData\Local\Temp\luyao-contact-comparison-v2.png`
- validation viewport: 1280 × 720 CSS px, desktop, light theme
- reference size: 2048 × 1152 px (same 16:9 aspect ratio)

## Visual comparison

The reference and implementation were normalized to the same 16:9 dimensions and reviewed side by side. The implementation preserves the reference hierarchy: oversized light-weight `THANKS`, one subordinate Chinese statement, then two equal contact actions. The supporting statement now uses a responsive size capped at 43 px and a fixed 38 px top margin, matching the approved desktop annotation.

The supplied WeChat raster icon is used directly from `/assets/ui/wechat-contact.png`. It is displayed at 36 × 36 CSS px and remains aligned with the contact text and arrow.

## Copy confirmation

- The supplied `已复制` artwork is rendered at 134.4 px wide in the validation viewport, approximately one third smaller than its previous maximum presentation.
- The confirmation is portaled to `document.body` and positioned from the live `THANKS` heading geometry.
- Measured gap between the confirmation icon's bottom edge and the `THANKS` heading's top edge: exactly 40 px.
- Every click creates a new keyed confirmation instance, so repeated clicks on the same contact replay the prompt.
- It fades out and is removed after 1.5 seconds.

## Interaction and quality checks

- WeChat copy button copies `yao731792534`.
- Email copy button copies `731792534@qq.com`; Windows clipboard verified.
- Existing footer and `返回顶部 ↑` row remain unchanged.
- Browser console warnings/errors: none.
- Production build: passed with Vite 6.4.2.

## Findings

No actionable P0/P1/P2 mismatches remain.

final result: passed
