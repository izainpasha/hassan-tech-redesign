# Hassan Tech — redesign concept

A homepage redesign concept for [hassantech.pk](https://hassantech.pk/), a gaming peripherals store in Pakistan.

Static HTML, CSS and JavaScript. No build step. Animations use [GSAP](https://gsap.com/) 3.12.5 (core, ScrollTrigger and Flip), loaded from cdnjs.

## What's in it

- **Live keyboard hero.** The board types "HASSAN TECH" on load, and keys light up when a visitor types on their own keyboard.
- **GSAP entrances.** A staggered header and headline reveal, keycaps dropping in from the centre, count-up stats, and scroll-triggered reveals for every section.
- **Product filter** that animates between categories with GSAP Flip.
- **Actuation slider** for the AULA HERO 99 HE. It shows how a Hall effect switch's trigger point changes.
- **Pre-owned section** that explains the store's condition grades and shows how much each item saves.
- Real products, prices and stock counts taken from the live store in October 2026.

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python -m http.server 8000
```

## Structure

```
index.html
css/style.css
js/main.js            product data, keyboard, animations
assets/products/      product photos from hassantech.pk
assets/logo-current.png
```

Product data lives at the top of `js/main.js`. Edit that array to change what's shown.
