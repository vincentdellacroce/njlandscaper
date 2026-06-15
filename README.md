# Morris Estate Landscapes — Website

A luxury, single-page marketing site for a Morris County, NJ landscaping firm.
Built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.
Minimal, high-end aesthetic — generous whitespace, Cormorant/Montserrat type, and
small botanical-green accents. All animations respect `prefers-reduced-motion`.

---

## Run it

```bash
npm install        # first time only
npm run dev        # http://localhost:3000
```

Build for production:

```bash
npm run build
npm run start
```

---

## ✏️ Edit your details in ONE place

Open **`lib/site.ts`** and replace the placeholder values:

- Business name, tagline, region
- **Phone, email, address, hours**
- **Formspree form ID** (see below)
- Social links and service-area towns

Everything across the site (nav, hero, contact, footer) reads from this file.

---

## 🖼️ Adding your real photos

Every image is currently a clearly-labeled placeholder (the grey/green boxes that
say things like *"Hero Image — wide estate landscape"*). To drop in a real photo,
find the `<PhotoSlot ... />` you want to replace and swap it for an image.

1. Put your photos in **`public/photos/`** (create the folder).
2. Replace a slot. Example — the hero in `components/Hero.tsx`:

   ```tsx
   // before
   <PhotoSlot tone="dark" label="Hero Image — wide estate landscape" className="h-full w-full" />

   // after (recommended: next/image)
   import Image from "next/image";
   <Image src="/photos/hero.jpg" alt="Estate garden at dusk in Mendham, NJ"
          fill priority className="object-cover" />
   ```

   For a plain tag, `<img src="/photos/hero.jpg" alt="…" className="h-full w-full object-cover" />`
   works too. Keep the wrapper element — it holds the aspect ratio.

Remaining photo slots live in: `Portfolio.tsx` (6) and `About.tsx` (1).
Each label tells you the suggested orientation. (The hero is a video — see below.)

The **Services** section (3 images) is already wired to real photos in
`public/photos/` via `next/image`. Filenames are referenced exactly as downloaded:
`residential-landscaping-service_1B6TP9.webp` (Design-Build),
`maxresdefault.jpg` (Hardscaping & Masonry), `grass-220465_1280.webp` (Maintenance).

### The hero video

The hero plays a cinematic intro that resolves on the logo, then reveals the
headline + CTAs. It autoplays muted, plays once, and holds on the final frame.

**Adaptive quality (two tiers).** `components/Hero.tsx` picks a source at runtime:

| File | Spec | Served to |
|------|------|-----------|
| `public/video/hero.mp4` | native **1280×720**, CRF 21, ~13 MB | capable devices on a good connection (max sharpness) |
| `public/video/hero-light.mp4` | 854×480, ~1.9 MB | data-saver, slow networks (2g/3g), or low-memory devices |

The source master is 720p, so 720p is the real sharpness ceiling — encoding larger
would only add weight, not detail. Reduced-motion visitors skip playback and see the
final logo frame (`public/video/hero-end.jpg`) with content shown immediately.

To replace the intro with your own footage:

1. Replace `public/video/hero.mp4` (high) and `public/video/hero-light.mp4` (light).
   Use H.264 / yuv420p with `+faststart`. Keep the last frame a clean "resting" shot.
2. Update the posters: `public/video/hero-start.jpg` (first frame) and
   `public/video/hero-end.jpg` (final frame, used for reduced-motion).
3. No code changes needed — `components/Hero.tsx` references those paths.
   (Tier thresholds — connection, memory, data-saver — live in that file's
   adaptive-source `useEffect`.)

> The source frames were re-encoded to MP4 with `ffmpeg` (added as the dev
> dependency `ffmpeg-static`). You can remove that dependency if you won't be
> re-encoding video locally.

> Tip: optimize photos before uploading (WebP/JPEG, ~1600–2400px wide). `next/image`
> handles responsive sizing and lazy-loading automatically.

---

## 📨 Making the consultation form receive real emails

The form works two ways:

- **Right now (no setup):** submitting opens the visitor's email app pre-filled to
  your address — no backend required.
- **Recommended (real inbox submissions):**
  1. Create a free form at <https://formspree.io> using your business email.
  2. Copy the form ID (the part after `/f/`, e.g. `xayzgwpq`).
  3. Paste it into `formspreeId` in `lib/site.ts`.

  Submissions will now arrive in your inbox and the visitor sees a "Thank you" state.

---

## Deploy

Easiest path is **Vercel** (free): push this folder to GitHub, import the repo at
<https://vercel.com/new>, and it deploys automatically. Netlify and Cloudflare Pages
work too. Point your domain at the deployment when ready.

---

## Structure

```
app/
  layout.tsx     fonts, metadata, global shell
  page.tsx       section order
  globals.css    design tokens + component classes
components/       Nav, Hero, Intro, Services, Portfolio,
                 Approach, About, Testimonial, Contact, Footer,
                 Reveal (mask-rise scroll reveal), ImageReveal (curtain +
                 Ken-Burns), DrawLine (animated hairline), PhotoSlot, Logo
lib/site.ts      ← YOUR CONTENT / CONTACT DETAILS
tailwind.config.ts  colors, fonts, spacing scale
```

## Brand palette

| Token | Hex | Use |
|-------|-----|-----|
| `paper` | `#FBFAF7` | page background |
| `ink` | `#16201A` | text / dark panels |
| `forest` | `#1F4D2E` | primary green accent / buttons |
| `moss` | `#3C8C5A` | bright accent |
| `sage` | `#8AA791` | soft accent on dark |

Fonts: **Cormorant** (serif headlines) + **Montserrat** (sans body), loaded via
`next/font` — no extra setup needed.

---

*Note: `everwood-logo.svg` in the project root is an unrelated leftover file and is
not used by the site. Safe to delete.*
