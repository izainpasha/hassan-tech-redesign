(() => {
  "use strict";

  const hasGsap = typeof window.gsap !== "undefined";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animate = hasGsap && !reduceMotion;
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.Flip) gsap.registerPlugin(Flip);
  }

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const rs = (n) => "Rs " + n.toLocaleString("en-US");

  /* ------------------------------------------------------------------
     Catalog (real listings from hassantech.pk, Oct 2026)
     cond: new | a = unused repack | b = open box | c = 10/10 no box
  ------------------------------------------------------------------ */
  const CONDITION = { a: "Unused repack", b: "Open box", c: "10/10, no box" };
  const products = [
    { id: "hero99",   cat: "keyboards", brand: "AULA",        name: "HERO 99 HE Hall Effect",  spec: "8000 Hz · Rapid Trigger · 0.05 mm",   now: 18499, was: 21999, img: "hero99.webp", featured: true, needs: ["gaming"], why: "Hall effect with Rapid Trigger. The fastest response we stock." },
    { id: "a9",       cat: "mice",      brand: "ATK",         name: "VXE A9 Pro Max",          spec: "8 kHz wireless · 42,000 DPI",         now: 13999, was: 16999, img: "a9.jpg", photo: true, featured: true },
    { id: "f75pro",   cat: "keyboards", brand: "AULA",        name: "F75 Pro Gradient Gray",   spec: "Reaper switches · 75% · Tri-mode",    now: 12799, was: 16499, img: "f75pro.webp", featured: true, needs: ["wireless", "gaming"], why: "Tri-mode wireless with fast Reaper switches." },
    { id: "e11",      cat: "mice",      brand: "EWEADN",      name: "E11 Wireless",            spec: "65 g · 12,800 DPI · Tri-mode",        now: 4450,  was: 4999,  img: "e11.webp", featured: true },
    { id: "duocast",  cat: "mics",      brand: "HyperX",      name: "DuoCast RGB",             spec: "24-bit / 96 kHz · USB condenser",     now: 13499, was: 17999, img: "duocast.jpg", featured: true },
    { id: "l99",      cat: "keyboards", brand: "AULA",        name: "L99 Blue Rain",           spec: "3.98″ IPS screen · Tri-mode · RGB",   now: 24850, was: 32999, img: "l99.jpg", photo: true, featured: true, needs: ["looks", "wireless"], why: "Built-in 3.98″ screen and translucent keycaps." },
    { id: "g7pro",    cat: "headsets",  brand: "AULA",        name: "G7 Pro Wireless",         spec: "7.1 surround · BT 5.3 · RGB",         now: 8299,  was: 8999,  img: "g7pro.jpg", featured: true },
    { id: "cloud3s",  cat: "headsets",  brand: "HyperX",      name: "Cloud III S Wireless",    spec: "120 h battery · 53 mm drivers",       now: 35999, was: 39999, img: "cloud3s.jpg", featured: true, soldOut: true },
    { id: "f99",      cat: "keyboards", brand: "AULA",        name: "F99 Pro White",           spec: "Silent · Hot-swap · Wireless",        now: 15350, was: 19000, img: "f99.webp", needs: ["quiet", "wireless"], why: "Silent switches in a full layout, fully wireless." },
    { id: "f87",      cat: "keyboards", brand: "AULA",        name: "F87 Wireless",            spec: "Gasket mount · Hot-swap · RGB",       now: 12999, was: 14999, img: "f87.png", needs: ["wireless", "quiet"], why: "Gasket mount gives a softer, quieter typing feel." },
    { id: "apex100",  cat: "keyboards", brand: "SteelSeries", name: "Apex 100",                spec: "QuickTension switches · Blue backlight", now: 3500, was: 6000, img: "apex100.webp", cond: "c", needs: ["gaming"], why: "Budget pick, pre-owned in 10/10 condition." },
    { id: "sc620",    cat: "mice",      brand: "AULA",        name: "SC620 Wireless",          spec: "Lightweight · RGB",                   now: 4950,  was: 6000,  img: "sc620.jpg" },
    { id: "proclick", cat: "mice",      brand: "Razer",       name: "Pro Click Ergonomic",     spec: "2.4 GHz + Bluetooth",                 now: 9750,  was: 19999, img: "proclick.jpg", photo: true, cond: "c" },
    { id: "nova5",    cat: "headsets",  brand: "SteelSeries", name: "Arctis Nova 5 Wireless",  spec: "100+ game presets · 40 h battery",    now: 23999, was: 29999, img: "nova5.jpg", cond: "a" },
    { id: "voidpro",  cat: "headsets",  brand: "Corsair",     name: "Void Pro RGB",            spec: "Dolby 7.1 · Wired",                   now: 6999,  was: 12000, img: "voidpro.jpg", cond: "b" },
    { id: "gm50",     cat: "mics",      brand: "Bloody",      name: "GM50 Pro",                spec: "192 kHz · USB condenser · RGB",       now: 7799,  was: 8999,  img: "gm50.webp" }
  ];
  const off = (p) => Math.round((1 - p.now / p.was) * 100);

  const plusIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  const waIcon = '<svg class="ico" aria-hidden="true"><use href="#i-wa"/></svg>';
  const WA = "https://wa.me/923496658003";
  const waAsk = (p) => `${WA}?text=${encodeURIComponent(`Hi, is the ${p.brand} ${p.name} (${rs(p.now)}) available?`)}`;

  function mediaHTML(p) {
    const badges = [];
    if (p.soldOut) badges.push('<span class="badge badge--out mono">Sold out</span>');
    else badges.push(`<span class="badge badge--deal mono">&minus;${off(p)}%</span>`);
    if (p.cond) badges.push(`<span class="badge badge--cond mono">${CONDITION[p.cond]}</span>`);
    return `<div class="card__media${p.photo ? " is-photo" : ""}">
        <img src="assets/products/${p.img}" alt="${p.brand} ${p.name}" loading="lazy">
        <div class="card__badges">${badges.join("")}</div>
      </div>`;
  }

  function cardHTML(p) {
    const full = `${p.brand} ${p.name}`;
    return `<article class="card" data-cat="${p.cat}" data-featured="${p.featured ? 1 : 0}">
      ${mediaHTML(p)}
      <div class="card__body">
        <span class="card__brand">${p.brand}</span>
        <h3 class="card__name">${p.name}</h3>
        <p class="card__spec">${p.spec}</p>
      </div>
      <div class="card__foot">
        <div class="price"><span class="price__now mono">${rs(p.now)}</span><span class="price__was mono">${rs(p.was)}</span></div>
        <button class="add" type="button" data-add="${full}" aria-label="${p.soldOut ? full + " is sold out" : "Add " + full + " to cart"}"${p.soldOut ? " disabled" : ""}>${plusIcon}</button>
      </div>
    </article>`;
  }

  function dealHTML(p) {
    const full = `${p.brand} ${p.name}`;
    return `<article class="deal glass" data-deal>
      ${mediaHTML(p)}
      <div class="deal__body">
        <span class="card__brand">${p.brand}</span>
        <h3 class="card__name">${p.name}</h3>
        <div class="deal__save mono"><b>Save ${rs(p.was - p.now)}</b><span class="deal__bar" aria-hidden="true"><i style="--save:${off(p)}%"></i></span></div>
        <div class="card__foot" style="padding:0">
          <div class="price"><span class="price__now mono">${rs(p.now)}</span><span class="price__was mono">${rs(p.was)}</span></div>
          <div class="pick__actions">
            <a class="pick__wa" href="${waAsk(p)}" target="_blank" rel="noopener" aria-label="Ask about ${full} on WhatsApp">${waIcon}</a>
            <button class="add" type="button" data-add="${full}" aria-label="Add ${full} to cart">${plusIcon}</button>
          </div>
        </div>
      </div>
    </article>`;
  }

  const grid = $("#products");
  grid.innerHTML = products.map(cardHTML).join("");
  $("#deals").innerHTML = products.filter((p) => p.cond).sort((a, b) => off(b) - off(a)).map(dealHTML).join("");

  /* ------------------------------------------------------------------
     Keyboard finder
  ------------------------------------------------------------------ */
  const finderForm = $("#finderForm");
  const finderOut = $("#finderResults");
  const NEED_LABEL = { gaming: "competitive gaming", wireless: "wireless", quiet: "quiet typing", looks: "looks and a screen" };

  function pickHTML(p, best) {
    const full = `${p.brand} ${p.name}`;
    return `<article class="pick${best ? " pick--best" : ""}">
      <div class="pick__img${p.photo ? " is-photo" : ""}"><img src="assets/products/${p.img}" alt="${full}" loading="lazy"></div>
      <div class="pick__body">
        ${best ? '<span class="pick__tag">Best match</span>' : ""}
        <span class="card__brand">${p.brand}</span>
        <h3 class="pick__name">${p.name}</h3>
        <p class="pick__why">${p.why}</p>
        <div class="price"><span class="price__now mono">${rs(p.now)}</span><span class="price__was mono">${rs(p.was)}</span></div>
      </div>
      <div class="pick__actions">
        <a class="pick__wa" href="${waAsk(p)}" target="_blank" rel="noopener" aria-label="Ask about ${full} on WhatsApp">${waIcon}</a>
        <button class="add" type="button" data-add="${full}" aria-label="Add ${full} to cart">${plusIcon}</button>
      </div>
    </article>`;
  }

  function runFinder() {
    const [lo, hi] = finderForm.budget.value.split("-").map(Number);
    const need = finderForm.need.value;
    const hits = products
      .filter((p) => p.needs && p.now >= lo && p.now < hi && p.needs.includes(need))
      .sort((a, b) => a.needs.indexOf(need) - b.needs.indexOf(need) || b.now - a.now)
      .slice(0, 3);
    if (hits.length) {
      finderOut.innerHTML = hits.map((p, i) => pickHTML(p, i === 0)).join("");
    } else {
      const msg = `Hi, I'm looking for a keyboard for ${NEED_LABEL[need]}. My budget is ${finderForm.querySelector("input[name=budget]:checked + label").textContent}.`;
      finderOut.innerHTML = `<div class="finder__empty">
        <p>Nothing in stock matches both right now. Message us and we&rsquo;ll check incoming stock for you.</p>
        <a class="btn btn--wa" href="${WA}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${waIcon} Ask on WhatsApp</a>
      </div>`;
    }
    if (animate) gsap.from(finderOut.children, { y: 16, opacity: 0, stagger: 0.07, duration: 0.45, ease: "power3.out", clearProps: "transform,opacity" });
  }
  finderForm.addEventListener("change", runFinder);
  finderForm.addEventListener("submit", (e) => e.preventDefault());
  runFinder();

  /* ------------------------------------------------------------------
     FAQ accordion (animated <details>)
  ------------------------------------------------------------------ */
  $$("[data-qa]").forEach((d) => {
    const sum = $("summary", d);
    const body = $(".qa__a", d);
    sum.addEventListener("click", (e) => {
      if (!animate) return;
      e.preventDefault();
      if (d.open) {
        gsap.to(body, { height: 0, duration: 0.35, ease: "power2.inOut", onComplete: () => { d.open = false; gsap.set(body, { clearProps: "height" }); } });
      } else {
        d.open = true;
        gsap.from(body, { height: 0, duration: 0.45, ease: "power3.out", clearProps: "height" });
      }
    });
  });

  /* ------------------------------------------------------------------
     Filters (GSAP Flip)
  ------------------------------------------------------------------ */
  const cards = $$(".card", grid);
  const filterBtns = $$(".filter");
  const matches = (card, f) => (f === "all" ? card.dataset.featured === "1" : card.dataset.cat === f);
  cards.forEach((c) => { c.hidden = !matches(c, "all"); });

  function setFilter(f) {
    filterBtns.forEach((b) => {
      const on = b.dataset.filter === f;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", String(on));
    });
    const state = hasGsap && window.Flip ? Flip.getState(cards) : null;
    cards.forEach((c) => { c.hidden = !matches(c, f); });
    if (state && animate) {
      Flip.from(state, {
        duration: 0.6,
        ease: "power3.inOut",
        absolute: true,
        scale: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.5, delay: 0.15, clearProps: "transform,opacity" }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.35 }),
        onComplete: () => ScrollTrigger.refresh()
      });
    }
  }
  filterBtns.forEach((b) => b.addEventListener("click", () => setFilter(b.dataset.filter)));
  $$("[data-filter-link]").forEach((a) => a.addEventListener("click", () => setFilter(a.dataset.filterLink)));

  /* ------------------------------------------------------------------
     Cart + toast
  ------------------------------------------------------------------ */
  let cart = 0;
  const cartCount = $("#cartCount");
  const cartBtn = $("#cartBtn");
  const toast = $("#toast");
  let toastTimer;

  function showToast(msg) {
    toast.textContent = msg;
    if (!hasGsap) { toast.style.opacity = 1; clearTimeout(toastTimer); toastTimer = setTimeout(() => (toast.style.opacity = 0), 2200); return; }
    gsap.killTweensOf(toast);
    gsap.to(toast, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" });
    gsap.to(toast, { opacity: 0, y: 20, duration: 0.3, delay: 2.2 });
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn || btn.disabled) return;
    cart += 1;
    cartCount.textContent = cart;
    cartBtn.setAttribute("aria-label", `Cart, ${cart} item${cart === 1 ? "" : "s"}`);
    showToast(`Added to cart · ${btn.dataset.add}`);
    if (animate) {
      gsap.fromTo(cartCount, { scale: 1.7 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      gsap.fromTo(btn, { scale: 0.85 }, { scale: 1, duration: 0.4, ease: "back.out(3)", clearProps: "transform" });
    }
  });

  /* ------------------------------------------------------------------
     Mobile menu
  ------------------------------------------------------------------ */
  const menuBtn = $("#menuBtn");
  const nav = $("#nav");
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(open));
    if (open && animate) gsap.from($$("a", nav), { x: -12, opacity: 0, stagger: 0.04, duration: 0.3, clearProps: "transform,opacity" });
  });
  $$("a", nav).forEach((a) => a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  }));

  /* ------------------------------------------------------------------
     Hero keyboard (75%-style layout, widths in key units)
  ------------------------------------------------------------------ */
  const L = (c) => [c, "Key" + c, 1];
  const ROWS = [
    [["Esc", "Escape", 1, "accent"], ["1", "Digit1", 1], ["2", "Digit2", 1], ["3", "Digit3", 1], ["4", "Digit4", 1], ["5", "Digit5", 1], ["6", "Digit6", 1], ["7", "Digit7", 1], ["8", "Digit8", 1], ["9", "Digit9", 1], ["0", "Digit0", 1], ["-", "Minus", 1], ["=", "Equal", 1], ["Bksp", "Backspace", 2]],
    [["Tab", "Tab", 1.5], ..."QWERTYUIOP".split("").map(L), ["[", "BracketLeft", 1], ["]", "BracketRight", 1], ["\\", "Backslash", 1.5]],
    [["Caps", "CapsLock", 1.75], ..."ASDFGHJKL".split("").map(L), [";", "Semicolon", 1], ["'", "Quote", 1], ["Enter", "Enter", 2.25, "accent"]],
    [["Shift", "ShiftLeft", 2.25], ..."ZXCVBNM".split("").map(L), [",", "Comma", 1], [".", "Period", 1], ["/", "Slash", 1], ["Shift", "ShiftRight", 2.75]],
    [["Ctrl", "ControlLeft", 1.25], ["Win", "MetaLeft", 1.25], ["Alt", "AltLeft", 1.25], ["", "Space", 6.25], ["Alt", "AltRight", 1.25], ["Fn", "Fn", 1.25], ["Menu", "ContextMenu", 1.25], ["Ctrl", "ControlRight", 1.25]]
  ];

  const keysEl = $("#keys");
  const keyMap = new Map();
  ROWS.forEach((row) => {
    const r = document.createElement("div");
    r.className = "row";
    row.forEach(([label, code, w, mod]) => {
      const k = document.createElement("span");
      k.className = "key" + (mod ? " key--" + mod : "");
      k.style.setProperty("--w", w);
      k.textContent = label;
      r.appendChild(k);
      keyMap.set(code, k);
    });
    keysEl.appendChild(r);
  });

  const typedEl = $("#typed");
  const keyCountEl = $("#keyCount");
  let typed = "";
  let presses = 0;

  function press(code) {
    const k = keyMap.get(code);
    presses += 1;
    keyCountEl.textContent = presses;
    if (!k) return;
    k.classList.add("is-down");
    clearTimeout(k._t);
    k._t = setTimeout(() => k.classList.remove("is-down"), 140);
  }
  function write(ch) {
    if (ch === "\b") typed = typed.slice(0, -1);
    else typed = (typed + ch).slice(-16);
    typedEl.textContent = typed;
  }

  function typeIntro(text) {
    return new Promise((resolve) => {
      typed = "";
      typedEl.textContent = "";
      let i = 0;
      const step = () => {
        if (i >= text.length) return resolve();
        const ch = text[i++];
        press(ch === " " ? "Space" : "Key" + ch);
        write(ch);
        setTimeout(step, ch === " " ? 220 : 95 + Math.random() * 70);
      };
      step();
    });
  }

  const hero = $(".hero");
  let heroVisible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }, { threshold: 0.2 }).observe(hero);
  }

  document.addEventListener("keydown", (e) => {
    const t = e.target;
    if (t.closest && t.closest("input, textarea, select, [contenteditable]")) return;
    if (e.repeat) return;
    press(e.code);
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "Backspace") write("\b");
    else if (e.code === "Space") {
      write(" ");
      if (heroVisible && (t === document.body || t === document.documentElement)) e.preventDefault();
    } else if (e.key.length === 1) write(e.key.toUpperCase());
  });

  /* ------------------------------------------------------------------
     Actuation slider
  ------------------------------------------------------------------ */
  const range = $("#actRange");
  const out = $("#actOut");
  const stem = $("#stem");
  const line = $("#actLine");
  const note = $("#actNote");
  const TRAVEL = 70;
  function setAct() {
    const v = parseFloat(range.value);
    const px = (v / 3.5) * TRAVEL;
    out.textContent = v.toFixed(1) + " mm";
    stem.style.transform = `translateY(${px}px)`;
    line.style.top = 46 + px + "px";
    range.style.setProperty("--p", ((v - 0.1) / 3.4) * 100 + "%");
    note.textContent =
      v < 0.7 ? "Hair trigger. The key fires almost as soon as you touch it. Good for FPS strafing."
      : v < 1.9 ? "Fast but forgiving. A good everyday setting for gaming and typing."
      : "Deep press. Fewer accidental keystrokes during long typing sessions.";
  }
  range.addEventListener("input", setAct);
  setAct();

  /* ------------------------------------------------------------------
     Hero title: split into masked words
  ------------------------------------------------------------------ */
  const title = $("[data-split]");
  title.innerHTML = title.textContent.trim().split(/\s+/)
    .map((w) => `<span class="w"><span>${w}</span></span>`).join(" ");

  /* ------------------------------------------------------------------
     No-motion fallback
  ------------------------------------------------------------------ */
  if (!animate) {
    typed = "HASSAN TECH";
    typedEl.textContent = typed;
    return;
  }

  /* ------------------------------------------------------------------
     Entrance timeline
  ------------------------------------------------------------------ */
  const CLR = "transform,opacity";
  const counters = $$("[data-count]");

  const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  intro
    .from(".topbar", { yPercent: -100, opacity: 0, duration: 0.5, clearProps: CLR })
    .from(".header__inner > *", { y: -18, opacity: 0, stagger: 0.08, duration: 0.6, clearProps: CLR }, "-=0.2")
    .from(".header .rgb-line", { scaleX: 0, duration: 1.4, ease: "power2.inOut" }, "<")
    .from("[data-hero='eyebrow']", { y: 16, opacity: 0, duration: 0.6, clearProps: CLR }, "-=1.1")
    .from(".hero__title .w > span", { yPercent: 115, duration: 1, stagger: 0.06, ease: "power4.out" }, "-=0.45")
    .from("[data-hero='lede']", { y: 22, opacity: 0, duration: 0.8, clearProps: CLR }, "-=0.7")
    .from("[data-hero='ctas'] > *", { y: 20, opacity: 0, stagger: 0.1, duration: 0.6, clearProps: CLR }, "-=0.55")
    .from("[data-hero='stats'] > div", { y: 18, opacity: 0, stagger: 0.08, duration: 0.6, clearProps: CLR }, "-=0.45")
    .add(() => {
      counters.forEach((el) => {
        const end = +el.dataset.count;
        const o = { v: 0 };
        gsap.to(o, { v: end, duration: 1.6, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(o.v)) });
      });
    }, "<")
    .from(".hero__grid-bg", { opacity: 0, duration: 1.6, ease: "none" }, 0.2)
    .from("[data-hero='stage']", { y: 70, opacity: 0, duration: 1.2, clearProps: CLR }, 0.35)
    .from(".board__bar", { scaleX: 0, duration: 1.1, ease: "power2.inOut" }, 0.8)
    .from(".key", {
      y: -16, opacity: 0, duration: 0.5,
      stagger: { each: 0.007, from: "center", grid: "auto" },
      clearProps: CLR
    }, 0.75)
    .from(".board__screen > *", { opacity: 0, y: 6, stagger: 0.12, duration: 0.4, clearProps: CLR }, 1.4)
    .add(() => { typeIntro("HASSAN TECH"); }, 1.9)
    .from("#boardHint", { opacity: 0, y: 8, duration: 0.6, clearProps: CLR }, 3.2);

  // RGB bar slowly cycles once the board is lit
  gsap.set(".board__bar, .rgb-line", { backgroundSize: "200% 100%" });
  gsap.to(".board__bar, .rgb-line", { backgroundPosition: "200% 0", duration: 8, ease: "none", repeat: -1 });

  /* ------------------------------------------------------------------
     Brand marquee (seamless loop)
  ------------------------------------------------------------------ */
  const marquee = $("#marquee");
  const track = $(".marquee__track", marquee);
  marquee.appendChild(track.cloneNode(true)).setAttribute("aria-hidden", "true");
  const loop = gsap.to($$(".marquee__track", marquee), { xPercent: -100, duration: 32, ease: "none", repeat: -1 });
  marquee.addEventListener("mouseenter", () => gsap.to(loop, { timeScale: 0.2, duration: 0.6 }));
  marquee.addEventListener("mouseleave", () => gsap.to(loop, { timeScale: 1, duration: 0.6 }));

  /* ------------------------------------------------------------------
     Scroll-driven entrances
  ------------------------------------------------------------------ */
  $$("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      y: 44, opacity: 0, duration: 1, ease: "power3.out", clearProps: CLR,
      scrollTrigger: { trigger: el, start: "top 88%", once: true }
    });
  });

  function batchIn(targets, vars = {}) {
    if (!targets.length) return;
    gsap.set(targets, { y: 50, opacity: 0 });
    ScrollTrigger.batch(targets, {
      start: "top 92%",
      once: true,
      onEnter: (b) => gsap.to(b, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.09, clearProps: CLR, ...vars })
    });
  }
  batchIn($$("[data-tile]"));
  batchIn(cards.filter((c) => !c.hidden));
  batchIn($$("[data-deal]"));
  batchIn($$("[data-trust]"));
  batchIn($$("[data-guide]"));
  batchIn($$("[data-step]"));
  batchIn($$("[data-qa]"));

  // Step connector draws across, numbers pop in sequence
  gsap.from(".step__n", {
    scale: 0, duration: 0.6, stagger: 0.25, ease: "back.out(2.4)", clearProps: "transform",
    scrollTrigger: { trigger: ".steps", start: "top 85%", once: true }
  });

  // WhatsApp label slides out once, then tucks away
  const waLabel = $("#waLabel");
  gsap.timeline({ delay: 4 })
    .to(waLabel, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" })
    .to(waLabel, { opacity: 0, x: 12, duration: 0.4, ease: "power2.in" }, "+=5");
  const waFloat = $(".wa-float");
  waFloat.addEventListener("mouseenter", () => gsap.to(waLabel, { opacity: 1, x: 0, duration: 0.3, overwrite: true }));
  waFloat.addEventListener("mouseleave", () => gsap.to(waLabel, { opacity: 0, x: 12, duration: 0.3, overwrite: true }));

  // Category images drift in from the corner
  $$("[data-tile] img").forEach((img) => {
    gsap.from(img, {
      xPercent: 18, yPercent: 14, rotate: 6, duration: 1.3, ease: "power3.out", clearProps: "transform",
      scrollTrigger: { trigger: img.parentElement, start: "top 85%", once: true }
    });
  });

  // Spotlight: product lifts into view, callouts pop on
  gsap.fromTo("#spotImg", { yPercent: 8, scale: 1.08 }, {
    yPercent: -4, scale: 1, ease: "none",
    scrollTrigger: { trigger: ".spotlight__stage", start: "top bottom", end: "bottom top", scrub: true }
  });
  gsap.from(".spotlight__callouts li", {
    scale: 0.6, opacity: 0, stagger: 0.18, duration: 0.6, ease: "back.out(2)",
    scrollTrigger: { trigger: ".spotlight__stage", start: "top 65%", once: true }
  });
  gsap.from(".specs > div", {
    opacity: 0, y: 14, stagger: 0.07, duration: 0.6, ease: "power3.out", clearProps: CLR,
    scrollTrigger: { trigger: ".specs", start: "top 88%", once: true }
  });
  // Stem demo presses once when the slider comes into view
  ScrollTrigger.create({
    trigger: ".actuation", start: "top 80%", once: true,
    onEnter: () => {
      const o = { v: 3.5 };
      range.value = 3.5; setAct();
      gsap.to(o, { v: 0.4, duration: 1.4, ease: "power3.inOut", onUpdate: () => { range.value = o.v.toFixed(1); setAct(); } });
    }
  });

  // Savings bars fill in
  $$(".deal__bar i").forEach((bar) => {
    gsap.from(bar, {
      scaleX: 0, duration: 1.2, ease: "power3.out",
      scrollTrigger: { trigger: bar, start: "top 92%", once: true }
    });
  });

  // Desk photo: unmask, then slow parallax
  gsap.fromTo(".desk__photo", { clipPath: "inset(12% 8% 12% 8% round 22px)" }, {
    clipPath: "inset(0% 0% 0% 0% round 22px)", duration: 1.3, ease: "power3.inOut", clearProps: "clipPath",
    scrollTrigger: { trigger: ".desk__photo", start: "top 85%", once: true }
  });
  gsap.fromTo("#deskImg", { yPercent: -14 }, {
    yPercent: 0, ease: "none",
    scrollTrigger: { trigger: ".desk__photo", start: "top bottom", end: "bottom top", scrub: true }
  });

  // CTA light line sweeps in
  gsap.from(".cta h2", {
    letterSpacing: "0.08em", opacity: 0, duration: 1.2, ease: "power3.out", clearProps: "letterSpacing,opacity",
    scrollTrigger: { trigger: ".cta", start: "top 80%", once: true }
  });

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
