# Idea to Identity: React build brief

## Goal
Port the single-file HTML site in the "Reference source" section at the bottom of this file into a **Vite + React** app. Keep the design, copy, colours, spacing and every animation **identical**. This is a port, not a redesign.

## Stack
- Vite + React (JavaScript)
- `gsap`, `@gsap/react` (useGSAP), `ScrollTrigger`, `lenis`
- Plain CSS in `src/styles/global.css` (reuse the CSS from the reference, split per component only if easy)
- Font: Archivo variable (wdth 62-125, wght 100-900) via the Google Fonts `<link>` in `index.html`. Do not swap the font.

Setup: `npm create vite@latest idea-to-identity -- --template react`, then `npm i gsap @gsap/react lenis`.

## Design tokens
ink #0A0D04, olive #1A2209, ivory #FAFFF3, lime #C0F53D (also the logo colour). Display style `.d` = Archivo, uppercase, `font-variation-settings: "wdth" var(--w), "wght" var(--t)`. Brand idea: the logo is four blocks (ivory square top-left, lime tall bar left, lime tall bar right, ivory square bottom-right).

## Components (src/components)
Preloader, Nav, Hero, Statement, Marquee, Services, Work (bento), Process, Pricing, Contact, Footer, Cursor. Data in `src/data/packages.js`. Hook `src/hooks/useLenis.js`.

## Behaviours that must be kept
1. **Preloader to hero flight:** the four logo blocks assemble in the centre of a dark screen, the dark screen fades, and the blocks fly to the hero mark position (read with getBoundingClientRect on a shared `heroMarkRef`), then swap for the real hero mark. App holds the ref and a `ready` state.
2. **Hero headline morph:** each line animates CSS variables `--w` 100 to 62 and `--t` 100 to 900 (thin and wide to heavy and condensed) with stagger. Lines rise in from a mask.
3. **Hero scroll transition (do not change):** hero is pinned; scrolling scales the right lime block until it floods the viewport and turns lime, while headline, subtext, badge and the other blocks fade. The next section (Statement) has a lime background.
4. Statement: words light up one by one on scroll (scrub).
5. Marquee: outlined giant text moves horizontally with scroll (scrub).
6. Services rows: on hover the title morphs wider and lighter (`--w:125; --t:300`) and turns lime.
7. Work bento (12-col grid): tiles reveal with clip-path, inner art has scroll parallax, desktop custom cursor shows "View" / "Talk" over tiles. Concepts are labelled "Self-initiated concept".
8. Process: outlined step titles fill solid as each step scrolls into the middle.
9. Pricing: 3-button package selector (Brand identity 20,000 / Website 45,000 / Brand + website 60,000). Selected package drives one panel: price count-up, timeline bar (43%, 71%, 100%), included list, best-for line, and a button that preselects that package in the contact form and scrolls to it. Below: 50/30/20 payment bar and 4 assumption notes. Mobile: single column, payment bar becomes rows.
10. Contact: 3-step form with progress bar (1 service, 2 budget, 3 name/email/business/message). Tapping an option on steps 1-2 advances automatically. Back button, validation, success message. In the reference it opens a mailto link; **in React send it to a real endpoint (Formspree or Web3Forms) via fetch and show success/error states.**
11. Nav: floating glass bar (backdrop blur). Only the wordmark shows at the top; the small logo icon slides in after scrolling 60px. Mobile shows only the "Start a project" button.
12. Footer: columns (about, studio links, services, contact and socials), faint giant "IDEA TO IDENTITY" wordmark (opacity .07) placed behind the content.
13. Global: film-grain overlay, smooth scroll (Lenis wired to ScrollTrigger), `prefers-reduced-motion` support, fully responsive down to 360px.

## Rules for the agent
- Do one task at a time and run the dev server to check it before moving on.
- Create and clean up animations inside `useGSAP` with a scope ref. Register ScrollTrigger once.
- Do not add UI libraries. Do not change copy, colours or layout.
- Keep accessibility: visible focus, labels on inputs, aria on tabs.

## Task order
1. Project setup, global.css, App, Nav, Preloader, Hero (including the flight and the pinned transition)
2. Statement, Marquee, Services
3. Work (bento) and Cursor
4. Process and Pricing
5. Contact (stepped form, real endpoint) and Footer
6. Mobile pass at 360px, 390px and 768px, then fix issues

## Placeholders to replace before launch
Email `hello@ideatoidentity.com`, LinkedIn, Behance and Instagram links, form endpoint, concept project names (Verdant, Atelier Nord, Orbit) and later real case studies.

## First prompt to give the agent
"Read `idea-to-identity-antigravity-brief.md` fully. Do Task 1 only. Port the reference source exactly. Run the dev server and tell me what to check."

---

## Reference source (single-file HTML, the source of truth for CSS, copy and animation)

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Idea to Identity | Brand identity and websites, designed as one</title>
<meta name="description" content="Thoughtful brand identities and high-performing websites that help businesses communicate their value and earn customer trust.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap" rel="stylesheet">
<style>
:root{--ink:#0A0D04;--olive:#1A2209;--ivory:#FAFFF3;--lime:#C0F53D;--logo:#C0F53D;--mute:rgba(250,255,243,.6);--ln:rgba(250,255,243,.22);--f:"Archivo","Helvetica Neue",Arial,sans-serif;
box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--ink:#0A0D04}}
:root[data-theme="dark"]{--ink:#0A0D04}
*{box-sizing:border-box;margin:0}
html{scroll-padding-top:env(safe-area-inset-top,0px)}
body{background:var(--ink);color:var(--ivory);font-family:var(--f);font-size:17px;line-height:1.5;overflow-x:hidden;-webkit-font-smoothing:antialiased}
body::after{content:"";position:fixed;inset:0;z-index:95;pointer-events:none;opacity:.07;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
a{color:inherit;text-decoration:none}
button,input,textarea{font:inherit;color:inherit}
:focus-visible{outline:2px solid var(--lime);outline-offset:3px}
.d{font-weight:900;font-stretch:62%;font-style:normal;font-variation-settings:"wdth" var(--w,62),"wght" var(--t,900);text-transform:uppercase;line-height:.86;letter-spacing:-.01em}
.pad{padding-inline:clamp(18px,3.4vw,52px)}
section{padding-block:clamp(70px,10vw,140px)}
h2.d{font-size:clamp(40px,7vw,116px);margin-bottom:clamp(36px,5vw,76px)}
.btn{display:inline-flex;align-items:center;justify-content:center;padding:16px 28px;border:0;border-radius:99px;background:var(--lime);color:var(--ink);font-weight:700;font-size:16px;cursor:pointer;transition:background .3s,color .3s}
.btn:hover{background:var(--ivory)}
#pre{position:fixed;inset:0;z-index:100;background:var(--ink);display:flex;align-items:flex-end;justify-content:center;padding:clamp(22px,4vw,56px);animation:gone 0s 5s forwards}
#pre small{font-size:14px;color:var(--mute)}
#pm{position:fixed;right:auto;left:0;top:0;z-index:101;animation:gone 0s 5s forwards}
@keyframes gone{to{visibility:hidden}}
/* nav */
nav{position:fixed;z-index:60;top:calc(env(safe-area-inset-top,0px) + 10px);left:clamp(10px,2vw,28px);right:clamp(10px,2vw,28px);display:flex;justify-content:space-between;align-items:center;padding:8px 8px 8px 18px;border-radius:22px;background:linear-gradient(180deg,rgba(250,255,243,.1),rgba(250,255,243,.03)),rgba(10,13,4,.55);-webkit-backdrop-filter:blur(22px) saturate(1.6);backdrop-filter:blur(22px) saturate(1.6);border:1px solid rgba(250,255,243,.16);box-shadow:inset 0 1px 0 rgba(250,255,243,.14),0 14px 40px rgba(0,0,0,.28)}
.lg{display:flex;align-items:center;font-weight:800;font-size:13px;line-height:1.05}
.lg svg{width:0;height:auto;opacity:0;margin-right:0;transition:width .5s cubic-bezier(.2,.8,.2,1),margin .5s cubic-bezier(.2,.8,.2,1),opacity .5s}
nav.sc .lg svg{width:17px;margin-right:11px;opacity:1}
.nl{display:flex;gap:28px;align-items:center;font-size:15px;font-weight:500;color:var(--ivory)}
.nl a:hover{text-decoration:underline;text-underline-offset:5px}
.nb{background:var(--lime);color:var(--ink)!important;mix-blend-mode:normal;padding:11px 20px;border-radius:99px;font-weight:700}
@media(max-width:760px){.nl a:not(.nb){display:none}.nb{padding:10px 16px;font-size:14px}}
/* hero */
.hero{height:100svh;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding-bottom:clamp(22px,3.4vw,48px);background:radial-gradient(60% 55% at 78% 40%,rgba(192,245,61,.14),transparent 70%),repeating-linear-gradient(90deg,transparent 0 calc(8.333% - 1px),rgba(250,255,243,.05) calc(8.333% - 1px) 8.333%)}
.hero h1{font-size:clamp(44px,9.2vw,168px);position:relative;z-index:3;white-space:nowrap}
.hero h1 span{display:block;overflow:hidden;padding-top:.04em}
.hero h1 i{font-style:normal}
.pill{position:absolute;z-index:3;left:clamp(18px,3.4vw,52px);top:clamp(88px,15svh,150px);display:flex;gap:10px;align-items:center;font-size:14px;font-weight:500;color:var(--mute);max-width:56vw}
.pill::before{content:"";width:8px;height:8px;flex:none;background:var(--logo);animation:pl 1.8s infinite}
@keyframes pl{50%{opacity:.25}}
.sub{position:relative;z-index:3;display:flex;justify-content:space-between;align-items:flex-end;gap:26px;margin-top:clamp(20px,3vw,38px);flex-wrap:wrap}
.sub p{max-width:42ch;font-size:clamp(16px,1.5vw,20px);color:var(--mute)}
.mark{position:absolute;right:clamp(18px,7vw,130px);top:15svh;width:min(30vw,400px);aspect-ratio:42/86;z-index:2}
.mark i{position:absolute;display:block;background:var(--logo);width:42.86%}
.mk-a{left:0;top:0;height:20.93%;background:var(--ivory)!important}
.mk-b{left:0;top:27.9%;height:72.1%}
.mk-c{left:57.14%;top:0;height:72.1%}
.mk-d{left:57.14%;top:79.1%;height:20.93%;background:var(--ivory)!important}
.bw{position:absolute;z-index:3;right:clamp(18px,3vw,60px);bottom:clamp(110px,22svh,230px);width:clamp(96px,9vw,136px)}
.bw svg{width:100%;animation:spin 18s linear infinite}
.bw text{font-size:9px;font-weight:600;fill:var(--ivory);letter-spacing:1.6px;text-transform:uppercase}
@keyframes spin{to{transform:rotate(360deg)}}
.cue{position:absolute;z-index:3;left:50%;bottom:clamp(22px,3.4vw,48px);font-size:13px;color:var(--mute);display:flex;flex-direction:column;align-items:center;gap:8px}
.cue::after{content:"";width:1px;height:42px;background:linear-gradient(var(--lime),transparent);animation:cu 1.8s infinite}
@keyframes cu{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
@media(max-width:760px){.hero h1{font-size:12.4vw}.mark{width:30vw;top:13svh}.bw,.cue{display:none}.pill{top:14svh;max-width:48vw;font-size:13px}}
/* statement + marquee */
.st{background:var(--lime);color:var(--ink);padding-block:clamp(90px,14vw,200px)}
.st p{font-size:clamp(32px,5vw,80px);font-weight:600;font-stretch:80%;line-height:1;letter-spacing:-.02em;max-width:19ch}
.st .w{opacity:.2}
.st small{display:block;margin-top:40px;font-size:clamp(16px,1.4vw,19px);max-width:46ch;color:rgba(10,13,4,.75)}
.mq{overflow:hidden;padding-block:clamp(36px,5vw,70px);white-space:nowrap}
.mq div{display:inline-block;font-size:clamp(60px,11vw,190px);-webkit-text-stroke:1.5px var(--ivory);color:transparent;padding-right:.5em}
.mq div b{color:var(--lime);-webkit-text-stroke:0}
/* services */
.rw{display:grid;grid-template-columns:1fr 1fr;gap:18px 40px;padding:clamp(22px,3vw,38px) 0;border-top:1px solid var(--ln);align-items:end}
.rw:last-child{border-bottom:1px solid var(--ln)}
.rw h3{font-size:clamp(34px,5vw,80px);transition:font-variation-settings .6s cubic-bezier(.2,.8,.2,1),color .3s}
.rw:hover h3{--w:125;--t:300;color:var(--lime)}
.rw p{color:var(--mute);max-width:44ch;justify-self:end}
.rw p b{display:block;color:var(--ivory);margin-top:10px;font-weight:600}
@media(max-width:760px){.rw{grid-template-columns:1fr}.rw p{justify-self:start}}
/* work */
.bn{display:grid;grid-template-columns:repeat(12,1fr);grid-auto-rows:clamp(190px,24vw,350px);gap:10px}
.tl{position:relative;overflow:hidden;padding:clamp(16px,2vw,28px);display:flex;flex-direction:column;justify-content:space-between}
@media(pointer:fine){.tl{cursor:none}}
.tl .in{position:absolute;inset:-8% 0;transition:transform .9s cubic-bezier(.2,.8,.2,1)}
.tl:hover .in{transform:scale(1.06)}
.tl>*:not(.in){position:relative;z-index:2}
.tl small{font-size:14px;font-weight:500;opacity:.7;max-width:34ch}
.tl h3{font-size:clamp(36px,4.8vw,80px)}
.a1{grid-column:span 7;grid-row:span 2;background:#E8E3D1;color:#243a1c}
.a1 .in{background:radial-gradient(circle at 70% 40%,#2f4a26 0 24%,transparent 24.2%),radial-gradient(circle at 70% 40%,transparent 0 30%,#6d8a4e 30% 31%,transparent 31.2%),radial-gradient(circle at 70% 40%,transparent 0 40%,#6d8a4e 40% 40.8%,transparent 41%)}
.a1 h3{--w:125;--t:300;text-transform:lowercase}
.a2{grid-column:span 5;background:#D6D5CE;color:#111}
.a2 .in{background:repeating-linear-gradient(90deg,transparent 0 11.6%,#111 11.6% 12.4%)}
.a3{grid-column:span 5;background:#2B3BFF;color:#fff}
.a3 .in{background:radial-gradient(circle at 78% 30%,#fff 0 3%,transparent 3.2%),radial-gradient(circle at 50% 50%,transparent 0 33%,rgba(255,255,255,.55) 33% 33.4%,transparent 33.6%),radial-gradient(circle at 50% 50%,transparent 0 22%,rgba(255,255,255,.3) 22% 22.4%,transparent 22.6%)}
.a3 h3{--w:100;--t:500;text-transform:lowercase}
.a4{grid-column:span 4;background:var(--olive)}
.a4 .in{background:linear-gradient(var(--lime),var(--lime)) 12% 20%/22% 30% no-repeat,linear-gradient(var(--ivory),var(--ivory)) 12% 60%/22% 14% no-repeat,linear-gradient(var(--lime),var(--lime)) 40% 20%/22% 55% no-repeat}
.a5{grid-column:span 8;background:var(--ink);box-shadow:inset 0 0 0 1px var(--ln)}
.a5 h3{color:var(--lime)}
@media(max-width:860px){.bn{grid-template-columns:1fr;grid-auto-rows:200px}.tl{grid-column:auto!important;grid-row:auto!important}.a1{grid-row:span 2!important}}
.cur{position:fixed;left:0;top:0;z-index:90;pointer-events:none;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:var(--lime);display:none;align-items:center;justify-content:center;color:var(--ink);font-size:14px;font-weight:700}
@media(pointer:fine) and (min-width:861px){.cur{display:flex}}
/* process */
.ps{background:var(--ivory);color:var(--ink)}
.sp{display:grid;grid-template-columns:90px 1fr 1fr;gap:26px;padding:24px 0;border-top:1px solid rgba(10,13,4,.2);align-items:center}
.sp:last-child{border-bottom:1px solid rgba(10,13,4,.2)}
.sp em{font-style:normal;font-weight:700;font-size:19px}
.sp h3{font-size:clamp(38px,6vw,96px);color:transparent;-webkit-text-stroke:1.5px var(--ink);transition:color .6s}
.sp.on h3{color:var(--ink)}
.sp p{color:rgba(10,13,4,.72);max-width:40ch}
@media(max-width:760px){.sp{grid-template-columns:40px 1fr;gap:6px 14px}.sp p{grid-column:2}}
/* pricing */
.lab{font-size:14px;color:var(--mute);margin-bottom:10px}
.seg{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}
.tab{background:none;border:0;border-radius:16px;box-shadow:inset 0 0 0 1px var(--ln);padding:16px 18px;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:4px;transition:background .3s,color .3s}
.tab b{font-size:clamp(15px,1.6vw,20px);font-weight:700;line-height:1.2}
.tab small{font-size:14px;color:var(--mute)}
.tab.on{background:var(--lime);color:var(--ink)}.tab.on small{color:rgba(10,13,4,.7)}
.tab:not(.on):hover{background:var(--olive)}
.panel{display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,4vw,70px);background:var(--olive);padding:clamp(22px,3.4vw,54px);border-radius:24px;box-shadow:inset 0 0 0 1px var(--ln)}
.pn{font-size:clamp(60px,8.4vw,140px);color:var(--lime);margin-bottom:22px}
.tm{display:flex;justify-content:space-between;align-items:baseline;font-size:15px;color:var(--mute)}
.tm b{color:var(--ivory);font-size:19px}
.bar{height:10px;background:rgba(250,255,243,.14);margin-top:10px;border-radius:6px;overflow:hidden}
.bar i{display:block;height:100%;background:var(--logo);width:43%;transition:width .9s cubic-bezier(.2,.8,.2,1)}
.pl{list-style:none;padding:0;display:grid;gap:12px;margin-bottom:26px}
.pl li{display:flex;gap:12px}
.pl li::before{content:"";width:9px;height:9px;flex:none;margin-top:8px;background:var(--logo)}
.pb2{color:var(--mute);font-size:15px;margin-top:20px}
.pay{margin-top:clamp(40px,6vw,80px)}
.pay>p{color:var(--mute);margin-bottom:14px}
.pay>div{display:flex}
.pay i{font-style:normal;padding:clamp(14px,2vw,26px);min-width:0}
.pay i b{display:block;font-size:clamp(34px,5vw,80px)}
.pay small{font-size:14px;display:block;line-height:1.3}
.pay i:nth-child(1){background:var(--olive);box-shadow:inset 0 0 0 1px var(--ln)}
.pay i:nth-child(2){background:var(--ivory);color:var(--ink)}
.pay i:nth-child(3){background:var(--lime);color:var(--ink)}
.as{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin-top:40px;font-size:15px;color:var(--mute)}
.as p{border-top:1px solid var(--ln);padding-top:14px}
@media(max-width:860px){.panel{grid-template-columns:1fr;gap:28px}.as{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.tab{padding:12px}.tab b{font-size:14px}.tab small{font-size:13px}.as{grid-template-columns:1fr;gap:16px}.pay>div{flex-direction:column}.pay i{flex:none!important;display:flex;align-items:baseline;gap:14px}.pay i b{font-size:40px;min-width:90px}}
/* contact */
.ct{background:var(--olive)}
.cg{display:grid;grid-template-columns:1fr 1.05fr;gap:clamp(30px,6vw,100px);align-items:start}
.ct h2.d{font-size:clamp(42px,7vw,116px)}
.ct .lead{color:var(--mute);max-width:40ch}
.nx{margin-top:34px;display:grid;gap:14px;list-style:none;padding:0;counter-reset:s}
.nx li{counter-increment:s;display:flex;gap:14px;font-size:16px;color:var(--mute)}
.nx li::before{content:counter(s);font-weight:800;width:28px;height:28px;flex:none;display:grid;place-items:center;background:var(--lime);color:var(--ink);font-size:14px}
.em{display:inline-block;margin-top:28px;color:var(--lime);font-weight:600;border-bottom:1px solid var(--lime)}
.fc{background:var(--ink);color:var(--ivory);border-radius:24px;padding:clamp(20px,3vw,44px);box-shadow:inset 0 0 0 1px var(--ln)}
.prog{display:flex;gap:6px}
.prog i{flex:1;height:4px;background:rgba(250,255,243,.15);transition:background .4s}
.prog i.on{background:var(--lime)}
.stp{font-size:14px;color:var(--mute);margin:16px 0 10px}
.pane{display:none}
.pane.on{display:block;animation:pin .5s cubic-bezier(.2,.8,.2,1)}
@keyframes pin{from{opacity:0;transform:translateX(18px)}}
.pane h3{font-weight:900;font-stretch:62%;font-variation-settings:"wdth" 62,"wght" 900;text-transform:uppercase;font-size:clamp(32px,4.6vw,60px);line-height:.9;margin-bottom:24px}
.opts{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.op{cursor:pointer;display:block;position:relative}
.op input{position:absolute;opacity:0}
.op span{display:block;height:100%;padding:16px 18px;border-radius:16px;box-shadow:inset 0 0 0 1px var(--ln);transition:background .25s,color .25s,box-shadow .25s}
.op b{display:block;font-size:17px;line-height:1.25}
.op small{display:block;font-size:14px;opacity:.6;margin-top:3px;line-height:1.35}
.op:hover span{box-shadow:inset 0 0 0 1px var(--lime)}
.op input:checked+span{background:var(--lime);color:var(--ink);box-shadow:none}
.op input:focus-visible+span{outline:2px solid var(--lime);outline-offset:3px}
.g2{display:grid;gap:16px}
.fl span{display:block;font-size:14px;font-weight:500;color:var(--mute);margin-bottom:6px}
.fl input,.fl textarea{width:100%;background:rgba(250,255,243,.06);border:0;border-radius:14px;padding:14px 16px;font-size:17px;resize:vertical;box-shadow:inset 0 0 0 1px var(--ln)}
.fl input:focus,.fl textarea:focus{outline:2px solid var(--lime);box-shadow:none}
.fl ::placeholder{color:rgba(250,255,243,.32)}
.act{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:24px}
.bk{background:none;border:0;font-weight:600;cursor:pointer;padding:12px 4px;text-decoration:underline;text-underline-offset:4px;color:var(--ivory)}
.act .btn{padding:16px 30px}
#fm{font-size:15px;margin-top:14px;min-height:1.4em;color:var(--mute)}
.done .pane,.done .act,.done .prog,.done .stp{display:none}
.done #fm{font-size:clamp(22px,2.6vw,32px);font-weight:600;line-height:1.25;margin:0;color:var(--ivory)}
@media(max-width:860px){.cg{grid-template-columns:1fr}}
@media(max-width:560px){.opts{grid-template-columns:1fr}.op span{padding:14px 16px}}
/* footer */
.ft{position:relative;isolation:isolate;overflow:hidden;padding-block:clamp(50px,7vw,90px) 26px}
.fg{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:34px;font-size:16px}
.fg h4{font-size:14px;font-weight:600;color:var(--mute);margin-bottom:14px}
.fg ul{list-style:none;padding:0;display:grid;gap:9px}
.fg a:hover{color:var(--lime)}
.fg p{color:var(--mute);max-width:34ch;margin-top:14px}
.fw{position:absolute;left:clamp(18px,3.4vw,52px);right:0;bottom:clamp(54px,5vw,72px);z-index:-1;font-size:12.4vw;white-space:nowrap;overflow:hidden;color:var(--ivory);opacity:.07;pointer-events:none}
.fb{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-top:clamp(80px,10vw,150px);padding-top:18px;border-top:1px solid var(--ln);font-size:14px;color:var(--mute)}
@media(max-width:860px){.fg{grid-template-columns:1fr 1fr}.fg>div:first-child{grid-column:1/-1}}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}#pre,#pm{display:none}.st .w{opacity:1}.cur{display:none}}
</style>
</head>
<body>
<div id="pre" aria-hidden="true"><small>Idea to Identity</small></div>
<div class="mark" id="pm" aria-hidden="true"><i class="mk-a"></i><i class="mk-b"></i><i class="mk-c"></i><i class="mk-d"></i></div>
<div class="cur" id="cur" aria-hidden="true"></div>
<nav><a class="lg" href="#top" aria-label="Idea to Identity home"><svg viewBox="0 0 42 86" aria-hidden="true"><rect width="18" height="18" fill="#FAFFF3"/><rect y="24" width="18" height="62" fill="#C0F53D"/><rect x="24" width="18" height="62" fill="#C0F53D"/><rect x="24" y="68" width="18" height="18" fill="#FAFFF3"/></svg><span>IDEA TO<br>IDENTITY</span></a><div class="nl"><a href="#services">Services</a><a href="#work">Work</a><a href="#process">Process</a><a href="#pricing">Pricing</a><a class="nb" href="#contact">Start a project</a></div></nav>

<header class="hero pad" id="top">
<div class="pill fx">Independent studio for brand identity and web design</div>
<div class="mark" id="hm" aria-hidden="true"><i class="mk-a"></i><i class="mk-b"></i><i class="mk-c" id="blk"></i><i class="mk-d"></i></div>
<div class="bw fx" aria-hidden="true"><svg viewBox="0 0 120 120"><defs><path id="cp" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"/></defs><text><textPath href="#cp" textLength="284" lengthAdjust="spacing">Designing Ideas · Building Identities · </textPath></text><rect x="54" y="54" width="12" height="12" fill="#C0F53D"/></svg></div>
<h1 class="d" id="hl"><span><i>From a great</i></span><span><i>idea to a</i></span><span><i>brand people</i></span><span><i>remember.</i></span></h1>
<div class="sub" id="sub"><p>We create thoughtful brand identities and high-performing websites that help businesses communicate their value and earn customer trust.</p><a class="btn" href="#contact">Start a project</a></div>
<div class="cue fx" aria-hidden="true">Scroll</div>
</header>

<section class="st pad"><p id="stmt">Good design earns trust before you say a word.</p><small>People judge a business quickly. A clear identity and a well-built website make you easier to understand, easier to trust and easier to choose.</small></section>

<div class="mq d" aria-hidden="true"><div id="mq">Brand identity <b>/</b> Websites <b>/</b> Strategy <b>/</b> Figma <b>/</b> Development <b>/</b> Brand identity <b>/</b> Websites <b>/</b> Strategy <b>/</b> Figma <b>/</b> Development <b>/</b></div></div>

<section class="pad" id="services"><h2 class="d">One process. Three ways in.</h2>
<a class="rw" href="#contact"><h3 class="d">Brand identity</h3><p>A refined visual foundation: logo, colour, typography and clear usage guidelines, built around your positioning.<b>From ₹20,000 · 2–3 weeks</b></p></a>
<a class="rw" href="#contact"><h3 class="d">Website design + build</h3><p>A responsive website designed in Figma and developed to the approved design, structured around what visitors need to do.<b>From ₹45,000 · 3–5 weeks</b></p></a>
<a class="rw" href="#contact"><h3 class="d">Brand + website</h3><p>Identity and website developed together, so strategy, visual direction and digital experience stay aligned from day one.<b>From ₹60,000 · 5–7 weeks</b></p></a>
</section>

<section class="pad" id="work"><h2 class="d">Work, with the thinking shown.</h2>
<div class="bn">
<a class="tl a1" href="#contact" data-v="View"><div class="in"></div><small>Self-initiated concept · Brand + landing page</small><h3 class="d">Verdant</h3></a>
<a class="tl a2" href="#contact" data-v="View"><div class="in"></div><small>Self-initiated concept · Identity + portfolio site</small><h3 class="d">Atelier Nord</h3></a>
<a class="tl a3" href="#contact" data-v="View"><div class="in"></div><small>Self-initiated concept · Brand + launch site</small><h3 class="d">Orbit</h3></a>
<a class="tl a4" href="#contact" data-v="View"><div class="in"></div><small>Strategy before style</small><h3 class="d">Systems</h3></a>
<a class="tl a5" href="#contact" data-v="Talk"><small>New work is in progress. Tell us what you are building.</small><h3 class="d">Yours is next.</h3></a>
</div></section>

<section class="ps pad" id="process"><h2 class="d">Idea to launch, in six moves.</h2>
<div class="sp"><em>01</em><h3 class="d">Discover</h3><p>Understand the business and the brief: goals, audience, timeline and budget.</p></div>
<div class="sp"><em>02</em><h3 class="d">Define</h3><p>Agree the direction, deliverables, milestones and terms before designing.</p></div>
<div class="sp"><em>03</em><h3 class="d">Design</h3><p>Develop the identity or Figma layouts, shared at planned review points.</p></div>
<div class="sp"><em>04</em><h3 class="d">Build</h3><p>Turn approved designs into a working, responsive website.</p></div>
<div class="sp"><em>05</em><h3 class="d">Refine</h3><p>Check responsive behaviour, links, forms, browsers and accessibility.</p></div>
<div class="sp"><em>06</em><h3 class="d">Launch</h3><p>Hand over agreed files and access, with a walkthrough of what was delivered.</p></div>
</section>

<section class="pad" id="pricing"><h2 class="d">Thoughtful design. Transparent investment.</h2>
<p class="lab">Choose a package</p>
<div class="seg" role="tablist" aria-label="Packages" id="tabs">
<button class="tab on" role="tab" aria-selected="true" type="button"><b>Brand identity</b><small>from ₹20,000</small></button>
<button class="tab" role="tab" aria-selected="false" type="button"><b>Website</b><small>from ₹45,000</small></button>
<button class="tab" role="tab" aria-selected="false" type="button"><b>Brand + website</b><small>from ₹60,000</small></button>
</div>
<div class="panel" aria-live="polite">
<div><p class="lab">Starting at</p><div class="pn d" id="pn">₹20,000</div><div class="tm"><span>Typical timeline</span><b id="pw">2–3 weeks</b></div><div class="bar"><i id="pbar"></i></div><p class="pb2" id="pbest"></p></div>
<div><p class="lab">What’s included</p><ul class="pl" id="pl"></ul><button class="btn" id="pcta" type="button">Start with this package</button></div>
</div>
<div class="pay"><p>Suggested payment schedule</p><div><i style="flex:50"><b class="d">50%</b><small>to book the project</small></i><i style="flex:30"><b class="d">30%</b><small>after design approval</small></i><i style="flex:20"><b class="d">20%</b><small>before launch</small></i></div></div>
<div class="as"><p>You provide final copy and images unless content creation is agreed in writing.</p><p>Domain, hosting, paid plugins, premium fonts and maintenance are separate.</p><p>Extra pages, integrations or revision rounds may change price and timeline.</p><p>Timelines start once the proposal is approved and the first payment is received.</p></div>
</section>

<section class="ct pad" id="contact"><div class="cg">
<div><h2 class="d">Tell us what you are building.</h2><p class="lead">You do not need a perfect brief. Three quick steps, and we will let you know honestly whether we are the right fit.</p>
<ul class="nx"><li>We review your enquiry.</li><li>If it looks aligned, we ask follow-up questions or arrange a short call.</li><li>We send a proposal with scope, timeline, investment and payment milestones.</li></ul>
<a class="em" href="mailto:hello@ideatoidentity.com">Prefer email? hello@ideatoidentity.com</a></div>
<form id="cf" class="fc" novalidate>
<div class="prog"><i class="on"></i><i></i><i></i></div><p class="stp" id="stp">Step 1 of 3</p>
<div class="pane on"><h3>What do you need?</h3><div class="opts">
<label class="op"><input type="radio" name="need" value="Brand identity"><span><b>Brand identity</b><small>Logo, colour, typography, guidelines</small></span></label>
<label class="op"><input type="radio" name="need" value="Website design + development"><span><b>Website design + development</b><small>Figma design and responsive build</small></span></label>
<label class="op"><input type="radio" name="need" value="Brand + website"><span><b>Brand + website</b><small>One connected project</small></span></label>
<label class="op"><input type="radio" name="need" value="Not sure yet"><span><b>Not sure yet</b><small>We will recommend a starting point</small></span></label></div></div>
<div class="pane"><h3>What is your estimated budget?</h3><div class="opts">
<label class="op"><input type="radio" name="bud" value="Below ₹20,000"><span><b>Below ₹20,000</b></span></label>
<label class="op"><input type="radio" name="bud" value="₹20,000–₹50,000"><span><b>₹20,000–50,000</b></span></label>
<label class="op"><input type="radio" name="bud" value="₹50,000–₹1,00,000"><span><b>₹50,000–1,00,000</b></span></label>
<label class="op"><input type="radio" name="bud" value="Above ₹1,00,000"><span><b>Above ₹1,00,000</b></span></label>
<label class="op"><input type="radio" name="bud" value="Need guidance"><span><b>Need guidance</b></span></label></div></div>
<div class="pane"><h3>Tell us about you and the project</h3><div class="g2">
<label class="fl"><span>Your name</span><input name="name" autocomplete="name" placeholder="Full name"></label>
<label class="fl"><span>Email address</span><input name="email" type="email" autocomplete="email" placeholder="you@company.com"></label>
<label class="fl"><span>Business or brand name (optional)</span><input name="biz" placeholder="Your business"></label>
<label class="fl"><span>What are you building?</span><textarea name="msg" rows="3" placeholder="Your business, audience and goals"></textarea></label></div></div>
<div class="act"><button class="bk" id="bk" type="button">Back</button><button class="btn" id="nxt" type="button">Next</button></div>
<p id="fm" role="status"></p>
</form></div></section>

<footer class="ft pad"><div class="fg">
<div><b class="d" style="font-size:30px">Designing Ideas.<br>Building Identities.</b><p>An independent studio creating brand identities and websites for ambitious founders and small businesses.</p></div>
<div><h4>Studio</h4><ul><li><a href="#services">Services</a></li><li><a href="#work">Work</a></li><li><a href="#process">Process</a></li><li><a href="#pricing">Pricing</a></li><li><a href="#contact">Contact</a></li></ul></div>
<div><h4>Services</h4><ul><li><a href="#pricing">Brand identity</a></li><li><a href="#pricing">Website design + development</a></li><li><a href="#pricing">Brand + website</a></li></ul></div>
<div><h4>Get in touch</h4><ul><li><a href="mailto:hello@ideatoidentity.com">hello@ideatoidentity.com</a></li><li><a href="#">LinkedIn</a></li><li><a href="#">Behance</a></li><li><a href="#">Instagram</a></li></ul></div></div>
<div class="fw d" aria-hidden="true">Idea to Identity</div>
<div class="fb"><span>© 2026 Idea to Identity. All rights reserved.</span><span>We use the details you share only to respond to your enquiry.</span><a href="#top">Back to top</a></div></footer>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
<script>
(function(){
var L=null,G=!!window.gsap,rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
var nv=document.querySelector('nav');function nvs(){nv.classList.toggle('sc',scrollY>60)}addEventListener('scroll',nvs,{passive:true});nvs();
function go(h){var t=document.querySelector(h);if(!t)return;if(L)L.scrollTo(t);else t.scrollIntoView({behavior:rm?'auto':'smooth'})}
document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var h=a.getAttribute('href');if(h.length>1){e.preventDefault();go(h)}})});
// pricing
var P=[{n:20000,w:'2–3 weeks',b:43,v:'Brand identity',l:['Primary logo and supporting variation','Colour palette and typography','Brand guidelines PDF','Up to 3 mockups','2 revision rounds'],t:'Best for founders launching a business or refreshing inconsistent visuals.'},
{n:45000,w:'3–5 weeks',b:71,v:'Website design + development',l:['Up to 5 website pages','Figma desktop and mobile layouts','Responsive development','Contact form and on-page SEO setup','Testing, handover and 2 design revision rounds'],t:'Best for small businesses that need a strong online presence.'},
{n:60000,w:'5–7 weeks',b:100,v:'Brand + website',l:['Complete brand identity deliverables','Up to 5 pages, Figma layouts and build','Contact form and on-page SEO setup','Testing, launch support and handover','2 revision rounds per milestone'],t:'Best for founders who want to launch with one consistent story.'}];
var tabs=[].slice.call(document.querySelectorAll('.tab')),cur=0,pn=document.getElementById('pn'),o={n:20000};
function fmt(n){return '₹'+Math.round(n).toLocaleString('en-IN')}
function show(i){cur=i;var p=P[i];tabs.forEach(function(t,k){t.classList.toggle('on',k==i);t.setAttribute('aria-selected',k==i)});
if(G){gsap.to(o,{n:p.n,duration:.9,ease:'expo.out',onUpdate:function(){pn.textContent=fmt(o.n)}})}else pn.textContent=fmt(p.n);
document.getElementById('pw').textContent=p.w;document.getElementById('pbar').style.width=p.b+'%';
document.getElementById('pl').innerHTML=p.l.map(function(x){return '<li>'+x+'</li>'}).join('');document.getElementById('pbest').textContent=p.t}
tabs.forEach(function(t,k){t.addEventListener('click',function(){show(k)})});show(0);
// contact steps
var f=document.getElementById('cf'),fm=document.getElementById('fm'),panes=[].slice.call(f.querySelectorAll('.pane')),pg=f.querySelectorAll('.prog i'),stp=document.getElementById('stp'),nxt=document.getElementById('nxt'),bk=document.getElementById('bk'),step=0;
function setStep(n){step=n;panes.forEach(function(p,i){p.classList.toggle('on',i==n)});pg.forEach(function(p,i){p.classList.toggle('on',i<=n)});stp.textContent='Step '+(n+1)+' of 3';bk.style.visibility=n?'visible':'hidden';nxt.textContent=n==2?'Send enquiry':'Next';fm.textContent=''}
function send(){var d=new FormData(f),n=(d.get('name')||'').trim(),m=(d.get('email')||'').trim(),g=(d.get('msg')||'').trim();
if(!n||!/^\S+@\S+\.\S+$/.test(m)||!g){fm.textContent='Please add your name, a valid email and a few words about your project.';return}
var b='Name: '+n+'\nEmail: '+m+'\nBusiness: '+(d.get('biz')||'-')+'\nNeed: '+(d.get('need')||'-')+'\nBudget: '+(d.get('bud')||'-')+'\n\nProject:\n'+g;
f.classList.add('done');fm.textContent='Thank you. Your email app should open with the enquiry ready to send. If it does not, write to hello@ideatoidentity.com.';
location.href='mailto:hello@ideatoidentity.com?subject='+encodeURIComponent('Project enquiry from '+n)+'&body='+encodeURIComponent(b)}
function next(){if(step<2){var nm=step?'bud':'need';if(!f.querySelector('input[name='+nm+']:checked')){fm.textContent='Choose an option to continue.';return}setStep(step+1)}else send()}
nxt.addEventListener('click',next);bk.addEventListener('click',function(){setStep(step-1)});
f.addEventListener('submit',function(e){e.preventDefault();next()});
f.addEventListener('change',function(e){if(e.target.type=='radio'&&step<2)setTimeout(function(){setStep(step+1)},240)});
setStep(0);
document.getElementById('pcta').addEventListener('click',function(){var r=document.querySelector('input[name=need][value="'+P[cur].v+'"]');if(r)r.checked=true;setStep(1);go('#contact')});
if(!G||rm){var pr=document.getElementById('pre');if(pr)pr.style.display='none';document.getElementById('pm').style.display='none';return}
gsap.registerPlugin(ScrollTrigger);
if(window.Lenis){L=new Lenis();L.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){L.raf(t*1000)});gsap.ticker.lagSmoothing(0)}
var s=document.getElementById('stmt');s.innerHTML=s.textContent.split(' ').map(function(w){return '<span class="w">'+w+'</span>'}).join(' ');
gsap.to('.st .w',{opacity:1,stagger:.1,ease:'none',scrollTrigger:{trigger:s,start:'top 80%',end:'bottom 45%',scrub:true}});
var lines=gsap.utils.toArray('#hl span i'),hm=document.getElementById('hm'),pm=document.getElementById('pm');
gsap.set(lines,{'--w':100,'--t':100,yPercent:110,display:'block'});gsap.set('#sub',{opacity:0,y:20});gsap.set(hm,{opacity:0});
var w0=Math.min(innerWidth*.22,96);
gsap.set(pm,{left:innerWidth/2-w0/2,top:innerHeight/2-w0*43/42,width:w0});
var tl=gsap.timeline();
tl.from('#pm .mk-a',{x:-60,y:-50,opacity:0,duration:.9,ease:'expo.out'})
.from('#pm .mk-b',{x:-40,y:80,opacity:0,duration:.9,ease:'expo.out'},'<.1')
.from('#pm .mk-c',{x:60,y:-80,opacity:0,duration:.9,ease:'expo.out'},'<.1')
.from('#pm .mk-d',{x:40,y:60,opacity:0,duration:.9,ease:'expo.out'},'<.1')
.from('#pre small',{opacity:0,duration:.6},'<.2')
.addLabel('fly','+=.4')
.to('#pre small',{opacity:0,duration:.3},'fly')
.to('#pre',{opacity:0,duration:1,ease:'power2.inOut'},'fly+=.1')
.to(pm,{left:function(){return hm.getBoundingClientRect().left},top:function(){return hm.getBoundingClientRect().top},width:function(){return hm.getBoundingClientRect().width},duration:1.3,ease:'expo.inOut'},'fly')
.set(hm,{opacity:1}).set(pm,{display:'none'}).set('#pre',{display:'none'})
.from('.fx',{opacity:0,duration:1.2},'<')
.to(lines,{yPercent:0,duration:1.1,stagger:.1,ease:'expo.out'},'<')
.to(lines,{'--w':62,'--t':900,duration:2,stagger:.14,ease:'expo.inOut'},'-=.8')
.to('#sub',{opacity:1,y:0,duration:1},'-=1.2');
var b=document.getElementById('blk');
function sc(){var r=b.getBoundingClientRect();return Math.max(innerWidth/r.width,innerHeight/r.height)*1.15}
var h=gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'+=120%',scrub:.6,pin:true,anticipatePin:1,invalidateOnRefresh:true}});
h.fromTo('#hl,#sub,.fx',{opacity:1,y:0},{opacity:0,y:-60,duration:.4,immediateRender:false},0)
.fromTo('#hm .mk-a,#hm .mk-b,#hm .mk-d',{opacity:1},{opacity:0,duration:.4,immediateRender:false},0)
.to(b,{scale:function(){return sc()},backgroundColor:'#C0F53D',ease:'power2.in',duration:1},0);
gsap.to('#mq',{xPercent:-50,ease:'none',scrollTrigger:{trigger:'.mq',start:'top bottom',end:'bottom top',scrub:true}});
gsap.utils.toArray('.tl').forEach(function(t){
gsap.from(t,{clipPath:'inset(100% 0 0 0)',duration:1.2,ease:'expo.out',scrollTrigger:{trigger:t,start:'top 90%'}});
var i=t.querySelector('.in');if(i)gsap.fromTo(i,{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{trigger:t,scrub:true}})});
gsap.utils.toArray('.sp').forEach(function(e){ScrollTrigger.create({trigger:e,start:'top 62%',end:'bottom 38%',toggleClass:{targets:e,className:'on'}})});
gsap.from('.rw',{y:40,opacity:0,stagger:.12,duration:1,ease:'expo.out',scrollTrigger:{trigger:'#services',start:'top 60%'}});
gsap.from('.pay i',{scaleX:0,transformOrigin:'left',stagger:.15,duration:1,ease:'expo.out',scrollTrigger:{trigger:'.pay',start:'top 85%'}});
var cu=document.getElementById('cur');
if(matchMedia('(pointer:fine)').matches){var qx=gsap.quickTo(cu,'x',{duration:.35,ease:'power3'}),qy=gsap.quickTo(cu,'y',{duration:.35,ease:'power3'});
addEventListener('pointermove',function(e){qx(e.clientX);qy(e.clientY)});
document.querySelectorAll('.tl').forEach(function(t){t.addEventListener('pointerenter',function(){cu.textContent=t.dataset.v;gsap.to(cu,{width:84,height:84,margin:'-42px 0 0 -42px',duration:.4})});t.addEventListener('pointerleave',function(){cu.textContent='';gsap.to(cu,{width:16,height:16,margin:'-8px 0 0 -8px',duration:.4})})})}
})();
</script>
</body>
</html>

```
